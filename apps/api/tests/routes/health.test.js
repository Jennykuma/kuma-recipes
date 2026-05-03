import { buildApp } from '../../src/app';
describe('health routes', () => {
    const app = buildApp();
    test('GET /health should return status OK', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health',
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ ok: true });
    });
});
