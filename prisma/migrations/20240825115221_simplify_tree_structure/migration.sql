/*
  Warnings:

  - You are about to drop the column `treeId` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `ParentRelationship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpouseRelationship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nodeId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nodeId` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
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

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "treeId",
DROP COLUMN "userId",
ADD COLUMN     "nodeId" UUID NOT NULL;

-- DropTable
DROP TABLE "ParentRelationship";

-- DropTable
DROP TABLE "SpouseRelationship";

-- CreateTable
CREATE TABLE "Node" (
    "id" UUID NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "treeId" UUID NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "targetId" UUID NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Relation_sourceId_targetId_key" ON "Relation"("sourceId", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Person_nodeId_key" ON "Person"("nodeId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
