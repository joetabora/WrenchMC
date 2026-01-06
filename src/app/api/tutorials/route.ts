// YouTube tutorials API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { searchYouTubeVideos } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q') || 'Harley Davidson maintenance'

    const videos = await searchYouTubeVideos(query, 20)

    return NextResponse.json({ videos })
  } catch (error: any) {
    console.error('Tutorials API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tutorials' },
      { status: 500 }
    )
  }
}

