/*
  Warnings:

  - You are about to drop the column `isWinner` on the `RecipeVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecipeVariant" DROP COLUMN "isWinner",
ADD COLUMN     "isBest" BOOLEAN NOT NULL DEFAULT false;
