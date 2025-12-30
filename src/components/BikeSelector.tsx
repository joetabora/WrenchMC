"use client"
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

const YEARS = Array.from({ length: 30 }, (_, i) => String(1995 + i))
const MODELS = ['Softail', 'Sportster', 'Dyna', 'Road King', 'Street Glide', 'Fat Boy', 'Heritage Classic', 'Low Rider', 'Electra Glide', 'Road Glide']
const VARIANTS = ['Standard', 'Custom', 'Limited', 'Special', 'Deluxe']

export default function BikeSelector({ onChange }: { onChange?: (v: any) => void }) {
  const { user } = useAuth()
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [variant, setVariant] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load existing profile
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  async function loadProfile() {
    if (!user) return
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const res = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (res.ok) {
        const { profile } = await res.json()
        if (profile) {
          setYear(profile.bike_year || '')
          setModel(profile.bike_model || '')
          setVariant(profile.bike_variant || '')
          
          // Also save to localStorage for voice component
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ type: 'error', text: 'Session expired. Please sign in again.' })
        setSaving(false)
        return
      }

      const bikeData = {
        bike_year: year || null,
        bike_model: model || null,
        bike_variant: variant || null,
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(bikeData),
      })

      if (res.ok) {
        const { profile } = await res.json()
        setMessage({ type: 'success', text: 'Bike profile saved successfully!' })
        
        // Also save to localStorage for voice component
        localStorage.setItem('wrenchmc_bike', JSON.stringify({
          year: profile.bike_year,
          model: profile.bike_model,
          variant: profile.bike_variant,
        }))
        
        onChange?.(bikeData)
      } else {
        const { error } = await res.json()
        setMessage({ type: 'error', text: error || 'Failed to save profile' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wrench-accent"></div>
      </div>
    )
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
        <select 
          name="year" 
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-wrench-accent"
        >
          <option value="">Select year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
        <select 
          name="model" 
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-wrench-accent"
        >
          <option value="">Select model</option>
          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Variant</label>
        <select 
          name="variant" 
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-wrench-accent"
        >
          <option value="">Select variant</option>
          {VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <Button 
        type="submit" 
        isLoading={saving}
        disabled={!user}
        className="w-full"
      >
        <Save className="w-4 h-4 inline mr-2" />
        {user ? 'Save Bike Profile' : 'Sign in to Save'}
      </Button>
      
      {!user && (
        <p className="text-xs text-gray-400 text-center">
          <a href="/auth/login" className="text-wrench-accent hover:underline">Sign in</a> to save your bike profile
        </p>
      )}
    </form>
  )
}
