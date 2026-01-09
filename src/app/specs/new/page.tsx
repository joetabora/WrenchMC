"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { FilePlus, Wrench, Gauge, Hash, FileText, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

const YEARS = Array.from({ length: 30 }, (_, i) => String(1995 + i))
const MODELS = ['Softail', 'Sportster', 'Dyna', 'Road King', 'Street Glide', 'Fat Boy', 'Heritage Classic', 'Low Rider', 'Electra Glide', 'Road Glide', 'All Models']

export default function NewSpecPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const router = useRouter()
  const [componentName, setComponentName] = useState('')
  const [boltSize, setBoltSize] = useState('')
  const [torqueLow, setTorqueLow] = useState('')
  const [torqueHigh, setTorqueHigh] = useState('')
  const [sequenceNotes, setSequenceNotes] = useState('')
  const [sourceNotes, setSourceNotes] = useState('')
  const [applicableYears, setApplicableYears] = useState<string[]>([])
  const [applicableModels, setApplicableModels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!user) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/specs/new'))
    } else {
      loadUserBikeProfile()
    }
  }, [user, router, status])

  async function loadUserBikeProfile() {
    if (!user) return
    
    try {
      const res = await fetch('/api/profile', {
        credentials: 'include',
      })
      if (res.ok) {
        const { profile } = await res.json()
        if (profile?.bike_year && profile?.bike_model) {
          if (!applicableYears.includes(profile.bike_year)) {
            setApplicableYears([profile.bike_year])
          }
          if (!applicableModels.includes(profile.bike_model)) {
            setApplicableModels([profile.bike_model])
          }
        }
      }
    } catch (error) {
      console.error('Error loading bike profile:', error)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to submit specs' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const body = {
        component_name: componentName,
        bolt_size: boltSize || null,
        torque_spec_low: torqueLow ? parseFloat(torqueLow) : null,
        torque_spec_high: torqueHigh ? parseFloat(torqueHigh) : null,
        sequence_notes: sequenceNotes || null,
        applicable_years: applicableYears,
        applicable_models: applicableModels,
        source_notes: sourceNotes || null,
        submitted_by: (user as any).id
      }

      const res = await fetch('/api/specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Spec submitted! It will be reviewed before publishing.' })
        setComponentName('')
        setBoltSize('')
        setTorqueLow('')
        setTorqueHigh('')
        setSequenceNotes('')
        setSourceNotes('')
      } else {
        const { error } = await res.json()
        setMessage({ type: 'error', text: error || 'Failed to submit spec' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error submitting spec' })
    } finally {
      setLoading(false)
    }
  }

  function toggleYear(year: string) {
    setApplicableYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  function toggleModel(model: string) {
    setApplicableModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    )
  }

  if (status === 'loading') {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="flame-spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flame-spinner mx-auto mb-4" />
          <p className="text-wrench-text-muted">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex p-3 rounded-2xl bg-wrench-accent/15 mb-3">
              <FilePlus className="w-7 h-7 text-wrench-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Submit <span className="gradient-text">Spec</span>
            </h1>
            <p className="text-wrench-text-secondary">
              Share your knowledge with the community
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <Card padding="lg">
          <form onSubmit={submit} className="space-y-5">
            {/* Component Name */}
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                <Wrench className="w-4 h-4 inline mr-2" />
                Component Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="e.g., Transmission cover, Head bolt"
                size="lg"
                required
              />
            </div>

            {/* Torque Specs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                  <Gauge className="w-4 h-4 inline mr-1" />
                  Low (Nm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={torqueLow}
                  onChange={(e) => setTorqueLow(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                  <Gauge className="w-4 h-4 inline mr-1" />
                  High (Nm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={torqueHigh}
                  onChange={(e) => setTorqueHigh(e.target.value)}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Bolt
                </label>
                <Input
                  value={boltSize}
                  onChange={(e) => setBoltSize(e.target.value)}
                  placeholder="M8"
                />
              </div>
            </div>

            {/* Sequence Notes */}
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Torque Sequence / Notes
              </label>
              <Textarea
                value={sequenceNotes}
                onChange={(e) => setSequenceNotes(e.target.value)}
                placeholder="e.g., Tighten in star pattern, start from center"
                rows={3}
              />
            </div>

            {/* Applicable Years */}
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                Applicable Years
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-3 rounded-2xl bg-wrench-light/30 border border-glass-border">
                {YEARS.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleYear(year)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all haptic ${
                      applicableYears.includes(year)
                        ? 'bg-wrench-accent text-white'
                        : 'bg-wrench-light/50 text-wrench-text-secondary hover:bg-wrench-light'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicable Models */}
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                Applicable Models
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-wrench-light/30 border border-glass-border">
                {MODELS.map(model => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => toggleModel(model)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all haptic ${
                      applicableModels.includes(model)
                        ? 'bg-wrench-accent text-white'
                        : 'bg-wrench-light/50 text-wrench-text-secondary hover:bg-wrench-light'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Notes */}
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Source / Reference
              </label>
              <Textarea
                value={sourceNotes}
                onChange={(e) => setSourceNotes(e.target.value)}
                placeholder="e.g., From 2018 Softail service manual"
                rows={2}
              />
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                    : 'bg-red-500/15 border border-red-500/30 text-red-400'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              isLoading={loading}
              variant="flame"
              size="lg"
              className="w-full"
            >
              <FilePlus className="w-5 h-5" />
              <span>Submit Spec</span>
            </Button>

            <p className="text-xs text-wrench-text-muted text-center">
              Your submission will be reviewed before publishing
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
