import { FastifyPluginAsync, FastifyReply } from 'fastify';

const sharedRecipesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /shared-recipes/:token (for shared recipes)
  fastify.get<{ Params: { token: string } }>(
    '/:token',
    async (request, reply: FastifyReply) => {
      const { getSharedRecipe } =
        await import('../services/recipes/sharedRecipes.service.js');

      const sharedRecipe = await getSharedRecipe(request.params.token);

      if (!sharedRecipe) {
        reply.code(404).send({ message: 'Recipe not found' });
        return;
      }

      reply.code(200).send({ sharedRecipe });
    }
  );
};

export default sharedRecipesRoutes;
