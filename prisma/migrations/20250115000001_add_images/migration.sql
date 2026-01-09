-- Add image fields to UserProfile and Garage

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN IF NOT EXISTS "profileImage" TEXT;

-- AlterTable
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "image" TEXT;
