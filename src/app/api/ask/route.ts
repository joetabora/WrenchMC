// Unified Ask API - combines query, search, and database with intelligent caching
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { queryAIWithRAG } from '@/lib/ai'
import { searchSimilarContent } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { searchYouTubeVideos } from '@/lib/youtube'
import { getUserBikeProfile } from '@/lib/user-bike'

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
  // Declare variables outside try block so they're accessible in catch
  let session: any = null
  let query: string = ''
  let originalQuery: string | undefined = undefined
  let source: string = 'web'
  let queryToSave: string = ''
  let isVoiceQuery: boolean = false
  
  try {
    session = await auth()
    const body = await req.json()
    query = body.query
    originalQuery = body.originalQuery
    source = body.source || 'web'

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Use original query if provided (for voice queries that get enhanced)
    queryToSave = originalQuery || query
    isVoiceQuery = source === 'voice'

    console.log('Ask API - Processing query:', query.substring(0, 50), isVoiceQuery ? '(VOICE)' : '')

    // STEP 1: Check for cached answer first (saves AI tokens!)
    const cachedAnswer = await findCachedQuery(query)
    
    if (cachedAnswer) {
      console.log('✅ Found cached answer - returning from database (saved AI tokens!)')
      
      // Increment view count
      await prisma.queryHistory.update({
        where: { id: cachedAnswer.id },
        data: { viewCount: { increment: 1 } },
      })

      // For voice queries, always save a record even if cached (to track voice usage)
      if (isVoiceQuery && queryToSave) {
        await prisma.queryHistory.create({
          data: {
            query: queryToSave,
            normalizedQuery: normalizeQuery(queryToSave),
            userId: session?.user?.id,
            response: cachedAnswer.response, // Reference to cached answer
            sources: cachedAnswer.sources || [],
            specs: cachedAnswer.specs,
            youtubeVideos: cachedAnswer.youtubeVideos,
            success: true,
            viewCount: 0, // This is a reference to cached answer, not a new answer
          },
        })
        console.log('✅ Voice query saved to database (referencing cached answer)')
      }

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
    // Get user's bike profile for filtering
    const userBike = await getUserBikeProfile()
    
    // Search for similar content in vector database
    const similarContent = await searchSimilarContent(query, 5)
    
    // Search database for specs - filter by user's bike if available
    const specWhere: any = {
      approved: true,
      OR: [
        { componentName: { contains: query, mode: 'insensitive' } },
        { sequenceNotes: { contains: query, mode: 'insensitive' } },
      ],
    }

    let dbSpecs: any[] = []

    // If user has a bike profile, prioritize specs for their bike
    if (userBike?.model || userBike?.year) {
      // Try to find bike-specific specs first
      const bikeFilterWhere: any = {
        ...specWhere,
        AND: [
          ...(userBike.model ? [
            {
              OR: [
                { applicableModels: { has: userBike.model } },
                { applicableModels: { has: 'All Models' } },
                { applicableModels: { isEmpty: true } },
              ],
            },
          ] : []),
          ...(userBike.year ? [
            {
              OR: [
                { applicableYears: { has: parseInt(userBike.year) } },
                { applicableYears: { isEmpty: true } },
              ],
            },
          ] : []),
        ],
      }

      const bikeFilteredSpecs = await prisma.spec.findMany({
        where: bikeFilterWhere,
        take: 5,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      })

      // If we found bike-specific specs, use those; otherwise fall back to all specs
      if (bikeFilteredSpecs.length > 0) {
        dbSpecs = bikeFilteredSpecs
      } else {
        // Fallback: search all specs if no bike-specific ones found
        dbSpecs = await prisma.spec.findMany({
          where: specWhere,
          take: 5,
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        })
      }
    } else {
      // No bike profile - search all specs
      dbSpecs = await prisma.spec.findMany({
        where: specWhere,
        take: 5,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      })
    }

    // Combine context from vector search and database
    const context = [
      ...similarContent.map((c) => c.text),
      ...dbSpecs.map(
        (s) =>
          `${s.componentName}: Torque ${s.torqueSpecLow || ''}-${s.torqueSpecHigh || ''} Nm, Bolt: ${s.boltSize || 'N/A'}. ${s.sequenceNotes || ''}`
      ),
    ]

    // Enhance query with bike context for AI
    const enhancedQuery = userBike?.model && userBike?.year
      ? `${query} (for ${userBike.year} ${userBike.model}${userBike.variant ? ' ' + userBike.variant : ''})`
      : query

    // Query AI (Groq/Gemini) with RAG context
    const { answer, sources } = await queryAIWithRAG(enhancedQuery, context)

    // Search YouTube for related tutorials - include bike info if available
    const youtubeQuery = userBike?.model && userBike?.year
      ? `Harley Davidson ${userBike.year} ${userBike.model} ${query}`
      : `Harley Davidson ${query}`
    const youtubeVideos = await searchYouTubeVideos(youtubeQuery, 3)

    // STEP 3: Save to database for future use (cache it!)
    // Save with original query if provided (for voice), otherwise use enhanced query
    const savedQuery = await prisma.queryHistory.create({
      data: {
        query: queryToSave, // Save original voice query if available, otherwise enhanced query
        normalizedQuery: normalizeQuery(query), // Normalize the search query for matching
        userId: session?.user?.id,
        response: answer,
        sources: sources,
        specs: JSON.parse(JSON.stringify(dbSpecs)), // Store as JSON
        youtubeVideos: JSON.parse(JSON.stringify(youtubeVideos)), // Store as JSON
        success: true,
        viewCount: 1,
      },
    })

    console.log(`✅ Answer saved to database for future caching${isVoiceQuery ? ' (VOICE QUERY)' : ''}`)

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
    
    // Save failed query to database for tracking (even on error)
    try {
      const failedQueryToSave = queryToSave || query || 'Unknown query'
      
      await prisma.queryHistory.create({
        data: {
          query: failedQueryToSave,
          normalizedQuery: failedQueryToSave ? normalizeQuery(failedQueryToSave) : null,
          userId: session?.user?.id,
          response: null, // No response due to error
          sources: [],
          success: false, // Mark as failed
          viewCount: 0,
        },
      })
      console.log(`✅ Failed query saved to database${isVoiceQuery ? ' (VOICE QUERY)' : ''}`)
    } catch (saveError) {
      console.error('Failed to save error query to database:', saveError)
    }
    
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

