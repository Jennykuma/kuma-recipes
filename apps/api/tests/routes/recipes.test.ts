import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
    verifyToken: vi.fn(),
}));

vi.mock('../../src/services/recipes/recipes.service', () => ({
    createNewRecipe: vi.fn(),
    listRecipes: vi.fn(),
    recipeDetails: vi.fn(),
    createRecipeShareLink: vi.fn(),
}));

vi.mock('../../src/services/recipes/recipe-photos.service', () => ({
    deleteRecipePhoto: vi.fn(),
    uploadRecipePhoto: vi.fn(),
}));

import {
    createNewRecipe,
    createRecipeShareLink,
    listRecipes,
    recipeDetails,
} from '../../src/services/recipes/recipes.service';
import {
    deleteRecipePhoto,
    uploadRecipePhoto,
} from '../../src/services/recipes/recipe-photos.service';
import { verifyToken } from '@clerk/backend';

describe('recipes routes', () => {
    let app: FastifyInstance;
    const authHeaders = { authorization: 'Bearer test-token' };

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

    test('POST /recipes should create a recipe', async () => {
        const mockedCreateNewRecipe = vi.mocked(createNewRecipe);
        mockedCreateNewRecipe.mockResolvedValue({
            id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
            title: 'Matcha Cookies',
            tags: [],
        } as any);

        const res = await app.inject({
            method: 'POST',
            url: '/recipes',
            headers: authHeaders,
            payload: {
                title: 'Matcha Cookies',
                tagIds: ['0f15302d-3bb6-4f73-b16c-dddfbd39bd44'],
                yield: '12 cookies',
            },
        });

        expect(res.statusCode).toBe(201);
        expect(mockedCreateNewRecipe).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Matcha Cookies',
                yield: '12 cookies',
            }),
            'test-user-1'
        );
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
        expect(mockedListRecipes).toHaveBeenCalledWith('test-user-1', []);
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

    test('GET /recipes forwards tag filters', async () => {
        const mockedListRecipes = vi.mocked(listRecipes);
        mockedListRecipes.mockResolvedValue([
            {
                id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
                title: 'Matcha Cookies',
                rating: 4,
            },
        ]);

        const res = await app.inject({
            method: 'GET',
            url: '/recipes?tag=matcha&tag=dessert',
            headers: authHeaders,
        });

        expect(res.statusCode).toBe(200);
        expect(mockedListRecipes).toHaveBeenCalledWith('test-user-1', [
            'matcha',
            'dessert',
        ]);
        expect(res.json()).toEqual({
            recipes: [
                {
                    id: '6fd3f0c5-c098-4804-89ad-299a25d5373a',
                    title: 'Matcha Cookies',
                    rating: 4,
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

    test('POST /recipes/:id/photo accepts multipart image uploads', async () => {
        const id = '6fd3f0c5-c098-4804-89ad-299a25d5373a';
        const boundary = '----kuma-recipes-test-boundary';
        const mockedUploadRecipePhoto = vi.mocked(uploadRecipePhoto);
        mockedUploadRecipePhoto.mockResolvedValue({
            imagePath: `test-user-1/${id}.png`,
        });

        const payload = Buffer.from(
            [
                `--${boundary}`,
                'Content-Disposition: form-data; name="photo"; filename="photo.png"',
                'Content-Type: image/png',
                '',
                'fake image bytes',
                `--${boundary}--`,
                '',
            ].join('\r\n')
        );

        const res = await app.inject({
            method: 'POST',
            url: `/recipes/${id}/photo`,
            headers: {
                ...authHeaders,
                'content-type': `multipart/form-data; boundary=${boundary}`,
            },
            payload,
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ imagePath: `test-user-1/${id}.png` });
        expect(mockedUploadRecipePhoto).toHaveBeenCalledWith({
            recipeId: id,
            userId: 'test-user-1',
            file: expect.objectContaining({
                filename: 'photo.png',
                mimetype: 'image/png',
            }),
        });
    });

    test('DELETE /recipes/:id/photo removes the recipe photo', async () => {
        const id = '6fd3f0c5-c098-4804-89ad-299a25d5373a';
        const mockedDeleteRecipePhoto = vi.mocked(deleteRecipePhoto);
        mockedDeleteRecipePhoto.mockResolvedValue({ imagePath: null });

        const res = await app.inject({
            method: 'DELETE',
            url: `/recipes/${id}/photo`,
            headers: authHeaders,
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toEqual({ imagePath: null });
        expect(mockedDeleteRecipePhoto).toHaveBeenCalledWith({
            recipeId: id,
            userId: 'test-user-1',
        });
    });

    test('POST /recipes/:id/share creates a recipe share link', async () => {
        const id = '6fd3f0c5-c098-4804-89ad-299a25d5373a';
        const mockedCreateRecipeShareLink = vi.mocked(createRecipeShareLink);

        mockedCreateRecipeShareLink.mockResolvedValue({
            id: 'share-link-id',
            recipeId: id,
            token: 'share-token',
            revokedAt: null,
            createdAt: new Date('2026-05-28T00:00:00.000Z'),
        } as any);

        const res = await app.inject({
            method: 'POST',
            url: `/recipes/${id}/share`,
            headers: authHeaders,
        });

        expect(res.statusCode).toBe(201);
        expect(mockedCreateRecipeShareLink).toHaveBeenCalledWith(id, 'test-user-1');
        expect(res.json()).toMatchObject({
            shareLink: {
                id: 'share-link-id',
                recipeId: id,
                token: 'share-token',
                revokedAt: null,
            },
        });
    });
});
