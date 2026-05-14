import { ContractTransactionResponse, ethers } from 'ethers';
import { sepoliaProvider, faucetAddress } from '../config';
import { FAUCET_ABI } from './abis';

type FaucetContract = ethers.BaseContract & {
  getBalance: () => Promise<bigint>;
  requestFunds: () => Promise<ContractTransactionResponse>;
};

// Create Faucet contract instance
const faucetContract = new ethers.Contract(faucetAddress, FAUCET_ABI, sepoliaProvider) as unknown as FaucetContract;

/**
 * Request funds from the faucet
 * @param signer Wallet signer instance
 * @returns Promise<string> Transaction hash
 */
export async function requestFunds(signer: ethers.Signer): Promise<string> {
  try {
    // Create a new contract instance with the signer to enable transactions
    const faucetContractWithSigner = faucetContract.connect(signer) as unknown as FaucetContract;

    // Call the requestFunds function
    const transaction = await faucetContractWithSigner.requestFunds();

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    return receipt?.hash ?? transaction.hash;
  } catch (error) {
    console.error('Error requesting funds:', error);
    throw error;
  }
}

/**
 * Get the faucet contract balance
 * @returns Promise<string> Contract balance in ETH
 */
export async function getFaucetBalance(): Promise<string> {
  try {
    const balance = await faucetContract.getBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting faucet balance:', error);
    throw error;
  }
}
