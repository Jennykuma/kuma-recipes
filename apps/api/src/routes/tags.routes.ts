import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { type CreateTagBody } from '../services/tags/tags.types.js';

const tagsRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /tags?query=ma
    fastify.get('/', async (request, reply: FastifyReply) => {
        const { listTags } = await import('../services/tags/tags.service.js');
        const { query } = request.query as { query?: string };
        const tags = await listTags(query);
        reply.send({ tags });
    });

    // POST /tags { name: "Matcha" }
    fastify.post<{ Body: CreateTagBody }>('/', async (request, reply) => {
        const { createOrGetTag } = await import('../services/tags/tags.service.js');
        const body = (request.body as { tag?: CreateTagBody }).tag ?? request.body;
        const tag = await createOrGetTag(body.name);
        reply.code(201).send({ tag });
    });

    // DELETE /tags/:id
    fastify.delete('/:id', async (request, reply) => {
        const { deleteTag } = await import('../services/tags/tags.service.js');
        const { id } = request.params as { id: string };
        await deleteTag(id);
        reply.code(204).send();
    });
};

export default tagsRoutes;
