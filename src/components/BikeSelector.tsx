"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Save, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { HARLEY_YEARS, HARLEY_MODELS, getVariantsForModel } from '@/lib/harley-models'

export default function BikeSelector({ onChange }: { onChange?: (v: any) => void }) {
  const { data: session } = useSession()
  const user = session?.user
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [variant, setVariant] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [variants, setVariants] = useState<string[]>([])

  useEffect(() => {
    if (model) {
      setVariants(getVariantsForModel(model))
      if (!getVariantsForModel(model).includes(variant)) {
        setVariant('')
      }
    } else {
      setVariants([])
      setVariant('')
    }
  }, [model, variant])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  async function loadProfile() {
    if (!user) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        credentials: 'include',
      })

      if (res.ok) {
        const { profile } = await res.json()
        if (profile) {
          setYear(profile.bike_year || '')
          setModel(profile.bike_model || '')
          setVariant(profile.bike_variant || '')
          
          const bikeData = {
            year: profile.bike_year,
            model: profile.bike_model,
            variant: profile.bike_variant,
          }
          localStorage.setItem('wrenchmc_bike', JSON.stringify(bikeData))
          onChange?.(bikeData)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to save your bike profile' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const bikeData = {
        bike_year: year || null,
        bike_model: model || null,
        bike_variant: variant || null,
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bikeData),
      })

      if (res.ok) {
        const { profile } = await res.json()
        setMessage({ type: 'success', text: 'Bike saved!' })
        
        localStorage.setItem('wrenchmc_bike', JSON.stringify({
          year: profile.bike_year,
          model: profile.bike_model,
          variant: profile.bike_variant,
        }))
        
        onChange?.(bikeData)
      } else {
        const { error } = await res.json()
        setMessage({ type: 'error', text: error || 'Failed to save' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flame-spinner" />
      </div>
    )
  }

  const selectClasses = `
    w-full px-4 py-3.5 
    bg-wrench-light/50 backdrop-blur-sm 
    border border-glass-border rounded-2xl 
    text-wrench-text-primary 
    focus:outline-none focus:ring-2 focus:ring-wrench-accent/30 focus:border-wrench-accent/50
    appearance-none cursor-pointer
    transition-all duration-200
  `

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-wrench-text-secondary mb-2">Year</label>
        <div className="relative">
          <select 
            name="year" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={selectClasses}
            style={{ fontSize: '16px' }}
          >
            <option value="">Select year</option>
            {HARLEY_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wrench-text-muted pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-wrench-text-secondary mb-2">Model</label>
        <div className="relative">
          <select 
            name="model" 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={selectClasses}
            style={{ fontSize: '16px' }}
          >
            <option value="">Select model</option>
            {HARLEY_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wrench-text-muted pointer-events-none" />
        </div>
      </div>

      {variants.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-wrench-text-secondary mb-2">Variant</label>
          <div className="relative">
            <select 
              name="variant" 
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className={selectClasses}
              style={{ fontSize: '16px' }}
            >
              <option value="">Select variant</option>
              {variants.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wrench-text-muted pointer-events-none" />
          </div>
        </div>
      )}

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/15 border border-green-500/30 text-green-400' 
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      <Button 
        type="submit" 
        isLoading={saving}
        disabled={!user}
        variant="flame"
        size="lg"
        className="w-full"
      >
        <Save className="w-5 h-5" />
        <span>{user ? 'Save Bike' : 'Sign in to Save'}</span>
      </Button>
      
      {!user && (
        <p className="text-xs text-wrench-text-muted text-center">
          <a href="/auth/login" className="text-wrench-accent hover:underline">Sign in</a> to save your bike profile
        </p>
      )}
    </form>
  )
}
