import { keepPreviousData, useQuery } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from 'shared';
import { useAuth } from '@clerk/clerk-react';

const useTagsQuery = (query: string, enabled = true) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery<Tag[]>({
    queryKey: ['tags', query],
    enabled: isLoaded && isSignedIn && enabled,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return tagsApi.listTags(query, token);
    },
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
};

export default useTagsQuery;
