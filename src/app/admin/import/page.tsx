"use client"
import React, { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sourceText, setSourceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [extractedSpecs, setExtractedSpecs] = useState<any[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function extractSpecs() {
    if (!sourceText.trim()) {
      setMessage({ type: 'error', text: 'Please enter source text' })
      return
    }

    setLoading(true)
    setMessage(null)
    setExtractedSpecs([])

    try {
      const res = await fetch('/api/admin/extract-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText }),
      })

      const data = await res.json()

      if (res.ok && data.specs) {
        setExtractedSpecs(data.specs)
        setMessage({ type: 'success', text: `Extracted ${data.specs.length} spec(s) from source` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to extract specs' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error extracting specs' })
    } finally {
      setLoading(false)
    }
  }

  async function submitSpec(spec: any, index: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ type: 'error', text: 'Session expired. Please sign in again.' })
        return
      }

      const res = await fetch('/api/specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...spec,
          approved: true, // Auto-approve AI-extracted specs
        }),
      })

      if (res.ok) {
        setExtractedSpecs(prev => prev.filter((_, i) => i !== index))
        setMessage({ type: 'success', text: 'Spec submitted successfully!' })
      } else {
        const { error } = await res.json()
        setMessage({ type: 'error', text: error || 'Failed to submit spec' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error submitting spec' })
    }
  }

  async function submitAll() {
    for (let i = 0; i < extractedSpecs.length; i++) {
      await submitSpec(extractedSpecs[i], i)
      await new Promise(resolve => setTimeout(resolve, 500)) // Rate limiting
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to access this page</p>
          <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <Sparkles className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered <span className="gradient-text">Spec Import</span>
          </h1>
          <p className="text-xl text-gray-400">
            Extract technical specs from manuals, documents, or any text source
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-accent/20">
                <FileText className="w-5 h-5 text-wrench-accent" />
              </div>
              <h2 className="text-xl font-bold">Source Material</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste text from manuals, service guides, or documentation
                </label>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Example:&#10;&#10;Transmission Cover Bolts:&#10;Torque: 20-25 Nm (15-18 ft-lbs)&#10;Bolt Size: M8&#10;Tighten in a star pattern starting from center...&#10;&#10;Head Bolts:&#10;Torque: 45-50 Nm&#10;Bolt Size: M10..."
                  rows={15}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wrench-accent font-mono text-sm"
                />
              </div>

              <Button
                onClick={extractSpecs}
                isLoading={loading}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Extract Specs with AI
              </Button>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 p-3 rounded-lg ${
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
            </div>
          </Card>

          {/* Extracted Specs Section */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-accent/20">
                  <Upload className="w-5 h-5 text-wrench-accent" />
                </div>
                <h2 className="text-xl font-bold">
                  Extracted Specs ({extractedSpecs.length})
                </h2>
              </div>
              {extractedSpecs.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={submitAll}
                >
                  Submit All
                </Button>
              )}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {extractedSpecs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Extracted specs will appear here</p>
                  <p className="text-sm mt-2">Paste source text and click "Extract Specs"</p>
                </div>
              ) : (
                extractedSpecs.map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="space-y-2 mb-3">
                      <h3 className="font-bold text-wrench-accent">{spec.component_name || 'Unnamed Component'}</h3>
                      {spec.torque_spec_low && (
                        <p className="text-sm">
                          <span className="text-gray-400">Torque:</span>{' '}
                          {spec.torque_spec_low}
                          {spec.torque_spec_high ? ` - ${spec.torque_spec_high}` : ''} Nm
                        </p>
                      )}
                      {spec.bolt_size && (
                        <p className="text-sm">
                          <span className="text-gray-400">Bolt Size:</span> {spec.bolt_size}
                        </p>
                      )}
                      {spec.sequence_notes && (
                        <p className="text-sm text-gray-300">{spec.sequence_notes}</p>
                      )}
                      {spec.source_notes && (
                        <p className="text-xs text-gray-500 italic">{spec.source_notes}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => submitSpec(spec, index)}
                      className="w-full"
                    >
                      Submit This Spec
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-wrench-accent/30">
            <h3 className="text-lg font-bold mb-4">How to Use</h3>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Copy text from service manuals, technical documents, or any source with torque specs</li>
              <li>Paste it into the text area on the left</li>
              <li>Click "Extract Specs with AI" - the AI will parse and structure the data</li>
              <li>Review the extracted specs on the right</li>
              <li>Submit individual specs or submit all at once</li>
            </ol>
            <p className="text-xs text-gray-500 mt-4">
              <strong>Note:</strong> Requires OpenAI API key configured in environment variables
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

