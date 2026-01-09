'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Wrench, ThumbsUp, ThumbsDown, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SpecCardProps {
  spec: {
    id: string
    componentName: string
    torqueSpecLow?: number
    torqueSpecHigh?: number
    torqueUnit?: string
    boltSize?: string
    notes?: string
    modelYear?: number
    modelName?: string
    upvotes?: number
    downvotes?: number
    source?: string
  }
  delay?: number
  onVote?: (id: string, type: 'up' | 'down') => void
}

export default function SpecCard({ spec, delay = 0, onVote }: SpecCardProps) {
  const [copied, setCopied] = useState(false)
  const [voting, setVoting] = useState(false)

  const torqueDisplay = spec.torqueSpecHigh
    ? `${spec.torqueSpecLow} - ${spec.torqueSpecHigh}`
    : spec.torqueSpecLow || 'N/A'

  const handleCopy = async () => {
    const text = `${spec.componentName}: ${torqueDisplay} ${spec.torqueUnit || 'Nm'}${spec.boltSize ? ` (${spec.boltSize})` : ''}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVote = async (type: 'up' | 'down') => {
    if (voting || !onVote) return
    setVoting(true)
    try {
      await onVote(spec.id, type)
    } finally {
      setVoting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-wrench-accent/15 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-5 h-5 text-wrench-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-wrench-text-primary line-clamp-2">
              {spec.componentName}
            </h3>
            {(spec.modelYear || spec.modelName) && (
              <p className="text-xs text-wrench-text-muted mt-0.5">
                {spec.modelYear} {spec.modelName}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-glass-light transition-colors flex-shrink-0 tap-target"
          title="Copy spec"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-wrench-text-muted" />
          )}
        </button>
      </div>

      {/* Torque Value - Highlight */}
      <div className="mb-4 p-3 rounded-xl bg-wrench-accent/10 border border-wrench-accent/20">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-bold text-wrench-accent">
            {torqueDisplay}
          </span>
          <span className="text-sm text-wrench-text-secondary font-medium">
            {spec.torqueUnit || 'Nm'}
          </span>
        </div>
        {spec.boltSize && (
          <p className="text-xs text-wrench-text-muted mt-1">
            Bolt: {spec.boltSize}
          </p>
        )}
      </div>

      {/* Notes */}
      {spec.notes && (
        <p className="text-sm text-wrench-text-secondary mb-4 line-clamp-3">
          {spec.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-glass-border">
        {/* Votes */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleVote('up')}
            disabled={voting}
            className="flex items-center gap-1 text-xs text-wrench-text-muted hover:text-green-400 transition-colors tap-target"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{spec.upvotes || 0}</span>
          </button>
          <button
            onClick={() => handleVote('down')}
            disabled={voting}
            className="flex items-center gap-1 text-xs text-wrench-text-muted hover:text-red-400 transition-colors tap-target"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{spec.downvotes || 0}</span>
          </button>
        </div>

        {/* Source */}
        {spec.source && (
          <span className="chip text-xs">
            {spec.source}
          </span>
        )}
      </div>
    </motion.div>
  )
}
