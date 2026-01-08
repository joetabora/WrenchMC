"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import SpecCard from '@/components/SpecCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Mic, Volume2, Loader2, AlertCircle } from 'lucide-react'

const VoiceController = dynamic(() => import('@/components/VoiceController'), { ssr: false })

export default function VoicePage() {
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastQuery, setLastQuery] = useState('')

  async function handleResult(text: string) {
    setLastQuery(text)
    setIsSearching(true)
    
    // Get bike from localStorage or profile
    let bike = null
    try { 
      bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null') 
    } catch {}

    // Enhance query with bike info if user doesn't mention it
    let enhancedQuery = text
    if (bike?.year && bike?.model && !text.toLowerCase().includes(bike.model.toLowerCase()) && !text.toLowerCase().includes(bike.year)) {
      enhancedQuery = `${text} for ${bike.year} ${bike.model}`
    }

    try {
      // Use Ask API for better answers (with caching!) - API will use user's saved bike
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: enhancedQuery })
      })
      const data = await res.json()
      
      if (data.answer) {
        // Speak the AI answer (limit length for speech)
        const answerText = data.answer.substring(0, 500)
        const u = new SpeechSynthesisUtterance(answerText)
        u.rate = 0.9
        window.speechSynthesis.speak(u)
        
        // Also show results if there are specs
        if (data.specs && data.specs.length > 0) {
          setResults(data.specs)
        }
      } else if (data.specs && data.specs.length > 0) {
        // Fallback: show specs if no AI answer
        setResults(data.specs)
        const top = data.specs[0]
        const txt = `${top.componentName}, torque ${top.torqueSpecLow || 'unknown'}${top.torqueSpecHigh ? ' to ' + top.torqueSpecHigh : ''} newton meters.`
        const u = new SpeechSynthesisUtterance(txt)
        u.rate = 0.9
        window.speechSynthesis.speak(u)
      } else {
        const u = new SpeechSynthesisUtterance("I couldn't find an answer. Try rephrasing your question.")
        u.rate = 0.9
        window.speechSynthesis.speak(u)
      }
    } catch (error) {
      console.error('Ask error:', error)
      const u = new SpeechSynthesisUtterance("Sorry, there was an error. Please try again.")
      window.speechSynthesis.speak(u)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex p-3 rounded-2xl bg-gradient-accent/20 mb-4">
              <Mic className="w-8 h-8 text-wrench-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Hands-Free</span> Voice Search
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Ask questions while you work on your bike
            </p>
            <p className="text-sm text-gray-500">
              Example: &quot;What&apos;s the torque for the transmission cover on my 2018 Softail?&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voice Controller Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <VoiceController onResult={handleResult} />
        </motion.div>

        {/* Last Query Display */}
        <AnimatePresence>
          {lastQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500 mb-1">You asked:</p>
              <p className="text-lg font-semibold text-gray-200 italic">&quot;{lastQuery}&quot;</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-10 h-10 text-wrench-accent animate-spin mb-4" />
              <p className="text-gray-400">Searching and preparing response...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Found <span className="gradient-text">{results.length}</span> {results.length === 1 ? 'result' : 'results'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.speechSynthesis.cancel()}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Stop Speaking
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((r: any, index: number) => (
                  <SpecCard key={r.id} spec={r} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          ) : !isSearching && lastQuery ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex p-4 rounded-full bg-yellow-500/20 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400 mb-4">
                Try rephrasing your question or be more specific
              </p>
              <p className="text-sm text-gray-500">
                Example: &quot;torque spec for transmission cover&quot; or &quot;head bolt torque&quot;
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tips Section */}
        {!lastQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-wrench-accent/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-wrench-accent" />
                Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-wrench-accent mt-1">•</span>
                  <span>Speak clearly and include the component name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wrench-accent mt-1">•</span>
                  <span>Mention your bike model if you have it set in your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wrench-accent mt-1">•</span>
                  <span>Use terms like &quot;torque&quot;, &quot;bolt size&quot;, or &quot;spec&quot;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wrench-accent mt-1">•</span>
                  <span>Works best in Chrome, Edge, or Safari browsers</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        )}
      </section>
    </div>
  )
}
