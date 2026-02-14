import { keepPreviousData, useQuery } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from '../../../../api/src/services/tags/tags.types';

const useTagsQuery = (query: string) => {
    return useQuery<Tag[]>({
        queryKey: ['tags', query],
        queryFn: () => tagsApi.listTags(query),
        staleTime: 1000 * 30,
        placeholderData: keepPreviousData,
    });
};

export default useTagsQuery;
