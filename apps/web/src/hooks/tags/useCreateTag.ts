import { useMutation, useQueryClient } from '@tanstack/react-query';
import tagsApi from '../../api/tags';
import type { Tag } from '../../../../api/src/services/tags/tags.types';
import { useAuth } from '@clerk/clerk-react';

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
            queryClient.setQueriesData<Tag[]>({ queryKey: ['tags'] }, (existing = []) => {
                const found = existing.some((item) => item.id === tag.id);
                return found ? existing : [tag, ...existing];
            });
        },
    });
};

export default useCreateTag;
