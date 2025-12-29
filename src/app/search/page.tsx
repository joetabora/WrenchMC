"use client"
import React, { useState } from 'react'
import SpecCard from '@/components/SpecCard'
import BikeSelector from '@/components/BikeSelector'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault()
    const bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null')
    const res = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, bike_year: bike?.year, bike_model: bike?.model }) })
    const data = await res.json()
    setResults(data.results || [])
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Search Specs</h2>
      <form onSubmit={doSearch} className="mt-4 flex gap-2">
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search component or keyword" className="flex-1" />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-4 grid gap-4">
        {results.length === 0 && <p className="text-sm text-gray-500">No results yet — try a search.</p>}
        {results.map(r => (
          <Card key={r.id} className="p-3">
            <SpecCard spec={r} />
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold">Your Bike</h3>
        <Card className="p-4 mt-2">
          <BikeSelector />
        </Card>
      </div>
    </section>
  )
}
