import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tags as tagsApi } from '../api';
import type { Tag } from '../../../api/src/services/tags/tags.types';

const useTags = (query: string) => {
    return useQuery<Tag[]>({
        queryKey: ['tags', query],
        queryFn: () => tagsApi.listTags(query),
        staleTime: 1000 * 30,
        keepPreviousData: true,
    });
};

const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => tagsApi.createTag(name),
        onSuccess: (tag) => {
            queryClient.setQueriesData<Tag[]>({ queryKey: ['tags'] }, (existing = []) => {
                const found = existing.some((item) => item.id === tag.id);
                return found ? existing : [tag, ...existing];
            });
        },
    });
};

const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tagsApi.deleteTag(id),
        onSuccess: (_, id) => {
            queryClient.setQueriesData<Tag[]>({ queryKey: ['tags'] }, (existing = []) =>
                existing.filter((tag) => tag.id !== id)
            );
        },
    });
};

export { useTags, useCreateTag, useDeleteTag };
