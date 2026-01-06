'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Bike, Calendar, Gauge, Wrench } from 'lucide-react'
import Link from 'next/link'

const HARLEY_MODELS = [
  { name: 'Road King', years: '1994-2025', engine: 'Milwaukee-Eight', image: '/models/road-king.jpg' },
  { name: 'Softail', years: '1984-2025', engine: 'Milwaukee-Eight', image: '/models/softail.jpg' },
  { name: 'Sportster', years: '1957-2025', engine: 'Evolution', image: '/models/sportster.jpg' },
  { name: 'Dyna', years: '1991-2017', engine: 'Twin Cam', image: '/models/dyna.jpg' },
  { name: 'Touring', years: '1965-2025', engine: 'Milwaukee-Eight', image: '/models/touring.jpg' },
  { name: 'CVO', years: '1999-2025', engine: 'Milwaukee-Eight', image: '/models/cvo.jpg' },
]

export default function ModelsPage() {
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
            <Bike className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Harley-Davidson <span className="gradient-text">Models</span>
          </h1>
          <p className="text-xl text-wrench-chrome-dark">
            Explore specs, tutorials, and community knowledge for each model
          </p>
        </motion.div>

        {/* Models Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {HARLEY_MODELS.map((model, i) => (
            <Link key={model.name} href={`/models/${model.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card delay={i * 0.05} className="cursor-pointer hover:border-wrench-accent/50 h-full">
                <div className="aspect-video bg-wrench-light/20 rounded-lg mb-4 flex items-center justify-center">
                  <Bike className="w-16 h-16 text-wrench-chrome-dark" />
                </div>
                <h3 className="text-2xl font-bold text-wrench-chrome mb-4">{model.name}</h3>
                <div className="space-y-2 text-sm text-wrench-chrome-dark">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{model.years}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    <span>{model.engine}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

