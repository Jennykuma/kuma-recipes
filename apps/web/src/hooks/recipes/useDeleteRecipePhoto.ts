import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { recipe as recipeApi } from '../../api';
import type { Recipe, RecipeListItem } from 'shared';
import { queryKeys } from '../../lib/queryKeys';

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
      queryClient.setQueryData<Recipe>(queryKeys.recipe.detail(recipeId), (previous) =>
        previous ? { ...previous, imagePath: null } : previous
      );
      queryClient.setQueryData<RecipeListItem[]>(queryKeys.recipes.all, (previous) =>
        previous?.map((item) =>
          item.id === recipeId ? { ...item, imagePath: null } : item
        )
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.detail(recipeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
    },
  });
};

export default useDeleteRecipePhoto;
