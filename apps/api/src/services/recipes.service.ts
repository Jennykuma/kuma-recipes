import { prisma } from '../prisma';
import { Recipe, RecipeListItem, NewRecipeBody } from './recipes.types';

export async function listRecipes(): Promise<RecipeListItem[]> {
    return prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function recipeDetails(recipeId: string): Promise<any> {
    return prisma.recipe.findUnique({
        where: {
            id: recipeId,
        },
    });
}

export async function createNewRecipe(recipeParams: NewRecipeBody) {
    const { title, ingredients, notes, rating, remake, steps, tags } = recipeParams;
    return prisma.recipe.create({
        data: {
            title,
            ingredients: ingredients,
            steps: steps,
            tags: tags,
            notes: notes ?? null,
            rating: rating ?? null,
            remake: remake ?? false,
        },
    });
}

export async function updateRecipeRating(recipeId: string, rating: number): Promise<any> {
    return prisma.recipe.update({
        where: {
            id: recipeId,
        },
        data: {
            rating,
        },
    });
}

export async function deleteRecipe(recipeId: string): Promise<any> {
    return prisma.recipe.delete({
        where: {
            id: recipeId,
        },
    });
}
