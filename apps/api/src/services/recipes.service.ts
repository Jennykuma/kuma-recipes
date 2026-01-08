import { prisma } from '../prisma';
import { RecipeListItem } from './recipes.types';

export async function listRecipes(): Promise<RecipeListItem[]> {
    return prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
    });
}
