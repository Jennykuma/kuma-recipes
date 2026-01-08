import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { vi } from 'vitest';

vi.mock('../../src/services/recipes.service', () => ({
    listRecipes: vi.fn(),
}));

import { listRecipes } from '../../src/services/recipes.service';

describe('recipes routes', () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        app = buildApp();
        await app.ready();
    });

    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });

    test('POST /recipes should create a recipe', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/recipes',
            payload: {
                title: 'Matcha Cookies',
            },
        });

        expect(res.statusCode).toBe(201);
        expect(res.json()).toMatchObject({
            title: 'Matcha Cookies',
        });
    });

    test('GET /recipes -> returns mocked recipes', async () => {
        const mockedListRecipes = vi.mocked(listRecipes);
        mockedListRecipes.mockResolvedValue([
            {
                id: '1',
                title: 'Matcha Cookies',
            },
            {
                id: '2',
                title: 'Salt Bread',
            },
        ]);

        const res = await app.inject({
            method: 'GET',
            url: '/recipes',
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({
            recipes: [
                { id: '1', title: 'Matcha Cookies' },
                { id: '2', title: 'Salt Bread' },
            ],
        });
    });
});
