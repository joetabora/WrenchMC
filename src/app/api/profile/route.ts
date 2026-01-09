import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user profile
    // Always use explicit select to avoid issues if activeBikeId column doesn't exist yet
    let profile: any
    let activeBikeId: string | null = null
    
    // Get or create user profile
    profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await prisma.userProfile.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    // Get active bike from garage if available
    let activeBike: { bikeYear: string | null; bikeModel: string | null; bikeVariant: string | null } | null = null
    if (profile.activeBikeId) {
      try {
        const bike = await prisma.garage.findUnique({
          where: { id: profile.activeBikeId },
          select: {
            bikeYear: true,
            bikeModel: true,
            bikeVariant: true,
          },
        })
        activeBike = bike
      } catch (error: any) {
        console.warn('Error loading active bike from garage:', error)
      }
    }

    // Fallback to profile bike fields for backward compatibility
    return NextResponse.json({ 
      profile: {
        bike_year: activeBike?.bikeYear || profile.bikeYear,
        bike_model: activeBike?.bikeModel || profile.bikeModel,
        bike_variant: activeBike?.bikeVariant || profile.bikeVariant,
        activeBikeId: profile.activeBikeId || null,
      }
    })
  } catch (error: any) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: error.message || 'Failed to load profile' }, { status: 500 })
  }
}

// POST/PUT profile - Updates bike info or user name
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bike_year, bike_model, bike_variant, name } = body

    // Update user name if provided
    if (name !== undefined) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name || null },
      })
    }

    // Upsert bike profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        bikeYear: bike_year || null,
        bikeModel: bike_model || null,
        bikeVariant: bike_variant || null,
      },
      create: {
        userId: session.user.id,
        bikeYear: bike_year || null,
        bikeModel: bike_model || null,
        bikeVariant: bike_variant || null,
      },
    })

    return NextResponse.json({ 
      profile: {
        bike_year: profile.bikeYear,
        bike_model: profile.bikeModel,
        bike_variant: profile.bikeVariant,
      },
      success: true 
    })
  } catch (error: any) {
    console.error('Profile POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to save profile' }, { status: 500 })
  }
}



