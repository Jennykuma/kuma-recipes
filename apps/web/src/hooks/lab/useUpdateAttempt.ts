import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { UpdateAttemptBody } from 'shared';
import { lab as labApi } from '../../api';
import { queryKeys } from '../../lib/queryKeys';

type UpdateAttemptParams = {
  attemptId: string;
  body: UpdateAttemptBody;
};

const useUpdateAttempt = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ attemptId, body }: UpdateAttemptParams) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.updateAttempt(recipeId, attemptId, body, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lab.detail(recipeId) });
    },
  });
};

export default useUpdateAttempt;
