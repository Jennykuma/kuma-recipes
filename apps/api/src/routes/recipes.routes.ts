import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import {
    recipeDetails,
    listRecipes,
    updateRecipeRating,
    createNewRecipe,
} from '../services/recipes.service';

interface NewRecipeBody {
    title: string;
    ingredients?: string[];
    notes?: string;
    rating?: number;
    remake?: boolean;
    steps?: string[];
    tags?: string[];
}

interface UpdateRecipeBody {
    rating: number;
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

    fastify.post<{ Body: NewRecipeBody }>('/', async (request, reply) => {
        const { title, ingredients, notes, rating, remake, steps, tags } = request.body;
        const result = await createNewRecipe({
            title,
            ingredients,
            notes,
            rating,
            remake,
            steps,
            tags,
        });
        reply.code(201).send(result);
    });

    fastify.patch<{ Body: UpdateRecipeBody }>('/:id/rating', async (request, reply) => {
        const params = request.params as { id: string };
        const { rating } = request.body;
        const result = await updateRecipeRating(params.id, rating);
        reply.code(200).send(result);
    });
};

export default recipesRoutes;
