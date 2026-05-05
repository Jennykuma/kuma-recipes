import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { RecipeListItem } from '../../../../api/src/services/recipes/recipes.types';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

const useRecipes = (tagSlugs: string[] = []) => {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const {
        data: recipes,
        isLoading,
        error,
    } = useQuery<RecipeListItem[]>({
        queryKey: ['recipes', tagSlugs],
        enabled: isLoaded && isSignedIn,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const token = await getToken();
            if (!token) {
                throw new Error('Missing auth token');
            }

            return recipeApi.getRecipes(token, tagSlugs);
        },
    });

    return {
        recipes,
        isLoading,
        error,
    };
};

export default useRecipes;
