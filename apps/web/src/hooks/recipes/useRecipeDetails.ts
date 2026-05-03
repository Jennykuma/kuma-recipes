import { useQuery } from '@tanstack/react-query';
import type { Recipe } from '../../../../api/src/services/recipes/recipes.types';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

const useRecipeDetails = (id: string) => {
    const { getToken } = useAuth();

    const {
        data: recipe,
        isLoading,
        error,
    } = useQuery<Recipe>({
        queryKey: ['recipe', id],
        queryFn: async () => {
            const token = await getToken();
            return recipeApi.getRecipeDetails(id, token ?? undefined);
        },
    });

    return {
        recipe,
        isLoading,
        error,
    };
};

export default useRecipeDetails;
