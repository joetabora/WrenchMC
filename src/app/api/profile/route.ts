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
    
    // First, get basic profile fields that definitely exist
    // Skip activeBikeId for now - it may not exist if migrations haven't run
    profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        bikeYear: true,
        bikeModel: true,
        bikeVariant: true,
      },
    })
    
    // Skip activeBikeId query entirely - Garage feature disabled until migrations run
    activeBikeId = null

    if (!profile) {
      // Create profile if it doesn't exist
      try {
        profile = await prisma.userProfile.create({
          data: {
            userId: session.user.id,
          },
        })
      } catch (createError: any) {
        // If create fails due to schema issues, still return basic profile
        console.warn('Error creating profile:', createError)
        profile = {
          bikeYear: null,
          bikeModel: null,
          bikeVariant: null,
        }
      }
    }

    // Get active bike from garage if available (gracefully handle if Garage table doesn't exist yet)
    let activeBike: { bikeYear: string | null; bikeModel: string | null; bikeVariant: string | null } | null = null
    if (activeBikeId) {
      try {
        const bike = await prisma.garage.findUnique({
          where: { id: activeBikeId },
          select: {
            bikeYear: true,
            bikeModel: true,
            bikeVariant: true,
          },
        })
        activeBike = bike
      } catch (error: any) {
        // Garage table might not exist yet (migration not run)
        // Silently fall back to profile bike fields
        if (error?.message?.includes('does not exist') || error?.message?.includes('relation') || error?.message?.includes('table') || error?.code === 'P2021') {
          console.warn('Garage feature not available yet - migration may need to be run')
        } else {
          console.warn('Error loading active bike from garage:', error)
        }
      }
    }

    // Fallback to profile bike fields for backward compatibility
    return NextResponse.json({ 
      profile: {
        bike_year: activeBike?.bikeYear || profile.bikeYear,
        bike_model: activeBike?.bikeModel || profile.bikeModel,
        bike_variant: activeBike?.bikeVariant || profile.bikeVariant,
        activeBikeId: activeBikeId || null,
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



