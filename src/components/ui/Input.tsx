'use client'
import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type InputProps = Omit<HTMLMotionProps<'input'>, 'onDrag' | 'onDragStart' | 'onDragEnd'>

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <motion.input
      {...props}
      whileFocus={{ scale: 1.02 }}
      className={`
        w-full px-4 py-3 
        bg-wrench-DEFAULT/90
        backdrop-blur-sm
        border-2 border-wrench-chrome/20
        rounded-lg
        text-wrench-text-primary placeholder:text-wrench-text-muted
        focus:outline-none focus:ring-2 focus:ring-wrench-accent focus:border-wrench-accent
        focus:shadow-glow
        transition-all duration-300
        font-medium
        ${className}
      `}
    />
  )
}
