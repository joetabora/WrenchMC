import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const id = body.get('id') as string
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabaseServer.from('specs').update({ approved: true }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.redirect('/admin/moderation')
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
