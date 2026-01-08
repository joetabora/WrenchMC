'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Video, Search, Youtube, ExternalLink, Play } from 'lucide-react'
import YouTube from 'react-youtube'

export default function TutorialsPage() {
  const { data: session } = useSession()
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('Harley Davidson maintenance')
  const [userBike, setUserBike] = useState<{ year?: string; model?: string } | null>(null)

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
          // Auto-update search query if user has a bike
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
      // Enhance query with user's bike if available
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

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <Video className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Video <span className="gradient-text">Tutorials</span>
          </h1>
          <p className="text-xl text-wrench-chrome-dark">
            Learn from expert mechanics with step-by-step repair videos
          </p>
        </motion.div>

        {/* Search */}
        <Card className="mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadTutorials()
            }}
            className="flex gap-3"
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tutorials (e.g., 'carb rebuild', 'fork service')"
              className="flex-1"
            />
            <Button type="submit" isLoading={loading}>
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>
        </Card>

        {/* Tutorials Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-64">
                <div className="h-40 bg-wrench-light rounded mb-4"></div>
                <div className="h-6 bg-wrench-light rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-wrench-light rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : tutorials.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-wrench-chrome-dark">No tutorials found. Try a different search.</p>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial, i) => (
              <Card key={tutorial.id} delay={i * 0.05}>
                <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-wrench-light/20">
                  <YouTube
                    videoId={tutorial.id}
                    opts={{
                      width: '100%',
                      height: '100%',
                    }}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-wrench-chrome mb-2 line-clamp-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-wrench-chrome-dark mb-2">
                  {tutorial.channelTitle} • {tutorial.duration} • {tutorial.viewCount} views
                </p>
                <a
                  href={`https://youtube.com/watch?v=${tutorial.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wrench-accent hover:underline text-sm flex items-center gap-1"
                >
                  Watch on YouTube <ExternalLink className="w-4 h-4" />
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

