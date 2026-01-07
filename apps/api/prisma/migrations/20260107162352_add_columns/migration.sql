/*
  Warnings:

  - You are about to drop the column `recipe` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "recipe",
ADD COLUMN     "ingredients" JSONB,
ADD COLUMN     "steps" JSONB,
ADD COLUMN     "tags" TEXT[];
