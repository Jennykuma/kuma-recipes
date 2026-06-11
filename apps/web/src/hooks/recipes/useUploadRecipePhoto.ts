import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { recipe as recipeApi } from '../../api';
import {
  MAX_SOURCE_PHOTO_SIZE,
  MAX_UPLOAD_PHOTO_SIZE,
  resizeImageFile,
} from '../../utils/resizeImageFile';

type UploadRecipePhotoParams = {
  recipeId: string;
  photo: File;
};

const useUploadRecipePhoto = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ recipeId, photo }: UploadRecipePhotoParams) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      if (photo.size > MAX_SOURCE_PHOTO_SIZE) {
        throw new Error('Photo must be 15 MB or smaller');
      }

      const resizedPhoto = await resizeImageFile(photo);
      if (resizedPhoto.size > MAX_UPLOAD_PHOTO_SIZE) {
        throw new Error('Resized photo must be 5 MB or smaller');
      }

      return recipeApi.uploadRecipePhoto(recipeId, resizedPhoto, token);
    },
    onSuccess: (_data, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export default useUploadRecipePhoto;
