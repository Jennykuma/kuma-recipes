-- Add owner columns.
ALTER TABLE "Recipe" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "Tag" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Ensure existing records are owned before NOT NULL constraints.
UPDATE "Recipe" SET "userId" = 'legacy' WHERE "userId" IS NULL;
UPDATE "Tag" SET "userId" = 'legacy' WHERE "userId" IS NULL;

ALTER TABLE "Recipe" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Tag" ALTER COLUMN "userId" SET NOT NULL;

-- Drop old global uniqueness and replace with per-user uniqueness.
DROP INDEX IF EXISTS "Tag_slug_key";
CREATE UNIQUE INDEX "Tag_userId_slug_key" ON "Tag"("userId", "slug");

-- Helpful lookup indexes.
CREATE INDEX IF NOT EXISTS "Recipe_userId_createdAt_idx" ON "Recipe"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Tag_userId_name_idx" ON "Tag"("userId", "name");
