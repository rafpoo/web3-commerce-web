// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    error EmptyRecipients();

    uint256 public tokenCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function mintNFT(address recipient) external onlyOwner {
        uint256 tokenId = tokenCounter;
        _safeMint(recipient, tokenId);

        unchecked {
            tokenCounter = tokenId + 1;
        }
    }

    function mintBatch(address[] calldata recipients) external onlyOwner {
        uint256 length = recipients.length;
        if (length == 0) {
            revert EmptyRecipients();
        }

        uint256 tokenId = tokenCounter;
        for (uint256 i = 0; i < length; ) {
            _safeMint(recipients[i], tokenId);

            unchecked {
                ++i;
                ++tokenId;
            }
        }

        tokenCounter = tokenId;
    }

    function mintBatchUnsafeEOA(address[] calldata recipients) external onlyOwner {
        uint256 length = recipients.length;
        if (length == 0) {
            revert EmptyRecipients();
        }

        uint256 tokenId = tokenCounter;
        for (uint256 i = 0; i < length; ) {
            _mint(recipients[i], tokenId);

            unchecked {
                ++i;
                ++tokenId;
            }
        }

        tokenCounter = tokenId;
    }
}
