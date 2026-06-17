import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { recipe as recipeApi } from '../../api';
import type { Recipe, RecipeListItem } from 'shared';

type DeleteRecipePhotoParams = {
  recipeId: string;
};

const useDeleteRecipePhoto = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ recipeId }: DeleteRecipePhotoParams) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return recipeApi.deleteRecipePhoto(recipeId, token);
    },
    onSuccess: (_data, { recipeId }) => {
      queryClient.setQueryData<Recipe>(['recipe', recipeId], (previous) =>
        previous ? { ...previous, imagePath: null } : previous
      );
      queryClient.setQueryData<RecipeListItem[]>(['recipes'], (previous) =>
        previous?.map((item) =>
          item.id === recipeId ? { ...item, imagePath: null } : item
        )
      );
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export default useDeleteRecipePhoto;
