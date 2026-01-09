'use client'
import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type InputProps = Omit<HTMLMotionProps<'input'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'size'> & {
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  error?: string
  size?: 'md' | 'lg' | 'xl'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, iconRight, error, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
      xl: 'px-6 py-5 text-xl'
    }

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-wrench-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          whileFocus={{ scale: 1.01 }}
          className={`
            input-touch w-full
            ${sizeClasses[size]}
            ${icon ? 'pl-12' : ''}
            ${iconRight ? 'pr-12' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/30' : ''}
            ${className}
          `}
          style={{ fontSize: '16px' }} // Prevent iOS zoom
          {...props}
        />
        {iconRight && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-wrench-text-muted">
            {iconRight}
          </div>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

// Search Input variant
export function SearchInput({ 
  onSearch, 
  placeholder = 'Search...', 
  value, 
  onChange,
  loading = false,
  className = ''
}: {
  onSearch?: (value: string) => void
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading?: boolean
  className?: string
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value && onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-wrench-text-muted pointer-events-none">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-wrench-text-muted/30 border-t-wrench-accent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          input-touch w-full pl-14 pr-5 py-4 text-lg
          shadow-glass-lg
        "
        style={{ fontSize: '16px' }}
      />
    </form>
  )
}

// Textarea variant
export function Textarea({ 
  className = '', 
  error, 
  rows = 4,
  ...props 
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <div className="relative w-full">
      <textarea
        rows={rows}
        className={`
          input-touch w-full resize-none
          ${error ? 'border-red-500/50 focus:ring-red-500/30' : ''}
          ${className}
        `}
        style={{ fontSize: '16px' }}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
