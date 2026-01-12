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
};

export default recipe;
