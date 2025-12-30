'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'relative font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wrench-accent focus:ring-offset-2 focus:ring-offset-wrench-DEFAULT disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-accent text-white hover:shadow-glow hover:scale-105 active:scale-95',
    secondary: 'bg-wrench-light text-white hover:bg-wrench-light/80 hover:scale-105 active:scale-95',
    outline: 'border-2 border-wrench-accent text-wrench-accent hover:bg-wrench-accent/10 hover:scale-105 active:scale-95',
    ghost: 'text-wrench-accent hover:bg-wrench-accent/10 hover:scale-105 active:scale-95'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-wrench-accent/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </motion.button>
  )
}
