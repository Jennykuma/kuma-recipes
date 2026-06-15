import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { UpdateVariantBody } from '../../../../api/src/services/lab/lab.types';
import { lab as labApi } from '../../api';

type UpdateVariantParams = {
  variantId: string;
  body: UpdateVariantBody;
};

const useUpdateVariant = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ variantId, body }: UpdateVariantParams) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.updateVariant(recipeId, variantId, body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab', recipeId] });
    },
  });
};

export default useUpdateVariant;
