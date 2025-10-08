const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy(1000); // pass constructor args here
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress(); // ✅ must await here
  console.log("✅ Factory deployed at:", factoryAddress );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
