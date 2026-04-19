import type {
    Recipe,
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../../../api/src/services/recipes/recipes.types';

type GetRecipeDetailsResponse = {
    recipe: Recipe;
};

type GetRecipesResponse = {
    recipes: RecipeListItem[];
};

const recipe = {
    async parseError(response: Response, fallbackMessage: string): Promise<Error> {
        try {
            const error = await response.json();
            return new Error(error.message ?? fallbackMessage);
        } catch {
            return new Error(fallbackMessage);
        }
    },

    async getRecipes(): Promise<RecipeListItem[]> {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to fetch recipes');
        }
        const data: GetRecipesResponse = await response.json();
        return data.recipes;
    },

    async getRecipeDetails(id: string): Promise<Recipe> {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to fetch recipe details');
        }
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
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to update recipe');
        }
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
            throw await this.parseError(response, 'Failed to create recipe');
        }

        return response.json();
    },

    async deleteRecipe(id: string): Promise<any> {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw await this.parseError(response, 'Failed to delete recipe');
        }
    },
};

export default recipe;
