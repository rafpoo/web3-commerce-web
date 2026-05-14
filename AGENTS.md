# AGENTS.md

## Project structure

- `src/` — Express API in TypeScript (entrypoint: `src/index.ts`). Compiles to `dist/`.
- `Faucet/` — Solidity Faucet contract + duplicate NFT contracts (Remix workspace).
- `NFT/` — Solidity NFT contracts (Remix workspace).
- `artifacts/` — Compiled Faucet ABI/bytecode from Remix.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Run dev server via `ts-node src/index.ts` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/index.js` |

No test, lint, or typecheck scripts are configured.

## Environment

`.env` requires: `SEPOLIA_RPC_URL`, `FAUCET_CONTRACT_ADDRESS`, `NFT_CONTRACT_ADDRESS`.

The app hardcodes fallback placeholder addresses if env vars are missing.

## Known issues in the codebase

- **Circular/self imports**: `src/services/faucet.service.ts:3` imports `FAUCET_ABI` from itself; same pattern in `nft.service.ts`. `contractService.ts` is unused and has a typo (`nptContract`).
- **Empty ABIs**: All ABI arrays are `[]` (TODOs). Real ABIs must be imported from `artifacts/` or the Solidity source.
- **Placeholder routes**: `POST /api/faucet/request` and `POST /api/nft/mint` return hardcoded responses instead of calling services. `GET /api/nft/totalSupply` is also hardcoded.
- **No test framework**: `npm test` is a no-op.

## Smart contract notes

- Solidity `^0.8.20`, compiled via Remix IDE.
- Contracts use `@openzeppelin/contracts` imports (require internet during Remix compilation).
- `Faucet/MyNFT.sol` and `Faucet/MyNFT2.sol` are duplicates of the NFT contracts — likely experimental copies.
- `NFT/contracts/MyToken.sol` is a minimal ERC721 (unused by the API).
