// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const Fee = ethers.parseUnits("0.01",18);

module.exports = buildModule("FactoryModule", (m) => {
    // getting parameters
    const fee = m.getParameter("fee",Fee);

    // geting contract
    const factory = m.contract("Factory", [fee] );

    // return factory
    return { factory };
})


