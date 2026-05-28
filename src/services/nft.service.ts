import { ContractTransactionResponse, ethers } from 'ethers';
import { sepoliaProvider, nftAddress } from '../config';
import { NFT_ABI } from './abis';

type NFTContract = ethers.BaseContract & {
  tokenCounter: () => Promise<bigint>;
  mintNFT: (to: string) => Promise<ContractTransactionResponse>;
  mintBatch: (recipients: string[]) => Promise<ContractTransactionResponse>;
};

// Create NFT contract instance
const nftContract = new ethers.Contract(nftAddress, NFT_ABI, sepoliaProvider) as unknown as NFTContract;

/**
 * Get the total supply of NFTs
 * @returns Promise<number> Total number of NFTs minted
 */
export async function getTotalSupply(): Promise<number> {
  try {
    const totalSupply = await nftContract.tokenCounter();
    return Number(totalSupply);
  } catch (error) {
    console.error('Error getting total supply:', error);
    throw error;
  }
}

/**
 * Mint a new NFT
 * @param to Recipient address
 * @param signer Wallet signer instance
 * @returns Promise<string> Transaction hash
 */
export async function mintNFT(to: string, signer: ethers.Signer): Promise<string> {
  try {
    // Create a new contract instance with the signer to enable transactions
    const nftContractWithSigner = nftContract.connect(signer) as unknown as NFTContract;

    // Call the mintNFT function
    const transaction = await nftContractWithSigner.mintNFT(to);

    // Wait for transaction to be mined
    const receipt = await transaction.wait();

    return receipt?.hash ?? transaction.hash;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

/**
 * Mint multiple NFTs in one transaction.
 * @param recipients Recipient addresses
 * @param signer Wallet signer instance
 * @returns Promise<string> Transaction hash
 */
export async function mintBatchNFT(recipients: string[], signer: ethers.Signer): Promise<string> {
  try {
    const nftContractWithSigner = nftContract.connect(signer) as unknown as NFTContract;
    const transaction = await nftContractWithSigner.mintBatch(recipients);
    const receipt = await transaction.wait();

    return receipt?.hash ?? transaction.hash;
  } catch (error) {
    console.error('Error batch minting NFTs:', error);
    throw error;
  }
}
