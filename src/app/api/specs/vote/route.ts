import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { spec_id, up = true, user_id = null } = body
    if (!spec_id) return NextResponse.json({ error: 'Missing spec_id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('spec_votes').insert([{ spec_id, up, user_id }])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
