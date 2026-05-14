# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Web3 e-commerce platform built with React.js frontend, Express.js API backend, and ethers.js that provides REST endpoints for interacting with two smart contracts:
1. Faucet contract - for requesting test ETH
2. NFT contract - for minting NFTs as digital receipts

The API is structured with:
- Express server as the entry point (src/index.ts)
- Route handlers for each contract type (src/routes/)
- Service layers for contract interactions (src/services/)

## Common Development Commands

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Run in production
```bash
npm start
```

## Project Structure

```
src/
  ├── index.ts          # Express app entry point
  ├── config.ts         # Configuration and environment variables
  ├── routes/          # API route handlers
  │   ├── faucet.ts    # Faucet endpoints
  │   └── nft.ts        # NFT endpoints
  └── services/         # Business logic
      ├── faucet.service.ts  # Faucet contract interactions
      └── nft.service.ts     # NFT contract interactions

frontend/
  ├── components/   # React UI components
  ├── web3/         # Web3 integration services
  ├── services/      # API service integration
  ├── App.js        # Main application component
  └── index.js     # Entry point
```

## Environment Variables

The project requires the following environment variables in a .env file:
- `SEPOLIA_RPC_URL`: Sepolia testnet RPC URL
- `FAUCET_CONTRACT_ADDRESS`: Deployed Faucet contract address
- `NFT_CONTRACT_ADDRESS`: Deployed NFT contract address

## API Endpoints

### Faucet Endpoints
- `POST /api/faucet/request` - Request funds from the faucet
- `GET /api/faucet/balance` - Get the faucet contract balance

### NFT Endpoints
- `POST /api/nft/mint` - Mint a new NFT
- `GET /api/nft/totalSupply` - Get the total supply of NFTs

## Architecture

The application follows a layered architecture:
1. **Frontend Layer**: React.js UI with Web3 integration
2. **API Layer**: Express.js REST API
3. **Services Layer**: Business logic and contract interactions
4. **Smart Contracts Layer**: Ethereum contracts on Sepolia testnet

All contract interactions use ethers.js to communicate with the Sepolia testnet.

## Additional Features

The project also includes:
- Performance testing framework in tests/ directory
- Optimized smart contracts in contracts/ directory
- Frontend components with Web3 integration