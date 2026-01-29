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
    source: string;
    createdAt: string;
    updatedAt: string;
};

export type RecipeListItem = {
    id: string;
    rating: number;
    title: string;
};

export type NewRecipeBody = {
    title: string;
    ingredients?: string[];
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: string[];
    tags?: string[];
    source?: string;
};

export type UpdateRecipeBody = Partial<{
    title: string;
    notes: string;
    source: string;
    remake: boolean;
    ingredients: string[];
    steps: string[];
    tags: string[];
    rating: number;
}>;

export type IngredientsForm = {
    ingredients: { ingredient: string }[];
};

export type StepsForm = {
    steps: { step: string }[];
};
