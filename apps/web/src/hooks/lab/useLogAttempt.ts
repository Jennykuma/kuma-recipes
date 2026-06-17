import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { CreateAttemptBody } from 'shared';
import { lab as labApi } from '../../api';

const useLogAttempt = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (body: CreateAttemptBody) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.logAttempt(recipeId, body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab', recipeId] });
    },
  });
};

export default useLogAttempt;
