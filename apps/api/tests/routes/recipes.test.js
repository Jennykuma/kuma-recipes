import { buildApp } from '../../src/app';
import { vi } from 'vitest';
vi.mock('@clerk/backend', () => ({
    verifyToken: vi.fn(),
}));
vi.mock('../../src/services/recipes/recipes.service', () => ({
    createNewRecipe: vi.fn(),
    listRecipes: vi.fn(),
    recipeDetails: vi.fn(),
}));
import { createNewRecipe, listRecipes, recipeDetails, } from '../../src/services/recipes/recipes.service';
import { verifyToken } from '@clerk/backend';
describe('recipes routes', () => {
    let app;
    const authHeaders = { authorization: 'Bearer test-token' };
    beforeEach(async () => {
        vi.mocked(verifyToken).mockResolvedValue({ sub: 'test-user-1' });
        app = buildApp();
        await app.ready();
    });
    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });
    test('POST /recipes should create a recipe', async () => {
        const mockedCreateNewRecipe = vi.mocked(createNewRecipe);
        mockedCreateNewRecipe.mockResolvedValue({
            id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
            title: 'Matcha Cookies',
            tags: [],
        });
        const res = await app.inject({
            method: 'POST',
            url: '/recipes',
            headers: authHeaders,
            payload: {
                title: 'Matcha Cookies',
                tagIds: ['0f15302d-3bb6-4f73-b16c-dddfbd39bd44'],
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
            headers: authHeaders,
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
            headers: authHeaders,
        });
        expect(res.statusCode).toBe(200);
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
    test('GET /recipes should require bearer auth', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/recipes',
        });
        expect(res.statusCode).toBe(401);
        expect(res.json()).toEqual({
            message: 'Missing bearer token',
        });
    });
});
