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

import { listTags, createOrGetTag } from '../../src/services/tags/tags.service';
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
});
