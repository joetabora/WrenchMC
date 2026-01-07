'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Search, Mic, Zap, Database, Video, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/query?q=${encodeURIComponent(query)}`)
    }
  }

  const quickQueries = [
    'Torque specs for transmission cover on 2005 Road King',
    'How to rebuild carb on 1980 Shovelhead',
    'Fork oil capacity for 2015 Softail',
    'Head bolt torque sequence for Twin Cam',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-hero">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6 p-4 rounded-full bg-wrench-accent/20 shadow-glow"
            >
              <Sparkles className="w-16 h-16 text-wrench-accent animate-pulse-slow" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="gradient-text">WrenchMC Goliath</span>
            </h1>
            <p className="text-xl md:text-2xl text-wrench-chrome-dark mb-4 max-w-2xl mx-auto">
              The ultimate AI-powered Harley-Davidson maintenance database
            </p>
            <p className="text-lg text-wrench-chrome-dark mb-12">
              Every bolt, torque value, and repair trick for all models from 1903 to now
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8 px-4"
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything: 'Torque specs for transmission cover on 2005 Road King'"
                className="flex-1 text-base sm:text-lg"
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </motion.form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/voice')}
                className="min-w-[200px]"
              >
                <Mic className="w-5 h-5 inline mr-2" />
                Voice Search
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/database')}
                className="min-w-[200px]"
              >
                <Database className="w-5 h-5 inline mr-2" />
                Browse Database
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Queries */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-wrench-chrome flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-wrench-accent" />
            Trending Queries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickQueries.map((q, i) => (
              <Card
                key={i}
                delay={i * 0.1}
                className="cursor-pointer hover:border-wrench-accent/50"
                onClick={() => router.push(`/query?q=${encodeURIComponent(q)}`)}
              >
                <p className="text-wrench-chrome">{q}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">wrench smarter</span>
            </h2>
            <p className="text-xl text-wrench-chrome-dark max-w-2xl mx-auto">
              AI-powered answers, comprehensive database, video tutorials, and community knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Queries',
                description: 'Ask natural language questions and get instant, accurate answers with cited sources',
                color: 'from-wrench-accent to-wrench-accent-dark',
              },
              {
                icon: Database,
                title: 'Massive Database',
                description: 'Thousands of specs, torque values, and technical data for all Harley models',
                color: 'from-blue-600 to-cyan-600',
              },
              {
                icon: Video,
                title: 'Video Tutorials',
                description: 'Searchable YouTube gallery with top repair videos from expert channels',
                color: 'from-red-600 to-orange-600',
              },
              {
                icon: MessageSquare,
                title: 'Community Forum',
                description: 'Share tips, ask questions, and learn from experienced mechanics',
                color: 'from-purple-600 to-pink-600',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} delay={index * 0.1} className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-md`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-wrench-chrome">{feature.title}</h3>
                  <p className="text-wrench-chrome-dark text-sm">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
