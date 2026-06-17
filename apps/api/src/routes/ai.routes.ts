import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { z } from 'zod';
import { requireUser } from '../auth/require-user.js';

const ParseRecipeBodySchema = z.object({
  recipeInput: z.string().min(1, 'rawText or URL is required'),
});

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /ai/parse-recipe
  fastify.post('/parse-recipe', async (request, reply: FastifyReply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const result = ParseRecipeBodySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'rawText or URL is required' });
    }

    const { parseRequest } = await import('../services/ai/parseRequest.service.js');
    const outcome = await parseRequest(result.data.recipeInput.trim());

    if (!outcome.ok) {
      return reply.status(422).send({
        error:
          "We couldn't extract a recipe from that URL. Try copying and pasting the recipe text instead.",
      });
    }

    return reply.send(outcome.recipe);
  });
};

export default aiRoutes;
