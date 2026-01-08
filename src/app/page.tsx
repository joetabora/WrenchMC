'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Search, Mic, Zap, Video, Database, TrendingUp, Sparkles, MessageSquare } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/ask?q=${encodeURIComponent(query)}`)
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
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-wrench-dark via-wrench-dark to-wrench" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-block mb-8 p-3 rounded-2xl bg-wrench-accent/10 backdrop-blur-sm border border-wrench-accent/20"
            >
              <Sparkles className="w-12 h-12 text-wrench-accent" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="gradient-text">WrenchMC Goliath</span>
            </h1>
            <p className="text-xl md:text-2xl text-wrench-text-secondary mb-4 max-w-2xl mx-auto font-light">
              The ultimate AI-powered Harley-Davidson maintenance database
            </p>
            <p className="text-base md:text-lg text-wrench-text-muted mb-12 max-w-xl mx-auto">
              Every bolt, torque value, and repair trick for all models from 1903 to now
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10"
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything: 'Torque specs for transmission cover on 2005 Road King'"
                className="flex-1"
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </motion.form>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/voice')}
                className="min-w-[180px]"
              >
                <Mic className="w-5 h-5 mr-2" />
                Voice Ask
              </Button>
              <Button
                size="lg"
                variant="primary"
                onClick={() => router.push('/ask')}
                className="min-w-[180px]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Ask Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Queries */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-wrench-text-primary flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-wrench-accent" />
            Trending Queries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickQueries.map((q, i) => (
              <Card
                key={i}
                delay={i * 0.05}
                className="cursor-pointer"
                onClick={() => router.push(`/query?q=${encodeURIComponent(q)}`)}
              >
                <p className="text-wrench-text-secondary leading-relaxed">{q}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">wrench smarter</span>
            </h2>
            <p className="text-lg text-wrench-text-secondary max-w-2xl mx-auto">
              AI-powered answers, comprehensive database, video tutorials, and community knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Ask',
                description: 'Ask natural language questions and get instant, accurate answers. Answers are cached to save AI tokens!',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Zap,
                title: 'Smart Caching',
                description: 'Previous answers are stored in database. Similar questions get instant responses without using AI tokens.',
                color: 'from-amber-500 to-orange-500',
              },
              {
                icon: Database,
                title: 'Massive Database',
                description: 'Thousands of specs, torque values, and technical data for all Harley models from the community',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Video,
                title: 'Video Tutorials',
                description: 'Searchable YouTube gallery with top repair videos from expert channels',
                color: 'from-red-500 to-pink-500',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} delay={index * 0.05} className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-wrench-text-primary">{feature.title}</h3>
                  <p className="text-wrench-text-secondary text-sm leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
