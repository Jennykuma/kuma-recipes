import { prisma } from '../../prisma';

function normalizeTag(input: string) {
    const name = input.trim();
    if (!name) return { name: '', slug: '' };

    const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-') // spaces -> hyphen
        .replace(/[^a-z0-9-]/g, '');

    return { name, slug };
}

export async function listTags(query?: string) {
    const q = query?.trim();
    const where = q
        ? {
              OR: [
                  { name: { contains: q, mode: 'insensitive' as const } },
                  { slug: { contains: q.toLowerCase() } },
              ],
          }
        : undefined;

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

export async function createOrGetTag(name: string) {
    const { name: displayName, slug } = normalizeTag(name);

    if (!displayName || !slug) {
        throw new Error('Tag name cannot be empty');
    }

    return prisma.tag.upsert({
        where: { slug },
        update: {}, // don’t change existing
        create: {
            name: displayName,
            slug,
        },
    });
}

export async function deleteTag(id: string) {
    await prisma.tag.delete({ where: { id } });
}
