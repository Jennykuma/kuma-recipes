import { MultipartFile } from '@fastify/multipart';

export async function uploadRecipePhoto({
    recipeId,
    userId,
    file,
}: {
    recipeId: string;
    userId: string;
    file: MultipartFile;
}) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype))
        throw new Error('Photo must be JPG, PNG, or WebP');

    const { prisma } = await import('../../prisma.js');
    const { supabase, recipePhotosBucket } = await import('../../supabase.js');

    const recipe = await prisma.recipe.findFirst({
        where: { id: recipeId, userId },
        select: { id: true, imagePath: true },
    });

    if (!recipe) throw new Error('Recipe not found');

    const bytes = await file.toBuffer();

    const extension =
        file.mimetype === 'image/png'
            ? 'png'
            : file.mimetype === 'image/webp'
              ? 'webp'
              : 'jpg';

    const imagePath = `${userId}/${recipeId}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
        .from(recipePhotosBucket)
        .upload(imagePath, bytes, {
            contentType: file.mimetype,
            upsert: true,
        });

    if (error) throw new Error(error.message);

    await prisma.recipe.update({
        where: { id: recipeId },
        data: { imagePath },
    });

    if (recipe.imagePath && recipe.imagePath !== imagePath) {
        const { error: removeError } = await supabase.storage
            .from(recipePhotosBucket)
            .remove([recipe.imagePath]);

        if (removeError) {
            console.warn(
                `Failed to remove previous recipe photo ${recipe.imagePath}: ${removeError.message}`
            );
        }
    }

    return { imagePath };
}
