/*
  Warnings:

  - You are about to drop the column `rating` on the `RecipeVariant` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `RecipeVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecipeVariant" DROP COLUMN "rating",
DROP COLUMN "tag";
