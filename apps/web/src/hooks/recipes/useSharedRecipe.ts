import { useQuery } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import type { Recipe } from 'shared';
import { queryKeys } from '../../lib/queryKeys';

const useSharedRecipe = (token: string) => {
  const {
    data: sharedRecipe,
    isLoading,
    error,
    refetch,
  } = useQuery<Recipe>({
    queryKey: queryKeys.sharedRecipe.detail(token),
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
