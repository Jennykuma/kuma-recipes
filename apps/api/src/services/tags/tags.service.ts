import { prisma } from '../../prisma.js';
import { TAG_NAME_MAX_LENGTH } from './tags.types.js';

function normalizeTag(input: string) {
    const name = input.trim();
    if (!name) return { name: '', slug: '' };

    const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-') // spaces -> hyphen
        .replace(/[^a-z0-9-]/g, '');

    return { name, slug };
}

export async function listTags(userId: string, query?: string) {
    const q = query?.trim();
    const where = q
        ? {
              userId,
              OR: [
                  { name: { contains: q, mode: 'insensitive' as const } },
                  { slug: { contains: q.toLowerCase() } },
              ],
          }
        : { userId };

    const tags = await prisma.tag.findMany({
        where,
        include: {
            _count: { select: { recipes: true } },
        },
        orderBy: [{ name: 'asc' }],
        take: 50, // keep dropdown fast
    });

    return tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        count: t._count.recipes,
    }));
}

export async function createOrGetTag(name: string, userId: string) {
    const { name: displayName, slug } = normalizeTag(name);

    if (!displayName || !slug) {
        throw new Error('Tag name cannot be empty');
    }

    if (displayName.length > TAG_NAME_MAX_LENGTH) {
        throw new Error(`Tag name must be ${TAG_NAME_MAX_LENGTH} characters or less`);
    }

    return prisma.tag.upsert({
        where: { userId_slug: { userId, slug } },
        update: {}, // don’t change existing
        create: {
            userId,
            name: displayName,
            slug,
        },
    });
}

export async function deleteTag(id: string, userId: string) {
    await prisma.tag.deleteMany({ where: { id, userId } });
}
