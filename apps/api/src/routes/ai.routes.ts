import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { requireUser } from '../auth/require-user.js';

const isUrl = (input: string) => {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
};

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /ai/parse-recipe
  fastify.post('/parse-recipe', async (request, reply: FastifyReply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { recipeInput } = request.body as { recipeInput?: string };
    if (
      !recipeInput ||
      typeof recipeInput !== 'string' ||
      recipeInput.trim().length === 0
    ) {
      return reply.status(400).send({ error: 'rawText or URL is required' });
    }

    const { parseRecipeFromUrl } =
      await import('../services/ai/parseRecipeFromUrl.service.js');
    const { parseRecipeText } = await import('../services/ai/parseRecipe.service.js');

    const trimmed = recipeInput.trim();
    if (isUrl(trimmed)) {
      const parsed = await parseRecipeFromUrl(trimmed);
      if (!parsed) {
        return reply.status(422).send({
          error: "We couldn't extract a recipe from that URL. Try copying and pasting the recipe text instead.",
        });
      }
      return reply.send(parsed);
    }

    const parsed = await parseRecipeText(trimmed);
    return reply.send(parsed);
  });
};

export default aiRoutes;
