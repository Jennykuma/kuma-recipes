import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const bucket = import.meta.env.VITE_SUPABASE_RECIPE_PHOTOS_BUCKET ?? 'recipe-photos';

export function getRecipePhotoUrl(imagePath: string | null | undefined) {
    if (!imagePath) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);

    return data.publicUrl;
}
