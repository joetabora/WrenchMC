import React from 'react'

type Spec = {
  id: string
  component_name: string
  bolt_size?: string
  torque_spec_low?: number
  torque_spec_high?: number
  sequence_notes?: string
  source_notes?: string
}

export default function SpecCard({ spec }: { spec: Spec }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{spec.component_name}</h3>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Bolt:</strong> {spec.bolt_size || '—'}</p>
        <p><strong>Torque:</strong> {spec.torque_spec_low ? `${spec.torque_spec_low}${spec.torque_spec_high ? ' - ' + spec.torque_spec_high : ''} Nm` : '—'}</p>
        {spec.sequence_notes && <p><strong>Sequence:</strong> {spec.sequence_notes}</p>}
        {spec.source_notes && <p className="mt-2 text-xs text-gray-500">Source: {spec.source_notes}</p>}
      </div>
    </div>
  )
}
