import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { vi } from 'vitest';

vi.mock('../../src/services/recipes.service', () => ({
    listRecipes: vi.fn(),
    recipeDetails: vi.fn(),
}));

import { listRecipes, recipeDetails } from '../../src/services/recipes.service';

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
                id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
                title: 'Matcha Cookies',
                rating: 4,
            },
            {
                id: 'ceada500-2341-42c5-869b-f231869a94aa',
                title: 'Salt Bread',
                rating: 5,
            },
        ]);

        const res = await app.inject({
            method: 'GET',
            url: '/recipes',
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({
            recipes: [
                {
                    id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
                    title: 'Matcha Cookies',
                    rating: 4,
                },
                {
                    id: 'ceada500-2341-42c5-869b-f231869a94aa',
                    title: 'Salt Bread',
                    rating: 5,
                },
            ],
        });
    });

    test('GET /recipes/:id -> returns mocked recipe details', async () => {
        const id = 'ceada500-2341-42c5-869b-f231869a94aa';
        const mockedRecipeDetails = vi.mocked(recipeDetails);
        mockedRecipeDetails.mockResolvedValue({
            id: id,
            title: 'Salt Bread',
            rating: 5,
            ingredients: null,
            notes: null,
            remake: false,
            steps: null,
            tags: [],
        });

        const res = await app.inject({
            method: 'GET',
            url: `/recipes/${id}`,
        });

        expect(res.statusCode).toBe(200);
        console.log('res.json(): ', res.json());
        expect(res.json()).toEqual({
            recipe: {
                id: id,
                title: 'Salt Bread',
                rating: 5,
                ingredients: null,
                notes: null,
                remake: false,
                steps: null,
                tags: [],
            },
        });
    });
});
