/*
  Warnings:

  - Added the required column `backgroundBaseUrl` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "backgroundBaseUrl" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
