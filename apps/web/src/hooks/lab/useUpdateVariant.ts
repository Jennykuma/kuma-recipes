import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { UpdateVariantBody } from 'shared';
import { lab as labApi } from '../../api';
import { queryKeys } from '../../lib/queryKeys';

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
      queryClient.invalidateQueries({ queryKey: queryKeys.lab.detail(recipeId) });
    },
  });
};

export default useUpdateVariant;
