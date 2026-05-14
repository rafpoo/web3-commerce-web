import { ethers } from 'ethers';
import { sepoliaProvider, faucetAddress, nftAddress } from '../config';
import { FAUCET_ABI, NFT_ABI } from './abis';

const faucetContract = new ethers.Contract(faucetAddress, FAUCET_ABI, sepoliaProvider);
const nftContract = new ethers.Contract(nftAddress, NFT_ABI, sepoliaProvider);

export { faucetContract, nftContract };
