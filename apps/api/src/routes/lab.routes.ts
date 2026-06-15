import { FastifyPluginAsync } from 'fastify';
import { requireUser } from '../auth/require-user.js';
import type {
  CreateVariantBody,
  UpdateVariantBody,
  CreateAttemptBody,
  CreatePinBody,
} from '../services/lab/lab.types.js';

const labRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /recipes/:id/lab
  fastify.get('/:id/lab', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { getLabData } = await import('../services/lab/lab.service.js');
    const { id } = request.params as { id: string };
    const data = await getLabData(id, userId);
    if (!data) {
      reply.code(404).send({ message: 'Recipe not found' });
      return;
    }
    reply.send(data);
  });

  // POST /recipes/:id/lab/variants
  fastify.post<{ Body: CreateVariantBody }>('/:id/lab/variants', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { createVariant } = await import('../services/lab/lab.service.js');
    const { id } = request.params as { id: string };
    try {
      const variant = await createVariant(id, request.body, userId);
      if (!variant) {
        reply.code(404).send({ message: 'Recipe not found' });
        return;
      }
      reply.code(201).send(variant);
    } catch (error) {
      reply.code(400).send({ message: (error as Error).message || 'Invalid variant payload' });
    }
  });

  // PATCH /recipes/:id/lab/variants/:variantId
  fastify.patch<{ Body: UpdateVariantBody }>(
    '/:id/lab/variants/:variantId',
    async (request, reply) => {
      const userId = await requireUser(request, reply);
      if (!userId) return;

      const { updateVariant } = await import('../services/lab/lab.service.js');
      const { id, variantId } = request.params as { id: string; variantId: string };
      try {
        const variant = await updateVariant(id, variantId, request.body, userId);
        if (!variant) {
          reply.code(404).send({ message: 'Variant not found' });
          return;
        }
        reply.send(variant);
      } catch (error) {
        reply.code(400).send({ message: (error as Error).message || 'Invalid variant payload' });
      }
    }
  );

  // DELETE /recipes/:id/lab/variants/:variantId
  fastify.delete('/:id/lab/variants/:variantId', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { deleteVariant } = await import('../services/lab/lab.service.js');
    const { id, variantId } = request.params as { id: string; variantId: string };
    const deleted = await deleteVariant(id, variantId, userId);
    if (!deleted) {
      reply.code(404).send({ message: 'Variant not found' });
      return;
    }
    reply.code(204).send();
  });

  // POST /recipes/:id/lab/attempts
  fastify.post<{ Body: CreateAttemptBody }>('/:id/lab/attempts', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { logAttempt } = await import('../services/lab/lab.service.js');
    const { id } = request.params as { id: string };
    try {
      const attempt = await logAttempt(id, request.body, userId);
      if (!attempt) {
        reply.code(404).send({ message: 'Recipe not found' });
        return;
      }
      reply.code(201).send(attempt);
    } catch (error) {
      reply.code(400).send({ message: (error as Error).message || 'Invalid attempt payload' });
    }
  });

  // DELETE /recipes/:id/lab/attempts/:attemptId
  fastify.delete('/:id/lab/attempts/:attemptId', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { deleteAttempt } = await import('../services/lab/lab.service.js');
    const { id, attemptId } = request.params as { id: string; attemptId: string };
    const deleted = await deleteAttempt(id, attemptId, userId);
    if (!deleted) {
      reply.code(404).send({ message: 'Attempt not found' });
      return;
    }
    reply.code(204).send();
  });

  // POST /recipes/:id/lab/pins
  fastify.post<{ Body: CreatePinBody }>('/:id/lab/pins', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { createPin } = await import('../services/lab/lab.service.js');
    const { id } = request.params as { id: string };
    try {
      const pin = await createPin(id, request.body, userId);
      if (!pin) {
        reply.code(404).send({ message: 'Recipe not found' });
        return;
      }
      reply.code(201).send(pin);
    } catch (error) {
      reply.code(400).send({ message: (error as Error).message || 'Invalid pin payload' });
    }
  });

  // DELETE /recipes/:id/lab/pins/:pinId
  fastify.delete('/:id/lab/pins/:pinId', async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const { deletePin } = await import('../services/lab/lab.service.js');
    const { id, pinId } = request.params as { id: string; pinId: string };
    const deleted = await deletePin(id, pinId, userId);
    if (!deleted) {
      reply.code(404).send({ message: 'Pin not found' });
      return;
    }
    reply.code(204).send();
  });
};

export default labRoutes;
