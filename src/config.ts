import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY');

const faucetAddress = process.env.FAUCET_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const nftAddress = process.env.NFT_CONTRACT_ADDRESS || '0xabcdef12345678901234567890abcdef12345678';

export { sepoliaProvider, faucetAddress, nftAddress };