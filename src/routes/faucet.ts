import { Router } from 'express';
import { requestFunds, getFaucetBalance } from '../services/faucet.service';

const router = Router();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Request funds from faucet
router.post('/request', async (req, res) => {
  try {
    // In a real implementation, you would validate the request and get the signer from the request
    // For now, we'll just return a placeholder response
    res.status(200).json({
      message: 'Funds requested successfully',
      transactionHash: '0x...',
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to request funds',
      message: getErrorMessage(error)
    });
  }
});

// Get faucet balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await getFaucetBalance();
    res.status(200).json({
      balance: balance,
      unit: 'ETH'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get balance',
      message: getErrorMessage(error)
    });
  }
});

export default router;
