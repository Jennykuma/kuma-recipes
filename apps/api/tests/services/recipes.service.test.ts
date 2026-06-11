import { beforeEach, describe, expect, test, vi } from 'vitest';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    recipe: {
      findFirst: vi.fn(),
    },
    recipeShareLink: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../../src/prisma', () => ({
  prisma: prismaMock,
}));

import { createRecipeShareLink } from '../../src/services/recipes/recipes.service';

describe('createRecipeShareLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns the latest active share link when one already exists', async () => {
    const existingShareLink = {
      id: 'share-link-id',
      recipeId: 'recipe-1',
      token: 'existing-token',
      revokedAt: null,
      createdAt: new Date('2026-06-02T00:00:00.000Z'),
    };

    prismaMock.recipe.findFirst.mockResolvedValue({ id: 'recipe-1' });
    prismaMock.recipeShareLink.findFirst.mockResolvedValue(existingShareLink);

    const result = await createRecipeShareLink('recipe-1', 'user-1');

    expect(prismaMock.recipe.findFirst).toHaveBeenCalledWith({
      where: { id: 'recipe-1', userId: 'user-1' },
      select: { id: true },
    });
    expect(prismaMock.recipeShareLink.findFirst).toHaveBeenCalledWith({
      where: {
        recipeId: 'recipe-1',
        revokedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(prismaMock.recipeShareLink.create).not.toHaveBeenCalled();
    expect(result).toBe(existingShareLink);
  });

  test('creates a new share link when no active link exists', async () => {
    prismaMock.recipe.findFirst.mockResolvedValue({ id: 'recipe-1' });
    prismaMock.recipeShareLink.findFirst.mockResolvedValue(null);
    prismaMock.recipeShareLink.create.mockResolvedValue({
      id: 'new-share-link-id',
      recipeId: 'recipe-1',
      token: 'new-token',
      revokedAt: null,
      createdAt: new Date('2026-06-02T00:00:00.000Z'),
    });

    const result = await createRecipeShareLink('recipe-1', 'user-1');

    expect(prismaMock.recipeShareLink.create).toHaveBeenCalledWith({
      data: {
        recipeId: 'recipe-1',
        token: expect.any(String),
      },
    });
    expect(result).toMatchObject({
      id: 'new-share-link-id',
      recipeId: 'recipe-1',
      token: 'new-token',
      revokedAt: null,
    });
  });

  test('returns null when the recipe does not belong to the user', async () => {
    prismaMock.recipe.findFirst.mockResolvedValue(null);

    const result = await createRecipeShareLink('recipe-1', 'user-1');

    expect(prismaMock.recipeShareLink.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.recipeShareLink.create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
