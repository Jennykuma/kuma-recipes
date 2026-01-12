import { prisma } from '../prisma';
import { Recipe } from './recipes.types';
import { RecipeListItem } from './recipes.types';

export async function listRecipes(): Promise<RecipeListItem[]> {
    return prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function recipeDetails(recipeId: string): Promise<Recipe> {
    return prisma.recipe.findUnique({
        where: {
            id: recipeId,
        },
    });
}
