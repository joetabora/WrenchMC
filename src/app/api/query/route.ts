// AI-powered query endpoint using Groq AI / Gemini with RAG
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryAIWithRAG } from '@/lib/ai'
import { searchSimilarContent } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { searchYouTubeVideos } from '@/lib/youtube'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Search for similar content in vector database
    const similarContent = await searchSimilarContent(query, 5)
    
    // Also search database for specs
    const dbSpecs = await prisma.spec.findMany({
      where: {
        approved: true,
        OR: [
          { componentName: { contains: query, mode: 'insensitive' } },
          { sequenceNotes: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    // Combine context from vector search and database
    const context = [
      ...similarContent.map((c) => c.text),
      ...dbSpecs.map(
        (s) =>
          `${s.componentName}: Torque ${s.torqueSpecLow || ''}-${s.torqueSpecHigh || ''} Nm, Bolt: ${s.boltSize || 'N/A'}. ${s.sequenceNotes || ''}`
      ),
    ]

    // Query AI (Groq/Gemini) with RAG context
    const { answer, sources } = await queryAIWithRAG(query, context)

    // Search YouTube for related tutorials
    const youtubeVideos = await searchYouTubeVideos(`Harley Davidson ${query}`, 3)

    // Save query to history
    if (session?.user?.id) {
      await prisma.queryHistory.create({
        data: {
          query,
          userId: session.user.id,
          response: answer,
          sources: sources,
          success: true,
        },
      })
    }

    return NextResponse.json({
      answer,
      sources: sources,
      specs: dbSpecs,
      youtubeVideos,
      similarContent: similarContent.map((c) => ({
        text: c.text,
        sourceType: c.sourceType,
        score: c.score,
      })),
    })
  } catch (error: any) {
    console.error('Query API error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Failed to process query'
    
    if (errorMessage.includes('GROQ_API_KEY') || errorMessage.includes('GEMINI_API_KEY')) {
      errorMessage = 'AI API keys not configured. Please add GROQ_API_KEY or GEMINI_API_KEY to your environment variables.'
    } else if (errorMessage.includes('Prisma') || errorMessage.includes('database')) {
      errorMessage = 'Database connection error. Please check your database configuration.'
    } else if (errorMessage.includes('API error')) {
      errorMessage = `AI service error: ${errorMessage}. Please check your API keys and quota.`
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

