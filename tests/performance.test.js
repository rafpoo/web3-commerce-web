const fs = require("fs");
const path = require("path");
const solc = require("solc");
const hre = require("hardhat");
const { performance } = require("perf_hooks");

const DEFAULT_TRANSACTION_COUNT = 100;
const BATCH_SIZES = [10, 25, 50, 100];

function resolveImport(importPath) {
  const basePath = importPath.startsWith("@")
    ? path.join(process.cwd(), "node_modules", importPath)
    : path.join(process.cwd(), importPath);

  if (!fs.existsSync(basePath)) {
    return { error: `Import not found: ${importPath}` };
  }

  return { contents: fs.readFileSync(basePath, "utf8") };
}

function compileContract(sourcePath, contractName) {
  const normalizedSourcePath = sourcePath.replace(/\\/g, "/");
  const input = {
    language: "Solidity",
    sources: {
      [normalizedSourcePath]: {
        content: fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8")
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: resolveImport }));
  const errors = (output.errors || []).filter((error) => error.severity === "error");

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.formattedMessage).join("\n"));
  }

  const contract = output.contracts?.[normalizedSourcePath]?.[contractName];
  if (!contract) {
    throw new Error(`Contract ${contractName} was not compiled from ${sourcePath}`);
  }

  return {
    abi: contract.abi,
    bytecode: `0x${contract.evm.bytecode.object}`
  };
}

async function deployContract(artifact, signer, args = []) {
  const factory = new hre.ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

async function createFundedWallets(count, funder) {
  const provider = hre.ethers.provider;
  const wallets = Array.from({ length: count }, () => hre.ethers.Wallet.createRandom().connect(provider));

  for (const wallet of wallets) {
    await waitForTransaction(
      funder.sendTransaction({
        to: wallet.address,
        value: hre.ethers.parseEther("1")
      })
    );
  }

  return wallets;
}

async function runTransactions(label, tasks, options = {}) {
  const startTime = performance.now();
  const settled = [];

  if (options.concurrent === false) {
    for (const task of tasks) {
      try {
        settled.push({ status: "fulfilled", value: await task() });
      } catch (error) {
        settled.push({ status: "rejected", reason: error });
      }
    }
  } else {
    settled.push(...(await Promise.allSettled(tasks.map((task) => task()))));
  }

  const endTime = performance.now();

  const successes = settled.filter((result) => result.status === "fulfilled");
  const failures = settled.filter((result) => result.status === "rejected");
  const durationSeconds = (endTime - startTime) / 1000;
  const gasUsed = successes.map((result) => result.value.gasUsed);
  const totalGas = gasUsed.reduce((sum, value) => sum + value, 0n);
  const itemsPerSuccessfulTransaction = options.itemsPerSuccessfulTransaction || 1;
  const itemsProcessed = successes.length * itemsPerSuccessfulTransaction;

  return {
    label,
    total: tasks.length,
    successful: successes.length,
    failed: failures.length,
    itemsProcessed,
    durationSeconds,
    throughput: successes.length / durationSeconds,
    itemThroughput: itemsProcessed / durationSeconds,
    averageGasUsed: gasUsed.length === 0 ? "0" : (totalGas / BigInt(gasUsed.length)).toString(),
    averageGasPerItem: itemsProcessed === 0 ? "0" : (totalGas / BigInt(itemsProcessed)).toString(),
    failureMessages: failures.slice(0, 3).map((result) => result.reason?.message || String(result.reason))
  };
}

async function waitForTransaction(transactionPromise) {
  const transaction = await transactionPromise;
  const receipt = await transaction.wait();
  return receipt;
}

async function assertReverts(label, action) {
  try {
    await action();
    return { label, passed: false, message: "Expected revert, but transaction succeeded" };
  } catch (error) {
    return { label, passed: true, message: error.message.split("\n")[0] };
  }
}

async function runEdgeCaseChecks(faucet, nft, wallets) {
  const emptyFaucet = await deployContract(compileContract("contracts/Faucet.sol", "Faucet"), wallets[0]);
  const cooldownFaucet = await deployContract(compileContract("contracts/Faucet.sol", "Faucet"), wallets[1]);
  await waitForTransaction(
    wallets[1].sendTransaction({
      to: await cooldownFaucet.getAddress(),
      value: hre.ethers.parseEther("1")
    })
  );
  await waitForTransaction(cooldownFaucet.connect(wallets[2]).requestFunds());

  return Promise.all([
    assertReverts("faucet cooldown", async () => {
      await waitForTransaction(cooldownFaucet.connect(wallets[2]).requestFunds());
    }),
    assertReverts("faucet insufficient balance", async () => {
      await waitForTransaction(emptyFaucet.connect(wallets[1]).requestFunds());
    }),
    assertReverts("nft empty batch", async () => {
      await waitForTransaction(nft.mintBatch([]));
    }),
    assertReverts("nft invalid recipient", async () => {
      await waitForTransaction(nft.mintBatch([hre.ethers.ZeroAddress]));
    })
  ]);
}

async function measureThroughput(options = {}) {
  const transactionCount = options.transactionCount || DEFAULT_TRANSACTION_COUNT;
  const [owner] = await hre.ethers.getSigners();
  const faucetArtifact = compileContract("contracts/Faucet.sol", "Faucet");
  const nftArtifact = compileContract("contracts/MyNFT.sol", "MyNFT");

  const faucet = await deployContract(faucetArtifact, owner);
  await waitForTransaction(
    owner.sendTransaction({
      to: await faucet.getAddress(),
      value: hre.ethers.parseEther("20")
    })
  );

  const nft = await deployContract(nftArtifact, owner);
  const wallets = await createFundedWallets(transactionCount, owner);
  const recipients = wallets.map((wallet) => wallet.address);

  const results = [];

  results.push(
    await runTransactions(
      "faucet.requestFunds",
      wallets.map((wallet) => () => waitForTransaction(faucet.connect(wallet).requestFunds()))
    )
  );

  results.push(
    await runTransactions(
      "nft.mintNFT",
      recipients.map((recipient) => () => waitForTransaction(nft.mintNFT(recipient))),
      { concurrent: false }
    )
  );

  for (const batchSize of BATCH_SIZES) {
    results.push(
      await runTransactions(`nft.mintBatch.${batchSize}`, [
        () => waitForTransaction(nft.mintBatch(recipients.slice(0, batchSize)))
      ], { itemsPerSuccessfulTransaction: batchSize })
    );
  }

  const edgeCases = await runEdgeCaseChecks(faucet, nft, wallets);

  return {
    transactionCount,
    batchSizes: BATCH_SIZES,
    results,
    edgeCases
  };
}

function printReport(report) {
  console.log(`Performance test transaction count: ${report.transactionCount}`);
  console.table(
    report.results.map((result) => ({
      scenario: result.label,
      total: result.total,
      successful: result.successful,
      failed: result.failed,
      itemsProcessed: result.itemsProcessed,
      seconds: result.durationSeconds.toFixed(3),
      txPerSecond: result.throughput.toFixed(2),
      itemsPerSecond: result.itemThroughput.toFixed(2),
      averageGasUsed: result.averageGasUsed,
      averageGasPerItem: result.averageGasPerItem
    }))
  );

  const failedScenarios = report.results.filter((result) => result.failed > 0);
  if (failedScenarios.length > 0) {
    console.log("Sample failure messages:");
    for (const scenario of failedScenarios) {
      console.log(`${scenario.label}: ${scenario.failureMessages.join(" | ")}`);
    }
  }

  console.table(report.edgeCases);
}

module.exports = {
  compileContract,
  measureThroughput,
  printReport
};
