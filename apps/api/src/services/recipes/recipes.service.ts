import { prisma } from '../../prisma.js';
import {
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../recipes/recipes.types.js';
import { randomBytes } from 'node:crypto';

function createShareToken() {
    return randomBytes(32).toString('base64url');
}

function normalizeTitle(title: string) {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
        throw new Error('Title is required');
    }

    return normalizedTitle;
}

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
    tagSlugs: string[] = []
): Promise<RecipeListItem[]> {
    const tagFilters = tagSlugs.map((slug) => ({
        tags: { some: { slug, userId } },
    }));

    const recipes = await prisma.recipe.findMany({
        where: {
            userId,
            ...(tagFilters.length ? { AND: tagFilters } : {}),
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
    const {
        title,
        ingredients,
        notes,
        rating,
        remake,
        steps,
        tagIds,
        source,
        yield: recipeYield,
    } = recipeParams;
    const ownedTagIds = await resolveOwnedTagIds(userId, tagIds);
    const normalizedTitle = normalizeTitle(title);
    const normalizedSource = source?.trim();
    return prisma.recipe.create({
        data: {
            userId,
            title: normalizedTitle,
            ingredients: ingredients || [],
            steps: steps || [],
            notes: notes ?? null,
            rating: rating ?? null,
            remake: remake ?? false,
            source: normalizedSource ? normalizedSource : null,
            yield: recipeYield?.trim() ? recipeYield.trim() : null,

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
    const { yield: recipeYield, ...otherUpdates } = rest;
    const ownedTagIds = tagIds ? await resolveOwnedTagIds(userId, tagIds) : null;
    const normalizedTitle =
        rest.title === undefined ? undefined : normalizeTitle(rest.title);
    const normalizedYield =
        recipeYield === undefined
            ? undefined
            : recipeYield.trim()
              ? recipeYield.trim()
              : null;
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
            ...otherUpdates,
            ...(normalizedTitle !== undefined ? { title: normalizedTitle } : {}),
            ...(normalizedYield !== undefined ? { yield: normalizedYield } : {}),
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

export async function createRecipeShareLink(recipeId: string, userId: string) {
    const recipe = await prisma.recipe.findFirst({
        where: { id: recipeId, userId },
        select: { id: true },
    });

    if (!recipe) return null;

    const existingShareLink = await prisma.recipeShareLink.findFirst({
        where: {
            recipeId,
            revokedAt: null,
        },
        orderBy: { createdAt: 'desc' },
    });

    if (existingShareLink) {
        return existingShareLink;
    }

    return prisma.recipeShareLink.create({
        data: {
            recipeId,
            token: createShareToken(),
        },
    });
}
