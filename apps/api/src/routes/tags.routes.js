import { requireUser } from '../auth/require-user.js';
const tagsRoutes = async (fastify) => {
    // GET /tags?query=ma
    fastify.get('/', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { listTags } = await import('../services/tags/tags.service.js');
        const { query } = request.query;
        const tags = await listTags(userId, query);
        reply.send({ tags });
    });
    // POST /tags { name: "Matcha" }
    fastify.post('/', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { createOrGetTag } = await import('../services/tags/tags.service.js');
        const body = request.body.tag ?? request.body;
        const tag = await createOrGetTag(body.name, userId);
        reply.code(201).send({ tag });
    });
    // DELETE /tags/:id
    fastify.delete('/:id', async (request, reply) => {
        const userId = await requireUser(request, reply);
        if (!userId) {
            return;
        }
        const { deleteTag } = await import('../services/tags/tags.service.js');
        const { id } = request.params;
        await deleteTag(id, userId);
        reply.code(204).send();
    });
};
export default tagsRoutes;
