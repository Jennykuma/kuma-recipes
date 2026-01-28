import { useQuery } from '@tanstack/react-query';
import type { Recipe } from '../../../api/src/services/recipes.types';
import { recipe as recipeApi } from '../api';

const useRecipeDetails = (id: string) => {
    const {
        data: recipe,
        isLoading,
        error,
    } = useQuery<Recipe>({
        queryKey: ['recipe', id],
        queryFn: () => recipeApi.getRecipeDetails(id),
    });

    return {
        recipe,
        isLoading,
        error,
    };
};

export default useRecipeDetails;
