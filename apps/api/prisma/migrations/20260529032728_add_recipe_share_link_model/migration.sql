-- CreateTable
CREATE TABLE "RecipeShareLink" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeShareLink_token_key" ON "RecipeShareLink"("token");

-- CreateIndex
CREATE INDEX "RecipeShareLink_recipeId_idx" ON "RecipeShareLink"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeShareLink" ADD CONSTRAINT "RecipeShareLink_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
