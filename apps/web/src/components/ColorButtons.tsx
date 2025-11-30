"use client"

import { motion } from "framer-motion"

interface Color {
  name: string
  hex: string
}

interface ColorButtonsProps {
  options: Color[]
  onSelect: (color: string) => void
  disabled: boolean
}

export default function ColorButtons({ options, onSelect, disabled }: ColorButtonsProps) {
  // Use 2 columns for 4 colors (standard game setup)
  // The grid will automatically wrap if there are more colors
  const gridColsClass = options.length <= 4 ? "grid-cols-2" : "grid-cols-2"
  
  return (
    <div className={`grid ${gridColsClass} gap-4 w-full max-w-md`}>
      {options.map((option) => (
        <motion.button
          key={option.hex}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(option.hex)}
          disabled={disabled}
          style={{ backgroundColor: option.hex }}
          className="py-6 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed aspect-square"
          aria-label={`Select ${option.name} color`}
        >
          {/* No text - just colored button */}
        </motion.button>
      ))}
    </div>
  )
}

