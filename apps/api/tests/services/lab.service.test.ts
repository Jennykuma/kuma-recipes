import { beforeEach, describe, expect, test, vi } from 'vitest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    recipeAttempt: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    recipeVariant: {
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    recipePin: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('../../src/prisma', () => ({
  prisma: prismaMock,
}));

import {
  updateAttempt,
  deleteAttempt,
  createPin,
  updateVariant,
} from '../../src/services/lab/lab.service';

describe('updateAttempt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns null when the attempt does not belong to the user', async () => {
    prismaMock.recipeAttempt.findFirst.mockResolvedValue(null);

    const result = await updateAttempt(
      'recipe-1',
      'attempt-1',
      { note: 'updated' },
      'user-1'
    );

    expect(prismaMock.recipeAttempt.findFirst).toHaveBeenCalledWith({
      where: { id: 'attempt-1', recipeId: 'recipe-1', recipe: { userId: 'user-1' } },
      select: { id: true },
    });
    expect(prismaMock.recipeAttempt.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('updates the attempt and converts a provided date string to a Date', async () => {
    prismaMock.recipeAttempt.findFirst.mockResolvedValue({ id: 'attempt-1' });
    prismaMock.recipeAttempt.update.mockResolvedValue({ id: 'attempt-1' });

    await updateAttempt(
      'recipe-1',
      'attempt-1',
      { date: '2026-06-01', note: 'tasted great' },
      'user-1'
    );

    expect(prismaMock.recipeAttempt.update).toHaveBeenCalledWith({
      where: { id: 'attempt-1' },
      data: {
        date: new Date('2026-06-01'),
        note: 'tasted great',
      },
    });
  });

  test('leaves date untouched when not provided in the patch', async () => {
    prismaMock.recipeAttempt.findFirst.mockResolvedValue({ id: 'attempt-1' });
    prismaMock.recipeAttempt.update.mockResolvedValue({ id: 'attempt-1' });

    await updateAttempt('recipe-1', 'attempt-1', { rating: 4 }, 'user-1');

    expect(prismaMock.recipeAttempt.update).toHaveBeenCalledWith({
      where: { id: 'attempt-1' },
      data: { rating: 4 },
    });
  });
});

describe('deleteAttempt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns false and skips delete when the attempt is not found', async () => {
    prismaMock.recipeAttempt.findFirst.mockResolvedValue(null);

    const result = await deleteAttempt('recipe-1', 'attempt-1', 'user-1');

    expect(prismaMock.recipeAttempt.delete).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('deletes the attempt and returns true when found', async () => {
    prismaMock.recipeAttempt.findFirst.mockResolvedValue({ id: 'attempt-1' });

    const result = await deleteAttempt('recipe-1', 'attempt-1', 'user-1');

    expect(prismaMock.recipeAttempt.delete).toHaveBeenCalledWith({
      where: { id: 'attempt-1' },
    });
    expect(result).toBe(true);
  });
});

describe('createPin variant scoping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns null when the variant does not belong to the recipe/user', async () => {
    prismaMock.recipeVariant.findFirst.mockResolvedValue(null);

    const result = await createPin(
      'recipe-1',
      {
        variantId: 'variant-from-another-recipe',
        text: 'note',
        color: 'yellow',
        rotation: 0,
      },
      'user-1'
    );

    expect(prismaMock.recipeVariant.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'variant-from-another-recipe',
        recipeId: 'recipe-1',
        recipe: { userId: 'user-1' },
      },
      select: { id: true },
    });
    expect(prismaMock.recipePin.create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('creates the pin scoped to the given variant when it belongs to the recipe', async () => {
    prismaMock.recipeVariant.findFirst.mockResolvedValue({ id: 'variant-1' });
    prismaMock.recipePin.create.mockResolvedValue({ id: 'pin-1' });

    const result = await createPin(
      'recipe-1',
      {
        variantId: 'variant-1',
        itemId: 'item-1',
        text: 'note',
        color: 'yellow',
        rotation: 5,
      },
      'user-1'
    );

    expect(prismaMock.recipePin.create).toHaveBeenCalledWith({
      data: {
        recipeId: 'recipe-1',
        variantId: 'variant-1',
        itemId: 'item-1',
        text: 'note',
        color: 'yellow',
        rotation: 5,
      },
    });
    expect(result).toEqual({ id: 'pin-1' });
  });
});

describe('updateVariant removes pins for removed items', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deletes pins attached to ingredients/steps removed from the variant', async () => {
    prismaMock.recipeVariant.findFirst.mockResolvedValue({
      id: 'variant-1',
      ingredients: [{ id: 'ing-1' }, { id: 'ing-2' }],
      steps: [{ id: 'step-1' }],
    });
    prismaMock.recipeVariant.update.mockResolvedValue({ id: 'variant-1' });

    await updateVariant(
      'recipe-1',
      'variant-1',
      {
        ingredients: [{ id: 'ing-1', text: 'flour', status: 'original' }],
        steps: [{ id: 'step-1', text: 'mix', status: 'original' }],
      },
      'user-1'
    );

    expect(prismaMock.recipePin.deleteMany).toHaveBeenCalledWith({
      where: { variantId: 'variant-1', itemId: { in: ['ing-2'] } },
    });
  });

  test('does not touch pins when no ingredients/steps are removed', async () => {
    prismaMock.recipeVariant.findFirst.mockResolvedValue({
      id: 'variant-1',
      ingredients: [{ id: 'ing-1' }],
      steps: [],
    });
    prismaMock.recipeVariant.update.mockResolvedValue({ id: 'variant-1' });

    await updateVariant(
      'recipe-1',
      'variant-1',
      { ingredients: [{ id: 'ing-1', text: 'flour', status: 'original' }] },
      'user-1'
    );

    expect(prismaMock.recipePin.deleteMany).not.toHaveBeenCalled();
  });
});
