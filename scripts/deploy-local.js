const hre = require("hardhat");
const { compileContract } = require("../tests/performance.test");

async function deployContract(name, artifact, signer, args = []) {
  const factory = new hre.ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();

  console.log(`${name} deployed to ${await contract.getAddress()}`);
  return contract;
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const faucetArtifact = compileContract("contracts/Faucet.sol", "Faucet");
  const nftArtifact = compileContract("contracts/MyNFT.sol", "MyNFT");

  const faucet = await deployContract("Faucet", faucetArtifact, deployer);
  await deployer.sendTransaction({
    to: await faucet.getAddress(),
    value: hre.ethers.parseEther("10")
  });
  await deployContract("MyNFT", nftArtifact, deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
