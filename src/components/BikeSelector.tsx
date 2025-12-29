"use client"
import React from 'react'

const YEARS = Array.from({ length: 30 }).map((_, i) => String(1995 + i))
const MODELS = ['Softail', 'Sportster', 'Dyna', 'Road King', 'Street Glide']
const VARIANTS = ['Standard', 'Custom', 'Limited']

export default function BikeSelector({ onChange }: { onChange?: (v: any) => void }) {
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const value = {
      year: data.get('year'),
      model: data.get('model'),
      variant: data.get('variant')
    }
    onChange?.(value)
    // Local persist for voice component to use
    try { localStorage.setItem('wrenchmc_bike', JSON.stringify(value)) } catch {}
    alert('Saved locally (for dev).')
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <label className="block text-sm">Year</label>
        <select name="year" className="mt-1 border rounded w-full p-2">
          <option value="">Select year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm">Model</label>
        <select name="model" className="mt-1 border rounded w-full p-2">
          <option value="">Select model</option>
          {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm">Variant</label>
        <select name="variant" className="mt-1 border rounded w-full p-2">
          <option value="">Select variant</option>
          {VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 bg-wrench-accent text-white rounded">Save Bike</button>
    </form>
  )
}
