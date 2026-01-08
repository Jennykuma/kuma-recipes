import type { RecipeListItem } from '../../../api/src/services/recipes.types';

type GetRecipesResponse = {
    recipes: RecipeListItem[];
};

const recipe = {
    async getRecipes(): Promise<RecipeListItem[]> {
        const response = await fetch('/api/recipes');
        const data: GetRecipesResponse = await response.json();
        return data.recipes;
    },
};

export default recipe;
