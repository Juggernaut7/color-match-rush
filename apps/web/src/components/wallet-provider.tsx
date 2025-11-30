"use client";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider, createConfig, http, useConnect } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { defineChain } from "viem";

// Define Celo Sepolia chain
const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: ["https://forno.celo-sepolia.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Celo Sepolia Explorer",
      url: "https://celo-sepolia.blockscout.com",
    },
  },
  testnet: true,
});

// Create connectors and config only on client side to avoid indexedDB SSR issues
function createConnectors() {
  return connectorsForWallets(
    [
      {
        groupName: "Recommended",
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          coinbaseWallet,
          walletConnectWallet,
          injectedWallet,
        ],
      },
    ],
    {
      appName: "color-match-rush",
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }
  );
}

function createWagmiConfig() {
  return createConfig({
    chains: [celoSepolia, celoAlfajores, celo],
    connectors: createConnectors(),
    transports: {
      [celoSepolia.id]: http(),
      [celoAlfajores.id]: http(),
      [celo.id]: http(),
    },
    ssr: false,
  });
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}

function MiniPayAutoConnect({ children }: { children: React.ReactNode }) {
  const { connect, connectors } = useConnect();
  const [hasTried, setHasTried] = useState(false);

  useEffect(() => {
    if (hasTried) return;
    
    // Check if the app is running inside MiniPay
    if (typeof window !== "undefined" && window.ethereum && (window.ethereum as any).isMiniPay) {
      setHasTried(true);
      // Find the injected connector, which is what MiniPay uses
      const injectedConnector = connectors.find((c) => c.id === "injected");
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  }, [connect, connectors, hasTried]);

  return <>{children}</>;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => getQueryClient());
  const [wagmiConfig, setWagmiConfig] = useState<any>(null);

  useEffect(() => {
    // Only create config on client side to avoid indexedDB SSR issues
    if (typeof window !== "undefined") {
      setWagmiConfig(createWagmiConfig());
      setMounted(true);
    }
  }, []);

  if (!mounted || !wagmiConfig) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MiniPayAutoConnect>{children}</MiniPayAutoConnect>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
