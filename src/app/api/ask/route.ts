// Unified Ask API - combines query, search, and database with intelligent caching
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryAIWithRAG } from '@/lib/ai'
import { searchSimilarContent } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { searchYouTubeVideos } from '@/lib/youtube'

// Normalize query for matching (lowercase, trim, remove extra spaces)
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ')
}

// Check if similar query exists in database
async function findCachedQuery(query: string): Promise<any | null> {
  const normalized = normalizeQuery(query)
  
  // Try exact match first
  const exactMatch = await prisma.queryHistory.findFirst({
    where: {
      normalizedQuery: normalized,
      success: true,
      response: { not: null },
    },
    orderBy: {
      viewCount: 'desc', // Prefer most viewed answers
    },
  })

  if (exactMatch) {
    return exactMatch
  }

  // Try partial match (query contains keywords from cached query or vice versa)
  const allCached = await prisma.queryHistory.findMany({
    where: {
      success: true,
      response: { not: null },
      normalizedQuery: { not: null },
    },
    orderBy: {
      viewCount: 'desc',
    },
    take: 50, // Check last 50 most viewed
  })

  // Check for similar queries (simple keyword matching)
  const queryWords = normalized.split(' ').filter(w => w.length > 3) // Words longer than 3 chars
  let bestMatch: any = null
  let bestScore = 0

  for (const cached of allCached) {
    if (!cached.normalizedQuery) continue
    
    const cachedWords = cached.normalizedQuery.split(' ').filter(w => w.length > 3)
    const commonWords = queryWords.filter(w => cachedWords.includes(w))
    const score = commonWords.length / Math.max(queryWords.length, cachedWords.length)
    
    // Consider it a match if 50%+ of words match
    if (score >= 0.5 && score > bestScore) {
      bestScore = score
      bestMatch = cached
    }
  }

  return bestMatch
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log('Ask API - Processing query:', query.substring(0, 50))

    // STEP 1: Check for cached answer first (saves AI tokens!)
    const cachedAnswer = await findCachedQuery(query)
    
    if (cachedAnswer) {
      console.log('✅ Found cached answer - returning from database (saved AI tokens!)')
      
      // Increment view count
      await prisma.queryHistory.update({
        where: { id: cachedAnswer.id },
        data: { viewCount: { increment: 1 } },
      })

      // Parse stored data (handle both JSON string and object)
      const specs = cachedAnswer.specs 
        ? (typeof cachedAnswer.specs === 'string' ? JSON.parse(cachedAnswer.specs) : cachedAnswer.specs)
        : []
      const youtubeVideos = cachedAnswer.youtubeVideos 
        ? (typeof cachedAnswer.youtubeVideos === 'string' ? JSON.parse(cachedAnswer.youtubeVideos) : cachedAnswer.youtubeVideos)
        : []

      return NextResponse.json({
        answer: cachedAnswer.response,
        sources: cachedAnswer.sources || [],
        specs: specs,
        youtubeVideos: youtubeVideos,
        cached: true, // Indicate this came from cache
        cachedAt: cachedAnswer.createdAt,
      })
    }

    console.log('🔄 No cached answer found - calling AI...')

    // STEP 2: No cache found - call AI
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

    // STEP 3: Save to database for future use (cache it!)
    const savedQuery = await prisma.queryHistory.create({
      data: {
        query,
        normalizedQuery: normalizeQuery(query),
        userId: session?.user?.id,
        response: answer,
        sources: sources,
        specs: JSON.parse(JSON.stringify(dbSpecs)), // Store as JSON
        youtubeVideos: JSON.parse(JSON.stringify(youtubeVideos)), // Store as JSON
        success: true,
        viewCount: 1,
      },
    })

    console.log('✅ Answer saved to database for future caching')

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
      cached: false,
      saved: true,
    })
  } catch (error: any) {
    console.error('Ask API error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    
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

