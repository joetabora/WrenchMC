"use client"
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Flame } from 'lucide-react'

type Props = {
  onResult?: (text: string) => void
  onSpeakRequest?: (text: string) => void
}

export default function VoiceController({ onResult, onSpeakRequest }: Props) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  async function speakWithElevenLabs(text: string) {
    if (onSpeakRequest) {
      onSpeakRequest(text)
      return
    }

    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (res.ok) {
        const audioBlob = await res.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl)
          fallbackSpeakText(text)
        }

        await audio.play()
        return
      }
    } catch (error) {
      console.warn('ElevenLabs TTS failed:', error)
    }

    fallbackSpeakText(text)
  }

  function fallbackSpeakText(text: string) {
    const synth = window.speechSynthesis
    if (!synth) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.9
    synth.cancel()
    synth.speak(utter)
  }

  useEffect(() => {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.maxAlternatives = 1

    rec.onresult = (ev: any) => {
      const text = ev.results[0][0].transcript
      setTranscript(text)
      
      if (ev.results[0].isFinal) {
        onResult?.(text)
        speakWithElevenLabs(`You asked: ${text}. Searching...`)
        setTranscript('')
      }
    }

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      speakWithElevenLabs("Sorry, I didn't catch that. Please try again.")
      setListening(false)
      setTranscript('')
    }

    rec.onend = () => {
      setListening(false)
      setTranscript('')
    }
    
    recognitionRef.current = rec
  }, [onResult, onSpeakRequest])

  function start() {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setListening(true)
      setTranscript('')
    } catch (e) {
      console.warn(e)
    }
  }

  function stop() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setListening(false)
    setTranscript('')
  }

  if (!supported) {
    return (
      <div className="glass-card p-6 text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-3">
          <MicOff className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-red-400 font-medium mb-1">Voice not supported</p>
        <p className="text-sm text-wrench-text-muted">Please use Chrome, Edge, or Safari.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main Microphone Button */}
      <motion.button
        onClick={() => (listening ? stop() : start())}
        className={`
          relative w-32 h-32 sm:w-40 sm:h-40
          rounded-full
          flex items-center justify-center
          transition-all duration-300
          tap-target
          ${listening 
            ? 'bg-gradient-flame shadow-glow-lg' 
            : 'bg-wrench-light/50 border-2 border-wrench-accent/30 hover:border-wrench-accent/50'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={listening ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          scale: {
            duration: 1.5,
            repeat: listening ? Infinity : 0,
            ease: 'easeInOut'
          }
        }}
        aria-label={listening ? 'Stop listening' : 'Start voice search'}
      >
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {listening && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-wrench-accent"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: [1, 2, 2.5],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Inner glow */}
        {listening && (
          <div 
            className="absolute inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,69,0,0.4) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={listening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.8, repeat: listening ? Infinity : 0 }}
        >
          {listening ? (
            <MicOff className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          ) : (
            <Mic className="w-12 h-12 sm:w-14 sm:h-14 text-wrench-accent" />
          )}
        </motion.div>
      </motion.button>

      {/* Status Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={listening ? 'listening' : 'idle'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          {listening ? (
            <div className="flex items-center justify-center gap-2 text-wrench-accent">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <Flame className="w-5 h-5" />
                <span className="text-lg font-semibold">Listening...</span>
              </motion.div>
            </div>
          ) : (
            <p className="text-wrench-text-secondary font-medium">Tap to speak</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md p-4 rounded-2xl glass-card"
          >
            <p className="text-sm text-wrench-text-primary italic text-center">
              &quot;{transcript}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
