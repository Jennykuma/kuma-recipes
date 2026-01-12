import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { recipeDetails, listRecipes } from '../services/recipes.service';

interface CreateRecipeBody {
    title: string;
    ingredients?: Prisma.InputJsonValue;
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: Prisma.InputJsonValue;
    tags?: string[];
}

const recipesRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/', async (_, reply: FastifyReply) => {
        const recipes = await listRecipes();
        reply.send({ recipes });
    });

    fastify.get('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        const recipe = await recipeDetails(params.id);
        reply.send({ recipe });
    });

    fastify.post<{ Body: CreateRecipeBody }>('/', async (request, reply) => {
        const { title, ingredients, notes, rating, remake, steps, tags } = request.body;
        const result = await prisma.recipe.create({
            data: { title, ingredients, notes, rating, remake, steps, tags },
        });
        reply.code(201).send(result);
    });
};

export default recipesRoutes;
