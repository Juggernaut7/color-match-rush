"use client"

import { motion } from "framer-motion"

interface ColorWordProps {
  text: string
  color: string
}

export default function ColorWord({ text, color }: ColorWordProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 style={{ color }} className="text-7xl font-black text-center select-none">
        {text}
      </h2>
    </motion.div>
  )
}

