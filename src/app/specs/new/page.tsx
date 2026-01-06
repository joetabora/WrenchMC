"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { FilePlus, Wrench, Gauge, Hash, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const YEARS = Array.from({ length: 30 }, (_, i) => String(1995 + i))
const MODELS = ['Softail', 'Sportster', 'Dyna', 'Road King', 'Street Glide', 'Fat Boy', 'Heritage Classic', 'Low Rider', 'Electra Glide', 'Road Glide', 'All Models']

export default function NewSpecPage() {
  const { data: session } = useSession()
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
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to submit specs' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in to submit specs' })
        setLoading(false)
        return
      }

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
        setMessage({ type: 'success', text: 'Spec submitted successfully! It will be reviewed before being published.' })
        // Reset form
        setComponentName('')
        setBoltSize('')
        setTorqueLow('')
        setTorqueHigh('')
        setSequenceNotes('')
        setSourceNotes('')
        setApplicableYears([])
        setApplicableModels([])
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <FilePlus className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Submit a <span className="gradient-text">Technical Spec</span>
          </h1>
          <p className="text-xl text-gray-400">
            Share your knowledge with the community
          </p>
        </motion.div>

        <Card>
          <form onSubmit={submit} className="space-y-6">
            {/* Component Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Wrench className="w-4 h-4 inline mr-2" />
                Component Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="e.g., Transmission cover, Head bolt, Exhaust nut"
                required
              />
            </div>

            {/* Torque Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Gauge className="w-4 h-4 inline mr-2" />
                  Torque Low (Nm)
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Gauge className="w-4 h-4 inline mr-2" />
                  Torque High (Nm)
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Bolt Size
                </label>
                <Input
                  value={boltSize}
                  onChange={(e) => setBoltSize(e.target.value)}
                  placeholder="e.g., M8, 1/4-20"
                />
              </div>
            </div>

            {/* Sequence Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Torque Sequence / Notes
              </label>
              <textarea
                value={sequenceNotes}
                onChange={(e) => setSequenceNotes(e.target.value)}
                placeholder="e.g., Tighten in a star pattern, Start from center and work outward"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wrench-accent"
              />
            </div>

            {/* Applicable Years */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Applicable Years (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-lg">
                {YEARS.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleYear(year)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      applicableYears.includes(year)
                        ? 'bg-wrench-accent text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicable Models */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Applicable Models (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-lg">
                {MODELS.map(model => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => toggleModel(model)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      applicableModels.includes(model)
                        ? 'bg-wrench-accent text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Source / Additional Notes
              </label>
              <textarea
                value={sourceNotes}
                onChange={(e) => setSourceNotes(e.target.value)}
                placeholder="e.g., From 2018 Softail service manual, Verified by dealer mechanic"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wrench-accent"
              />
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
              size="lg"
            >
              <FilePlus className="w-5 h-5 inline mr-2" />
              Submit Spec for Review
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your submission will be reviewed before being published. Thank you for contributing!
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
