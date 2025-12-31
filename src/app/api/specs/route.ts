import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      submitted_by: user.id,
      approved: false
    }

    const { data, error } = await supabase.from('specs').insert([toInsert]).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data, success: true })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
