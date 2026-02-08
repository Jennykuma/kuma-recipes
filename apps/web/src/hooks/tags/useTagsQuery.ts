import { useQuery } from '@tanstack/react-query';
import { tags as tagsApi } from '../../api';
import type { Tag } from '../../../../api/src/services/tags/tags.types';

const useTagsQuery = (query: string) => {
    return useQuery<Tag[]>({
        queryKey: ['tags', query],
        queryFn: () => tagsApi.listTags(query),
        staleTime: 1000 * 30,
        keepPreviousData: true,
    });
};

export default useTagsQuery;
