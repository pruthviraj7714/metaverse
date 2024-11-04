-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_spaceId_fkey";

-- AlterTable
ALTER TABLE "Element" ALTER COLUMN "spaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
