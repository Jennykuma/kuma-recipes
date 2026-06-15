import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { CreatePinBody } from '../../../../api/src/services/lab/lab.types';
import { lab as labApi } from '../../api';

const useCreatePin = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (body: CreatePinBody) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.createPin(recipeId, body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab', recipeId] });
    },
  });
};

export default useCreatePin;
