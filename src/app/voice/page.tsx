"use client"
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import SpecCard from '@/components/SpecCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Mic, Volume2, Loader2, AlertCircle, Flame, StopCircle } from 'lucide-react'

const VoiceController = dynamic(() => import('@/components/VoiceController'), { ssr: false })

export default function VoicePage() {
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastQuery, setLastQuery] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasAnswer, setHasAnswer] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  async function speakText(text: string) {
    stopSpeaking()
    const speechText = text.substring(0, 500)

    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText }),
      })

      if (res.ok) {
        const audioBlob = await res.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        audioRef.current = audio
        setIsSpeaking(true)

        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          fallbackToWebSpeech(speechText)
        }

        await audio.play()
        return
      } else {
        fallbackToWebSpeech(speechText)
      }
    } catch (error) {
      fallbackToWebSpeech(speechText)
    }
  }

  function fallbackToWebSpeech(text: string) {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
  }

  async function handleResult(text: string) {
    setLastQuery(text)
    setIsSearching(true)
    setHasAnswer(false)
    setResults([])
    
    let bike: { year?: string; model?: string } | null = null
    try { 
      bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null') 
    } catch {}

    let enhancedQuery = text
    if (bike && bike.year && bike.model && !text.toLowerCase().includes(bike.model.toLowerCase()) && !text.toLowerCase().includes(bike.year)) {
      enhancedQuery = `${text} for ${bike.year} ${bike.model}`
    }

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          query: enhancedQuery,
          originalQuery: text,
          source: 'voice'
        })
      })
      const data = await res.json()
      
      if (data.answer) {
        setHasAnswer(true)
        await speakText(data.answer)
        
        if (data.specs && data.specs.length > 0) {
          setResults(data.specs)
        }
      } else if (data.specs && data.specs.length > 0) {
        setHasAnswer(true)
        setResults(data.specs)
        const top = data.specs[0]
        const txt = `${top.componentName}, torque ${top.torqueSpecLow || 'unknown'}${top.torqueSpecHigh ? ' to ' + top.torqueSpecHigh : ''} newton meters.`
        await speakText(txt)
      } else {
        setHasAnswer(false)
        await speakText("I couldn't find an answer. Try rephrasing your question.")
      }
    } catch (error) {
      setHasAnswer(false)
      await speakText("Sorry, there was an error. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,69,0,0.15) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex p-4 rounded-3xl bg-gradient-flame mb-6 shadow-glow-lg">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              <span className="gradient-text">Voice</span> Search
            </h1>
            <p className="text-lg text-wrench-text-secondary mb-2">
              Hands-free while you work
            </p>
            <p className="text-sm text-wrench-text-muted">
              &quot;What&apos;s the torque for my transmission cover?&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voice Controller */}
      <section className="max-w-2xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <VoiceController onResult={handleResult} />
        </motion.div>

        {/* Last Query */}
        <AnimatePresence>
          {lastQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-wrench-text-muted mb-1">You asked:</p>
              <p className="text-base font-medium text-wrench-text-primary">&quot;{lastQuery}&quot;</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading/Speaking State */}
        <AnimatePresence>
          {(isSearching || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative mb-4">
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-wrench-light border-t-wrench-accent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <Flame className="absolute inset-0 m-auto w-6 h-6 text-wrench-accent animate-flame-flicker" />
              </div>
              <p className="text-wrench-text-muted mb-4">
                {isSearching ? 'Searching...' : 'Speaking...'}
              </p>
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Stop</span>
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-wrench-text-primary">
                  Found <span className="text-wrench-accent">{results.length}</span> {results.length === 1 ? 'result' : 'results'}
                </h2>
                {isSpeaking && (
                  <Button variant="ghost" size="sm" onClick={stopSpeaking}>
                    <Volume2 className="w-4 h-4" />
                    <span>Stop</span>
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r: any, i: number) => (
                  <SpecCard key={r.id} spec={r} delay={i * 0.05} />
                ))}
              </div>
            </motion.div>
          ) : !isSearching && lastQuery && !hasAnswer ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-wrench-text-primary mb-2">No results found</h3>
              <p className="text-wrench-text-muted">
                Try rephrasing your question
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tips */}
        {!lastQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="lg">
              <h3 className="text-base font-bold text-wrench-text-primary mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-wrench-accent" />
                Tips for Best Results
              </h3>
              <ul className="space-y-3 text-sm text-wrench-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-wrench-accent mt-0.5">•</span>
                  <span>Speak clearly and include the component name</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-wrench-accent mt-0.5">•</span>
                  <span>Set your bike in profile for personalized results</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-wrench-accent mt-0.5">•</span>
                  <span>Use terms like &quot;torque&quot;, &quot;bolt size&quot;, or &quot;spec&quot;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-wrench-accent mt-0.5">•</span>
                  <span>Works best in Chrome, Edge, or Safari</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        )}
      </section>
    </div>
  )
}
