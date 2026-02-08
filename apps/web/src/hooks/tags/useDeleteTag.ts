import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tags as tagsApi } from '../../api';
import type { Tag } from '../../../../api/src/services/tags/tags.types';

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

export default useDeleteTag;
