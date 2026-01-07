import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';

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

    test('GET /recipes -> gets all recipes', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/recipes',
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toMatchObject({});
    });
});
