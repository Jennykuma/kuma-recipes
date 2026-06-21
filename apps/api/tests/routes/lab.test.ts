import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('../../src/services/lab/lab.service', () => ({
  getLabData: vi.fn(),
  createVariant: vi.fn(),
  updateVariant: vi.fn(),
  deleteVariant: vi.fn(),
  logAttempt: vi.fn(),
  updateAttempt: vi.fn(),
  deleteAttempt: vi.fn(),
  createPin: vi.fn(),
  deletePin: vi.fn(),
}));

import { updateAttempt, createPin } from '../../src/services/lab/lab.service';
import { verifyToken } from '@clerk/backend';

describe('lab routes', () => {
  let app: FastifyInstance;
  const authHeaders = { authorization: 'Bearer test-token' };
  const recipeId = '6fd3f0c5-c098-4804-89ad-299a25d5373a';

  beforeEach(async () => {
    process.env.CLERK_SECRET_KEY = 'test-secret';
    vi.clearAllMocks();
    vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' } as any);
    app = buildApp();
    await app.ready();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  test('PATCH /recipes/:id/lab/attempts/:attemptId updates the attempt', async () => {
    const mockedUpdateAttempt = vi.mocked(updateAttempt);
    mockedUpdateAttempt.mockResolvedValue({
      id: 'attempt-1',
      recipeId,
      variantId: null,
      date: new Date('2026-06-01'),
      changes: ['less sugar'],
      note: 'good',
      rating: 4,
    } as any);

    const res = await app.inject({
      method: 'PATCH',
      url: `/recipes/${recipeId}/lab/attempts/attempt-1`,
      headers: authHeaders,
      payload: { changes: ['less sugar'], note: 'good', rating: 4 },
    });

    expect(res.statusCode).toBe(200);
    expect(mockedUpdateAttempt).toHaveBeenCalledWith(
      recipeId,
      'attempt-1',
      { changes: ['less sugar'], note: 'good', rating: 4 },
      'test-user-1'
    );
    expect(res.json()).toMatchObject({ id: 'attempt-1', note: 'good', rating: 4 });
  });

  test('PATCH /recipes/:id/lab/attempts/:attemptId returns 404 when attempt is not found', async () => {
    const mockedUpdateAttempt = vi.mocked(updateAttempt);
    mockedUpdateAttempt.mockResolvedValue(null);

    const res = await app.inject({
      method: 'PATCH',
      url: `/recipes/${recipeId}/lab/attempts/missing-attempt`,
      headers: authHeaders,
      payload: { note: 'good' },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ message: 'Attempt not found' });
  });

  test('PATCH /recipes/:id/lab/attempts/:attemptId requires bearer auth', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/recipes/${recipeId}/lab/attempts/attempt-1`,
      payload: { note: 'good' },
    });

    expect(res.statusCode).toBe(401);
    expect(updateAttempt).not.toHaveBeenCalled();
  });

  test('POST /recipes/:id/lab/pins returns 404 when the variant is not scoped to the recipe', async () => {
    const mockedCreatePin = vi.mocked(createPin);
    mockedCreatePin.mockResolvedValue(null);

    const res = await app.inject({
      method: 'POST',
      url: `/recipes/${recipeId}/lab/pins`,
      headers: authHeaders,
      payload: {
        variantId: 'variant-from-other-recipe',
        text: 'note',
        color: 'yellow',
        rotation: 0,
      },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ message: 'Variant not found' });
  });

  test('POST /recipes/:id/lab/pins creates a pin scoped to the variant', async () => {
    const mockedCreatePin = vi.mocked(createPin);
    mockedCreatePin.mockResolvedValue({
      id: 'pin-1',
      recipeId,
      variantId: 'variant-1',
      itemId: null,
      text: 'note',
      color: 'yellow',
      rotation: 0,
    } as any);

    const res = await app.inject({
      method: 'POST',
      url: `/recipes/${recipeId}/lab/pins`,
      headers: authHeaders,
      payload: { variantId: 'variant-1', text: 'note', color: 'yellow', rotation: 0 },
    });

    expect(res.statusCode).toBe(201);
    expect(mockedCreatePin).toHaveBeenCalledWith(
      recipeId,
      { variantId: 'variant-1', text: 'note', color: 'yellow', rotation: 0 },
      'test-user-1'
    );
    expect(res.json()).toMatchObject({ id: 'pin-1', variantId: 'variant-1' });
  });
});
