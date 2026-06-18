import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';
import { queryKeys } from '../../lib/queryKeys';

const useDeleteRecipe = (id: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Missing recipe id');
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return recipeApi.deleteRecipe(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

export default useDeleteRecipe;
