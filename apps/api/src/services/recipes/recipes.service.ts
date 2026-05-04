import { prisma } from '../../prisma.js';
import {
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../recipes/recipes.types.js';

async function resolveOwnedTagIds(userId: string, tagIds: string[] = []) {
    if (!tagIds.length) return [];

    const ownedTags = await prisma.tag.findMany({
        where: {
            userId,
            id: { in: tagIds },
        },
        select: { id: true },
    });

    if (ownedTags.length !== tagIds.length) {
        throw new Error('One or more tags do not belong to this user');
    }

    return ownedTags.map((tag) => tag.id);
}

export async function listRecipes(
    userId: string,
    tagSlug?: string
): Promise<RecipeListItem[]> {
    const recipes = await prisma.recipe.findMany({
        where: {
            userId,
            ...(tagSlug ? { tags: { some: { slug: tagSlug, userId } } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: { tags: true },
    });

    return recipes.map((recipe) => ({
        ...recipe,
        rating: recipe.rating ?? 0, // Provide a default value if rating is null
    }));
}

export async function recipeDetails(recipeId: string, userId: string): Promise<any> {
    return prisma.recipe.findFirst({
        where: { id: recipeId, userId },
        include: { tags: true },
    });
}

export async function createNewRecipe(recipeParams: NewRecipeBody, userId: string) {
    const { title, ingredients, notes, rating, remake, steps, tagIds, source } =
        recipeParams;
    const ownedTagIds = await resolveOwnedTagIds(userId, tagIds);
    const normalizedSource = source?.trim();
    return prisma.recipe.create({
        data: {
            userId,
            title,
            ingredients: ingredients || [],
            steps: steps || [],
            notes: notes ?? null,
            rating: rating ?? null,
            remake: remake ?? false,
            source: normalizedSource ? normalizedSource : null,

            // connect tags
            ...(ownedTagIds.length
                ? { tags: { connect: ownedTagIds.map((id) => ({ id })) } }
                : {}),
        },
        include: { tags: true },
    });
}

export async function updateRecipe(
    recipeId: string,
    updatedRecipe: UpdateRecipeBody,
    userId: string
) {
    const { tagIds, ...rest } = updatedRecipe;
    const ownedTagIds = tagIds ? await resolveOwnedTagIds(userId, tagIds) : null;
    const recipe = await prisma.recipe.findFirst({
        where: { id: recipeId, userId },
        select: { id: true },
    });

    if (!recipe) {
        return null;
    }

    await prisma.recipe.update({
        where: { id: recipeId },
        data: {
            ...rest,
            ...(ownedTagIds ? { tags: { set: ownedTagIds.map((id) => ({ id })) } } : {}),
        },
    });

    return recipeDetails(recipeId, userId);
}

export async function deleteRecipe(recipeId: string, userId: string): Promise<boolean> {
    const deleted = await prisma.recipe.deleteMany({
        where: { id: recipeId, userId },
    });
    return deleted.count > 0;
}
