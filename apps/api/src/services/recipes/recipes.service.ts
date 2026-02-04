import { prisma } from '../../prisma';
import {
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../recipes/recipes.types';

export async function listRecipes(tagSlug?: string): Promise<RecipeListItem[]> {
    const recipes = await prisma.recipe.findMany({
        where: tagSlug ? { tags: { some: { slug: tagSlug } } } : undefined,
        orderBy: { createdAt: 'desc' },
        include: { tags: true },
    });

    return recipes.map((recipe) => ({
        ...recipe,
        rating: recipe.rating ?? 0, // Provide a default value if rating is null
    }));
}

export async function recipeDetails(recipeId: string): Promise<any> {
    return prisma.recipe.findUnique({
        where: { id: recipeId },
        include: { tags: true },
    });
}

export async function createNewRecipe(recipeParams: NewRecipeBody) {
    const { title, ingredients, notes, rating, remake, steps, tagIds, source } =
        recipeParams;
    const normalizedSource = source?.trim();
    return prisma.recipe.create({
        data: {
            title,
            ingredients: ingredients || [],
            steps: steps || [],
            notes: notes ?? null,
            rating: rating ?? null,
            remake: remake ?? false,
            source: normalizedSource ? normalizedSource : null,

            // connect tags
            ...(tagIds?.length
                ? { tags: { connect: tagIds.map((id) => ({ id })) } }
                : {}),
        },
        include: { tags: true },
    });
}

export async function updateRecipe(recipeId: string, updatedRecipe: UpdateRecipeBody) {
    const { tagIds, ...rest } = updatedRecipe;

    return prisma.recipe.update({
        where: { id: recipeId },
        data: {
            ...rest,
            ...(tagIds ? { tags: { set: tagIds.map((id) => ({ id })) } } : {}),
        },
        include: { tags: true },
    });
}

export async function deleteRecipe(recipeId: string): Promise<any> {
    return prisma.recipe.delete({
        where: { id: recipeId },
    });
}
