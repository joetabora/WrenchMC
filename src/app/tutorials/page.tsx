'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Video, Search, Youtube, ExternalLink, Play, Flame, Filter } from 'lucide-react'
import YouTube from 'react-youtube'

export default function TutorialsPage() {
  const { data: session } = useSession()
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('Harley Davidson maintenance')
  const [userBike, setUserBike] = useState<{ year?: string; model?: string } | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  useEffect(() => {
    loadUserBike()
    loadTutorials()
  }, [])

  async function loadUserBike() {
    if (!session?.user) return
    
    try {
      const res = await fetch('/api/profile', {
        credentials: 'include',
      })
      if (res.ok) {
        const { profile } = await res.json()
        if (profile?.bike_year && profile?.bike_model) {
          setUserBike({ year: profile.bike_year, model: profile.bike_model })
          setSearchQuery(`Harley Davidson ${profile.bike_year} ${profile.bike_model} maintenance`)
        }
      }
    } catch (error) {
      console.error('Error loading bike profile:', error)
    }
  }

  async function loadTutorials() {
    setLoading(true)
    try {
      let enhancedQuery = searchQuery
      if (userBike?.year && userBike?.model && !searchQuery.toLowerCase().includes(userBike.model.toLowerCase())) {
        enhancedQuery = `Harley Davidson ${userBike.year} ${userBike.model} ${searchQuery.replace(/Harley Davidson/gi, '').trim()}`
      }
      
      const res = await fetch(`/api/tutorials?q=${encodeURIComponent(enhancedQuery)}`)
      const data = await res.json()
      setTutorials(data.videos || [])
    } catch (error) {
      console.error('Failed to load tutorials:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickFilters = [
    'Oil Change',
    'Brake Service',
    'Fork Rebuild',
    'Carb Tuning',
    'Transmission',
    'Electrical',
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <section className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex p-3 rounded-2xl bg-wrench-accent/15 mb-3">
              <Video className="w-7 h-7 text-wrench-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Video <span className="gradient-text">Tutorials</span>
            </h1>
            <p className="text-wrench-text-secondary">
              Learn from expert Harley mechanics
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search - Sticky */}
      <div className="sticky top-[52px] lg:top-[73px] z-30 px-4 py-3 bg-wrench/90 backdrop-blur-xl border-b border-glass-border overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadTutorials()
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wrench-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials..."
                className="input-touch w-full pl-12 pr-4"
                style={{ fontSize: '16px' }}
              />
            </div>
            <Button type="submit" isLoading={loading} variant="flame" className="flex-shrink-0">
              <Search className="w-5 h-5" />
            </Button>
          </form>

          {/* Quick Filters - Horizontal scroll */}
          <div className="swipe-carousel mt-3 pb-1 -mx-4 px-4 gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSearchQuery(`Harley Davidson ${filter}`)
                  loadTutorials()
                }}
                className="chip whitespace-nowrap haptic"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 overflow-x-hidden">
        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video rounded-2xl overflow-hidden bg-wrench-dark">
                  <YouTube
                    videoId={selectedVideo.id}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: { autoplay: 1 },
                    }}
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-wrench-text-primary mb-2">
                    {selectedVideo.title}
                  </h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-wrench-accent hover:underline"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-video bg-wrench-light rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-wrench-light rounded w-3/4" />
                  <div className="h-3 bg-wrench-light rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : tutorials.length === 0 ? (
          <div className="empty-state">
            <div className="w-16 h-16 rounded-2xl bg-wrench-light/50 flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-wrench-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-wrench-text-primary mb-2">No tutorials found</h3>
            <p className="text-wrench-text-muted">Try a different search term</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial, i) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedVideo(tutorial)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-wrench-light overflow-hidden">
                  {tutorial.thumbnail ? (
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Youtube className="w-12 h-12 text-wrench-text-muted" />
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-wrench-accent/90 flex items-center justify-center shadow-glow">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  {tutorial.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 text-xs text-white font-medium">
                      {tutorial.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-wrench-text-primary mb-1 line-clamp-2 group-hover:text-wrench-accent transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-xs text-wrench-text-muted mb-2">
                    {tutorial.channelTitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-wrench-text-muted">
                      {tutorial.viewCount} views
                    </span>
                    <a
                      href={`https://youtube.com/watch?v=${tutorial.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-wrench-accent hover:underline text-xs flex items-center gap-1"
                    >
                      YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
