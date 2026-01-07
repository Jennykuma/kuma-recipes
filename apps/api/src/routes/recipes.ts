import { FastifyInstance, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

interface CreateRecipeBody {
    title: string;
    ingredients?: Prisma.InputJsonValue;
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: Prisma.InputJsonValue;
    tags?: string[];
}

export default async function recipesRoutes(app: FastifyInstance) {
    app.get('/recipes', async (_, reply: FastifyReply) => {
        const recipes = await prisma.recipe.findMany({
            orderBy: { createdAt: 'desc' },
        });
        reply.send({ recipes });
    });

    app.post<{ Body: CreateRecipeBody }>('/recipes', async (request, reply) => {
        const { title, ingredients, notes, rating, remake, steps, tags } = request.body;
        const result = await prisma.recipe.create({
            data: { title, ingredients, notes, rating, remake, steps, tags },
        });
        reply.code(201).send(result);
    });
}
