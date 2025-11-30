"use client"
import { motion } from "framer-motion"

interface TimerBarProps {
  timeLeft: number
  duration: number
}

export default function TimerBar({ timeLeft, duration }: TimerBarProps) {
  const percentage = (timeLeft / duration) * 100

  return (
    <div className="w-full bg-[#f2f2f2] h-2">
      <motion.div
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: "linear" }}
        className={`h-full transition-colors ${
          timeLeft > 10 ? "bg-[#35d07f]" : timeLeft > 5 ? "bg-[#fbcc5c]" : "bg-[#ff4d4d]"
        }`}
      />
    </div>
  )
}

