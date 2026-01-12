import fastify from 'fastify';
import recipesRoutes from './routes/recipes.routes';

export function buildApp() {
    const app = fastify();

    app.register(recipesRoutes, { prefix: '/recipes' });

    app.get('/health', async () => {
        return { ok: true };
    });

    return app;
}
