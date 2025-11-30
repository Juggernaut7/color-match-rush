import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { WalletProvider } from "@/components/wallet-provider"
import AnimatedBackground from "@/components/AnimatedBackground"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Color Match Rush',
  description: 'A fast-paced color-matching reaction puzzle game built for the Celo MiniPay Hackathon. Mobile-first, fast, clean, with leaderboard + wallet integration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnimatedBackground variant="gradient" />
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
