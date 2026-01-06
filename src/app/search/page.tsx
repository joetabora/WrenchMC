"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpecCard from '@/components/SpecCard'
import BikeSelector from '@/components/BikeSelector'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Search, Filter, Bike, Loader2 } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return
    
    setIsSearching(true)
    try {
      const bike = JSON.parse(localStorage.getItem('wrenchmc_bike') || 'null')
      const res = await fetch('/api/search', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ query, bike_year: (bike as any)?.year, bike_model: (bike as any)?.model }) 
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex p-3 rounded-2xl bg-gradient-accent/20 mb-4">
              <Search className="w-8 h-8 text-wrench-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Search <span className="gradient-text">Technical Specs</span>
            </h1>
            <p className="text-xl text-gray-400">
              Find torque specs, bolt sizes, and more for your Harley
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={doSearch}
            className="relative"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search component or keyword (e.g., 'transmission cover', 'head bolt')"
                  className="pl-12 pr-4 py-4 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                isLoading={isSearching}
                disabled={!query.trim() || isSearching}
              >
                {!isSearching && <Search className="w-5 h-5 inline mr-2" />}
                Search
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-wrench-accent animate-spin mb-4" />
              <p className="text-gray-400">Searching...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Found <span className="gradient-text">{results.length}</span> {results.length === 1 ? 'result' : 'results'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((r, index) => (
                  <SpecCard key={r.id} spec={r} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          ) : query ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try different keywords or check your bike selection
              </p>
              <Button variant="outline" onClick={() => setQuery('')}>
                Clear Search
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex p-4 rounded-full bg-gradient-accent/20 mb-4">
                <Search className="w-8 h-8 text-wrench-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Start your search</h3>
              <p className="text-gray-400">
                Enter a component name or keyword to find technical specs
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bike Selector Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="border-wrench-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-accent/20">
                <Bike className="w-5 h-5 text-wrench-accent" />
              </div>
              <h3 className="text-xl font-bold">Your Bike Profile</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Set your bike details to get personalized search results
            </p>
            <BikeSelector />
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
