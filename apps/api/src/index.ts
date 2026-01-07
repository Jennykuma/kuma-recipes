import fastify from 'fastify';
import { prisma } from './prisma';

const app = fastify();

app.get('/health', async () => {
    return { ok: true };
});

app.get('/recipes', async () => {
    const recipes = await prisma.recipe.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return { recipes };
});

const start = async () => {
    try {
        await app.listen({ port: 3001, host: '0.0.0.0' });
        console.log('API running on http://localhost:3001');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
