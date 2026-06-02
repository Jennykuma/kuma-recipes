import { FastifyPluginAsync, FastifyReply } from 'fastify';
import {
    type NewRecipeBody,
    type UpdateRecipeBody,
} from '../services/recipes/recipes.types.js';
import { requireUser } from '../auth/require-user.js';
import {
    deleteRecipePhoto,
    uploadRecipePhoto,
} from '../services/recipes/recipe-photos.service.js';

function parseTagFilters(tagQuery?: string | string[]) {
    const queryValues = Array.isArray(tagQuery) ? tagQuery : tagQuery ? [tagQuery] : [];

    return [
        ...new Set(
            queryValues
                .flatMap((value) => value.split(','))
                .map((value) => value.trim())
                .filter(Boolean)
        ),
    ];
}

const recipesRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /recipes
    fastify.get('/', async (request, reply: FastifyReply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { listRecipes } = await import('../services/recipes/recipes.service.js');
        const { tag } = request.query as { tag?: string | string[] };
        const recipes = await listRecipes(userId, parseTagFilters(tag));
        reply.send({ recipes });
    });

    // GET /recipes/:id
    fastify.get('/:id', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { recipeDetails } = await import('../services/recipes/recipes.service.js');
        const params = request.params as { id: string };
        const recipe = await recipeDetails(params.id, userId);
        if (!recipe) {
            reply.code(404).send({ message: 'Recipe not found' });
            return;
        }
        reply.send({ recipe });
    });

    // POST /recipes
    fastify.post<{ Body: NewRecipeBody }>('/', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { createNewRecipe } =
            await import('../services/recipes/recipes.service.js');
        const body = (request.body as { recipe?: NewRecipeBody }).recipe ?? request.body;

        const {
            title,
            ingredients,
            notes,
            rating,
            steps,
            tagIds,
            source,
            yield: recipeYield,
        } = body;
        try {
            const result = await createNewRecipe(
                {
                    title,
                    ingredients,
                    notes,
                    rating,
                    steps,
                    tagIds,
                    source,
                    yield: recipeYield,
                },
                userId
            );
            reply.code(201).send(result);
        } catch (error) {
            reply
                .code(400)
                .send({ message: (error as Error).message || 'Invalid recipe payload' });
        }
    });

    // PATCH /recipes/:id
    fastify.patch<{ Body: UpdateRecipeBody }>('/:id', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { updateRecipe } = await import('../services/recipes/recipes.service.js');
        const params = request.params as { id: string };
        try {
            const result = await updateRecipe(params.id, request.body, userId);
            if (!result) {
                reply.code(404).send({ message: 'Recipe not found' });
                return;
            }
            reply.code(200).send(result);
        } catch (error) {
            reply
                .code(400)
                .send({ message: (error as Error).message || 'Invalid recipe payload' });
        }
    });

    // DELETE /recipes/:id
    fastify.delete('/:id', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { deleteRecipe } = await import('../services/recipes/recipes.service.js');
        const params = request.params as { id: string };
        const deleted = await deleteRecipe(params.id, userId);
        if (!deleted) {
            reply.code(404).send({ message: 'Recipe not found' });
            return;
        }
        reply.code(204).send();
    });

    // POST /:id/photo
    fastify.post('/:id/photo', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { id } = request.params as { id: string };
        const file = await request.file();

        if (!file) {
            reply.code(400).send({ message: 'Photo is required' });
            return;
        }

        const result = await uploadRecipePhoto({
            recipeId: id,
            userId,
            file,
        });

        reply.send(result);
    });

    // DELETE /:id/photo
    fastify.delete('/:id/photo', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { id } = request.params as { id: string };
        const result = await deleteRecipePhoto({
            recipeId: id,
            userId,
        });

        if (!result) {
            reply.code(404).send({ message: 'Recipe not found' });
            return;
        }

        reply.send(result);
    });

    // POST /recipes/:id/share
    fastify.post('/:id/share', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) return;

        const { id } = request.params as { id: string };
        const { createRecipeShareLink } =
            await import('../services/recipes/recipes.service.js');

        const shareLink = await createRecipeShareLink(id, userId);

        if (!shareLink) {
            reply.code(404).send({ message: 'Recipe not found' });
            return;
        }

        reply.code(201).send({ shareLink });
    });
};

export default recipesRoutes;
