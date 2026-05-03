import { useQuery } from '@tanstack/react-query';
import type { RecipeListItem } from '../../../../api/src/services/recipes/recipes.types';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

const useRecipes = () => {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const {
        data: recipes,
        isLoading,
        error,
    } = useQuery<RecipeListItem[]>({
        queryKey: ['recipes'],
        enabled: isLoaded && isSignedIn,
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                throw new Error('Missing auth token');
            }

            return recipeApi.getRecipes(token);
        },
    });

    return {
        recipes,
        isLoading,
        error,
    };
};

export default useRecipes;
