// Forum posts API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.forumPost.findMany({
      where: {
        locked: false,
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        model: {
          select: {
            name: true,
            variant: true,
          },
        },
      },
    })

    return NextResponse.json({ posts })
  } catch (error: any) {
    console.error('Forum posts API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

