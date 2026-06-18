import { useMutation, useQueryClient } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from 'shared';
import { useAuth } from '@clerk/clerk-react';
import { queryKeys } from '../../lib/queryKeys';

const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return tagsApi.deleteTag(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.setQueriesData<Tag[]>(
        { queryKey: queryKeys.tags.all },
        (existing = []) => existing.filter((tag) => tag.id !== id)
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.all });
    },
  });
};

export default useDeleteTag;
