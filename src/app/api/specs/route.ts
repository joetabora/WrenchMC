// Specs API endpoint using Prisma
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const spec = await prisma.spec.create({
      data: {
        componentName: body.component_name || body.componentName,
        boltSize: body.bolt_size || body.boltSize || null,
        torqueSpecLow: body.torque_spec_low || body.torqueSpecLow ? parseFloat(body.torque_spec_low || body.torqueSpecLow) : null,
        torqueSpecHigh: body.torque_spec_high || body.torqueSpecHigh ? parseFloat(body.torque_spec_high || body.torqueSpecHigh) : null,
        sequenceNotes: body.sequence_notes || body.sequenceNotes || null,
        applicableYears: body.applicable_years || body.applicableYears || [],
        applicableModels: body.applicable_models || body.applicableModels || [],
        sourceNotes: body.source_notes || body.sourceNotes || null,
        submittedBy: session.user.id,
        approved: body.approved || false,
      },
    })

    return NextResponse.json({ data: spec, success: true })
  } catch (err: any) {
    console.error('Spec creation error:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const approved = searchParams.get('approved') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    const specs = await prisma.spec.findMany({
      where: {
        approved: approved,
        ...(search && {
          OR: [
            { componentName: { contains: search, mode: 'insensitive' } },
            { sequenceNotes: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ specs })
  } catch (err: any) {
    console.error('Spec fetch error:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
