'use client'
import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
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
  onDrag,
  onDragStart,
  onDragEnd,
  ...props 
}: ButtonProps) {
  const baseStyles = 'relative font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wrench-accent/50 focus:ring-offset-2 focus:ring-offset-wrench-dark disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-accent text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] shadow-elevated',
    secondary: 'bg-wrench-light/50 backdrop-blur-sm text-wrench-text-primary hover:bg-wrench-light border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] shadow-elevated',
    outline: 'border border-wrench-accent/50 text-wrench-accent hover:bg-wrench-accent/10 hover:border-wrench-accent hover:scale-[1.02] active:scale-[0.98] bg-transparent',
    ghost: 'text-wrench-accent hover:bg-wrench-accent/10 hover:scale-[1.02] active:scale-[0.98] bg-transparent'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }
  
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-wrench-accent/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-6 h-6 border-3 border-wrench-chrome-bright border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </motion.button>
  )
}
