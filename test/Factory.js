const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Factory", function () {
    const Fee = ethers.parseUnits("0.01",18); // 0.01 ether in wei


    // this function deploy the contract and returns the contract instance as factory
    async function deployFactoryFixture() {
        // fetch Account's
        const [deployer] = await ethers.getSigners();
        
        // fetch the contract
        const Factory = await ethers.getContractFactory("Factory");
        // deploy the contract
        const factory = await Factory.deploy(Fee);
        return { factory, deployer }; //this line is to export variables
    }   //to use its return var we must use line below
        // const { factory } = await loadFixture(deployFactoryFixture)

    describe("Deployment", function() {
        it("Should have immutabe value", async() => {
            const { factory } = await loadFixture(deployFactoryFixture);
            expect(await factory.fee()).to.equal(Fee);              
        });

        it("Should have Same Owner", async() => {
            const { factory, deployer } = await loadFixture(deployFactoryFixture);
            expect(await factory.owner()).to.equal(deployer.address.toString());
        });
    });

})


// Basic tst 
/*
it("Should have a name", async () => {
    // fetch the contract
    const Factory = await ethers.getContractFactory("Factory");
    // deploy the contract
    const factory = await Factory.deploy();
    //check name
    const name = await factory.name();
    console.log("Name is:",name);
    expect(name).to.equal("Factory");
});
*/

