-- CreateTable
CREATE TABLE "RecipeVariant" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "delta" JSONB,
    "rating" INTEGER,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "ingredients" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeAttempt" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "variantId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "changes" TEXT[],
    "note" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipePin" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "attachType" TEXT,
    "attachMatch" TEXT,
    "text" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "rotation" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipePin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeVariant_recipeId_order_idx" ON "RecipeVariant"("recipeId", "order");

-- CreateIndex
CREATE INDEX "RecipeAttempt_recipeId_idx" ON "RecipeAttempt"("recipeId");

-- CreateIndex
CREATE INDEX "RecipePin_recipeId_idx" ON "RecipePin"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeVariant" ADD CONSTRAINT "RecipeVariant_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeAttempt" ADD CONSTRAINT "RecipeAttempt_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeAttempt" ADD CONSTRAINT "RecipeAttempt_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "RecipeVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePin" ADD CONSTRAINT "RecipePin_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
