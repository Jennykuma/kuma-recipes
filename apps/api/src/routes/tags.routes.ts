import { FastifyPluginAsync, FastifyReply } from 'fastify';
import { listTags, createOrGetTag } from '../services/tags/tags.service';
import { type CreateTagBody } from '../services/tags/tags.types';

const tagsRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /tags?query=ma
    fastify.get('/', async (request, reply: FastifyReply) => {
        const { query } = request.query as { query?: string };
        const tags = await listTags(query);
        reply.send({ tags });
    });

    // POST /tags { name: "Matcha" }
    fastify.post<{ Body: CreateTagBody }>('/', async (request, reply) => {
        const body = (request.body as { tag?: CreateTagBody }).tag ?? request.body;
        const tag = await createOrGetTag(body.name);
        reply.code(201).send({ tag });
    });
};

export default tagsRoutes;
