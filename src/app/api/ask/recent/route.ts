// API endpoint to get recent queries for the Ask page
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Get recent successful queries, ordered by view count and recency
    const queries = await prisma.queryHistory.findMany({
      where: {
        success: true,
        response: { not: null },
      },
      orderBy: [
        { viewCount: 'desc' }, // Most viewed first
        { createdAt: 'desc' }, // Then most recent
      ],
      take: 20,
      select: {
        id: true,
        query: true,
        viewCount: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ queries })
  } catch (error: any) {
    console.error('Recent queries error:', error)
    return NextResponse.json({ queries: [] }, { status: 500 })
  }
}

