const hre = require("hardhat");

async function main() {
  const fee = hre.ethers.parseEther("0.001");

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy(fee);

  await factory.waitForDeployment();

  console.log(`Factory deployed to ${factory.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});