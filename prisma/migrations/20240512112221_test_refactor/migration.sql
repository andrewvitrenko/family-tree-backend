/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `Relative` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[treeId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `treeId` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('SPOUSE', 'CHILD', 'PARENT');

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_userId_fkey";

-- DropForeignKey
ALTER TABLE "Relative" DROP CONSTRAINT "Relative_childId_fkey";

-- DropForeignKey
ALTER TABLE "Relative" DROP CONSTRAINT "Relative_parentId_fkey";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "birthDate",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "sex",
ADD COLUMN     "treeId" UUID NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateOfDeath" TIMESTAMP(3),
ADD COLUMN     "sex" "Sex" NOT NULL;

-- DropTable
DROP TABLE "Relative";

-- CreateTable
CREATE TABLE "Tree" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Tree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChildParents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChildParents_AB_unique" ON "_ChildParents"("A", "B");

-- CreateIndex
CREATE INDEX "_ChildParents_B_index" ON "_ChildParents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Person_treeId_key" ON "Person"("treeId");

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChildParents" ADD CONSTRAINT "_ChildParents_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChildParents" ADD CONSTRAINT "_ChildParents_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
