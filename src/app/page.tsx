'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Search, Mic, Sparkles, Video, Database, Zap, ChevronRight, Flame } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/ask?q=${encodeURIComponent(query)}`)
    }
  }

  const quickQueries = [
    { text: 'Torque specs for transmission cover', icon: '🔧' },
    { text: 'Primary oil capacity', icon: '🛢️' },
    { text: 'Fork service intervals', icon: '🔩' },
    { text: 'Head bolt sequence', icon: '⚙️' },
  ]

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Instant answers from our trained AI mechanic',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Zap,
      title: 'Smart Cache',
      description: 'Lightning fast responses from saved queries',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Database,
      title: 'Spec Database',
      description: 'Community-verified torque specs and data',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Video,
      title: 'Video Guides',
      description: 'Expert tutorials from top Harley mechanics',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section px-4 py-16 sm:py-24">
        {/* Animated flame gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,69,0,0.2) 0%, transparent 60%)',
              filter: 'blur(80px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex p-4 rounded-3xl bg-gradient-flame mb-6 shadow-glow-lg"
            >
              <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">WrenchMC</span>
            </h1>
            <p className="text-lg sm:text-xl text-wrench-text-secondary mb-2 font-medium">
              Mobile Edition
            </p>
            <p className="text-base sm:text-lg text-wrench-text-muted mb-8 max-w-xl mx-auto">
              Your AI-powered Harley-Davidson maintenance companion. Every spec, torque value, and repair trick at your fingertips.
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className={`
                relative overflow-hidden rounded-3xl transition-all duration-300
                ${isFocused ? 'shadow-glow-lg' : 'shadow-glass-lg'}
              `}>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-wrench-text-muted z-10">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Torque for 2005 Road King transmission?"
                  className="
                    w-full pl-14 pr-32 sm:pr-36 py-5 sm:py-6
                    bg-wrench-light/60 backdrop-blur-xl
                    border border-glass-border
                    text-wrench-text-primary placeholder:text-wrench-text-muted
                    focus:outline-none focus:border-wrench-accent/50
                    text-base sm:text-lg rounded-3xl
                  "
                  style={{ fontSize: '16px' }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button type="submit" variant="flame" size="md" className="rounded-2xl">
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">Ask</span>
                  </Button>
                </div>
              </div>
            </motion.form>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/voice')}
                className="w-full sm:w-auto min-w-[180px]"
              >
                <Mic className="w-5 h-5" />
                <span>Voice Search</span>
              </Button>
              <Button
                size="lg"
                variant="primary"
                onClick={() => router.push('/ask')}
                className="w-full sm:w-auto min-w-[180px]"
              >
                <Sparkles className="w-5 h-5" />
                <span>Ask AI</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Queries - Horizontal scroll on mobile */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-wrench-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-wrench-accent" />
            Quick Questions
          </h2>
          <div className="swipe-carousel pb-4">
            {quickQueries.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push(`/ask?q=${encodeURIComponent(q.text)}`)}
                className="
                  flex items-center gap-3 px-5 py-4 rounded-2xl
                  bg-wrench-light/50 border border-glass-border
                  text-wrench-text-secondary hover:text-wrench-text-primary
                  hover:bg-wrench-light hover:border-wrench-accent/30
                  transition-all duration-200 haptic
                  whitespace-nowrap min-w-[260px]
                "
              >
                <span className="text-xl">{q.icon}</span>
                <span className="text-sm font-medium">{q.text}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-wrench-text-muted" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Everything to <span className="gradient-text">wrench smarter</span>
            </h2>
            <p className="text-wrench-text-secondary max-w-xl mx-auto">
              AI-powered answers, comprehensive specs, and expert tutorials in your pocket
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} delay={i * 0.1} className="text-center p-4 sm:p-6">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      inline-flex p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4
                      bg-gradient-to-br ${feature.gradient}
                      shadow-lg
                    `}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-bold text-wrench-text-primary mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-wrench-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden p-8 sm:p-12 text-center">
            {/* Background flame effect */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at bottom, rgba(255,69,0,0.3) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <div className="inline-flex p-3 rounded-2xl bg-wrench-accent/20 mb-4">
                <Mic className="w-8 h-8 text-wrench-accent" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Hands-Free in the Garage
              </h2>
              <p className="text-wrench-text-secondary mb-6 max-w-md mx-auto">
                Use voice commands while your hands are dirty. Just speak your question and get instant answers.
              </p>
              <Button
                size="lg"
                variant="flame"
                onClick={() => router.push('/voice')}
                className="min-w-[200px]"
              >
                <Mic className="w-5 h-5" />
                <span>Try Voice Search</span>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
