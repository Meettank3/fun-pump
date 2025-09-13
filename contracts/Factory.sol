// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Token} from "./Token.sol";

contract Factory {

    uint256 public immutable fee;
    address public owner;

    uint256 public totalTokens;
    address[] public tokens;

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function create(
        string memory _name,
        string memory _symbole
    ) external payable{
        // create a new token which require 2 thing from erc20 which is name and symbole by calling another contract Token
        Token token = new Token( msg.sender, _name, _symbole, 1_000_000 ether );
        // then Save the Token on BLOCKCHAIN
        tokens.push(address(token));
        
        totalTokens++;

        // List token for sale
        // tell people its Live
    }

}
