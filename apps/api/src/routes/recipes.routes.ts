import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import {
    recipeDetails,
    listRecipes,
    updateRecipeRating,
    createNewRecipe,
    deleteRecipe,
    updateRecipe,
} from '../services/recipes.service';
import { type NewRecipeBody, type UpdateRecipeBody } from '../services/recipes.types';

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

    fastify.post<{ Body: NewRecipeBody }>('/', async (request, reply) => {
        const body = (request.body as { recipe?: NewRecipeBody }).recipe ?? request.body;
        const { title, ingredients, notes, rating, remake, steps, tags, source } = body;
        const result = await createNewRecipe({
            title,
            ingredients,
            notes,
            rating,
            remake,
            steps,
            tags,
            source,
        });
        reply.code(201).send(result);
    });

    fastify.patch<{ Body: UpdateRecipeBody }>('/:id/rating', async (request, reply) => {
        const params = request.params as { id: string };
        const { rating } = request.body;
        if (typeof rating !== 'number') {
            reply.code(400).send({ error: 'Rating is required and must be a number.' });
            return;
        }
        const result = await updateRecipeRating(params.id, rating);
        reply.code(200).send(result);
    });

    fastify.patch<{ Body: UpdateRecipeBody }>('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        const result = await updateRecipe(params.id, request.body);
        reply.code(200).send(result);
    });

    fastify.delete('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        await deleteRecipe(params.id);
        reply.code(204);
    });
};

export default recipesRoutes;
