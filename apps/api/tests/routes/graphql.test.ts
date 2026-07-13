import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('../../src/services/tags/tags.service', () => ({
  listTags: vi.fn(),
  createOrGetTag: vi.fn(),
}));

vi.mock('../../src/services/recipes/recipes.service', () => ({
  listRecipes: vi.fn(),
  recipeDetails: vi.fn(),
  createNewRecipe: vi.fn(),
}));

import { listTags, createOrGetTag } from '../../src/services/tags/tags.service';
import {
  listRecipes,
  recipeDetails,
  createNewRecipe,
} from '../../src/services/recipes/recipes.service';
import { verifyToken } from '@clerk/backend';

describe('graphql tags', () => {
  let app: FastifyInstance;
  const authHeaders = { authorization: 'Bearer test-token' };

  beforeEach(async () => {
    process.env.CLERK_SECRET_KEY = 'test-secret';
    vi.clearAllMocks();
    app = await buildApp();
    await app.ready();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  test('tags query without a token returns an UNAUTHENTICATED error', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `query { tags { id name slug } }`,
      },
    });

    const body = res.json();
    expect(body.data).toBeNull();
    expect(body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    expect(listTags).not.toHaveBeenCalled();
  });

  test('tags query with a valid token returns tags from the service', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(listTags).mockResolvedValue([
      { id: 'tag-1', name: 'Matcha', slug: 'matcha', count: 0 },
    ] as any);

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `query { tags { id name slug } }`,
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.tags).toEqual([{ id: 'tag-1', name: 'Matcha', slug: 'matcha' }]);
    expect(listTags).toHaveBeenCalledWith('test-user-1');
  });

  test('createTag mutation without a token returns an UNAUTHENTICATED error', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `mutation($input: CreateTagInput!) {
          createTag(input: $input) { id name slug }
        }`,
        variables: { input: { name: 'Matcha' } },
      },
    });

    const body = res.json();
    expect(body.data).toBeNull();
    expect(body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    expect(createOrGetTag).not.toHaveBeenCalled();
  });

  test('createTag mutation with a valid token creates a tag via the service', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(createOrGetTag).mockResolvedValue({
      id: 'tag-2',
      name: 'Matcha',
      slug: 'matcha',
    } as any);

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `mutation($input: CreateTagInput!) {
          createTag(input: $input) { id name slug }
        }`,
        variables: { input: { name: 'Matcha' } },
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.createTag).toEqual({ id: 'tag-2', name: 'Matcha', slug: 'matcha' });
    expect(createOrGetTag).toHaveBeenCalledWith('Matcha', 'test-user-1');
  });

  test('recipes query without a token returns an UNAUTHENTICATED error', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `query { recipes { id title rating } }`,
      },
    });

    const body = res.json();
    expect(body.data).toBeNull();
    expect(body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    expect(listRecipes).not.toHaveBeenCalled();
  });

  test('recipes query with a valid token returns recipes from the service', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(listRecipes).mockResolvedValue([
      { id: 'recipe-1', title: 'Matcha Latte', rating: 5, tags: [], imagePath: null },
    ] as any);

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `query($tag: [String!]) { recipes(tag: $tag) { id title rating } }`,
        variables: { tag: ['matcha'] },
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.recipes).toEqual([
      { id: 'recipe-1', title: 'Matcha Latte', rating: 5 },
    ]);
    expect(listRecipes).toHaveBeenCalledWith('test-user-1', ['matcha']);
  });

  test('recipe query without a token returns an UNAUTHENTICATED error', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `query($id: ID!) { recipe(id: $id) { id title } }`,
        variables: { id: 'recipe-1' },
      },
    });

    const body = res.json();
    expect(body.data).toEqual({ recipe: null });
    expect(body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    expect(recipeDetails).not.toHaveBeenCalled();
  });

  test('recipe query with a valid token returns recipe details from the service', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(recipeDetails).mockResolvedValue({
      id: 'recipe-1',
      title: 'Matcha Latte',
      ingredients: ['matcha', 'milk'],
      notes: '',
      rating: 5,
      steps: ['whisk', 'pour'],
      tags: [],
      source: '',
      imagePath: null,
      yield: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } as any);

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `query($id: ID!) { recipe(id: $id) { id title ingredients steps } }`,
        variables: { id: 'recipe-1' },
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.recipe).toEqual({
      id: 'recipe-1',
      title: 'Matcha Latte',
      ingredients: ['matcha', 'milk'],
      steps: ['whisk', 'pour'],
    });
    expect(recipeDetails).toHaveBeenCalledWith('recipe-1', 'test-user-1');
  });

  test('recipe query returns null when the recipe is not found', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(recipeDetails).mockResolvedValue(null as any);

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `query($id: ID!) { recipe(id: $id) { id title } }`,
        variables: { id: 'missing-recipe' },
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.recipe).toBeNull();
  });

  test('createRecipe mutation without a token returns an UNAUTHENTICATED error', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `mutation($input: CreateRecipeInput!) {
          createRecipe(input: $input) { id title }
        }`,
        variables: { input: { title: 'Matcha Latte' } },
      },
    });

    const body = res.json();
    expect(body.data).toBeNull();
    expect(body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    expect(createNewRecipe).not.toHaveBeenCalled();
  });

  test('createRecipe mutation with a valid token creates a recipe via the service', async () => {
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    vi.mocked(createNewRecipe).mockResolvedValue({
      id: 'recipe-1',
      title: 'Matcha Latte',
      ingredients: ['matcha', 'milk'],
      notes: '',
      rating: 0,
      steps: ['whisk', 'pour'],
      tags: [],
      source: '',
      imagePath: null,
      yield: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } as any);

    const input = {
      title: 'Matcha Latte',
      ingredients: ['matcha', 'milk'],
      steps: ['whisk', 'pour'],
    };

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      headers: authHeaders,
      payload: {
        query: `mutation($input: CreateRecipeInput!) {
          createRecipe(input: $input) { id title ingredients steps }
        }`,
        variables: { input },
      },
    });

    const body = res.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.createRecipe).toEqual({
      id: 'recipe-1',
      title: 'Matcha Latte',
      ingredients: ['matcha', 'milk'],
      steps: ['whisk', 'pour'],
    });
    expect(createNewRecipe).toHaveBeenCalledWith(input, 'test-user-1');
  });
});
