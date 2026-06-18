import { useMutation, useQueryClient } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from 'shared';
import { useAuth } from '@clerk/clerk-react';
import { queryKeys } from '../../lib/queryKeys';

const useCreateTag = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (name: string) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return tagsApi.createTag(name, token);
    },
    onSuccess: (tag: Tag) => {
      queryClient.setQueriesData<Tag[]>(
        { queryKey: queryKeys.tags.all },
        (existing = []) => {
          const found = existing.some((item) => item.id === tag.id);
          return found ? existing : [tag, ...existing];
        }
      );
    },
  });
};

export default useCreateTag;
