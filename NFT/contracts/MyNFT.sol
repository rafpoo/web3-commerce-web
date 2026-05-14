// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {

    uint256 public tokenCounter;

    constructor()
        ERC721("MyNFT", "MNFT")
        Ownable(msg.sender)   
    {
        tokenCounter = 0;
    }

    function mintNFT(address to) public onlyOwner {
        _safeMint(to, tokenCounter);
        tokenCounter++;
    }
}