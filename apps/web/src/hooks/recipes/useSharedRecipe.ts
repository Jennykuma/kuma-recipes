import { useQuery } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import type { Recipe } from '../../../../api/src/services/recipes/recipes.types';

const useSharedRecipe = (token: string) => {
  const {
    data: sharedRecipe,
    isLoading,
    error,
    refetch,
  } = useQuery<Recipe>({
    queryKey: ['sharedRecipe', token],
    queryFn: async () => {
      if (!token) throw new Error('Missing recipe token');

      const recipe = await recipeApi.getSharedRecipe(token);
      if (!recipe) throw new Error('Recipe not found');

      return recipe;
    },
    enabled: !!token,
  });

  return {
    sharedRecipe,
    isLoading,
    error,
    refetch,
  };
};

export default useSharedRecipe;
