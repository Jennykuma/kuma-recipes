export const TAG_NAME_MAX_LENGTH = 24;

export type Tag = {
    id: string;
    name: string;
    slug: string;
    count?: number;
};

export type CreateTagBody = {
    name: string;
};
