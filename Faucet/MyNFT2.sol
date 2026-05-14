// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin Contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MyNFT2 is ERC721, ERC2981, Ownable, Pausable {

    // ========================
    // STATE VARIABLES
    // ========================

    uint256 public tokenCounter;
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public mintPrice = 0.01 ether;

    string private baseTokenURI;

    // ========================
    // CONSTRUCTOR
    // ========================

    constructor()
        ERC721("MyNFT2", "MNFT2")
        Ownable(msg.sender)
    {
        tokenCounter = 0;

        // Royalty 5% (500 basis points)
        _setDefaultRoyalty(msg.sender, 500);
    }

    // ========================
    // MINT FUNCTIONS
    // ========================

    /// Owner mint (free)
    function ownerMint(address recipient) public onlyOwner {
        require(tokenCounter < MAX_SUPPLY, "Sold out");

        _safeMint(recipient, tokenCounter);
        tokenCounter++;
    }

    /// Public mint (paid)
    function publicMint() public payable whenNotPaused {
        require(tokenCounter < MAX_SUPPLY, "Sold out");
        require(msg.value >= mintPrice, "Not enough ETH");

        _safeMint(msg.sender, tokenCounter);
        tokenCounter++;
    }

    // ========================
    // METADATA
    // ========================

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseTokenURI = _baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // ========================
    // BURN
    // ========================

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
    }

    // ========================
    // ADMIN FUNCTIONS
    // ========================

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    /// withdraw ETH from contract
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ========================
    // REQUIRED OVERRIDES
    // ========================

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}