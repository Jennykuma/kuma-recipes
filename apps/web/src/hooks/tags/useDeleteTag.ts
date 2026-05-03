import { useMutation, useQueryClient } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from '../../../../api/src/services/tags/tags.types';
import { useAuth } from '@clerk/clerk-react';

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
            queryClient.setQueriesData<Tag[]>({ queryKey: ['tags'] }, (existing = []) =>
                existing.filter((tag) => tag.id !== id)
            );
        },
    });
};

export default useDeleteTag;
