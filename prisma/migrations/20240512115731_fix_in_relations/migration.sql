/*
  Warnings:

  - You are about to drop the `_ChildParents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChildParents" DROP CONSTRAINT "_ChildParents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChildParents" DROP CONSTRAINT "_ChildParents_B_fkey";

-- DropTable
DROP TABLE "_ChildParents";

-- DropEnum
DROP TYPE "RelationshipType";

-- CreateTable
CREATE TABLE "SpouseRelationship" (
    "id" UUID NOT NULL,
    "wifeId" UUID NOT NULL,
    "husbandId" UUID NOT NULL,

    CONSTRAINT "SpouseRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentRelationship" (
    "id" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "childId" UUID NOT NULL,

    CONSTRAINT "ParentRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpouseRelationship_wifeId_key" ON "SpouseRelationship"("wifeId");

-- CreateIndex
CREATE UNIQUE INDEX "SpouseRelationship_husbandId_key" ON "SpouseRelationship"("husbandId");

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_husbandId_fkey" FOREIGN KEY ("husbandId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_wifeId_fkey" FOREIGN KEY ("wifeId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentRelationship" ADD CONSTRAINT "ParentRelationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentRelationship" ADD CONSTRAINT "ParentRelationship_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
