import fastify from 'fastify';
import recipesRoutes from './routes/recipes.routes.js';
import tagsRoutes from './routes/tags.routes.js';

export function buildApp() {
    const app = fastify({ logger: true });

    app.register(recipesRoutes, { prefix: '/recipes' });
    app.register(tagsRoutes, { prefix: '/tags' });

    app.get('/health', async () => {
        return { ok: true };
    });

    return app;
}
