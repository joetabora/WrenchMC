'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <motion.input
      {...props}
      whileFocus={{ scale: 1.02 }}
      className={`
        w-full px-4 py-3 
        bg-white/10 dark:bg-gray-800/40 
        backdrop-blur-sm
        border border-white/20 dark:border-gray-700/50 
        rounded-lg
        text-gray-100 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-wrench-accent focus:border-wrench-accent
        transition-all duration-300
        ${props.className || ''}
      `}
    />
  )
}
