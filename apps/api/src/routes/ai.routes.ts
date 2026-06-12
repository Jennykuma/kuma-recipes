import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { requireUser } from '../auth/require-user.js';

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /ai/parse-recipe
  fastify.post('/parse-recipe', async (request, reply: FastifyReply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { rawText } = request.body as { rawText?: string };
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return reply.status(400).send({ error: 'rawText is required' });
    }

    const { parseRecipeText } = await import('../services/ai/parseRecipe.service.js');
    const parsed = await parseRecipeText(rawText.trim());
    return reply.send(parsed);
  });
};

export default aiRoutes;
