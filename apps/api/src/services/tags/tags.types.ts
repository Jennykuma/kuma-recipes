export type Tag = {
    id: string;
    name: string;
    slug: string;
    count?: number;
};

export type CreateTagBody = {
    name: string;
};
