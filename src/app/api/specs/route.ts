import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const toInsert = {
      component_name: body.component_name,
      bolt_size: body.bolt_size || null,
      torque_spec_low: body.torque_spec_low || null,
      torque_spec_high: body.torque_spec_high || null,
      sequence_notes: body.sequence_notes || null,
      applicable_years: body.applicable_years || [],
      applicable_models: body.applicable_models || [],
      source_notes: body.source_notes || null,
      approved: false
    }

    const { data, error } = await supabaseServer.from('specs').insert([toInsert])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
