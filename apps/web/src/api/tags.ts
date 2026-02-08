import type { Tag } from '../../../api/src/services/tags/tags.types';

type ListTagsResponse = {
    tags: Tag[];
};

type CreateTagResponse = {
    tag: Tag;
};

const tags = {
    async listTags(query: string): Promise<Tag[]> {
        const response = await fetch(`/api/tags?query=${encodeURIComponent(query)}`);
        const data: ListTagsResponse = await response.json();
        return data.tags ?? [];
    },

    async createTag(name: string): Promise<Tag> {
        const response = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const data: CreateTagResponse = await response.json();
        return data.tag;
    },

    async deleteTag(id: string): Promise<void> {
        const response = await fetch(`/api/tags/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message ?? 'Failed to delete tag');
        }
    },
};

export default tags;
