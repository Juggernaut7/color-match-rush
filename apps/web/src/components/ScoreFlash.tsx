"use client"

import { motion } from "framer-motion"

interface ScoreFlashProps {
  type: "correct" | "wrong"
}

export default function ScoreFlash({ type }: ScoreFlashProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black pointer-events-none ${
        type === "correct" ? "text-green-500" : "text-red-500"
      }`}
    >
      {type === "correct" ? "+1" : "-1"}
    </motion.div>
  )
}

