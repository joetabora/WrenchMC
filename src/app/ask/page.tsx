'use client'
import React, { useState, useEffect, Suspense } from 'react'

export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Search, Loader2, Sparkles, Youtube, Database, ExternalLink, Save, CheckCircle, AlertCircle, Zap, Clock } from 'lucide-react'
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
  const [showDatabase, setShowDatabase] = useState(false)

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
      // Silent fail - not critical
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
        body: JSON.stringify({ query: queryText }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${res.status} ${res.statusText}`)
      }

      const data: AskResponse = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setResponse(data)
      loadRecentQueries() // Reload recent queries
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
        setSaveMessage({ type: 'success', text: data.message || 'Spec saved! It will be reviewed before being published.' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to save spec' })
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Error saving spec' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <Sparkles className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Ask</span> Anything
          </h1>
          <p className="text-lg sm:text-xl text-wrench-chrome-dark">
            Get instant, accurate answers about Harley-Davidson maintenance
          </p>
          {response?.cached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Instant answer from database (saved AI tokens!)</span>
              {response.cachedAt && (
                <span className="text-xs opacity-75">
                  • {new Date(response.cachedAt).toLocaleDateString()}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Search Form */}
        <Card className="mb-6 sm:mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk()
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: 'Torque specs for transmission cover on 2005 Road King'"
              className="flex-1 text-sm sm:text-base"
            />
            <Button type="submit" isLoading={loading} size="lg" className="w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" />
              Ask
            </Button>
          </form>
        </Card>

        {/* Recent Queries */}
        {recentQueries.length > 0 && !response && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-wrench-chrome mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-wrench-accent" />
              Recent Questions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentQueries.slice(0, 6).map((item: any) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:border-wrench-accent/50 transition-colors"
                  onClick={() => handleAsk(item.query)}
                >
                  <p className="text-sm text-wrench-chrome line-clamp-2">{item.query}</p>
                  {item.viewCount > 0 && (
                    <p className="text-xs text-wrench-chrome-dark mt-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {item.viewCount} {item.viewCount === 1 ? 'time' : 'times'}
                    </p>
                  )}
                </Card>
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
              <Loader2 className="w-12 h-12 text-wrench-accent animate-spin mb-4" />
              <p className="text-wrench-chrome-dark">
                {response?.cached ? 'Loading from database...' : 'Querying AI and searching database...'}
              </p>
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
              className="mb-8 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400"
            >
              {error}
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
              className="space-y-6 sm:space-y-8"
            >
              {/* AI Answer */}
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-wrench-accent" />
                    <h2 className="text-xl sm:text-2xl font-bold text-wrench-chrome">Answer</h2>
                    {response.cached && (
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                        Cached
                      </span>
                    )}
                  </div>
                  {session?.user && (
                    <Button
                      onClick={handleSaveAsSpec}
                      isLoading={saving}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save as Spec
                    </Button>
                  )}
                </div>
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                      saveMessage.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {saveMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{saveMessage.text}</span>
                  </motion.div>
                )}
                <div className="prose prose-invert max-w-none">
                  <p className="text-wrench-chrome whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {response.answer}
                  </p>
                </div>
              </Card>

              {/* Database Toggle */}
              {response.specs.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowDatabase(!showDatabase)}
                    className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-wrench-chrome mb-4 hover:text-wrench-accent transition-colors"
                  >
                    <Database className="w-6 h-6 text-wrench-accent" />
                    Related Specs ({response.specs.length})
                  </button>
                  {showDatabase && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
                    >
                      {response.specs.map((spec, i) => (
                        <SpecCard key={spec.id} spec={spec} delay={i * 0.05} />
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* YouTube Tutorials */}
              {response.youtubeVideos.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-wrench-chrome mb-4 sm:mb-6 flex items-center gap-2">
                    <Youtube className="w-6 h-6 text-wrench-accent" />
                    Video Tutorials ({response.youtubeVideos.length})
                  </h2>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                    {response.youtubeVideos.map((video: any, i) => (
                      <Card key={video.id || i} delay={i * 0.05}>
                        <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                          <YouTube
                            videoId={video.id}
                            opts={{
                              width: '100%',
                              height: '100%',
                            }}
                            className="w-full h-full"
                          />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-wrench-chrome mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-wrench-chrome-dark mb-2">
                          {video.channelTitle} {video.duration && `• ${video.duration}`} {video.viewCount && `• ${video.viewCount} views`}
                        </p>
                        <a
                          href={`https://youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-wrench-accent hover:underline text-xs sm:text-sm flex items-center gap-1"
                        >
                          Watch on YouTube <ExternalLink className="w-4 h-4" />
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {response.sources.length > 0 && (
                <Card>
                  <h3 className="text-base sm:text-lg font-bold text-wrench-chrome mb-4">Sources</h3>
                  <ul className="space-y-2">
                    {response.sources.map((source, i) => (
                      <li key={i} className="text-xs sm:text-sm text-wrench-chrome-dark">
                        {i + 1}. {source}
                      </li>
                    ))}
                  </ul>
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
      <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
      </div>
    }>
      <AskPageContent />
    </Suspense>
  )
}

