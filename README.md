# 🎨 Color Match Rush

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Celo](https://img.shields.io/badge/Celo-Sepolia-gold?logo=celo)

**A fast-paced color-matching reaction puzzle game built for the Celo MiniPay Hackathon**

*Mobile-first • Blockchain-integrated • Real-time leaderboard*

[Features](#-features) • [Installation](#-installation) • [Game Rules](#-game-rules) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Game Rules](#-game-rules)
- [API Documentation](#-api-documentation)
- [Smart Contracts](#-smart-contracts)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Color Match Rush** is an engaging, fast-paced color-matching game that combines the classic Stroop effect with blockchain technology. Players compete in time-limited rounds, paying entry fees in cUSD and competing for prize pools distributed to the top 3 winners.

### Key Highlights

- 🎮 **30-second gameplay** - Fast-paced, intense color matching challenges
- 💰 **Blockchain payments** - Real cUSD transactions via Celo network
- 🏆 **Round-based competition** - 12-hour rounds with prize pools
- 📱 **Mobile-first design** - Optimized for mobile devices
- 🎨 **Animated backgrounds** - Dynamic, color-changing visual experience
- 📊 **Real-time leaderboard** - Live rankings and score tracking

---

## ✨ Features

### 🎮 Game Features

- **8 Color Options**: RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE, PINK, CYAN
- **Stroop Effect**: Color words displayed in different colors for cognitive challenge
- **Real-time Scoring**: +1 for correct, -1 for wrong answers
- **30-Second Timer**: Animated countdown bar
- **Automatic Score Submission**: Scores saved automatically when game ends

### 💳 Blockchain Integration

- **Wallet Connection**: MetaMask, Rainbow, WalletConnect, Coinbase Wallet support
- **Celo Sepolia Network**: Testnet deployment ready
- **cUSD Payments**: Real ERC20 token transfers for entry fees
- **Transaction Tracking**: All payments recorded on-chain

### 🏆 Competition System

- **12-Hour Rounds**: New rounds start every 12 hours
- **Entry Fee**: $0.50 cUSD per round
- **Prize Distribution**: 50% / 30% / 20% split for top 3 winners
- **One Play Per Round**: Fair competition, no replay advantage
- **Live Leaderboard**: Real-time rankings sorted by highest scores

### 🎨 User Experience

- **Animated Backgrounds**: Dynamic color-changing backgrounds
- **Mobile-First UI**: Bottom navigation, thumb-reachable buttons
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on all screen sizes

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework with App Router |
| **TypeScript** | 5.2 | Type-safe development |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 12.x | Smooth animations |
| **shadcn/ui** | Latest | UI component library |
| **Wagmi** | 2.x | Ethereum React hooks |
| **RainbowKit** | 2.x | Wallet connection UI |
| **Viem** | 2.x | Ethereum utilities |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.x | Serverless backend |
| **MongoDB Atlas** | Latest | Database for scores & rounds |
| **Zod** | 3.x | Schema validation |
| **bcryptjs** | 3.x | Password hashing |

### Blockchain

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hardhat** | Latest | Smart contract development |
| **Solidity** | ^0.8.0 | Smart contract language |
| **Celo Sepolia** | - | Test network |

### Development

| Technology | Version | Purpose |
|------------|---------|---------|
| **Turborepo** | 1.10 | Monorepo management |
| **PNPM** | 8.x | Package manager |
| **TypeScript** | 5.2 | Type checking |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  Pages: Home | Play | Game | Result | Leaderboard | Profile │
│  Components: Wallet | BottomNav | AnimatedBackground        │
│  State: Wagmi (Wallet) | React Query (Data)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/API Calls
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Next.js API Routes (Serverless)                 │
├─────────────────────────────────────────────────────────────┤
│  /api/round/current    - Get current round info            │
│  /api/round/join       - Join round with payment            │
│  /api/round/play-count - Check user play status            │
│  /api/submit-score     - Submit game score                  │
│  /api/leaderboard      - Get leaderboard rankings           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ MongoDB Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    MongoDB Atlas                            │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                               │
│  - rounds    (round info, pool, timeLeft)                   │
│  - entries   (user round participation)                      │
│  - scores    (user scores per round)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Blockchain (Celo Sepolia)                     │
├─────────────────────────────────────────────────────────────┤
│  - cUSD Token (ERC20) for entry fees                        │
│  - Treasury Contract (optional, for auto-payouts)           │
│  - Wallet Integration (MetaMask, Rainbow, etc.)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **PNPM** >= 8.0.0
- **MongoDB Atlas** account (free tier works)
- **WalletConnect Project ID** ([Get one here](https://cloud.walletconnect.com))

### Step 1: Clone the Repository

```bash
git clone https://github.com/Juggernaut7/color-match-rush.git
cd color-match-rush
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cd apps/web
cp .example .env.local
```

Edit `.env.local` with your values:

```env
# WalletConnect Project ID (REQUIRED)
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id_here

# MongoDB Connection String (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Treasury Address (OPTIONAL - Your wallet address for receiving entry fees)
NEXT_PUBLIC_TREASURY_ADDRESS=0xYourWalletAddressHere
```

### Step 4: Start Development Server

```bash
# From root directory
pnpm dev

# Or from apps/web
cd apps/web
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_WC_PROJECT_ID` | ✅ Yes | WalletConnect project ID | `bbd247378e89e58df9b556683f410774` |
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | ⚠️ Optional | Wallet address for receiving entry fees | `0xf39ce20c6a905157cf532890ed87b86f422774b7` |

### MongoDB Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free tier M0 works)
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database password

### WalletConnect Setup

1. Sign up at [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Add it to `.env.local`

---

## 🎮 Game Rules

### How to Play

1. **Join a Round**
   - Connect your wallet (MetaMask, Rainbow, etc.)
   - Pay $0.50 cUSD entry fee
   - Wait for round to start

2. **Play the Game**
   - You'll see a color word (e.g., "RED") displayed in a different color
   - Select the button that matches the **word's meaning**, not the color it's displayed in
   - You have **30 seconds** to answer as many questions as possible

3. **Scoring**
   - ✅ **Correct answer**: +1 point
   - ❌ **Wrong answer**: -1 point
   - Score cannot go below 0

4. **Winning**
   - Top 3 players win prizes:
     - 🥇 **1st Place**: 50% of prize pool
     - 🥈 **2nd Place**: 30% of prize pool
     - 🥉 **3rd Place**: 20% of prize pool

### Game Mechanics

- **8 Colors**: RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE, PINK, CYAN
- **Stroop Effect**: Word color ≠ Text color (cognitive challenge)
- **One Play Per Round**: Fair competition, no replays
- **Automatic Submission**: Score saved automatically when game ends

---

## 📡 API Documentation

### Round Endpoints

#### `GET /api/round/current`

Get current active round information.

**Response:**
```json
{
  "roundId": "round-1234567890",
  "entryFee": 0.5,
  "pool": 25.50,
  "timeLeft": 43200,
  "startTime": "2024-01-01T00:00:00Z",
  "endTime": "2024-01-01T12:00:00Z"
}
```

#### `POST /api/round/join`

Join a round by paying entry fee.

**Request:**
```json
{
  "address": "0x...",
  "txHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "roundId": "round-1234567890",
  "pool": 26.00
}
```

#### `GET /api/round/join?check={address}&roundId={roundId}`

Check if user has joined a round.

**Response:**
```json
{
  "hasJoined": true
}
```

#### `GET /api/round/play-count?address={address}&roundId={roundId}`

Check user's play status for a round.

**Response:**
```json
{
  "hasPlayed": false,
  "score": 0,
  "canPlay": true,
  "playCount": 0
}
```

### Score Endpoints

#### `POST /api/submit-score`

Submit game score (called automatically when game ends).

**Request:**
```json
{
  "roundId": "round-1234567890",
  "address": "0x...",
  "score": 25
}
```

**Response:**
```json
{
  "success": true,
  "score": 25,
  "hasPlayed": true,
  "canPlayAgain": false
}
```

**Error Response (if already played):**
```json
{
  "error": "You have already played this round. Wait for the next round to play again.",
  "score": 25,
  "hasPlayed": true
}
```

### Leaderboard Endpoint

#### `GET /api/leaderboard`

Get current round leaderboard (top 100).

**Response:**
```json
[
  {
    "_id": "...",
    "address": "0x...",
    "score": 45,
    "rank": 1
  },
  {
    "_id": "...",
    "address": "0x...",
    "score": 42,
    "rank": 2
  }
]
```

---

## 🔐 Smart Contracts

### Treasury Contract (Optional)

The project includes a `ColorMatchRushTreasury` contract for automatic prize distribution.

**Location:** `apps/contracts/contracts/ColorMatchRushTreasury.sol`

**Features:**
- Receive entry fees
- Automatically distribute prizes to top 3 winners
- Owner-controlled functions

**Deployment:**

```bash
cd apps/contracts
npm run deploy:treasury:sepolia
```

See [DEPLOY.md](apps/contracts/DEPLOY.md) for detailed deployment instructions.

**Note:** Currently using EOA (wallet address) for receiving entry fees. Contract is ready for future use when automatic payouts are needed.

---

## 📱 MiniPay Testing

Test your app in the MiniPay environment using ngrok for local development.

### Quick Start

1. **Install ngrok** (if not already installed):
   ```bash
   # macOS
   brew install ngrok/ngrok/ngrok
   
   # Or via npm
   npm install -g ngrok
   ```

2. **Set up ngrok config**:
   ```bash
   cd apps/web
   cp ngrok.yml.example ngrok.yml
   # Edit ngrok.yml and add your auth token
   ```

3. **Start testing environment**:
   ```bash
   # Linux/macOS
   ./scripts/start-minipay-test.sh
   
   # Windows PowerShell
   .\scripts\start-minipay-test.ps1
   ```

4. **Enable Developer Mode in MiniPay**:
   - Open MiniPay app
   - Go to **Settings** → **About**
   - Tap version number 7 times
   - Go to **Settings** → **Developer Settings**
   - Enable **Developer Mode** and **Use Testnet**

5. **Load your app**:
   - In Developer Settings, tap **Load test page**
   - Enter the ngrok URL shown in terminal
   - Tap **Load** to launch

### Manual Setup

If you prefer manual setup:

```bash
# Terminal 1: Start dev server
cd apps/web
pnpm dev

# Terminal 2: Start ngrok
cd apps/web
pnpm ngrok
# Or: ngrok start --config=ngrok.yml minipay
```

Get your URL from http://localhost:4040 (ngrok dashboard)

### Documentation

For detailed instructions, troubleshooting, and configuration, see:
- **[MINIPAY_TESTING.md](apps/web/MINIPAY_TESTING.md)** - Complete testing guide

### Features Tested

- ✅ Wallet auto-connection in MiniPay
- ✅ cUSD transactions (entry fees)
- ✅ Gameplay and scoring
- ✅ Leaderboard updates
- ✅ Round management

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub** (already done ✅)

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Vercel will automatically detect Next.js

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Manual Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `NEXT_PUBLIC_WC_PROJECT_ID`
- `MONGODB_URI`
- `NEXT_PUBLIC_TREASURY_ADDRESS`

---

## 📁 Project Structure

```
color-match-rush/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router pages
│   │   │   │   ├── api/        # API routes
│   │   │   │   ├── game/       # Game page
│   │   │   │   ├── play/       # Play/join page
│   │   │   │   ├── result/     # Results page
│   │   │   │   └── leaderboard/# Leaderboard page
│   │   │   ├── components/     # React components
│   │   │   │   ├── AnimatedBackground.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── ColorButtons.tsx
│   │   │   │   ├── JoinRoundButton.tsx
│   │   │   │   └── wallet-provider.tsx
│   │   │   └── lib/            # Utilities
│   │   │       ├── db.ts       # MongoDB connection
│   │   │       └── utils/      # Helper functions
│   │   ├── .env.local          # Environment variables
│   │   └── package.json
│   │
│   └── contracts/              # Smart contracts
│       ├── contracts/          # Solidity contracts
│       ├── ignition/           # Deployment scripts
│       ├── test/               # Contract tests
│       └── hardhat.config.ts
│
├── package.json                # Root package.json
├── turbo.json                  # Turborepo config
└── README.md                   # This file
```

---

## 🧪 Available Scripts

### Root Level

```bash
pnpm dev              # Start all development servers
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm type-check       # Run TypeScript type checking
pnpm clean            # Clean all build artifacts
```

### Web App

```bash
cd apps/web
pnpm dev              # Start Next.js dev server (port 3000)
pnpm dev:minipay      # Start dev server for MiniPay testing
pnpm ngrok            # Start ngrok tunnel for MiniPay
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Smart Contracts

```bash
cd apps/contracts
pnpm compile          # Compile Solidity contracts
pnpm test             # Run contract tests
pnpm deploy:treasury:sepolia  # Deploy treasury to Celo Sepolia
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#35D07F` | Buttons, highlights, success states |
| Secondary Yellow | `#FBCC5C` | Accents, gradients |
| Dark Text | `#1A1A1A` | Primary text |
| Light Grey | `#F2F2F2` | Backgrounds, cards |
| Error Red | `#FF4D4D` | Errors, wrong answers |

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large (3xl-5xl)
- **Body**: Regular, readable sizes

### Components

- **Rounded corners**: `rounded-2xl` (1rem)
- **Shadows**: `shadow-lg` for depth
- **Spacing**: Generous padding and margins
- **Animations**: Framer Motion for smooth transitions

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Celo Foundation** - For the amazing blockchain infrastructure
- **MiniPay** - For mobile wallet integration inspiration
- **Next.js Team** - For the incredible framework
- **RainbowKit** - For seamless wallet connection UX
- **Framer Motion** - For beautiful animations

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Juggernaut7/color-match-rush/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Juggernaut7/color-match-rush/discussions)

---

<div align="center">

**Built with ❤️ for the Celo MiniPay Hackathon**

⭐ Star this repo if you find it helpful!

</div>
