import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET garage - Get all bikes in user's garage
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bikes = await prisma.garage.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ bikes })
  } catch (error: any) {
    console.error('Garage GET error:', error)
    return NextResponse.json({ error: error.message || 'Failed to load garage' }, { status: 500 })
  }
}

// POST garage - Add a new bike
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nickname, bike_year, bike_model, bike_variant, bike_image } = body

    // If this is the first bike, make it active
    const existingBikes = await prisma.garage.count({
      where: { userId: session.user.id },
    })

    const bike = await prisma.garage.create({
      data: {
        userId: session.user.id,
        nickname: nickname || null,
        bikeYear: bike_year || null,
        bikeModel: bike_model || null,
        bikeVariant: bike_variant || null,
        image: bike_image || null,
        isActive: existingBikes === 0, // First bike is active by default
      },
    })

    // Update profile activeBikeId if this is the active bike
    if (bike.isActive) {
      await prisma.userProfile.update({
        where: { userId: session.user.id },
        data: { activeBikeId: bike.id },
      })
    }

    return NextResponse.json({ bike, success: true })
  } catch (error: any) {
    console.error('Garage POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to add bike' }, { status: 500 })
  }
}

// PUT garage - Update an existing bike
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, nickname, bike_year, bike_model, bike_variant, bike_image } = body

    if (!id) {
      return NextResponse.json({ error: 'Bike ID required' }, { status: 400 })
    }

    // Verify bike belongs to user
    const existingBike = await prisma.garage.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existingBike) {
      return NextResponse.json({ error: 'Bike not found' }, { status: 404 })
    }

    const bike = await prisma.garage.update({
      where: { id },
      data: {
        nickname: nickname !== undefined ? (nickname || null) : undefined,
        bikeYear: bike_year !== undefined ? (bike_year || null) : undefined,
        bikeModel: bike_model !== undefined ? (bike_model || null) : undefined,
        bikeVariant: bike_variant !== undefined ? (bike_variant || null) : undefined,
        image: bike_image !== undefined ? (bike_image || null) : undefined,
      },
    })

    return NextResponse.json({ bike, success: true })
  } catch (error: any) {
    console.error('Garage PUT error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update bike' }, { status: 500 })
  }
}

// PATCH garage - Set active bike
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { activeBikeId } = body

    if (!activeBikeId) {
      return NextResponse.json({ error: 'Active bike ID required' }, { status: 400 })
    }

    // Verify bike belongs to user
    const bike = await prisma.garage.findFirst({
      where: { id: activeBikeId, userId: session.user.id },
    })

    if (!bike) {
      return NextResponse.json({ error: 'Bike not found' }, { status: 404 })
    }

    // Set all bikes to inactive
    await prisma.garage.updateMany({
      where: { userId: session.user.id },
      data: { isActive: false },
    })

    // Set selected bike to active
    await prisma.garage.update({
      where: { id: activeBikeId },
      data: { isActive: true },
    })

    // Update profile activeBikeId
    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: { activeBikeId },
      create: {
        userId: session.user.id,
        activeBikeId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Garage PATCH error:', error)
    return NextResponse.json({ error: error.message || 'Failed to set active bike' }, { status: 500 })
  }
}

// DELETE garage - Remove a bike
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bikeId } = body

    if (!bikeId) {
      return NextResponse.json({ error: 'Bike ID required' }, { status: 400 })
    }

    // Verify bike belongs to user
    const bike = await prisma.garage.findFirst({
      where: { id: bikeId, userId: session.user.id },
    })

    if (!bike) {
      return NextResponse.json({ error: 'Bike not found' }, { status: 404 })
    }

    const wasActive = bike.isActive

    // Delete the bike
    await prisma.garage.delete({
      where: { id: bikeId },
    })

    // If deleted bike was active, set another bike as active (or clear activeBikeId)
    if (wasActive) {
      const remainingBikes = await prisma.garage.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      })

      if (remainingBikes) {
        await prisma.garage.update({
          where: { id: remainingBikes.id },
          data: { isActive: true },
        })
        await prisma.userProfile.update({
          where: { userId: session.user.id },
          data: { activeBikeId: remainingBikes.id },
        })
      } else {
        await prisma.userProfile.update({
          where: { userId: session.user.id },
          data: { activeBikeId: null },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Garage DELETE error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete bike' }, { status: 500 })
  }
}
