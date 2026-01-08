"use client"
import React, { useState, useRef } from 'react'
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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasAnswer, setHasAnswer] = useState(false) // Track if we got an AI answer
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Function to speak text using ElevenLabs (with fallback to Web Speech API)
  async function speakText(text: string) {
    // Stop any current speech
    stopSpeaking()

    // Limit text length for speech (500 chars for better performance)
    const speechText = text.substring(0, 500)

    try {
      // Try ElevenLabs first
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText }),
      })

      if (res.ok) {
        // ElevenLabs succeeded - use high-quality audio
        const audioBlob = await res.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        audioRef.current = audio
        setIsSpeaking(true)

        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl) // Clean up
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          // Fallback to Web Speech API
          fallbackToWebSpeech(speechText)
        }

        await audio.play()
        return
      } else {
        // ElevenLabs failed - fallback to Web Speech API
        console.warn('ElevenLabs TTS failed, using fallback')
        fallbackToWebSpeech(speechText)
      }
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to Web Speech API
      fallbackToWebSpeech(speechText)
    }
  }

  // Fallback to Web Speech API
  function fallbackToWebSpeech(text: string) {
    if (!window.speechSynthesis) {
      console.error('Web Speech API not available')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.0

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  // Stop speaking function
  function stopSpeaking() {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    // Stop Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
  }

  async function handleResult(text: string) {
    setLastQuery(text)
    setIsSearching(true)
    setHasAnswer(false) // Reset answer state
    setResults([]) // Clear previous results
    
    // Get bike from localStorage or profile
    let bike: { year?: string; model?: string } | null = null
    try { 
      bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null') 
    } catch {}

    // Enhance query with bike info if user doesn't mention it
    let enhancedQuery = text
    if (bike && bike.year && bike.model && !text.toLowerCase().includes(bike.model.toLowerCase()) && !text.toLowerCase().includes(bike.year)) {
      enhancedQuery = `${text} for ${bike.year} ${bike.model}`
    }

    try {
      // Use Ask API for better answers (with caching!) - API will use user's saved bike
      // Pass original voice query and enhanced query so both are saved
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          query: enhancedQuery, // Enhanced query for search
          originalQuery: text, // Original voice query to save
          source: 'voice' // Mark as voice query
        })
      })
      const data = await res.json()
      
      if (data.answer) {
        // We got an AI answer - mark as success
        setHasAnswer(true)
        
        // Speak the AI answer using ElevenLabs (with fallback)
        await speakText(data.answer)
        
        // Also show results if there are specs
        if (data.specs && data.specs.length > 0) {
          setResults(data.specs)
        }
      } else if (data.specs && data.specs.length > 0) {
        // Fallback: show specs if no AI answer
        setHasAnswer(true) // We still got useful results
        setResults(data.specs)
        const top = data.specs[0]
        const txt = `${top.componentName}, torque ${top.torqueSpecLow || 'unknown'}${top.torqueSpecHigh ? ' to ' + top.torqueSpecHigh : ''} newton meters.`
        await speakText(txt)
      } else {
        // No answer found
        setHasAnswer(false)
        await speakText("I couldn't find an answer. Try rephrasing your question.")
      }
    } catch (error) {
      console.error('Ask error:', error)
      setHasAnswer(false)
      await speakText("Sorry, there was an error. Please try again.")
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
          {(isSearching || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-10 h-10 text-wrench-accent animate-spin mb-4" />
              <p className="text-gray-400">
                {isSearching ? 'Searching and preparing response...' : 'Speaking answer...'}
              </p>
              {isSpeaking && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopSpeaking}
                  className="mt-4"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Stop Speaking
                </Button>
              )}
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
                  onClick={stopSpeaking}
                  disabled={!isSpeaking}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isSpeaking ? 'Stop Speaking' : 'Not Speaking'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((r: any, index: number) => (
                  <SpecCard key={r.id} spec={r} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          ) : !isSearching && lastQuery && !hasAnswer ? (
            // Only show "No results" if we didn't get an AI answer
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
