import { Prisma } from '@prisma/client';

export type Recipe = {
    id: string;
    ingredients: JSON;
    notes: string;
    rating: number;
    remake: boolean;
    steps: JSON;
    tags: string[];
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type RecipeListItem = {
    id: string;
    rating: number;
    title: string;
};

export interface NewRecipeBody {
    title: string;
    ingredients?: Prisma.InputJsonValue;
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: Prisma.InputJsonValue;
    tags?: string[];
}
