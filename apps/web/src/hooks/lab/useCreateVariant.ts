import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { CreateVariantBody } from '../../../../api/src/services/lab/lab.types';
import { lab as labApi } from '../../api';

const useCreateVariant = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (body: CreateVariantBody) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.createVariant(recipeId, body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab', recipeId] });
    },
  });
};

export default useCreateVariant;
