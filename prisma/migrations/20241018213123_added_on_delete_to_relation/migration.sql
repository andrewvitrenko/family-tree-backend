-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_childId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
