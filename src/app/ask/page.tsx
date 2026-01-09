'use client'
import React, { useState, useEffect, Suspense } from 'react'

export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Search, Sparkles, Youtube, Database, ExternalLink, Save, CheckCircle, AlertCircle, Zap, Clock, ChevronRight, Flame } from 'lucide-react'
import SpecCard from '@/components/SpecCard'
import YouTube from 'react-youtube'

interface AskResponse {
  answer: string
  sources: string[]
  specs: any[]
  youtubeVideos: any[]
  similarContent?: Array<{ text: string; sourceType: string; score: number }>
  cached?: boolean
  cachedAt?: string
  saved?: boolean
  error?: string
  details?: string
}

function AskPageContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [response, setResponse] = useState<AskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [recentQueries, setRecentQueries] = useState<any[]>([])
  const [showDatabase, setShowDatabase] = useState(true)

  useEffect(() => {
    if (initialQuery) {
      handleAsk(initialQuery)
    }
    loadRecentQueries()
  }, [initialQuery])

  async function loadRecentQueries() {
    try {
      const res = await fetch('/api/ask/recent')
      if (res.ok) {
        const data = await res.json()
        setRecentQueries(data.queries || [])
      }
    } catch (err) {
      // Silent fail
    }
  }

  async function handleAsk(q?: string) {
    const queryText = q || query
    if (!queryText.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)
    setSaveMessage(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: queryText }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${res.status}`)
      }

      const data: AskResponse = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setResponse(data)
      loadRecentQueries()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveAsSpec() {
    if (!session?.user) {
      setSaveMessage({ type: 'error', text: 'Please sign in to save specs' })
      return
    }

    if (!response) {
      setSaveMessage({ type: 'error', text: 'No answer to save' })
      return
    }

    setSaving(true)
    setSaveMessage(null)

    try {
      const res = await fetch('/api/query/save-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          answer: response.answer,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSaveMessage({ type: 'success', text: data.message || 'Spec saved!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to save' })
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Error saving spec' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex p-3 rounded-2xl bg-wrench-accent/15 mb-3">
              <Sparkles className="w-7 h-7 text-wrench-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="gradient-text">Ask</span> Anything
            </h1>
            <p className="text-wrench-text-secondary">
              Get instant answers about Harley maintenance
            </p>
          </motion.div>

          {/* Cached indicator */}
          {response?.cached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <span className="chip chip-accent">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant from cache</span>
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Search Form - Sticky on mobile */}
      <div className="sticky top-[52px] lg:top-[73px] z-30 px-4 py-3 bg-wrench/90 backdrop-blur-xl border-b border-glass-border">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAsk()
          }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wrench-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Torque specs for 2005 Road King..."
                className="input-touch w-full pl-12 pr-4"
                style={{ fontSize: '16px' }}
              />
            </div>
            <Button type="submit" isLoading={loading} size="md" variant="flame">
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Ask</span>
            </Button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Recent Queries */}
        {recentQueries.length > 0 && !response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-base font-semibold text-wrench-text-primary mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-wrench-accent" />
              Recent Questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recentQueries.slice(0, 6).map((item: any) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  className="
                    text-left p-4 rounded-2xl
                    bg-wrench-light/50 border border-glass-border
                    hover:bg-wrench-light hover:border-wrench-accent/30
                    transition-all duration-200
                  "
                  onClick={() => handleAsk(item.query)}
                >
                  <p className="text-sm text-wrench-text-secondary line-clamp-2">{item.query}</p>
                  {item.viewCount > 0 && (
                    <p className="text-xs text-wrench-text-muted mt-2 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-wrench-accent" />
                      {item.viewCount}x
                    </p>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-wrench-light border-t-wrench-accent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <Flame className="absolute inset-0 m-auto w-6 h-6 text-wrench-accent animate-flame-flicker" />
              </div>
              <p className="text-wrench-text-muted mt-4">Searching knowledge base...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* AI Answer */}
              <Card padding="lg" className="relative overflow-visible">
                {/* Flame accent */}
                <div className="absolute -top-1 left-6 right-6 h-1 bg-gradient-flame rounded-full" />
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-wrench-accent/15 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-wrench-accent" />
                    </div>
                    <h2 className="text-xl font-bold text-wrench-text-primary">Answer</h2>
                  </div>
                  {response.cached && (
                    <span className="chip chip-accent text-xs">
                      <Zap className="w-3 h-3" />
                      Cached
                    </span>
                  )}
                  {session?.user && (
                    <Button
                      onClick={handleSaveAsSpec}
                      isLoading={saving}
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                    >
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Save</span>
                    </Button>
                  )}
                </div>

                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-sm ${
                      saveMessage.type === 'success'
                        ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                        : 'bg-red-500/15 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {saveMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{saveMessage.text}</span>
                  </motion.div>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-wrench-text-primary whitespace-pre-wrap leading-relaxed">
                    {response.answer}
                  </p>
                </div>
              </Card>

              {/* Related Specs */}
              {response.specs.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowDatabase(!showDatabase)}
                    className="flex items-center gap-2 text-lg font-bold text-wrench-text-primary mb-4 tap-target"
                  >
                    <Database className="w-5 h-5 text-wrench-accent" />
                    Related Specs ({response.specs.length})
                    <ChevronRight className={`w-4 h-4 transition-transform ${showDatabase ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDatabase && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-3 grid-cols-1 sm:grid-cols-2"
                      >
                        {response.specs.map((spec, i) => (
                          <SpecCard key={spec.id} spec={spec} delay={i * 0.05} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* YouTube Videos - Swipeable on mobile */}
              {response.youtubeVideos.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-wrench-text-primary mb-4">
                    <Youtube className="w-5 h-5 text-wrench-accent" />
                    Video Tutorials ({response.youtubeVideos.length})
                  </h2>
                  <div className="swipe-carousel pb-4 -mx-4 px-4">
                    {response.youtubeVideos.map((video: any, i) => (
                      <Card 
                        key={video.id || i} 
                        delay={i * 0.05} 
                        padding="none"
                        className="min-w-[280px] sm:min-w-[320px]"
                      >
                        <div className="aspect-video rounded-t-2xl overflow-hidden bg-wrench-light">
                          <YouTube
                            videoId={video.id}
                            opts={{
                              width: '100%',
                              height: '100%',
                            }}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-wrench-text-primary mb-1 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-wrench-text-muted mb-2">
                            {video.channelTitle}
                          </p>
                          <a
                            href={`https://youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-wrench-accent hover:underline text-xs flex items-center gap-1"
                          >
                            Watch on YouTube <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {response.sources.length > 0 && (
                <Card padding="md">
                  <h3 className="text-sm font-semibold text-wrench-text-primary mb-3">Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {response.sources.map((source, i) => (
                      <span key={i} className="chip text-xs">
                        {source}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex items-center justify-center py-20">
        <div className="flame-spinner" />
      </div>
    }>
      <AskPageContent />
    </Suspense>
  )
}
