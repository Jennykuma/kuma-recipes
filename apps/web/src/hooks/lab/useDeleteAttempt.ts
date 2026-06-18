import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { lab as labApi } from '../../api';
import { queryKeys } from '../../lib/queryKeys';

const useDeleteAttempt = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (attemptId: string) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.deleteAttempt(recipeId, attemptId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lab.detail(recipeId) });
    },
  });
};

export default useDeleteAttempt;
