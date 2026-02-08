import { useMutation, useQueryClient } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from '../../../../api/src/services/tags/tags.types';

const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => tagsApi.createTag(name),
        onSuccess: (tag: Tag) => {
            queryClient.setQueriesData<Tag[]>({ queryKey: ['tags'] }, (existing = []) => {
                const found = existing.some((item) => item.id === tag.id);
                return found ? existing : [tag, ...existing];
            });
        },
    });
};

export default useCreateTag;
