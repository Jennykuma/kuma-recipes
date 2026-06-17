import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { z } from 'zod';
import { requireUser } from '../auth/require-user.js';

const ParseRecipeBodySchema = z.object({
  recipeInput: z.string().min(1, 'rawText or URL is required'),
});

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

    const result = ParseRecipeBodySchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'rawText or URL is required' });
    }

    const { parseRecipeFromUrl } =
      await import('../services/ai/parseRecipeFromUrl.service.js');
    const { parseRecipeText } = await import('../services/ai/parseRecipe.service.js');

    const trimmed = result.data.recipeInput.trim();
    if (isUrl(trimmed)) {
      const parsed = await parseRecipeFromUrl(trimmed);
      if (!parsed) {
        return reply.status(422).send({
          error:
            "We couldn't extract a recipe from that URL. Try copying and pasting the recipe text instead.",
        });
      }
      return reply.send(parsed);
    }

    const parsed = await parseRecipeText(trimmed);
    return reply.send(parsed);
  });
};

export default aiRoutes;
