/*
  Warnings:

  - Added the required column `updatedAt` to the `QueryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueryHistory" ADD COLUMN     "normalizedQuery" TEXT,
ADD COLUMN     "specs" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "youtubeVideos" JSONB;

-- CreateIndex
CREATE INDEX "QueryHistory_normalizedQuery_idx" ON "QueryHistory"("normalizedQuery");
