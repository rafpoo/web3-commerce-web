const fs = require("fs");
const path = require("path");
const { compileContract } = require("../tests/performance.test");

function writeArtifact(fileName, contractName, sourcePath) {
  const artifact = compileContract(sourcePath, contractName);
  const outputPath = path.join(process.cwd(), "artifacts", fileName);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        contractName,
        sourcePath,
        abi: artifact.abi,
        bytecode: artifact.bytecode
      },
      null,
      2
    )}\n`
  );

  console.log(`Wrote ${outputPath}`);
}

writeArtifact("Faucet.json", "Faucet", "contracts/Faucet.sol");
writeArtifact("MyNFT.json", "MyNFT", "contracts/MyNFT.sol");
