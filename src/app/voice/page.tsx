"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import SpecCard from '@/components/SpecCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const VoiceController = dynamic(() => import('@/components/VoiceController'), { ssr: false })

export default function VoicePage() {
  const [results, setResults] = useState<any[]>([])

  async function handleResult(text: string) {
    let bike = null
    try { bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null') } catch {}

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, bike_year: bike?.year, bike_model: bike?.model })
    })
    const data = await res.json()
    const items = data.results || []
    setResults(items)

    if (items.length > 0) {
      const top = items[0]
      const txt = `${top.component_name}, torque ${top.torque_spec_low || 'unknown'}${top.torque_spec_high ? ' to ' + top.torque_spec_high : ''} newton meters.`
      const u = new SpeechSynthesisUtterance(txt)
      window.speechSynthesis.speak(u)
    } else {
      const u = new SpeechSynthesisUtterance("No matching specs found.")
      window.speechSynthesis.speak(u)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Voice Search</h2>
      <p className="text-sm text-gray-500">Tap and ask: &quot;What&apos;s the torque for the transmission cover on my 2018 Softail?&quot;</p>
      <div className="mt-4">
        <VoiceController onResult={handleResult} />
      </div>

      <div className="mt-6 grid gap-4">
        {results.length === 0 && <p className="text-sm text-gray-500">No results yet.</p>}
        {results.map((r: any) => (
          <Card key={r.id} className="p-3">
            <SpecCard spec={r} />
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={() => window.speechSynthesis.cancel()}>Stop Speaking</Button>
      </div>
    </section>
  )
}
