# Web3 E-commerce Platform

This project provides a complete e-commerce platform with Web3 integration, allowing users to shop for digital products and receive NFTs as digital receipts for their purchases.

## Features

- **Product Browsing**: Browse products through an intuitive interface
- **Web3 Integration**: Connect your wallet to make purchases with cryptocurrency
- **NFT Minting**: Receive NFTs as digital receipts for purchases
- **Performance Testing**: Built-in throughput measurement tools

## API Endpoints

### Available Endpoints
- `POST /api/faucet/request` - Request funds from the faucet
- `GET /api/faucet/balance` - Get the faucet contract balance
- `POST /api/npt/mint` - Mint a new NFT
- `GET /api/nft/totalSupply` - Get the total supply of NFTs

## Project Structure

```
web3-commerce/
├── backend/              # API server
├── frontend/               # React frontend
├── contracts/            # Smart contracts
└── tests/                # Performance testing framework
```

## Smart Contract Optimization

Optimized versions of the smart contracts are available in the `contracts/` directory with gas-optimized implementations and batch minting support.