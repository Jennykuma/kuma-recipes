import type {
    Recipe,
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../../../api/src/services/recipes.types';

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

    async updateRecipe(id: string, updatedRecipe: UpdateRecipeBody): Promise<any> {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe),
        });
        return response.json();
    },

    async createRecipe(recipe: NewRecipeBody): Promise<any> {
        const response = await fetch(`/api/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to create recipe');
        }

        return response.json();
    },

    async deleteRecipe(id: string): Promise<any> {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to delete recipe');
        }
    },
};

export default recipe;
