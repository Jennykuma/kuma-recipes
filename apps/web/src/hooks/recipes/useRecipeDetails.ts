import { useQuery } from '@tanstack/react-query';
import type { Recipe } from 'shared';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

const useRecipeDetails = (id: string) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const {
    data: recipe,
    isLoading,
    error,
    refetch,
  } = useQuery<Recipe>({
    queryKey: ['recipe', id],
    enabled: Boolean(id) && isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return recipeApi.getRecipeDetails(id, token);
    },
  });

  return {
    recipe,
    isLoading,
    error,
    refetch,
  };
};

export default useRecipeDetails;
