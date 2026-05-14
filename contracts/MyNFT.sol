// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract OptimizedNFT is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("OptimizedNFT", "ONFT") {}

    function mintNFT(address to) public onlyOwner {
        _safeMint(to, tokenCounter);
        tokenCounter++;
    }

    // Optimized function with batch minting support
    function mintBatch(address[] memory recipients) public onlyOwner {
        for (uint i = 0; i < recipients.length; i++) {
            _safeMint(recipients[i], tokenCounter);
            tokenCounter++;
        }
    }
}