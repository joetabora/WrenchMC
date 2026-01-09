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
        activeBikeId: true,
      },
    })

    if (!profile) {
      return null
    }

    // If user has an active bike in garage, use that
    if (profile.activeBikeId) {
      const activeBike = await prisma.garage.findUnique({
        where: { id: profile.activeBikeId },
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

