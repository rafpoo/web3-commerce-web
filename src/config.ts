import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function normalizePrivateKey(privateKey: string): string {
  const trimmedKey = privateKey.trim();
  return trimmedKey.startsWith('0x') ? trimmedKey : `0x${trimmedKey}`;
}

function getRequiredAddress(name: string): string {
  const address = getRequiredEnv(name).trim();

  if (!ethers.isAddress(address)) {
    throw new Error(`${name} must be a valid Ethereum address, for example 0x followed by 40 hex characters`);
  }

  return address;
}

function getRequiredPrivateKey(name: string): string {
  const privateKey = normalizePrivateKey(getRequiredEnv(name));

  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error(`${name} must be a valid private key, for example 0x followed by 64 hex characters`);
  }

  return privateKey;
}

const sepoliaProvider = new ethers.JsonRpcProvider(getRequiredEnv('SEPOLIA_RPC_URL'));

const faucetAddress = getRequiredAddress('FAUCET_CONTRACT_ADDRESS');
const nftAddress = getRequiredAddress('NFT_CONTRACT_ADDRESS');
const backendSigner = new ethers.Wallet(getRequiredPrivateKey('PRIVATE_KEY'), sepoliaProvider);

export { sepoliaProvider, faucetAddress, nftAddress, backendSigner };
