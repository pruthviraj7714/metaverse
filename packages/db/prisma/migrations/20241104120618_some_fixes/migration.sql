/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Space` table. All the data in the column will be lost.
  - Added the required column `mapId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_spaceId_fkey";

-- DropIndex
DROP INDEX "Map_spaceId_key";

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "spaceId",
ADD COLUMN     "mapId" TEXT;

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "spaceId";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "size",
ADD COLUMN     "mapId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE SET NULL ON UPDATE CASCADE;
