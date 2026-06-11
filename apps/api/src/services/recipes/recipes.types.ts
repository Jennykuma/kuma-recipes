import { type Tag } from '../tags/tags.types.js';

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

export type NewRecipeBody = {
  title: string;
  ingredients?: string[];
  notes?: string;
  rating?: number;
  steps?: string[];
  tagIds?: string[];
  source?: string;
  imagePath?: string | null;
  yield?: string;
};

export type UpdateRecipeBody = Partial<{
  title: string;
  notes: string;
  source: string;
  ingredients: string[];
  steps: string[];
  tagIds?: string[];
  rating: number;
  imagePath: string | null;
  yield?: string;
}>;

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
