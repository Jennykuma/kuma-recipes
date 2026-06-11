import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import type {
  NewRecipeBody,
  Recipe,
} from '../../../../api/src/services/recipes/recipes.types';
import { useAuth } from '@clerk/clerk-react';
import {
  MAX_SOURCE_PHOTO_SIZE,
  MAX_UPLOAD_PHOTO_SIZE,
  resizeImageFile,
} from '../../utils/resizeImageFile';

type CreateRecipeParams = {
  recipe: NewRecipeBody;
  photo?: File;
};

const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ recipe, photo }: CreateRecipeParams): Promise<Recipe> => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      const createdRecipe = await recipeApi.createRecipe(recipe, token);

      if (photo) {
        if (photo.size > MAX_SOURCE_PHOTO_SIZE) {
          throw new Error('Photo must be 15 MB or smaller');
        }

        const resizedPhoto = await resizeImageFile(photo);
        if (resizedPhoto.size > MAX_UPLOAD_PHOTO_SIZE) {
          throw new Error('Resized photo must be 5 MB or smaller');
        }

        const { imagePath } = await recipeApi.uploadRecipePhoto(
          createdRecipe.id,
          resizedPhoto,
          token
        );

        return {
          ...createdRecipe,
          imagePath,
        };
      }

      return createdRecipe;
    },
    onSuccess: (createdRecipe: Recipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', createdRecipe.id] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export default useCreateRecipe;
