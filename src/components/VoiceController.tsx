"use client"
import React, { useState, useEffect, useRef } from 'react'

type Props = {
  onResult?: (text: string) => void
}

export default function VoiceController({ onResult }: Props) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = (ev: any) => {
      const text = ev.results[0][0].transcript
      onResult?.(text)
      speakText(`You asked: ${text}. Searching...`)
    }

    rec.onerror = () => {
      speakText("Sorry, I didn't catch that.")
      setListening(false)
    }

    rec.onend = () => setListening(false)
    recognitionRef.current = rec
  }, [onResult])

  function start() {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (e) {
      console.warn(e)
    }
  }

  function stop() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  function speakText(text: string) {
    const synth = window.speechSynthesis
    if (!synth) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    synth.cancel()
    synth.speak(utter)
  }

  if (!supported) return <div className="text-red-500">Voice not supported in this browser.</div>

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => (listening ? stop() : start())}
        className={`px-4 py-2 rounded ${listening ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
        {listening ? 'Listening…' : 'Start Voice'}
      </button>
    </div>
  )
}
