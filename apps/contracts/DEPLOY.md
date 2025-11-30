# Deploy ColorMatchRushTreasury Contract

> **Note**: Currently using EOA (wallet address) for receiving entry fees. This contract is kept for future use when automatic prize distribution is needed.

## Quick Answer: Do You Need a Contract?

**For just receiving entry fees: NO** - Your EOA (wallet address) can receive ERC20 tokens directly.

**For automatic prize distribution: YES** - A contract makes it easier to automatically distribute prizes to winners.

**Current Setup**: Using EOA address `0xf39ce20c6a905157cf532890ed87b86f422774b7` for receiving entry fees.

## Deployment Steps

### 1. Set up environment variables

Create a `.env` file in `apps/contracts/`:

```bash
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here  # Optional, for verification
```

⚠️ **IMPORTANT**: Use a private key that has CELO for gas fees on Celo Sepolia. Do NOT use a key with real funds on mainnet.

### 2. Get testnet CELO

You need CELO for gas fees. Get some from:
- Celo Sepolia Faucet: https://faucet.celo.org/
- Or use the Celo Discord faucet

### 3. Deploy to Celo Sepolia

```bash
cd apps/contracts
npm run deploy:treasury:sepolia
```

This will:
- Deploy the contract to Celo Sepolia
- Set the owner to your deployer address
- Set cUSD address to `0x6c23508A9b310C5f2eb2e2eFeBeB748067478667`

### 4. Get the deployed contract address

After deployment, you'll see output like:
```
Deployed ColorMatchRushTreasury at: 0x...
```

Copy this address and update your `.env.local` in `apps/web/`:

```bash
NEXT_PUBLIC_TREASURY_ADDRESS=0xYourDeployedContractAddress
```

### 5. Verify the contract (optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> 0x6c23508A9b310C5f2eb2e2eFeBeB748067478667
```

## Contract Functions

### For Players
- **Entry fees**: Send cUSD directly to the contract address (no function call needed)

### For Owner (You)
- `distributePrizes(roundId, firstPlace, secondPlace, thirdPlace)` - Distribute prizes (50/30/20 split)
- `updateRoundPool(roundId, amount)` - Update pool when entry fees are received
- `endRound(roundId)` - Mark a round as ended
- `changeOwner(newOwner)` - Transfer ownership
- `emergencyWithdraw(amount)` - Emergency withdraw (only owner)

## Using EOA vs Contract

### Option 1: Use Your EOA (Current Setup)
- ✅ Simple - no deployment needed
- ✅ Entry fees go directly to your wallet
- ❌ Manual prize distribution required
- ❌ You need to manually send prizes to winners

### Option 2: Use Contract (Recommended for Production)
- ✅ Automatic prize distribution
- ✅ Transparent on-chain tracking
- ✅ More secure and trustless
- ❌ Requires deployment and gas fees
- ❌ Need to call `distributePrizes` function

## Recommendation

For testing: Use your EOA address (current setup)
For production: Deploy the contract for automatic prize distribution

