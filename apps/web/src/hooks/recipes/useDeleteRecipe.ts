import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import { useAuth } from '@clerk/clerk-react';

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
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export default useDeleteRecipe;
