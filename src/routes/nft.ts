import { Router } from 'express';
import { mintNFT, getTotalSupply } from '../services/nft.service';
import { ethers } from 'ethers';

const router = Router();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Mint a new NFT
router.post('/mint', async (req, res) => {
  try {
    const { recipient } = req.body;

    if (!recipient) {
      return res.status(400).json({
        error: 'Missing recipient address'
      });
    }

    // Validate Ethereum address
    if (!ethers.isAddress(recipient)) {
      return res.status(400).json({
        error: 'Invalid recipient address'
      });
    }

    // In a real implementation, you would get the signer from the request
    // For now, we'll just return a placeholder response
    res.status(200).json({
      message: 'NFT minted successfully',
      recipient: recipient,
      transactionHash: '0x...',
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to mint NFT',
      message: getErrorMessage(error)
    });
  }
});

// Get total supply of NFTs
router.get('/totalSupply', async (req, res) => {
  try {
    // In a real implementation, we would call the service method
    // For now, return a placeholder response
    res.status(200).json({
      totalSupply: 0
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get total supply',
      message: getErrorMessage(error)
    });
  }
});

export default router;
