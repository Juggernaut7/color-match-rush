# ColorMatchRushTreasury Contract

> **Status**: Contract is ready but not currently deployed.  
> **Current Setup**: Using EOA address `0xf39ce20c6a905157cf532890ed87b86f422774b7` for receiving entry fees.

## Contract Overview

The `ColorMatchRushTreasury` contract is designed for:
- Receiving entry fees from players
- Automatically distributing prizes to top 3 winners (50/30/20 split)
- Tracking rounds and prize pools on-chain

## When to Deploy

Deploy this contract when you want:
- ✅ Automatic prize distribution (no manual transfers needed)
- ✅ On-chain transparency for prize pools
- ✅ Trustless prize payouts
- ✅ Better tracking of rounds and funds

## Current Setup (EOA)

Right now, entry fees are sent directly to your wallet address:
- **Address**: `0xf39ce20c6a905157cf532890ed87b86f422774b7`
- **Pros**: Simple, no deployment needed, immediate access to funds
- **Cons**: Manual prize distribution required

## Files

- `contracts/ColorMatchRushTreasury.sol` - Main contract
- `ignition/modules/ColorMatchRushTreasury.ts` - Deployment script
- `DEPLOY.md` - Deployment instructions

## Quick Deploy (When Ready)

```bash
cd apps/contracts
# Add PRIVATE_KEY to .env
npm run deploy:treasury:sepolia
# Update NEXT_PUBLIC_TREASURY_ADDRESS in apps/web/.env.local
```

The contract is ready whenever you need it! 🚀


