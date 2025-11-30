"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import BottomNav from "@/components/BottomNav"
import WalletButton from "@/components/WalletButton"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const roundId = searchParams.get("roundId") || ""
  const autoSubmitted = searchParams.get("autoSubmitted") === "true"
  const canPlayAgain = false // Can't play again in same round (one play per round)
  const [submitted, setSubmitted] = useState(autoSubmitted)
  const [loading, setLoading] = useState(false)
  const [currentRoundId, setCurrentRoundId] = useState(roundId)

  useEffect(() => {
    // Get current round if not provided
    if (!currentRoundId) {
      fetch("/api/round/current")
        .then((res) => res.json())
        .then((data) => {
          if (data.roundId) {
            setCurrentRoundId(data.roundId)
          }
        })
    }
  }, [currentRoundId])

  const handleSubmitScore = async () => {
    if (!isConnected || !address || !currentRoundId) {
      alert("Please connect your wallet and join a round first")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roundId: currentRoundId,
          address,
          score,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit score")
      }
    } catch (error) {
      console.error("Failed to submit score:", error)
      alert("Failed to submit score")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full pb-20 relative">
      <WalletButton />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#35d07f] to-[#fbcc5c] flex items-center justify-center">
            <span className="text-6xl">{score > 15 ? "🎉" : "👏"}</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black text-[#1a1a1a] mb-2"
        >
          {score} Points
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#1a1a1a] mb-8 text-center"
        >
          {score > 25 ? "Outstanding!" : score > 15 ? "Great job!" : "Good effort!"}
        </motion.p>

        {submitted ? (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-semibold text-[#35d07f] mb-8"
          >
            {autoSubmitted ? "Score automatically submitted! 🎯" : "Score submitted! 🎯"}
          </motion.p>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xs mb-8"
          >
            {isConnected && currentRoundId ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitScore}
                disabled={loading}
                className="w-full py-4 px-6 bg-[#35d07f] text-[#1a1a1a] font-bold rounded-2xl disabled:opacity-50 transition-all"
              >
                {loading ? "Submitting..." : "Submit Score to Leaderboard"}
              </motion.button>
            ) : (
              <div className="bg-[#f2f2f2] rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  {!isConnected ? "Connect wallet to submit score" : "Join a round to submit score"}
                </p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          {canPlayAgain ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/play")}
              className="w-full py-4 px-6 bg-[#fbcc5c] text-[#1a1a1a] font-bold rounded-2xl transition-all hover:opacity-90"
            >
              Play Again
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/leaderboard")}
              className="w-full py-4 px-6 bg-[#35d07f] text-[#1a1a1a] font-bold rounded-2xl transition-all hover:opacity-90"
            >
              View Leaderboard
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="w-full py-4 px-6 border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold rounded-2xl transition-all hover:bg-[#f2f2f2]"
          >
            Home
          </motion.button>
        </motion.div>
      </div>

      <BottomNav active="play" />
    </div>
  )
}

