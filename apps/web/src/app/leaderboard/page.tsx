"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import WalletButton from "@/components/WalletButton"
import BottomNav from "@/components/BottomNav"

interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  _id: string
}

export default function LeaderboardPage() {
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
    <div className="flex flex-col h-screen w-full pb-20 relative">
      <WalletButton />
      <div className="sticky top-0 bg-white z-10 px-6 pt-20 pb-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black text-[#1a1a1a]"
        >
          Leaderboard
        </motion.h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#1a1a1a]">Loading...</p>
          </div>
        ) : !Array.isArray(leaderboard) || leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-lg text-[#1a1a1a]">No scores yet</p>
            <p className="text-sm text-gray-500">Be the first to submit!</p>
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
                  entry.rank <= 3 ? "bg-gradient-to-r from-[#35d07f] to-[#fbcc5c]" : "bg-[#f2f2f2]"
                }`}
              >
                <div className="text-2xl font-black w-12 text-center">
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1a1a1a] text-lg font-mono text-sm">
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

