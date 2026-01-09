-- CreateTable
CREATE TABLE "Garage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT,
    "bikeYear" TEXT,
    "bikeModel" TEXT,
    "bikeVariant" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Garage_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "activeBikeId" TEXT;

-- CreateIndex
CREATE INDEX "Garage_userId_idx" ON "Garage"("userId");

-- CreateIndex
CREATE INDEX "Garage_userId_isActive_idx" ON "Garage"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
