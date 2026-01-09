"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Plus, Bike, CheckCircle, AlertCircle, ChevronDown, Trash2, Star, StarOff } from 'lucide-react'
import { HARLEY_YEARS, HARLEY_MODELS, getVariantsForModel } from '@/lib/harley-models'

interface GarageBike {
  id: string
  nickname?: string | null
  bikeYear?: string | null
  bikeModel?: string | null
  bikeVariant?: string | null
  isActive: boolean
}

export default function Garage({ onChange }: { onChange?: (activeBike: GarageBike | null) => void }) {
  const { data: session, status } = useSession()
  const user = session?.user
  const [bikes, setBikes] = useState<GarageBike[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBike, setEditingBike] = useState<GarageBike | null>(null)
  
  // Form state
  const [nickname, setNickname] = useState('')
  const [year, setYear] = useState('')
  const [model, setModel] = useState('')
  const [variant, setVariant] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [variants, setVariants] = useState<string[]>([])

  useEffect(() => {
    if (user && status === 'authenticated') {
      loadGarage()
    }
  }, [user, status])

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

  async function loadGarage() {
    if (!user) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/profile/garage', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setBikes(data.bikes || [])
        
        // Find active bike and notify parent
        const activeBike = data.bikes?.find((b: GarageBike) => b.isActive) || null
        onChange?.(activeBike)
        
        // Update localStorage for voice component
        if (activeBike) {
          localStorage.setItem('wrenchmc_bike', JSON.stringify({
            year: activeBike.bikeYear,
            model: activeBike.bikeModel,
            variant: activeBike.bikeVariant,
          }))
        }
      } else {
        // Garage API might not be available if migration hasn't run
        // Silently fail - garage feature will work after migration
        const errorData = await res.json().catch(() => ({}))
        if (errorData.error?.includes('does not exist') || errorData.error?.includes('relation') || res.status === 500) {
          console.warn('Garage feature not available yet - migration may need to be run')
        }
      }
    } catch (error) {
      // Silently handle errors - garage feature is optional
      console.warn('Garage feature not available:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setNickname('')
    setYear('')
    setModel('')
    setVariant('')
    setEditingBike(null)
    setShowAddForm(false)
    setMessage(null)
  }

  async function saveBike(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to save bikes' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const bikeData = {
        id: editingBike?.id,
        nickname: nickname || null,
        bike_year: year || null,
        bike_model: model || null,
        bike_variant: variant || null,
      }

      const res = await fetch('/api/profile/garage', {
        method: editingBike ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bikeData),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: editingBike ? 'Bike updated!' : 'Bike added!' })
        resetForm()
        await loadGarage()
      } else {
        const { error } = await res.json()
        setMessage({ type: 'error', text: error || 'Failed to save bike' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save bike' })
    } finally {
      setSaving(false)
    }
  }

  async function setActiveBike(bikeId: string) {
    if (!user) return

    try {
      const res = await fetch('/api/profile/garage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ activeBikeId: bikeId }),
      })

      if (res.ok) {
        await loadGarage()
      }
    } catch (error) {
      console.error('Error setting active bike:', error)
    }
  }

  async function deleteBike(bikeId: string) {
    if (!user || !confirm('Are you sure you want to remove this bike from your garage?')) return

    try {
      const res = await fetch('/api/profile/garage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bikeId }),
      })

      if (res.ok) {
        await loadGarage()
      }
    } catch (error) {
      console.error('Error deleting bike:', error)
    }
  }

  function startEdit(bike: GarageBike) {
    setEditingBike(bike)
    setNickname(bike.nickname || '')
    setYear(bike.bikeYear || '')
    setModel(bike.bikeModel || '')
    setVariant(bike.bikeVariant || '')
    setShowAddForm(true)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flame-spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Garage List */}
      {bikes.length > 0 && (
        <div className="space-y-2">
          {bikes.map((bike) => (
            <motion.div
              key={bike.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                glass-card p-4 flex items-center justify-between gap-3
                ${bike.isActive ? 'border-2 border-wrench-accent/50' : ''}
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Bike className="w-4 h-4 text-wrench-accent flex-shrink-0" />
                  <h3 className="font-semibold text-wrench-text-primary truncate">
                    {bike.nickname || `${bike.bikeYear || ''} ${bike.bikeModel || ''} ${bike.bikeVariant || ''}`.trim() || 'Unnamed Bike'}
                  </h3>
                  {bike.isActive && (
                    <span className="chip chip-accent text-xs">
                      <Star className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-wrench-text-muted">
                  {[bike.bikeYear, bike.bikeModel, bike.bikeVariant].filter(Boolean).join(' • ') || 'No details'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {!bike.isActive && (
                  <button
                    onClick={() => setActiveBike(bike.id)}
                    className="p-2 rounded-lg hover:bg-glass-light transition-colors tap-target"
                    title="Set as active"
                  >
                    <StarOff className="w-4 h-4 text-wrench-text-muted" />
                  </button>
                )}
                <button
                  onClick={() => startEdit(bike)}
                  className="p-2 rounded-lg hover:bg-glass-light transition-colors tap-target"
                  title="Edit"
                >
                  <ChevronDown className="w-4 h-4 text-wrench-text-muted rotate-[-90deg]" />
                </button>
                <button
                  onClick={() => deleteBike(bike.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors tap-target"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card padding="md">
              <form onSubmit={saveBike} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                    Nickname (optional)
                  </label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g., My Road King, Project Bike"
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wrench-text-secondary mb-2">Year</label>
                  <div className="relative">
                    <select 
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

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    isLoading={saving}
                    variant="flame"
                    size="md"
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingBike ? 'Update' : 'Add'} Bike</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!showAddForm && (
        <Button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <Plus className="w-5 h-5" />
          <span>Add Bike to Garage</span>
        </Button>
      )}

      {bikes.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <Bike className="w-12 h-12 text-wrench-text-muted mx-auto mb-3 opacity-50" />
          <p className="text-wrench-text-muted mb-4">No bikes in your garage yet</p>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="flame"
            size="md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Bike</span>
          </Button>
        </div>
      )}
    </div>
  )
}
