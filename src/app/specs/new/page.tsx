"use client"
import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function NewSpecPage() {
  const [componentName, setComponentName] = useState('')
  const [boltSize, setBoltSize] = useState('')
  const [torqueLow, setTorqueLow] = useState('')
  const [torqueHigh, setTorqueHigh] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Submitting...')
    const body = {
      component_name: componentName,
      bolt_size: boltSize,
      torque_spec_low: torqueLow || null,
      torque_spec_high: torqueHigh || null,
      sequence_notes: null,
      applicable_years: [],
      applicable_models: [],
      source_notes: notes
    }

    try {
      const res = await fetch('/api/specs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) setStatus('Submitted — pending moderation')
      else setStatus('Failed to submit')
    } catch (err) {
      setStatus('Error submitting')
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Submit a Spec</h2>
      <Card className="mt-4 p-4 max-w-lg">
        <form onSubmit={submit} className="space-y-3">
          <Input value={componentName} onChange={(e) => setComponentName(e.target.value)} placeholder="Component name" required />
          <Input value={boltSize} onChange={(e) => setBoltSize(e.target.value)} placeholder="Bolt size" />
          <div className="flex gap-2">
            <Input value={torqueLow} onChange={(e) => setTorqueLow(e.target.value)} placeholder="Torque low (Nm)" />
            <Input value={torqueHigh} onChange={(e) => setTorqueHigh(e.target.value)} placeholder="Torque high (Nm)" />
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Source / notes" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <Button type="submit">Submit</Button>
          </div>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </form>
      </Card>
    </section>
  )
}
