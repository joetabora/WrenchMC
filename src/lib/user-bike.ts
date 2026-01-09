// Helper functions to get user's bike profile
import { auth } from './auth'
import { prisma } from './prisma'

export interface BikeProfile {
  year: string | null
  model: string | null
  variant: string | null
}

export async function getUserBikeProfile(): Promise<BikeProfile | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        bikeYear: true,
        bikeModel: true,
        bikeVariant: true,
      },
    })

    if (!profile) {
      return null
    }

    // Try to get activeBikeId separately (column might not exist if migration hasn't run)
    let activeBikeId: string | null = null
    try {
      const profileWithActiveBike = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
        select: {
          activeBikeId: true,
        },
      })
      activeBikeId = (profileWithActiveBike as any)?.activeBikeId || null
    } catch (error) {
      // activeBikeId column might not exist yet - that's okay
      console.warn('activeBikeId column not available:', error)
    }

    // If user has an active bike in garage, use that (gracefully handle if Garage table doesn't exist yet)
    if (activeBikeId) {
      try {
        const activeBike = await prisma.garage.findUnique({
          where: { id: activeBikeId },
          select: {
            bikeYear: true,
            bikeModel: true,
            bikeVariant: true,
          },
        })

        if (activeBike) {
          return {
            year: activeBike.bikeYear,
            model: activeBike.bikeModel,
            variant: activeBike.bikeVariant,
          }
        }
      } catch (error) {
        // Garage table might not exist yet (migration not run)
        // Silently fall back to profile bike fields
        console.warn('Garage table not available, using profile bike fields:', error)
      }
    }

    // Fallback to profile bike fields for backward compatibility
    return {
      year: profile.bikeYear,
      model: profile.bikeModel,
      variant: profile.bikeVariant,
    }
  } catch (error) {
    console.error('Error fetching user bike profile:', error)
    return null
  }
}

