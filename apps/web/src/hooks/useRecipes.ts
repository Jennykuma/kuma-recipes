import { useQuery } from '@tanstack/react-query';
import type { RecipeListItem } from '../../../api/src/services/recipes.types';
import { recipe as recipeApi } from '../api';

const useRecipes = () => {
    const {
        data: recipes,
        isLoading,
        error,
    } = useQuery<RecipeListItem[]>({
        queryKey: ['recipes'],
        queryFn: () => recipeApi.getRecipes(),
    });

    return {
        recipes,
        isLoading,
        error,
    };
};

export default useRecipes;
