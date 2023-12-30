-- DropForeignKey
ALTER TABLE "Relative" DROP CONSTRAINT "Relative_childId_fkey";

-- DropForeignKey
ALTER TABLE "Relative" DROP CONSTRAINT "Relative_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Relative" ADD CONSTRAINT "Relative_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relative" ADD CONSTRAINT "Relative_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
