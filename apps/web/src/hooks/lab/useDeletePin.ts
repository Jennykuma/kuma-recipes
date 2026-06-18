import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { lab as labApi } from '../../api';
import { queryKeys } from '../../lib/queryKeys';

const useDeletePin = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (pinId: string) => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.deletePin(recipeId, pinId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lab.detail(recipeId) });
    },
  });
};

export default useDeletePin;
