"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RoundCountdownProps {
  timeLeft: number // in seconds
}

export default function RoundCountdown({ timeLeft }: RoundCountdownProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft)

  useEffect(() => {
    setDisplayTime(timeLeft)
    const interval = setInterval(() => {
      setDisplayTime((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const hours = Math.floor(displayTime / 3600)
  const minutes = Math.floor((displayTime % 3600) / 60)
  const seconds = displayTime % 60

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-r from-[#35d07f] to-[#fbcc5c] rounded-2xl p-4 text-center"
    >
      <p className="text-sm font-bold text-[#1a1a1a] mb-2">Round Ends In</p>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-white/80 rounded-xl px-3 py-2">
          <p className="text-2xl font-black text-[#1a1a1a]">{String(hours).padStart(2, "0")}</p>
          <p className="text-xs text-gray-500">HRS</p>
        </div>
        <span className="text-2xl font-black text-[#1a1a1a]">:</span>
        <div className="bg-white/80 rounded-xl px-3 py-2">
          <p className="text-2xl font-black text-[#1a1a1a]">{String(minutes).padStart(2, "0")}</p>
          <p className="text-xs text-gray-500">MIN</p>
        </div>
        <span className="text-2xl font-black text-[#1a1a1a]">:</span>
        <div className="bg-white/80 rounded-xl px-3 py-2">
          <p className="text-2xl font-black text-[#1a1a1a]">{String(seconds).padStart(2, "0")}</p>
          <p className="text-xs text-gray-500">SEC</p>
        </div>
      </div>
    </motion.div>
  )
}


