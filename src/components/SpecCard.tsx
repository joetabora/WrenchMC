'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Wrench, Gauge, Hash, FileText } from 'lucide-react'

type Spec = {
  id: string
  component_name: string
  bolt_size?: string
  torque_spec_low?: number
  torque_spec_high?: number
  sequence_notes?: string
  source_notes?: string
}

export default function SpecCard({ spec, delay = 0 }: { spec: Spec; delay?: number }) {
  const hasTorque = spec.torque_spec_low !== null && spec.torque_spec_low !== undefined
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="card group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-accent/20 group-hover:bg-gradient-accent/30 transition-colors">
            <Wrench className="w-5 h-5 text-wrench-accent" />
          </div>
          <h3 className="text-xl font-bold text-gray-100 group-hover:text-wrench-accent transition-colors">
            {spec.component_name}
          </h3>
        </div>
      </div>

      {/* Specs Grid */}
      <div className="space-y-3">
        {/* Torque Spec - Highlighted */}
        {hasTorque && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 }}
            className="p-3 rounded-lg bg-gradient-to-r from-wrench-accent/20 to-wrench-accent-dark/20 border border-wrench-accent/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-wrench-accent" />
              <span className="text-xs font-semibold text-wrench-accent uppercase tracking-wide">Torque</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {spec.torque_spec_low}
              {spec.torque_spec_high ? (
                <span className="text-lg text-gray-300"> - {spec.torque_spec_high}</span>
              ) : null}
              <span className="text-sm font-normal text-gray-400 ml-2">Nm</span>
            </p>
          </motion.div>
        )}

        {/* Bolt Size */}
        {spec.bolt_size && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Bolt Size</span>
              <p className="text-sm font-semibold text-gray-200">{spec.bolt_size}</p>
            </div>
          </div>
        )}

        {/* Sequence Notes */}
        {spec.sequence_notes && (
          <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Sequence</span>
              <p className="text-sm text-gray-300">{spec.sequence_notes}</p>
            </div>
          </div>
        )}

        {/* Source Notes */}
        {spec.source_notes && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-500 italic">
              <span className="font-semibold">Source:</span> {spec.source_notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
