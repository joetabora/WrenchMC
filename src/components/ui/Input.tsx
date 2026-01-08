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
        bg-wrench-light/30
        backdrop-blur-md
        border border-white/10
        rounded-xl
        text-wrench-text-primary placeholder:text-wrench-text-muted
        focus:outline-none focus:ring-2 focus:ring-wrench-accent/50 focus:border-wrench-accent
        focus:shadow-glow
        transition-all duration-200
        font-normal
        ${className}
      `}
    />
  )
}
