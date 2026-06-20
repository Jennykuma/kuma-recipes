import { z } from 'zod';

export const VariantItemSchema = z.object({
  text: z.string(),
  status: z.enum(['original', 'tweaked', 'new']),
});

export const CreateVariantBodySchema = z.object({
  name: z.string(),
  delta: z.string().optional(),
  isBest: z.boolean().optional(),
  ingredients: z.array(VariantItemSchema),
  steps: z.array(VariantItemSchema),
});

export const UpdateVariantBodySchema = z
  .object({
    name: z.string(),
    delta: z.string().nullable(),
    isBest: z.boolean(),
    ingredients: z.array(VariantItemSchema),
    steps: z.array(VariantItemSchema),
    order: z.number().int(),
  })
  .partial();

export type VariantItem = z.infer<typeof VariantItemSchema>;
export type CreateVariantBody = z.infer<typeof CreateVariantBodySchema>;
export type UpdateVariantBody = z.infer<typeof UpdateVariantBodySchema>;

export type LabVariant = {
  id: string;
  recipeId: string;
  name: string;
  delta: string | null;
  isBest: boolean;
  ingredients: VariantItem[];
  steps: VariantItem[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LabAttempt = {
  id: string;
  recipeId: string;
  variantId: string | null;
  date: Date;
  changes: string[];
  note: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LabPin = {
  id: string;
  recipeId: string;
  attachType: string | null;
  attachMatch: string | null;
  text: string;
  color: string;
  rotation: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LabData = {
  variants: LabVariant[];
  attempts: LabAttempt[];
  pins: LabPin[];
};

export type CreateAttemptBody = {
  variantId?: string;
  date: string;
  changes?: string[];
  note?: string;
  rating?: number;
};

export type CreatePinBody = {
  attachType?: string;
  attachMatch?: string;
  text: string;
  color: string;
  rotation: number;
};
