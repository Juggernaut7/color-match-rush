"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import WalletButton from "@/components/WalletButton"
import BottomNav from "@/components/BottomNav"
import JoinRoundButton from "@/components/JoinRoundButton"

function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected, address } = useAccount()
  const [roundData, setRoundData] = useState<any>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const alreadyPlayed = searchParams.get("alreadyPlayed") === "true"
  const existingScore = Number.parseInt(searchParams.get("score") || "0")

  useEffect(() => {
    fetchRoundData()
  }, [address])

  const fetchRoundData = async () => {
    try {
      const response = await fetch("/api/round/current")
      if (response.ok) {
        const data = await response.json()
        setRoundData(data)
        
        // Check if user has joined and if they've already played
        if (address) {
          const checkResponse = await fetch(`/api/round/join?check=${address}&roundId=${data.roundId}`)
          if (checkResponse.ok) {
            const checkData = await checkResponse.json()
            setHasJoined(checkData.hasJoined || false)
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

  const handleResetPlay = async () => {
    if (!address) return
    
    setResetting(true)
    try {
      const response = await fetch(`/api/reset-play?address=${address}`)
      const data = await response.json()
      
      if (response.ok) {
        // Refresh the page data
        await fetchRoundData()
        alert("✅ Play status reset! You can now play again.")
      } else {
        alert(data.error || "Failed to reset play status")
      }
    } catch (error) {
      console.error("Reset play error:", error)
      alert("Failed to reset play status")
    } finally {
      setResetting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#0f172a] pb-20 relative">
        <WalletButton />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Please connect your wallet to start playing!
            </p>
            <p className="text-sm text-gray-400">
              Click the wallet button in the top right corner.
            </p>
          </motion.div>
        </div>
        <BottomNav active="play" />
      </div>
    )
  }

  // Check if user has joined the round
  if (!hasJoined && roundData) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#0f172a] pb-20 relative">
        <WalletButton />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="text-6xl mb-6">💰</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Join Round to Play
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Pay ${roundData.entryFee.toFixed(2)} to join this round and compete for the prize pool!
            </p>
            {loading ? (
              <div className="w-full py-5 bg-[#1e293b] rounded-2xl animate-pulse border border-[#334155]"></div>
            ) : (
              <JoinRoundButton
                roundId={roundData.roundId}
                entryFee={roundData.entryFee}
                pool={roundData.pool}
                hasJoined={hasJoined}
              />
            )}
          </motion.div>
        </div>
        <BottomNav active="play" />
      </div>
    )
  }

  // Check if user has already played this round
  if (hasPlayed || alreadyPlayed) {
    const score = userScore || existingScore
    return (
      <div className="flex flex-col h-screen w-full bg-[#0f172a] pb-20 relative">
        <WalletButton />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Already Played This Round
            </h2>
            <p className="text-lg text-gray-200 mb-4">
              You can only play once per round!
            </p>
            <div className="bg-[#1e293b] rounded-2xl p-4 mb-6 border border-[#334155]">
              <p className="text-2xl font-black text-[#35d07f] mb-2">{score}</p>
              <p className="text-sm text-gray-400">Your Score</p>
            </div>
            <p className="text-sm text-gray-400 mb-8">
              Wait for the round to end and join the next round to play again!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/leaderboard")}
              className="w-full py-4 px-6 bg-[#35d07f] text-[#1a1a1a] font-bold rounded-2xl transition-all hover:opacity-90 mb-3"
            >
              View Leaderboard
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleResetPlay}
              disabled={resetting}
              className="w-full py-4 px-6 bg-yellow-500 text-white font-bold rounded-2xl transition-all hover:opacity-90 mb-3 disabled:opacity-50"
            >
              {resetting ? "Resetting..." : "🔄 Reset Play (Demo)"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="w-full py-4 px-6 border-2 border-gray-400 text-white font-bold rounded-2xl transition-all hover:bg-[#1e293b]"
            >
              Home
            </motion.button>
          </motion.div>
        </div>
        <BottomNav active="play" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] pb-20 relative">
      <WalletButton />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-6xl">🎮</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Ready to Play?
            </h1>
            <p className="text-lg text-gray-200 mb-4">
              You'll have 30 seconds to match as many colors as possible!
            </p>
            <div className="bg-[#1e293b] rounded-2xl p-3 mb-4 border border-[#334155]">
              <p className="text-sm text-gray-300">
                One play per round • Your score will be saved automatically
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#334155]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="font-bold text-white">30 Seconds</p>
                  <p className="text-sm text-gray-400">Time limit per game</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#334155]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-white">+1 Point</p>
                  <p className="text-sm text-gray-400">For each correct answer</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#334155]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-bold text-white">-1 Point</p>
                  <p className="text-sm text-gray-400">For each wrong answer</p>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/game")}
            className="w-full py-5 px-6 bg-gradient-to-r from-[#35d07f] to-[#fbcc5c] text-[#1a1a1a] text-xl font-black rounded-2xl shadow-lg transition-all hover:opacity-90"
          >
            Start Game! 🚀
          </motion.button>
        </motion.div>
      </div>

      <BottomNav active="play" />
    </div>
  )
}

export default function PlayPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <PlayPageContent />
}

