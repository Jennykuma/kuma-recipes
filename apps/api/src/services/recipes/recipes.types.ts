import { z } from 'zod';
import { type Tag } from '../tags/tags.types.js';

export const NewRecipeBodySchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()).optional(),
  notes: z.string().optional(),
  rating: z.number().int().optional(),
  steps: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  source: z.string().optional(),
  imagePath: z.string().nullable().optional(),
  yield: z.string().optional(),
});

export const UpdateRecipeBodySchema = z
  .object({
    title: z.string(),
    notes: z.string(),
    source: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    tagIds: z.array(z.string()),
    rating: z.number().int(),
    imagePath: z.string().nullable(),
    yield: z.string(),
  })
  .partial();

export type NewRecipeBody = z.infer<typeof NewRecipeBodySchema>;
export type UpdateRecipeBody = z.infer<typeof UpdateRecipeBodySchema>;

export type Recipe = {
  id: string;
  ingredients: string[];
  notes: string;
  rating: number;
  steps: string[];
  tags: Tag[];
  title: string;
  source: string;
  imagePath?: string | null;
  yield?: string;
  createdAt: string;
  updatedAt: string;
};

export type RecipeListItem = {
  id: string;
  rating: number;
  title: string;
  tags?: Tag[];
  imagePath?: string | null;
};

export type ShareLinkItem = {
  id: string;
  recipeId: string;
  token: string;
  revokedAt: Date | null;
  createdAt: Date;
};

export type IngredientsForm = {
  ingredients: { ingredient: string }[];
};

export type StepsForm = {
  steps: { step: string }[];
};
