"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import WalletButton from "@/components/WalletButton"
import BottomNav from "@/components/BottomNav"
import RoundCountdown from "@/components/RoundCountdown"
import JoinRoundButton from "@/components/JoinRoundButton"
import { useAccount } from "wagmi"

interface RoundData {
  roundId: string
  pool: number
  entryFee: number
  timeLeft: number
}

function HomeContent() {
  const { isConnected, address } = useAccount()
  const [roundData, setRoundData] = useState<RoundData | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        const response = await fetch("/api/round/current")
        if (response.ok) {
          const data = await response.json()
          setRoundData(data)
          
          // Check if user has joined and if they've already played
          if (address) {
            const entriesResponse = await fetch(`/api/round/join?check=${address}&roundId=${data.roundId}`)
            if (entriesResponse.ok) {
              const entryData = await entriesResponse.json()
              setHasJoined(entryData.hasJoined || false)
            }

            // Check if user has already played
            const playCountResponse = await fetch(`/api/round/play-count?address=${address}&roundId=${data.roundId}`)
            if (playCountResponse.ok) {
              const playData = await playCountResponse.json()
              setHasPlayed(playData.hasPlayed || false)
              setUserScore(playData.score || 0)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch round data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoundData()
    const interval = setInterval(fetchRoundData, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [address])
  
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center mb-6 shadow-lg">
          <span className="text-6xl font-bold text-[#1a1a1a]">🎨</span>
        </div>
        <h1 className="text-5xl font-black text-[#1a1a1a] text-center mb-3">
          Color Match Rush
        </h1>
        <p className="text-xl font-medium text-[#1a1a1a] text-center text-balance mb-2">
          Compete. Earn. Win.
        </p>
        <p className="text-sm text-gray-500 text-center">
          Join 12-hour rounds • $0.50 entry • Top 3 win prizes
        </p>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 text-center">How It Works</h2>
        <div className="space-y-4">
          <div className="bg-[#f2f2f2] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">1️⃣</div>
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Match the Color</h3>
                <p className="text-[#1a1a1a]">
                  You'll see a color word (like "RED") displayed in a different color. Your job is to select the button that matches the word's meaning, not the color it's displayed in!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f2f2] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">2️⃣</div>
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Race Against Time</h3>
                <p className="text-[#1a1a1a]">
                  You have 30 seconds to answer as many questions as possible. Each correct answer gives you +1 point, wrong answers give you -1 point.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f2f2] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">3️⃣</div>
              <div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Climb the Leaderboard</h3>
                <p className="text-[#1a1a1a]">
                  Submit your score and compete with players worldwide. See if you can make it to the top!
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Round Info Section */}
      {roundData && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <RoundCountdown timeLeft={roundData.timeLeft} />
          <div className="mt-4 bg-[#f2f2f2] rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Prize Pool</p>
            <p className="text-3xl font-black text-[#1a1a1a]">${roundData.pool.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">
              Top 3 winners share: 50% / 30% / 20%
            </p>
          </div>
        </motion.div>
      )}

      {/* Join Round Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 text-center">Ready to Play?</h2>
        {loading ? (
          <div className="w-full py-5 bg-[#f2f2f2] rounded-2xl animate-pulse"></div>
        ) : hasPlayed ? (
          <div className="bg-[#f2f2f2] rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg font-bold text-[#1a1a1a] mb-2">
              You've already played this round!
            </p>
            <p className="text-2xl font-black text-[#35d07f] mb-2">{userScore}</p>
            <p className="text-sm text-gray-500 mb-4">Your Score</p>
            <p className="text-sm text-gray-500">
              Wait for the next round to play again.
            </p>
          </div>
        ) : isConnected && roundData ? (
          <JoinRoundButton
            roundId={roundData.roundId}
            entryFee={roundData.entryFee}
            pool={roundData.pool}
            hasJoined={hasJoined}
          />
        ) : (
          <div className="bg-[#f2f2f2] rounded-2xl p-6 text-center">
            <p className="text-lg text-[#1a1a1a] mb-4">
              Connect your wallet to start playing!
            </p>
            <p className="text-sm text-gray-500">
              Click the wallet button in the top right corner to connect.
            </p>
          </div>
        )}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-black text-[#1a1a1a] mb-6 text-center">Features</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#35d07f] to-[#35d07f]/80 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-bold text-[#1a1a1a]">Fast Paced</p>
          </div>
          <div className="bg-gradient-to-br from-[#fbcc5c] to-[#fbcc5c]/80 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <p className="font-bold text-[#1a1a1a]">Brain Training</p>
          </div>
          <div className="bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-bold text-[#1a1a1a]">Competitive</p>
          </div>
          <div className="bg-gradient-to-br from-[#fbcc5c] to-[#35d07f] rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">📱</div>
            <p className="font-bold text-[#1a1a1a]">Mobile First</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-full bg-white pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center animate-pulse">
            <span className="text-5xl font-bold text-[#1a1a1a]">🎨</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white pb-20 relative">
      <WalletButton />
      
      <div className="flex-1 overflow-y-auto px-6 pt-20">
        <div className="max-w-2xl mx-auto">
          {isMounted ? (
            <HomeContent />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center animate-pulse">
                <span className="text-5xl font-bold text-[#1a1a1a]">🎨</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  )
}
