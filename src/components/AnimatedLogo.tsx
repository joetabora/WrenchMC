'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

export default function AnimatedLogo() {
  return (
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
      className="p-2 rounded-lg bg-gradient-accent/20 group-hover:bg-gradient-accent/30 transition-colors"
    >
      <Wrench className="w-6 h-6 text-wrench-accent" />
    </motion.div>
  )
}

