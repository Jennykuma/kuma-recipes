import type { Tag } from '../../../api/src/services/tags/tags.types';
import { buildApiUrl } from './client';

type ListTagsResponse = {
    tags: Tag[];
};

type CreateTagResponse = {
    tag: Tag;
};

const tags = {
    async listTags(query: string, token?: string): Promise<Tag[]> {
        const url = buildApiUrl('/tags');
        const response = await fetch(`${url}?query=${encodeURIComponent(query)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data: ListTagsResponse = await response.json();
        return data.tags ?? [];
    },

    async createTag(name: string, token?: string): Promise<Tag> {
        const response = await fetch(buildApiUrl('/tags'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ name }),
        });
        const data: CreateTagResponse = await response.json();
        return data.tag;
    },

    async deleteTag(id: string, token?: string): Promise<void> {
        const response = await fetch(buildApiUrl(`/tags/${encodeURIComponent(id)}`), {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to delete tag');
        }
    },
};

export default tags;
