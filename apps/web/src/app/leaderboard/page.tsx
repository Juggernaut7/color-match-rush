"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import WalletButton from "@/components/WalletButton"
import BottomNav from "@/components/BottomNav"

export const dynamic = 'force-dynamic'

interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  _id: string
}

function LeaderboardPageContent() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        const data = await response.json()
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setLeaderboard(data)
        } else {
          console.error("Invalid leaderboard data:", data)
          setLeaderboard([])
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] pb-20 relative">
      <WalletButton />
      <div className="sticky top-0 bg-[#0f172a] z-10 px-6 pt-20 pb-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black text-white"
        >
          Leaderboard
        </motion.h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-white">Loading...</p>
          </div>
        ) : !Array.isArray(leaderboard) || leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-lg text-white">No scores yet</p>
            <p className="text-sm text-gray-400">Be the first to submit!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry._id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl ${
                  entry.rank <= 3 ? "bg-gradient-to-r from-[#35d07f] to-[#fbcc5c]" : "bg-[#1e293b] border border-[#334155]"
                }`}
              >
                <div className="text-2xl font-black w-12 text-center">
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg font-mono text-sm">
                    {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                  </p>
                </div>
                <div className="text-3xl font-black text-[#35d07f]">{entry.score}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="leaderboard" />
    </div>
  )
}

export default function LeaderboardPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#0f172a] items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center animate-pulse">
          <span className="text-5xl font-bold text-white">🎨</span>
        </div>
        <p className="mt-4 text-lg text-white">Loading...</p>
      </div>
    )
  }

  return <LeaderboardPageContent />
}
