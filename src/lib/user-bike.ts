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

    // Garage feature temporarily disabled - skip activeBikeId logic

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

