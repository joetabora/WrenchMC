'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children?: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
  onClick?: () => void
}

export default function Card({ children, className = '', hover = true, delay = 0, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -2 } : {}}
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
