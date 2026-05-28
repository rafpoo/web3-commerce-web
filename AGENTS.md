# AGENTS.md

## Project structure

- `src/` - Express API in TypeScript (entrypoint: `src/index.ts`). Compiles to `dist/`.
- `src/routes/` - Faucet and NFT REST endpoints.
- `src/services/` - ethers.js contract interaction services.
- `contracts/` - Optimized Solidity contracts used by local Hardhat simulation and artifact generation.
- `artifacts/` - ABI/bytecode generated from `contracts/` by `npm run compile:contracts`.
- `tests/` - Local Hardhat throughput benchmark runner.
- `scripts/` - Local contract compile/deploy utilities.
- `Faucet/` and `NFT/` - Remix workspace copies of Solidity contracts.
- `frontend/` - React frontend.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Run API dev server via `ts-node src/index.ts` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/index.js` |
| `npm run compile:contracts` | Compile optimized contracts with local `solc` and update `artifacts/` |
| `npm run test:performance` | Run local Hardhat throughput benchmark |
| `npm test` | Alias for `npm run test:performance` |
| `npm run node:local` | Start a local Hardhat JSON-RPC node |
| `npm run deploy:local` | Deploy Faucet and MyNFT to a running local Hardhat node |
| `npm run dev:frontend` | Run the frontend dev server |

No lint script is configured.

## Environment

`.env` requires:

- `SEPOLIA_RPC_URL`
- `FAUCET_CONTRACT_ADDRESS`
- `NFT_CONTRACT_ADDRESS`
- `PRIVATE_KEY`

The backend validates required addresses and private key format at startup. Missing values fail fast.

## API endpoints

- `GET /health` - API health check.
- `POST /api/faucet/request` - Request faucet funds through the configured backend signer.
- `GET /api/faucet/balance` - Read Faucet contract balance.
- `POST /api/nft/mint` - Mint one NFT.
- `POST /api/nft/mintBatch` - Mint multiple NFTs in a single contract transaction.
- `GET /api/nft/totalSupply` - Read `tokenCounter`.

## Throughput evaluation

- `tests/performance.test.js` deploys the optimized contracts to Hardhat's local in-process network, funds test wallets, sends real transactions, and reports:
  - successful/failed transaction counts,
  - duration,
  - transactions per second,
  - items/NFTs per second for batch minting,
  - average gas per transaction,
  - average gas per item,
  - edge-case revert checks.
- Current scenarios cover `faucet.requestFunds`, `nft.mintNFT`, and `nft.mintBatch` with batch sizes 10, 25, 50, and 100.

## Smart contract notes

- Solidity source uses `^0.8.20`; OpenZeppelin dependencies may require compiler `0.8.24+` in Hardhat config.
- `contracts/Faucet.sol` uses custom errors, constant withdrawal/cooldown values, checks-effects-interactions, and `.call`.
- `contracts/MyNFT.sol` supports single mint, safe batch mint, and EOA-only unsafe batch mint for higher-throughput experiments.
- Root `artifacts/` should be regenerated after contract changes with `npm run compile:contracts`.
- Remix workspace copies in `Faucet/` and `NFT/` should be kept in sync if they are still used for manual Remix workflows.
