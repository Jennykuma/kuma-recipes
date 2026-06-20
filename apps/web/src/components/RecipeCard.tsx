import Rating from './Rating';
import { Link } from 'react-router-dom';
import { getRecipePhotoUrl } from '../api/supabaseStorage';
import type { Tag } from 'shared';
import { Cookie } from 'lucide-react';

interface RecipeCardProps {
  id: string;
  rating?: number;
  tags?: Tag[];
  title: string;
  imagePath?: string | null;
}

const VISIBLE_TAG_COUNT = 2;

const RecipeCard = ({ id, rating, tags = [], title, imagePath }: RecipeCardProps) => {
  const visibleTags = tags.slice(0, VISIBLE_TAG_COUNT);
  const hiddenTags = tags.slice(VISIBLE_TAG_COUNT);
  const tagListLabel = tags.map((tag) => tag.name).join(', ');
  const imageUrl = getRecipePhotoUrl(imagePath);

  return (
    <Link
      role="link"
      tabIndex={0}
      className="
        flex h-full w-full flex-col
        gap-4 p-4 bg-white border border-sage-300/50
        rounded-xl shadow-md shadow-gray-100
        hover:shadow-none cursor-pointer
        dark:border-gray-700 dark:bg-canvas-card dark:text-gray-100
        dark:shadow-none dark:hover:border-gray-600"
      to={`/recipes/${id}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col text-center text-sm">
          <div className="flex h-16 flex-col items-center justify-center">
            <span
              className="quicksand-bold text-md block w-full min-w-0 max-w-full truncate"
              title={title}
            >
              {title}
            </span>
            <Rating value={rating} />
          </div>

          {tags.length > 0 && (
            <div
              className="mt-2 flex max-w-full flex-nowrap items-center justify-center gap-1.5"
              title={tagListLabel}
            >
              {visibleTags.map((tag) => (
                <span
                  key={tag.id}
                  title={tag.name}
                  className="
                    inline-flex min-h-6 min-w-0 max-w-24 items-center rounded-full
                    bg-sage-100 px-2.5 py-0.5 text-xs leading-tight font-semibold
                    text-gray-700 dark:bg-sage-300/20 dark:text-sage-100"
                >
                  <span className="min-w-0 truncate leading-tight">{tag.name}</span>
                </span>
              ))}
              {hiddenTags.length > 0 && (
                <span className="group relative inline-flex">
                  <span
                    aria-label={`${hiddenTags.length} more tags: ${hiddenTags
                      .map((tag) => tag.name)
                      .join(', ')}`}
                    className="
                      inline-flex min-h-6 items-center rounded-full bg-sage-100
                      px-2.5 py-0.5 text-xs leading-tight text-gray-700 font-semibold
                      dark:bg-sage-300/25 dark:text-sage-100"
                  >
                    +{hiddenTags.length}
                  </span>
                  <div
                    className="
                      pointer-events-none absolute bottom-full left-1/2 z-10 mb-2
                      w-52 -translate-x-1/2 rounded-lg border border-sage-200
                      bg-white px-3 py-2 text-left text-xs text-gray-700 wrap-break-words
                      opacity-0 shadow-lg shadow-gray-100 transition-opacity
                      group-hover:opacity-100
                      dark:border-gray-700 dark:bg-canvas-raised dark:text-gray-100 dark:shadow-none"
                  >
                    {hiddenTags.map((tag) => tag.name).join(', ')}
                  </div>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 md:h-28 md:w-28">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <Cookie className="h-7 w-7 text-gray-400" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
