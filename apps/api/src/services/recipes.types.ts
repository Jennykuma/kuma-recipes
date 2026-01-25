import { Prisma } from '@prisma/client';

export type Recipe = {
    id: string;
    ingredients: string[];
    notes: string;
    rating: number;
    remake: boolean;
    steps: string[];
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
    ingredients?: string[];
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: string[];
    tags?: string[];
}
