import { prisma } from '../../prisma.js';

export async function getSharedRecipe(token: string) {
  const sharedRecipeLink = await prisma.recipeShareLink.findFirst({
    where: {
      token,
      revokedAt: null,
    },
    include: {
      recipe: {
        include: { tags: true },
      },
    },
  });

  if (!sharedRecipeLink) return null;
  return sharedRecipeLink.recipe;
}
