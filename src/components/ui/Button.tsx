'use client'
import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'flame'
  size?: 'sm' | 'md' | 'lg' | 'xl'
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
  const baseStyles = `
    relative font-semibold rounded-2xl transition-all duration-200 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-wrench-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-wrench
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    overflow-hidden touch-manipulation
    active:scale-[0.97] active:transition-transform active:duration-100
  `
  
  const variants = {
    primary: `
      bg-gradient-flame text-white 
      shadow-[0_4px_16px_rgba(255,69,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
      hover:shadow-[0_6px_24px_rgba(255,69,0,0.4)]
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-wrench-light/80 backdrop-blur-sm text-wrench-text-primary 
      border border-glass-border
      hover:bg-wrench-light hover:border-glass-border-light
      shadow-glass
    `,
    outline: `
      border-2 border-wrench-accent/50 text-wrench-accent bg-transparent
      hover:bg-wrench-accent/10 hover:border-wrench-accent
      shadow-[0_0_20px_rgba(255,69,0,0.1)]
    `,
    ghost: `
      text-wrench-accent bg-transparent
      hover:bg-wrench-accent/10
    `,
    flame: `
      bg-gradient-flame text-white 
      shadow-glow animate-glow
      hover:shadow-glow-lg
    `
  }
  
  const sizes = {
    sm: 'px-4 py-2.5 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
    xl: 'px-10 py-5 text-xl min-h-[64px]'
  }
  
  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine overlay */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit backdrop-blur-sm rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      <span className={`relative flex items-center justify-center gap-2 ${isLoading ? 'invisible' : ''}`}>
        {children}
      </span>
    </motion.button>
  )
}
