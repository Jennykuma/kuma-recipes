-- Backfill stable ids onto existing ingredient/step items
UPDATE "RecipeVariant"
SET ingredients = (
  SELECT coalesce(jsonb_agg(elem || jsonb_build_object('id', gen_random_uuid()::text)), '[]'::jsonb)
  FROM jsonb_array_elements(ingredients) elem
),
steps = (
  SELECT coalesce(jsonb_agg(elem || jsonb_build_object('id', gen_random_uuid()::text)), '[]'::jsonb)
  FROM jsonb_array_elements(steps) elem
);

-- Existing pins have no reliable mapping to a specific variant/item, so they are dropped
DELETE FROM "RecipePin";

-- DropForeignKey (old recipe-scoped pin had no variant/item attachment columns)
ALTER TABLE "RecipePin" DROP COLUMN "attachType";
ALTER TABLE "RecipePin" DROP COLUMN "attachMatch";

-- AlterTable
ALTER TABLE "RecipePin" ADD COLUMN "variantId" TEXT NOT NULL;
ALTER TABLE "RecipePin" ADD COLUMN "itemId" TEXT;

-- CreateIndex
CREATE INDEX "RecipePin_variantId_idx" ON "RecipePin"("variantId");

-- AddForeignKey
ALTER TABLE "RecipePin" ADD CONSTRAINT "RecipePin_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "RecipeVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
