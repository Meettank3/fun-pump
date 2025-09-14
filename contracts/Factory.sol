// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Token} from "./Token.sol";

contract Factory {

    uint256 public constant TARGET = 3 ether;
    uint256 public TOKEN_LIMIT = 500_000 ether;

    uint256 public immutable fee;
    address public owner;

    uint256 public totalTokens;
    address[] public tokens;
    mapping(address => TokenSale) public tokenToSales;


    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount);

    struct TokenSale{
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function getTokenSale(uint256 _index) public view returns(TokenSale memory) {
        return tokenToSales[tokens[_index]];
    }

    function create(
        string memory _name,
        string memory _symbole
    ) external payable{
        // make sure fee is correct
        require(msg.value >= fee, "Factory: Fee not met");

        // create a new token which require 2 thing from erc20 which is name and symbole by calling another contract Token
        Token token = new Token( msg.sender, _name, _symbole, 1_000_000 ether );

        // then Save the Token on BLOCKCHAIN
        tokens.push(address(token));        
        totalTokens++;

        // List token for sale
        TokenSale memory sale = TokenSale(
            address(token),
            _name,
            msg.sender,
            0,
            0,
            true
        );
        tokenToSales[address(token)] = sale; // this is stored on Blockchain

        emit Created(address(token));
    }

    function getCost(uint256 _sold) public pure returns (uint256) {
        uint256 floor = 0.0001 ether;
        uint256 steps = 0.0001 ether;
        uint256 increment = 10000 ether;

        uint256 cost = (steps * (_sold / increment) ) + floor;
        return cost;
    }

    function buy( address _token ,uint256 _amount)external payable {
        TokenSale storage sale = tokenToSales[_token];

        // check the condi
        require(sale.isOpen == true, "Factory: Sale is not Open for this Token Yet");
        require(_amount >= 1 ether,"Factory: Amount is too Low");
        require(_amount <= 10000 ether, "Factory: Amount is too High");

        // calculate price of 1 token as per based on total broughtup
        uint256 cost = getCost(sale.sold);
        uint256 price = cost * (_amount / 10 ** 18);

        // update sale
        sale.sold += _amount;
        sale.raised += price;

        // make sure fund raising goal isnt met
        require(msg.value >= price, "Factory: Insuffient ETH recived");
        
        if(sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET){
            sale.isOpen = false;
        }

        //transfer
        Token(_token).transfer(msg.sender, _amount);

        // emit event
        emit Buy(_token, _amount);
    }

    function deposite(address _token) external {
        // the remaning token balance and ETH raised
        //would go into liquidity pool like UniSwap V3
        // for simplicity we will just transfre the remaning
        //tokens and ETH raised to the creator

        Token token = Token(_token);
        TokenSale memory sale = tokenToSales[_token];

        require(sale.isOpen == false, "Factory: Target not Reached yet");
        
        // transfer token to its creator
        token.transfer(sale.creator, token.balanceOf(address(this)));

        // transfer ETH raised
        (bool sucess, ) = payable(sale.creator).call{value: sale.raised}("");
        require(sucess,"Factory: Eth transfer failed");
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == owner, "Factory: Only Owner");
        (bool sucess,) =payable(owner).call{value: _amount}("");
        require(sucess,"Factory: Withdraw Failed");

    }

}
