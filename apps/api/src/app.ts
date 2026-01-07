import fastify from 'fastify';
import recipesRoutes from './routes/recipes';

export function buildApp() {
    const app = fastify();

    app.register(recipesRoutes);

    app.get('/health', async () => {
        return { ok: true };
    });

    return app;
}
