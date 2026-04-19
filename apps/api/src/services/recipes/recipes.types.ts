import { type Tag } from '../tags/tags.types.js';

export type Recipe = {
    id: string;
    ingredients: string[];
    notes: string;
    rating: number;
    remake: boolean;
    steps: string[];
    tags: Tag[];
    title: string;
    source: string;
    createdAt: string;
    updatedAt: string;
};

export type RecipeListItem = {
    id: string;
    rating: number;
    title: string;
    tags?: Tag[];
};

export type NewRecipeBody = {
    title: string;
    ingredients?: string[];
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: string[];
    tagIds?: string[];
    source?: string;
};

export type UpdateRecipeBody = Partial<{
    title: string;
    notes: string;
    source: string;
    remake: boolean;
    ingredients: string[];
    steps: string[];
    tagIds?: string[];
    rating: number;
}>;

export type IngredientsForm = {
    ingredients: { ingredient: string }[];
};

export type StepsForm = {
    steps: { step: string }[];
};
