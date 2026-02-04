import fastify from 'fastify';
import recipesRoutes from './routes/recipes.routes';
import tagsRoutes from './routes/tags.routes';

export function buildApp() {
    const app = fastify();

    app.register(recipesRoutes, { prefix: '/recipes' });
    app.register(tagsRoutes, { prefix: '/tags' });

    app.get('/health', async () => {
        return { ok: true };
    });

    return app;
}
