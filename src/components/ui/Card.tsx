'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export default function Card({ children, className = '', hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}
