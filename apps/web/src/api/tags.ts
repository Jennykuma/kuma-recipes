import type { Tag } from '../../../api/src/services/tags/tags.types';
import { buildApiUrl } from './client';

type ListTagsResponse = {
    tags: Tag[];
};

type CreateTagResponse = {
    tag: Tag;
};

const tags = {
    async listTags(query: string): Promise<Tag[]> {
        const url = buildApiUrl('/tags');
        const response = await fetch(`${url}?query=${encodeURIComponent(query)}`);
        const data: ListTagsResponse = await response.json();
        return data.tags ?? [];
    },

    async createTag(name: string): Promise<Tag> {
        const response = await fetch(buildApiUrl('/tags'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const data: CreateTagResponse = await response.json();
        return data.tag;
    },

    async deleteTag(id: string): Promise<void> {
        const response = await fetch(buildApiUrl(`/tags/${encodeURIComponent(id)}`), {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to delete tag');
        }
    },
};

export default tags;
