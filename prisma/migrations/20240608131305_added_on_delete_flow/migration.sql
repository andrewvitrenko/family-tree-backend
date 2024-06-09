-- DropForeignKey
ALTER TABLE "ParentRelationship" DROP CONSTRAINT "ParentRelationship_childId_fkey";

-- DropForeignKey
ALTER TABLE "ParentRelationship" DROP CONSTRAINT "ParentRelationship_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_treeId_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpouseRelationship" DROP CONSTRAINT "SpouseRelationship_husbandId_fkey";

-- DropForeignKey
ALTER TABLE "SpouseRelationship" DROP CONSTRAINT "SpouseRelationship_wifeId_fkey";

-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_husbandId_fkey" FOREIGN KEY ("husbandId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_wifeId_fkey" FOREIGN KEY ("wifeId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentRelationship" ADD CONSTRAINT "ParentRelationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentRelationship" ADD CONSTRAINT "ParentRelationship_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
