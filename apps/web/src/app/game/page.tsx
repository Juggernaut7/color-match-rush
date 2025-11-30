"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount } from "wagmi"
import TimerBar from "@/components/TimerBar"
import ColorWord from "@/components/ColorWord"
import ColorButtons from "@/components/ColorButtons"
import ScoreFlash from "@/components/ScoreFlash"
import AnimatedBackground from "@/components/AnimatedBackground"

export const dynamic = 'force-dynamic'

interface Question {
  wordName: string
  wordColor: string
  options: { name: string; hex: string }[]
}

const COLORS = [
  { name: "RED", hex: "#FF4D4D" },
  { name: "GREEN", hex: "#35D07F" },
  { name: "BLUE", hex: "#3B82F6" },
  { name: "YELLOW", hex: "#FBCC5C" },
  { name: "ORANGE", hex: "#FF8C42" },
  { name: "PURPLE", hex: "#9B59B6" },
  { name: "PINK", hex: "#FF6B9D" },
  { name: "CYAN", hex: "#00CED1" },
]

function generateQuestion(): Question {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5)
  const wordName = shuffled[0].name
  const correctColor = shuffled[0] // The correct answer color
  
  // Pick a different color for the text (Stroop effect)
  const wordColor = shuffled[1].hex

  // Ensure the correct color is always in the options
  // Pick 3 other random colors, then add the correct one
  const otherColors = shuffled.filter(c => c.name !== wordName)
  const randomOthers = otherColors.sort(() => Math.random() - 0.5).slice(0, 3)
  
  // Combine: correct color + 3 random others, then shuffle
  const options = [correctColor, ...randomOthers].sort(() => Math.random() - 0.5)

  return { wordName, wordColor, options }
}

function GamePageContent() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(true)
  const [question, setQuestion] = useState<Question>(generateQuestion())
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [checking, setChecking] = useState(true)
  const timerRef = useRef<NodeJS.Timeout>()

  // Check if user has already played this round
  useEffect(() => {
    const checkPlayStatus = async () => {
      if (!isConnected || !address) {
        setChecking(false)
        return
      }

      try {
        const roundResponse = await fetch("/api/round/current")
        const roundData = await roundResponse.json()
        const roundId = roundData.roundId || ""

        if (roundId) {
          const playCountResponse = await fetch(`/api/round/play-count?address=${address}&roundId=${roundId}`)
          const playData = await playCountResponse.json()
          
          if (playData.hasPlayed) {
            setHasPlayed(true)
            // Redirect to play page with message
            router.push(`/play?alreadyPlayed=true&score=${playData.score}`)
            return
          }
        }
      } catch (error) {
        console.error("Failed to check play status:", error)
      } finally {
        setChecking(false)
      }
    }

    checkPlayStatus()
  }, [isConnected, address, router])

  useEffect(() => {
    if (!gameActive) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameActive])

  useEffect(() => {
    if (!gameActive && timeLeft === 0 && !submitting) {
      setSubmitting(true)
      
      // Automatically submit score if wallet is connected
      const submitScore = async () => {
        try {
          // Get current round ID
          const roundResponse = await fetch("/api/round/current")
          const roundData = await roundResponse.json()
          const roundId = roundData.roundId || ""

          let submissionResult = null
          if (isConnected && address && roundId) {
            // Submit score automatically
            const submitResponse = await fetch("/api/submit-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                roundId,
                address,
                score,
              }),
            })
            submissionResult = await submitResponse.json()
          }

          // Navigate to result page with submission info
          const autoSubmitted = isConnected && address && roundId ? "true" : "false"
          // Can't play again in same round (one play per round)
          router.push(`/result?score=${score}&roundId=${roundId}&autoSubmitted=${autoSubmitted}&canPlayAgain=false`)
        } catch (error) {
          console.error("Failed to submit score:", error)
          // Still navigate even if submission fails
          router.push(`/result?score=${score}&autoSubmitted=false`)
        }
      }

      submitScore()
    }
  }, [gameActive, timeLeft, score, router, isConnected, address, submitting])

  const handleAnswer = (selectedColorHex: string) => {
    if (!gameActive) return

    // Find the correct answer (the color option that matches the word name)
    const correctOption = question.options.find(opt => opt.name === question.wordName)
    const isCorrect = selectedColorHex === correctOption?.hex

    if (isCorrect) {
      setScore((prev) => prev + 1)
      setFeedback("correct")
    } else {
      setScore((prev) => Math.max(0, prev - 1))
      setFeedback("wrong")
    }

    setTimeout(() => {
      setQuestion(generateQuestion())
      setFeedback(null)
    }, 400)
  }

  // Show loading while checking play status
  if (checking) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#0f172a] items-center justify-center">
        <div className="text-4xl mb-4">🎮</div>
        <p className="text-lg text-white">Loading game...</p>
      </div>
    )
  }

  // If already played, don't render game (will redirect)
  if (hasPlayed) {
    return null
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden relative bg-[#0f172a]">
      {/* Animated background */}
      <AnimatedBackground variant="game" intensity="high" />
      
      {/* No bottom nav on game page for focus */}
      <TimerBar timeLeft={timeLeft} duration={30} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="absolute top-8 right-6">
          <motion.div
            key={score}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-white"
          >
            {score}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {gameActive && (
            <motion.div
              key={question.wordName}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="mb-12"
            >
              <ColorWord text={question.wordName} color={question.wordColor} />
            </motion.div>
          )}
        </AnimatePresence>

        {feedback && <ScoreFlash type={feedback} />}

        <ColorButtons options={question.options} onSelect={handleAnswer} disabled={!gameActive} />
      </div>
    </div>
  )
}

export default function GamePage() {
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

  return <GamePageContent />
}
