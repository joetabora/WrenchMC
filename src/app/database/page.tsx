'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import SpecCard from '@/components/SpecCard'
import { Database, Search, Filter, Download } from 'lucide-react'

export default function DatabasePage() {
  const [specs, setSpecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    model: '',
    year: '',
    approved: true,
  })

  useEffect(() => {
    loadSpecs()
  }, [filters, searchQuery])

  async function loadSpecs() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (filters.model) params.append('model', filters.model)
      if (filters.year) params.append('year', filters.year)
      params.append('approved', filters.approved.toString())

      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setSpecs(data.results || [])
    } catch (error) {
      console.error('Failed to load specs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <Database className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Specs <span className="gradient-text">Database</span>
          </h1>
          <p className="text-xl text-wrench-chrome-dark">
            Browse thousands of technical specifications for all Harley-Davidson models
          </p>
        </motion.div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search component name, bolt size, torque..."
                className="flex-1"
              />
              <Button onClick={loadSpecs}>
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-wrench-chrome-dark" />
                <span className="text-sm text-wrench-chrome-dark">Filters:</span>
              </div>
              <select
                value={filters.model}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                className="px-4 py-2 bg-wrench-light/50 border border-wrench-chrome-dark/30 rounded-lg text-wrench-chrome"
              >
                <option value="">All Models</option>
                <option value="Road King">Road King</option>
                <option value="Softail">Softail</option>
                <option value="Sportster">Sportster</option>
                <option value="Dyna">Dyna</option>
                <option value="Touring">Touring</option>
              </select>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                placeholder="Year"
                className="px-4 py-2 bg-wrench-light/50 border border-wrench-chrome-dark/30 rounded-lg text-wrench-chrome w-32"
              />
            </div>
          </div>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-wrench-chrome">
              {specs.length} {specs.length === 1 ? 'Spec' : 'Specs'} Found
            </h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse h-48">
                  <div className="h-6 bg-wrench-light rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-wrench-light rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-wrench-light rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : specs.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-wrench-chrome-dark">No specs found. Try adjusting your filters.</p>
            </Card>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {specs.map((spec, i) => (
                <SpecCard key={spec.id} spec={spec} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

