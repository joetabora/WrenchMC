'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children?: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
  onClick?: () => void
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  delay = 0, 
  onClick,
  glass = true,
  padding = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6 sm:p-8'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover && !onClick ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        ${glass ? 'glass-card' : 'bg-wrench-light rounded-2xl border border-glass-border'}
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// Video Card variant
export function VideoCard({ 
  children, 
  className = '', 
  delay = 0, 
  onClick,
  thumbnail
}: CardProps & { thumbnail?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      className={`video-card cursor-pointer ${className}`}
      onClick={onClick}
    >
      {thumbnail && (
        <div 
          className="aspect-video bg-wrench-light bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      )}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  )
}

// Stat Card variant
export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  className = '',
  delay = 0
}: {
  icon: React.ElementType
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-wrench-accent/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-wrench-accent" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-wrench-text-primary mb-1">{value}</p>
      <p className="text-sm text-wrench-text-muted">{label}</p>
    </motion.div>
  )
}
