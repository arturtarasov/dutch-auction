//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DutchAuction {
    address public owner;   // owner auction
    uint constant DURATION = 2 days; // 2 * 24 * 60 * 60 auction time
    uint constant FEE = 10; // 10% fee for owner from client

    struct Auction {
        address payable seller;
        uint startingPrice;
        uint finalPrice;
        uint startAt;
        uint endsAt;
        uint discountRate;
        string item;
        bool stopped;
    }

    Auction[] public auctions;

    constructor() {
        owner = msg.sender;
    }
}
