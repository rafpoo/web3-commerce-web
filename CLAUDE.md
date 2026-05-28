# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This is a Web3 e-commerce platform with:

1. React frontend in `frontend/`.
2. Express TypeScript API in `src/`.
3. ethers.js services for Faucet and NFT contract interactions.
4. Optimized Solidity contracts in `contracts/`.
5. Local Hardhat throughput benchmarking in `tests/`.

The API entrypoint is `src/index.ts`. It exposes health, faucet, and NFT routes and compiles to `dist/index.js`.

## Common Development Commands

```bash
npm install
npm run build
npm run dev
npm start
```

Contract and benchmark commands:

```bash
npm run compile:contracts
npm run test:performance
npm test
npm run node:local
npm run deploy:local
```

`npm run compile:contracts` updates the root `artifacts/Faucet.json` and `artifacts/MyNFT.json` files used by the backend ABI loader.

## Project Structure

```text
src/
  index.ts                 Express app entrypoint
  config.ts                Environment validation, provider, signer
  routes/
    faucet.ts              Faucet endpoints
    nft.ts                 NFT single and batch mint endpoints
  services/
    abis.ts                ABI imports from root artifacts
    faucet.service.ts      Faucet contract calls
    nft.service.ts         NFT contract calls

contracts/
  Faucet.sol               Optimized Faucet contract
  MyNFT.sol                Optimized NFT contract with batch minting

tests/
  performance.test.js      Local Hardhat throughput benchmark
  run-performance-test.js  Benchmark CLI runner

scripts/
  compile-contracts.js     Local solc artifact generation
  deploy-local.js          Deploy to running local Hardhat node

frontend/
  src/                     React frontend
```

## Environment Variables

The backend requires these values in `.env`:

- `SEPOLIA_RPC_URL`
- `FAUCET_CONTRACT_ADDRESS`
- `NFT_CONTRACT_ADDRESS`
- `PRIVATE_KEY`

Startup validates required values. Invalid addresses or private keys throw before the API starts.

## API Endpoints

### Health

- `GET /health` - Returns `{ status: "ok" }`.

### Faucet

- `POST /api/faucet/request` - Calls `requestFunds()` using the backend signer.
- `GET /api/faucet/balance` - Reads the Faucet ETH balance.

### NFT

- `POST /api/nft/mint` - Mints one NFT to `recipient`.
- `POST /api/nft/mintBatch` - Mints NFTs to a non-empty `recipients` array in one transaction.
- `GET /api/nft/totalSupply` - Reads `tokenCounter`.

## Architecture Notes

- API routes validate request input and delegate blockchain work to services.
- Services use ABI data from root `artifacts/`.
- Contract artifacts are generated locally from `contracts/`, not from Remix output.
- Sepolia is used by the running API through `.env`; throughput evaluation is intentionally local and repeatable on Hardhat.

## Smart Contract Optimization Notes

- `Faucet` uses custom errors, constants, checks-effects-interactions, and `.call` for ETH transfer.
- `MyNFT` caches `tokenCounter`, uses `calldata` for batch recipients, writes storage once per batch, and uses `unchecked` increments.
- `mintBatch` uses `_safeMint`; `mintBatchUnsafeEOA` uses `_mint` for EOA-only throughput experiments.

## Performance Testing

`npm run test:performance` deploys contracts to Hardhat's in-process local network and measures real transaction throughput. It reports successful/failed counts, seconds, tx/s, items/s, average gas per transaction, average gas per item, and edge-case revert checks.

Current benchmark scenarios:

- 100 Faucet `requestFunds` calls from funded wallets.
- 100 sequential NFT `mintNFT` calls from the owner signer.
- NFT `mintBatch` with batch sizes 10, 25, 50, and 100.
- Revert checks for faucet cooldown, insufficient faucet balance, empty NFT batch, and invalid NFT recipient.
