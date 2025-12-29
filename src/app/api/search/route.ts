import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { query, bike_year, bike_model } = body

    if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

    // Basic filtering: match component_name ilike query, and optionally filter by year/model
    let qb = supabaseServer
      .from('specs')
      .select('*')
      .ilike('component_name', `%${query}%`)

    // If bike filters present, use overlap for arrays or ilike on applicable_models
    if (bike_year) qb = qb.or(`applicable_years.cs.{${bike_year}}`)
    if (bike_model) qb = qb.or(`applicable_models.ilike.%${bike_model}%`)

    const { data, error } = await qb.limit(10)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ results: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
