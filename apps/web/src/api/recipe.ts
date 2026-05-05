import type {
    Recipe,
    RecipeListItem,
    NewRecipeBody,
    UpdateRecipeBody,
} from '../../../api/src/services/recipes/recipes.types';
import { buildApiUrl } from './client';

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

    async getRecipes(token?: string, tagSlugs: string[] = []): Promise<RecipeListItem[]> {
        const params = new URLSearchParams();
        tagSlugs.forEach((tagSlug) => params.append('tag', tagSlug));
        const queryString = params.size > 0 ? `?${params.toString()}` : '';

        const response = await fetch(`${buildApiUrl('/recipes')}${queryString}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to fetch recipes');
        }
        const data: GetRecipesResponse = await response.json();
        return data.recipes;
    },

    async getRecipeDetails(id: string, token?: string): Promise<Recipe> {
        const response = await fetch(buildApiUrl(`/recipes/${id}`), {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to fetch recipe details');
        }
        const data: GetRecipeDetailsResponse = await response.json();
        return data.recipe;
    },

    async updateRecipe(
        id: string,
        updatedRecipe: UpdateRecipeBody,
        token?: string
    ): Promise<any> {
        const response = await fetch(buildApiUrl(`/recipes/${id}`), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(updatedRecipe),
        });
        if (!response.ok) {
            throw await this.parseError(response, 'Failed to update recipe');
        }
        return response.json();
    },

    async createRecipe(recipe: NewRecipeBody, token?: string): Promise<any> {
        const response = await fetch(buildApiUrl('/recipes'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            throw await this.parseError(response, 'Failed to create recipe');
        }

        return response.json();
    },

    async deleteRecipe(id: string, token?: string): Promise<any> {
        const response = await fetch(buildApiUrl(`/recipes/${id}`), {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
            throw await this.parseError(response, 'Failed to delete recipe');
        }
    },
};

export default recipe;
