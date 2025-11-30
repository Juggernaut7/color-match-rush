"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import WalletButton from "@/components/WalletButton"
import BottomNav from "@/components/BottomNav"

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white pb-20 relative">
      <WalletButton />
      
      <div className="flex-1 overflow-y-auto px-6 pt-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-[#1a1a1a] mb-2">Profile</h1>
            <p className="text-gray-500">Your game statistics and settings</p>
          </motion.div>

          {isConnected ? (
            <div className="space-y-6">
              {/* Wallet Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] rounded-2xl p-6"
              >
                <h2 className="text-2xl font-black text-[#1a1a1a] mb-4">Wallet</h2>
                <div className="bg-white/80 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="font-mono text-[#1a1a1a] font-bold break-all">
                    {address}
                  </p>
                </div>
              </motion.div>

              {/* Stats Placeholder */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#f2f2f2] rounded-2xl p-6"
              >
                <h2 className="text-2xl font-black text-[#1a1a1a] mb-4">Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1a1a1a]">Games Played</span>
                    <span className="font-bold text-[#1a1a1a]">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1a1a1a]">Best Score</span>
                    <span className="font-bold text-[#1a1a1a]">-</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1a1a1a]">Total Points</span>
                    <span className="font-bold text-[#1a1a1a]">-</span>
                  </div>
                </div>
              </motion.div>

              {/* About Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#f2f2f2] rounded-2xl p-6"
              >
                <h2 className="text-2xl font-black text-[#1a1a1a] mb-4">About</h2>
                <p className="text-[#1a1a1a] mb-4">
                  Color Match Rush is a fast-paced color-matching game built for the Celo MiniPay Hackathon.
                </p>
                <p className="text-sm text-gray-500">
                  Test your brain speed and compete with players worldwide!
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#f2f2f2] rounded-2xl p-8 text-center"
            >
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-black text-[#1a1a1a] mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-[#1a1a1a] mb-4">
                Connect your wallet to view your profile and statistics.
              </p>
              <p className="text-sm text-gray-500">
                Click the wallet button in the top right corner to connect.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}


