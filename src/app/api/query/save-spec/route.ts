// API endpoint to save AI query answer as a spec
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { queryAI } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query, answer, componentName, torqueLow, torqueHigh, boltSize, sequenceNotes, applicableYears, applicableModels, sourceNotes } = await req.json()

    if (!query || !answer) {
      return NextResponse.json({ error: 'Query and answer are required' }, { status: 400 })
    }

    // If component name not provided, try to extract it from the query/answer
    let finalComponentName = componentName
    if (!finalComponentName) {
      // Use AI to extract component name from query
      try {
        const extraction = await queryAI(
          [
            {
              role: 'user',
              content: `Extract the main component or part name from this query: "${query}". Return ONLY the component name, nothing else.`
            }
          ],
          'You are a technical data extractor. Extract only the component name.'
        )
        finalComponentName = extraction.trim() || 'Unknown Component'
      } catch (error) {
        finalComponentName = query.substring(0, 50) // Fallback to query text
      }
    }

    // Create spec from AI answer
    const spec = await prisma.spec.create({
      data: {
        componentName: finalComponentName,
        boltSize: boltSize || null,
        torqueSpecLow: torqueLow ? parseFloat(torqueLow) : null,
        torqueSpecHigh: torqueHigh ? parseFloat(torqueHigh) : null,
        sequenceNotes: sequenceNotes || answer.substring(0, 500), // Use answer as notes if no sequence provided
        applicableYears: applicableYears || [],
        applicableModels: applicableModels || [],
        sourceNotes: sourceNotes || `AI-generated from query: "${query}"`,
        submittedBy: session.user.id,
        approved: false, // Requires moderation
      },
    })

    return NextResponse.json({
      success: true,
      spec,
      message: 'Spec saved successfully! It will be reviewed before being published.'
    })
  } catch (error: any) {
    console.error('Save spec error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save spec' },
      { status: 500 }
    )
  }
}

