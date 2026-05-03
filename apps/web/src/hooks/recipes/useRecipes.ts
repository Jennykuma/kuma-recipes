import { useQuery } from '@tanstack/react-query';
import type { RecipeListItem } from '../../../../api/src/services/recipes/recipes.types';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

const useRecipes = () => {
    const { getToken } = useAuth();

    const {
        data: recipes,
        isLoading,
        error,
    } = useQuery<RecipeListItem[]>({
        queryKey: ['recipes'],
        queryFn: async () => {
            const token = await getToken();
            return recipeApi.getRecipes(token ?? undefined);
        },
    });

    return {
        recipes,
        isLoading,
        error,
    };
};

export default useRecipes;
