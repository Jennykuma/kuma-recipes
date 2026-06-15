import { prisma } from '../../prisma.js';
import type { InputJsonValue } from '../../generated/prisma/internal/prismaNamespace.js';
import type {
  LabData,
  CreateVariantBody,
  UpdateVariantBody,
  CreateAttemptBody,
  CreatePinBody,
} from './lab.types.js';

export async function getLabData(recipeId: string, userId: string): Promise<LabData | null> {
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    select: {
      variants: { orderBy: { order: 'asc' } },
      attempts: { orderBy: { date: 'desc' } },
      pins: true,
    },
  });

  if (!recipe) return null;

  return {
    variants: recipe.variants,
    attempts: recipe.attempts,
    pins: recipe.pins,
  };
}

export async function createVariant(
  recipeId: string,
  body: CreateVariantBody,
  userId: string
) {
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    select: { id: true },
  });
  if (!recipe) return null;

  let order = body.order;
  if (order === undefined) {
    const count = await prisma.recipeVariant.count({ where: { recipeId } });
    order = count;
  }

  return prisma.recipeVariant.create({
    data: {
      recipeId,
      name: body.name,
      tag: body.tag ?? null,
      ...(body.delta !== undefined ? { delta: body.delta as InputJsonValue } : {}),
      rating: body.rating ?? null,
      isBest: body.isBest ?? false,
      ingredients: body.ingredients as InputJsonValue,
      steps: body.steps as InputJsonValue,
      order,
    },
  });
}

export async function updateVariant(
  recipeId: string,
  variantId: string,
  body: UpdateVariantBody,
  userId: string
) {
  const variant = await prisma.recipeVariant.findFirst({
    where: { id: variantId, recipeId, recipe: { userId } },
    select: { id: true },
  });
  if (!variant) return null;

  if (body.isBest === true) {
    return prisma.$transaction(async (tx) => {
      await tx.recipeVariant.updateMany({
        where: { recipeId, id: { not: variantId } },
        data: { isBest: false },
      });
      return tx.recipeVariant.update({
        where: { id: variantId },
        data: body as Parameters<typeof tx.recipeVariant.update>[0]['data'],
      });
    });
  }

  return prisma.recipeVariant.update({
    where: { id: variantId },
    data: body as Parameters<typeof prisma.recipeVariant.update>[0]['data'],
  });
}

export async function deleteVariant(
  recipeId: string,
  variantId: string,
  userId: string
): Promise<boolean> {
  const variant = await prisma.recipeVariant.findFirst({
    where: { id: variantId, recipeId, recipe: { userId } },
    select: { id: true },
  });
  if (!variant) return false;

  await prisma.recipeVariant.delete({ where: { id: variantId } });
  return true;
}

export async function logAttempt(
  recipeId: string,
  body: CreateAttemptBody,
  userId: string
) {
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    select: { id: true },
  });
  if (!recipe) return null;

  return prisma.recipeAttempt.create({
    data: {
      recipeId,
      variantId: body.variantId ?? null,
      date: new Date(body.date),
      changes: body.changes ?? [],
      note: body.note ?? null,
      rating: body.rating ?? null,
    },
  });
}

export async function deleteAttempt(
  recipeId: string,
  attemptId: string,
  userId: string
): Promise<boolean> {
  const attempt = await prisma.recipeAttempt.findFirst({
    where: { id: attemptId, recipeId, recipe: { userId } },
    select: { id: true },
  });
  if (!attempt) return false;

  await prisma.recipeAttempt.delete({ where: { id: attemptId } });
  return true;
}

export async function createPin(
  recipeId: string,
  body: CreatePinBody,
  userId: string
) {
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    select: { id: true },
  });
  if (!recipe) return null;

  return prisma.recipePin.create({
    data: {
      recipeId,
      attachType: body.attachType ?? null,
      attachMatch: body.attachMatch ?? null,
      text: body.text,
      color: body.color,
      rotation: body.rotation,
    },
  });
}

export async function deletePin(
  recipeId: string,
  pinId: string,
  userId: string
): Promise<boolean> {
  const pin = await prisma.recipePin.findFirst({
    where: { id: pinId, recipeId, recipe: { userId } },
    select: { id: true },
  });
  if (!pin) return false;

  await prisma.recipePin.delete({ where: { id: pinId } });
  return true;
}
