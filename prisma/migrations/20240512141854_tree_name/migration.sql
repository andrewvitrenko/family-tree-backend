/*
  Warnings:

  - You are about to drop the column `dateOfDeath` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tree` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateOfDeath" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "sex" "Sex" NOT NULL;

-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateOfDeath";
