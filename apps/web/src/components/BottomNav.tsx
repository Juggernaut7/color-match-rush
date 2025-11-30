"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface BottomNavProps {
  active: "home" | "play" | "leaderboard" | "profile"
}

export default function BottomNav({ active }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", href: "/", icon: "🏠" },
    { id: "play", label: "Play", href: "/play", icon: "🎮" },
    { id: "leaderboard", label: "Leaderboard", href: "/leaderboard", icon: "🏆" },
    { id: "profile", label: "Profile", href: "/profile", icon: "👤" },
  ]

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#f2f2f2] rounded-t-2xl shadow-lg z-50 safe-area-inset-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-6 transition-colors ${
                active === tab.id ? "text-[#35d07f]" : "text-[#1a1a1a]"
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-bold">{tab.label}</span>
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

