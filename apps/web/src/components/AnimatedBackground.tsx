"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedBackgroundProps {
  variant?: "game" | "default" | "gradient"
  intensity?: "high" | "medium" | "low"
}

export default function AnimatedBackground({ 
  variant = "default", 
  intensity = "medium" 
}: AnimatedBackgroundProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.01)
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [])

  if (variant === "game") {
    // Dynamic color-changing background for game page
    const hue1 = (Math.sin(time) * 30 + 150) % 360 // Green to cyan range
    const hue2 = (Math.sin(time * 0.7) * 30 + 50) % 360 // Yellow to orange range
    const hue3 = (Math.sin(time * 1.3) * 30 + 200) % 360 // Blue to purple range

    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `linear-gradient(135deg, hsl(${hue1}, 70%, 95%) 0%, hsl(${hue2}, 70%, 95%) 50%, hsl(${hue3}, 70%, 95%) 100%)`,
              `linear-gradient(225deg, hsl(${hue2}, 70%, 95%) 0%, hsl(${hue3}, 70%, 95%) 50%, hsl(${hue1}, 70%, 95%) 100%)`,
              `linear-gradient(315deg, hsl(${hue3}, 70%, 95%) 0%, hsl(${hue1}, 70%, 95%) 50%, hsl(${hue2}, 70%, 95%) 100%)`,
              `linear-gradient(45deg, hsl(${hue1}, 70%, 95%) 0%, hsl(${hue2}, 70%, 95%) 50%, hsl(${hue3}, 70%, 95%) 100%)`,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating color blobs */}
        {[...Array(6)].map((_, i) => {
          const size = 200 + Math.sin(time + i) * 50
          const x = 50 + Math.sin(time * 0.5 + i) * 30
          const y = 50 + Math.cos(time * 0.7 + i) * 30
          const hue = (hue1 + i * 60) % 360

          return (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20 blur-3xl"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `hsl(${hue}, 70%, 70%)`,
                left: `${x}%`,
                top: `${y}%`,
              }}
              animate={{
                x: [0, Math.sin(time + i) * 100, 0],
                y: [0, Math.cos(time + i) * 100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>
    )
  }

  if (variant === "gradient") {
    // Subtle animated gradient for other pages
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #f0f9ff 100%)",
              "linear-gradient(225deg, #fefce8 0%, #f0f9ff 50%, #f0fdf4 100%)",
              "linear-gradient(315deg, #f0f9ff 0%, #f0fdf4 50%, #fefce8 100%)",
              "linear-gradient(45deg, #f0fdf4 0%, #fefce8 50%, #f0f9ff 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    )
  }

  // Default: subtle pulsing background
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, #35d07f20 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

