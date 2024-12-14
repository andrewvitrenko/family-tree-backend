/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Relation` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `Relation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId,childId]` on the table `Relation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `childId` to the `Relation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_targetId_fkey";

-- DropIndex
DROP INDEX "Relation_sourceId_targetId_key";

-- AlterTable
ALTER TABLE "Relation" DROP COLUMN "sourceId",
DROP COLUMN "targetId",
ADD COLUMN     "childId" UUID NOT NULL,
ADD COLUMN     "parentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Relation_parentId_childId_key" ON "Relation"("parentId", "childId");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
