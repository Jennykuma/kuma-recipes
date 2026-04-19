import { FastifyPluginAsync, FastifyReply } from 'fastify';
import {
    recipeDetails,
    listRecipes,
    createNewRecipe,
    deleteRecipe,
    updateRecipe,
} from '../services/recipes/recipes.service.js';
import {
    type NewRecipeBody,
    type UpdateRecipeBody,
} from '../services/recipes/recipes.types.js';

const recipesRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /recipes
    fastify.get('/', async (_, reply: FastifyReply) => {
        const recipes = await listRecipes();
        reply.send({ recipes });
    });

    // GET /recipes/:id
    fastify.get('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        const recipe = await recipeDetails(params.id);
        reply.send({ recipe });
    });

    // POST /recipes
    fastify.post<{ Body: NewRecipeBody }>('/', async (request, reply) => {
        const body = (request.body as { recipe?: NewRecipeBody }).recipe ?? request.body;

        const {
            title,
            ingredients,
            notes,
            rating,
            remake,
            steps,
            tagIds,
            source,
        } = body;
        const result = await createNewRecipe({
            title,
            ingredients,
            notes,
            rating,
            remake,
            steps,
            tagIds,
            source,
        });
        reply.code(201).send(result);
    });

    // PATCH /recipes/:id
    fastify.patch<{ Body: UpdateRecipeBody }>('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        const result = await updateRecipe(params.id, request.body);
        reply.code(200).send(result);
    });

    // DELETE /recipes/:id
    fastify.delete('/:id', async (request, reply) => {
        const params = request.params as { id: string };
        await deleteRecipe(params.id);
        reply.code(204);
    });
};

export default recipesRoutes;
