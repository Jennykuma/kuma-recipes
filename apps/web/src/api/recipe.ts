import type { Recipe, RecipeListItem } from '../../../api/src/services/recipes.types';

type GetRecipeDetailsResponse = {
    recipe: Recipe;
};

type GetRecipesResponse = {
    recipes: RecipeListItem[];
};

const recipe = {
    async getRecipes(): Promise<RecipeListItem[]> {
        const response = await fetch('/api/recipes');
        const data: GetRecipesResponse = await response.json();
        return data.recipes;
    },

    async getRecipeDetails(id: string): Promise<Recipe> {
        const response = await fetch(`/api/recipes/${id}`);
        const data: GetRecipeDetailsResponse = await response.json();
        return data.recipe;
    },

    async updateRecipeRating(id: string, rating: number): Promise<any> {
        const response = await fetch(`/api/recipes/${id}/rating`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to update recipe rating');
        }

        return response.json();
    },
};

export default recipe;
