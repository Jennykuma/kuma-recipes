export type LabVariant = {
  id: string;
  recipeId: string;
  name: string;
  tag: string | null;
  delta: unknown;
  rating: number | null;
  isBest: boolean;
  ingredients: unknown;
  steps: unknown;
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

export type CreateVariantBody = {
  name: string;
  tag?: string;
  delta?: unknown;
  rating?: number;
  isBest?: boolean;
  ingredients: unknown;
  steps: unknown;
  order?: number;
};

export type UpdateVariantBody = Partial<{
  name: string;
  tag: string | null;
  delta: unknown;
  rating: number | null;
  isBest: boolean;
  ingredients: unknown;
  steps: unknown;
  order: number;
}>;

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
