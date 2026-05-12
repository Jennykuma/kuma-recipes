export const MAX_SOURCE_PHOTO_SIZE = 15 * 1024 * 1024;
export const MAX_UPLOAD_PHOTO_SIZE = 5 * 1024 * 1024;
export const RECIPE_PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';

export async function resizeImageFile(
    file: File,
    maxWidth = 1600,
    quality = 0.82
): Promise<File> {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    try {
        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error('Could not load image'));
            image.src = objectUrl;
        });

        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not resize image');
        }

        context.drawImage(image, 0, 0, width, height);

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) {
                        resolve(result);
                        return;
                    }

                    reject(new Error('Could not create resized image'));
                },
                'image/jpeg',
                quality
            );
        });

        const filenameBase = file.name.replace(/\.[^.]+$/, '') || 'recipe-photo';

        return new File([blob], `${filenameBase}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}
