import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { type CreateTagBody } from '../services/tags/tags.types';
import { requireUser } from '../auth/require-user';

const tagsRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /tags?query=ma
    fastify.get('/', async (request, reply: FastifyReply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { listTags } = await import('../services/tags/tags.service.js');
        const { query } = request.query as { query?: string };
        const tags = await listTags(userId, query);
        reply.send({ tags });
    });

    // POST /tags { name: "Matcha" }
    fastify.post<{ Body: CreateTagBody }>('/', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { createOrGetTag } = await import('../services/tags/tags.service.js');
        const body = (request.body as { tag?: CreateTagBody }).tag ?? request.body;
        try {
            const tag = await createOrGetTag(body.name, userId);
            reply.code(201).send({ tag });
        } catch (error) {
            reply.code(400).send({
                message: (error as Error).message || 'Invalid tag payload',
            });
        }
    });

    // DELETE /tags/:id
    fastify.delete('/:id', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { deleteTag } = await import('../services/tags/tags.service.js');
        const { id } = request.params as { id: string };
        await deleteTag(id, userId);
        reply.code(204).send();
    });
};

export default tagsRoutes;
