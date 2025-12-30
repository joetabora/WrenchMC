"use client"
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2 } from 'lucide-react'

type Props = {
  onResult?: (text: string) => void
}

export default function VoiceController({ onResult }: Props) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

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
        speakText(`You asked: ${text}. Searching...`)
        setTranscript('')
      }
    }

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      speakText("Sorry, I didn't catch that. Please try again.")
      setListening(false)
      setTranscript('')
    }

    rec.onend = () => {
      setListening(false)
      setTranscript('')
    }
    
    recognitionRef.current = rec
  }, [onResult])

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

  function speakText(text: string) {
    const synth = window.speechSynthesis
    if (!synth) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.9
    synth.cancel()
    synth.speak(utter)
  }

  if (!supported) {
    return (
      <div className="text-center p-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <p className="text-red-400">Voice recognition not supported in this browser.</p>
        <p className="text-sm text-gray-400 mt-2">Please use Chrome, Edge, or Safari.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main Microphone Button */}
      <motion.button
        onClick={() => (listening ? stop() : start())}
        className={`
          relative w-32 h-32 md:w-40 md:h-40
          rounded-full
          flex items-center justify-center
          transition-all duration-300
          ${listening 
            ? 'bg-gradient-accent shadow-glow-lg' 
            : 'bg-gradient-to-br from-wrench-light to-wrench-DEFAULT border-2 border-wrench-accent/30'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={listening ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          scale: {
            duration: 1.5,
            repeat: listening ? Infinity : 0,
            ease: 'easeInOut'
          }
        }}
      >
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {listening && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-wrench-accent"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ 
                    scale: [1, 2, 2.5],
                    opacity: [0.8, 0.4, 0]
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

        {/* Icon */}
        <motion.div
          animate={listening ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: listening ? Infinity : 0 }}
        >
          {listening ? (
            <MicOff className="w-12 h-12 md:w-16 md:h-16 text-white" />
          ) : (
            <Mic className="w-12 h-12 md:w-16 md:w-16 text-wrench-accent" />
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
          <p className="text-xl font-semibold mb-2">
            {listening ? (
              <span className="text-wrench-accent flex items-center justify-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Listening...
                </motion.span>
              </span>
            ) : (
              <span className="text-gray-400">Tap to start</span>
            )}
          </p>
          {listening && (
            <p className="text-sm text-gray-500">Ask your question now</p>
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
            className="w-full max-w-md p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-start gap-2">
              <Volume2 className="w-5 h-5 text-wrench-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300 italic">"{transcript}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
