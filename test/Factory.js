const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Factory", function () {
    const Fee = ethers.parseUnits("0.01",18); // 0.01 ether in wei

    // this function deploy the contract and returns the contract instance as factory
    async function deployFactoryFixture() {
        // fetch Account's
        const [deployer, creator, buyer] = await ethers.getSigners();        
        
        // fetch the contract
        const Factory = await ethers.getContractFactory("Factory");
        
        // deploy the contract
        const factory = await Factory.deploy(Fee);
        
        // create token
        const transaction = await factory.connect(creator).create("Dapp Uni","DAP", { value: Fee });
        await transaction.wait();
        
        // get Token Address
        const tokenAddress = await factory.tokens(0);
        const token = await ethers.getContractAt("Token", tokenAddress);

        return { factory, token, deployer, creator, buyer }; //this line is to export variables
    }   //to use its return var we must use line below
        // const { factory, deployer, creator } = await loadFixture(deployFactoryFixture)

        async function buyTokenFixture() {
            const { factory, token, deployer, creator, buyer } = await loadFixture(deployFactoryFixture);
            const AMOUNT = ethers.parseUnits("10000",18);
            const COST = ethers.parseUnits("1",18);
            const transaction = await factory.connect(buyer).buy( await token.getAddress() ,AMOUNT, {value: COST });
            await transaction.wait();
            //expect().to.be.equal(buyer);
            return { factory, token, deployer, creator, buyer };
        }

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

    describe("Creating",function (params) {
        
        it("Should Set the Owner", async ()=> {
            const { factory, token } = await loadFixture(deployFactoryFixture);
            expect(await token.owner() ).to.equal(await factory.getAddress());
        });

        it("Should Set the creator", async ()=> {
            const { creator, token } = await loadFixture(deployFactoryFixture);
            expect(await token.creator() ).to.equal(await creator.getAddress());
        });

        it("Should Set the Supply", async ()=> {
            const { factory, token } = await loadFixture(deployFactoryFixture);
            const totalSupply = ethers.parseUnits("1000000",18); // 1000 tokens with 18 decimals
            expect(await token.balanceOf(await factory.getAddress()) ).to.equal(totalSupply);
        });

        it("Should Update the Eth balance", async ()=> {
            const { factory, token } = await loadFixture(deployFactoryFixture);
            const balance = await ethers.provider.getBalance(await factory.getAddress());
            expect(balance).to.equal(Fee);
        });

        it("Sould create Sales", async ()=> {

            const { factory, token, creator } = await loadFixture(deployFactoryFixture);
            const count = await factory.totalTokens();

            expect(count).to.be.equal(1);
            const sale = await factory.getTokenSale(0);

            expect(sale.token).to.be.equal(await token.getAddress());
            expect(sale.creator).to.be.equal(creator.address);
            expect(sale.sold).to.be.equal(0);
            expect(sale.raised).to.be.equal(0);
            expect(sale.isOpen).to.be.equal(true);
        });

    });

    describe("Buying", function () {

        const AMOUNT = ethers.parseUnits("10000",18);
        const COST = ethers.parseUnits("1",18);

        it("Check contract recive ETH", async () => {
            const { factory, token, deployer, creator, buyer } = await buyTokenFixture();
            const balance = await ethers.provider.getBalance(await factory.getAddress()); // to check balance of contract
            expect(balance).to.be.equal( Fee + COST );
        });

        it("Check buyer recived Token", async () =>{
            const { factory, token, deployer, creator, buyer } = await buyTokenFixture();
            const balance = await token.balanceOf(buyer.address);
            expect(balance).to.equal(AMOUNT);
        });

        it("Should update Token Sale", async () => {
            const { factory, token } = await buyTokenFixture();
            const sale = await factory.tokenToSales( await token.getAddress());
            expect(sale.sold).to.equal(AMOUNT);
            const  cost = await factory.getCost(sale.sold);
            expect(sale.raised).to.equal(COST);
        });
    })

});


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

