import { keepPreviousData, useQuery } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from '../../../../api/src/services/tags/tags.types';
import { useAuth } from '@clerk/clerk-react';

const useTagsQuery = (query: string) => {
    const { getToken } = useAuth();

    return useQuery<Tag[]>({
        queryKey: ['tags', query],
        queryFn: async () => {
            const token = await getToken();
            return tagsApi.listTags(query, token ?? undefined);
        },
        staleTime: 1000 * 30,
        placeholderData: keepPreviousData,
    });
};

export default useTagsQuery;
