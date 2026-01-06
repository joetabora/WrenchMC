'use client'
import React, { useState, useEffect, Suspense } from 'react'

export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Search, Loader2, Sparkles, Youtube, Database, ExternalLink, Mic } from 'lucide-react'
import SpecCard from '@/components/SpecCard'
import YouTube from 'react-youtube'

interface QueryResponse {
  answer: string
  sources: string[]
  specs: any[]
  youtubeVideos: any[]
  similarContent: Array<{ text: string; sourceType: string; score: number }>
}

function QueryPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuery) {
      handleQuery(initialQuery)
    }
  }, [initialQuery])

  async function handleQuery(q?: string) {
    const queryText = q || query
    if (!queryText.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      })

      if (!res.ok) {
        throw new Error('Failed to process query')
      }

      const data: QueryResponse = await res.json()
      setResponse(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <Sparkles className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered <span className="gradient-text">Query</span>
          </h1>
          <p className="text-xl text-wrench-chrome-dark">
            Ask anything about Harley-Davidson maintenance and get instant answers
          </p>
        </motion.div>

        {/* Search Form */}
        <Card className="mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleQuery()
            }}
            className="flex gap-3"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: 'Torque specs for transmission cover on 2005 Road King'"
              className="flex-1"
            />
            <Button type="submit" isLoading={loading} size="lg">
              <Search className="w-5 h-5 mr-2" />
              Query
            </Button>
          </form>
        </Card>

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
              <p className="text-wrench-chrome-dark">Querying AI and searching database...</p>
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
              className="space-y-8"
            >
              {/* AI Answer */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-wrench-accent" />
                  <h2 className="text-2xl font-bold text-wrench-chrome">AI Answer</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-wrench-chrome whitespace-pre-wrap leading-relaxed">
                    {response.answer}
                  </p>
                </div>
              </Card>

              {/* Specs from Database */}
              {response.specs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-wrench-chrome mb-6 flex items-center gap-2">
                    <Database className="w-6 h-6 text-wrench-accent" />
                    Related Specs
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {response.specs.map((spec, i) => (
                      <SpecCard key={spec.id} spec={spec} delay={i * 0.05} />
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube Tutorials */}
              {response.youtubeVideos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-wrench-chrome mb-6 flex items-center gap-2">
                    <Youtube className="w-6 h-6 text-wrench-accent" />
                    Video Tutorials
                  </h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {response.youtubeVideos.map((video, i) => (
                      <Card key={video.id} delay={i * 0.05}>
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
                        <h3 className="text-lg font-bold text-wrench-chrome mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-wrench-chrome-dark mb-2">
                          {video.channelTitle} • {video.duration} • {video.viewCount} views
                        </p>
                        <a
                          href={`https://youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-wrench-accent hover:underline text-sm flex items-center gap-1"
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
                  <h3 className="text-lg font-bold text-wrench-chrome mb-4">Sources</h3>
                  <ul className="space-y-2">
                    {response.sources.map((source, i) => (
                      <li key={i} className="text-sm text-wrench-chrome-dark">
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

export default function QueryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
      </div>
    }>
      <QueryPageContent />
    </Suspense>
  )
}

