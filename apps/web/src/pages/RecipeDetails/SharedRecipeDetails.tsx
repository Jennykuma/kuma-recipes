import { useParams } from 'react-router-dom';
import { CalendarPlus, Link2, PieChart, Star } from 'lucide-react';
import { useSharedRecipe } from '../../hooks';
import { getRecipePhotoUrl } from '../../api/supabaseStorage';
import PageState from '../../components/PageState';
import Rating from '../../components/Rating';
import IngredientsSection from './components/IngredientsSection';
import NotesSection from './components/NotesSection';
import StepsSection from './components/StepsSection';
import TagsSection from './components/TagsSection';
import RecipeDetailsView from './RecipeDetailsView';
import RecipeDetailsSkeleton from './RecipeDetailsSkeleton';

const getSourceLink = (source?: string) => {
  const sourceText = source?.trim() ?? '';

  if (!sourceText) {
    return null;
  }

  try {
    const withScheme =
      sourceText.startsWith('http://') || sourceText.startsWith('https://')
        ? sourceText
        : sourceText.startsWith('www.')
          ? `https://${sourceText}`
          : null;

    return withScheme ? new URL(withScheme).href : null;
  } catch {
    return null;
  }
};

const SharedRecipeDetails = () => {
  const { token } = useParams();
  const { sharedRecipe, isLoading, error, refetch } = useSharedRecipe(token || '');
  const detailImageUrl = getRecipePhotoUrl(sharedRecipe?.imagePath);

  if (isLoading) {
    return <RecipeDetailsSkeleton shared />;
  }

  if (error || !sharedRecipe) {
    const isMissingRecipe =
      error instanceof Error && error.message === 'Recipe not found';

    return (
      <PageState
        variant="error"
        title={
          isMissingRecipe || !sharedRecipe
            ? "This shared recipe isn't available"
            : "We couldn't open this shared recipe"
        }
        message={
          isMissingRecipe || !sharedRecipe
            ? 'The share link may have expired, or the recipe may no longer be shared.'
            : error instanceof Error
              ? error.message
              : 'Please try again in a moment.'
        }
        actionLabel={isMissingRecipe || !sharedRecipe ? undefined : 'Try again'}
        onAction={isMissingRecipe || !sharedRecipe ? undefined : () => void refetch()}
      />
    );
  }

  const sourceLink = getSourceLink(sharedRecipe.source);

  return (
    <RecipeDetailsView
      title={<h1 className="text-lg font-bold">{sharedRecipe.title}</h1>}
      photo={
        <div className="h-[250px] w-full overflow-hidden rounded-xl border border-dashed border-sage-300 bg-surface md:w-[250px] dark:border-gray-700 dark:bg-gray-800">
          {detailImageUrl ? (
            <img
              src={detailImageUrl}
              alt={sharedRecipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500 dark:text-gray-300">
              No photo available
            </div>
          )}
        </div>
      }
      summary={
        <>
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide text-gray-600 dark:text-gray-300">
              <CalendarPlus className="h-3 w-3 text-gray-400" aria-hidden="true" />
              Created on
            </span>
            <time dateTime={sharedRecipe.createdAt}>
              {new Date(sharedRecipe.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
            <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide">
              <PieChart className="h-3 w-3 text-gray-400" aria-hidden="true" />
              Yield
            </span>
            <span className="text-xs">{sharedRecipe.yield || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
            <span
              id="shared-recipe-rating-label"
              className="inline-flex w-[110px] shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide"
            >
              <Star className="h-3 w-3 text-gray-400" aria-hidden="true" />
              Rating
            </span>
            <Rating
              value={sharedRecipe.rating}
              readOnly
              ariaLabelledby="shared-recipe-rating-label"
              className="justify-start"
            />
          </div>
          <div className="flex items-start gap-4 text-gray-600 dark:text-gray-300">
            <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-[10px] uppercase tracking-wide">
              <Link2 className="h-3 w-3 text-gray-400" aria-hidden="true" />
              Source
            </span>
            <div className="-mt-0.5 min-w-0 flex-1 text-xs">
              {sourceLink ? (
                <a
                  href={sourceLink}
                  target="_blank"
                  rel="noreferrer"
                  title={sourceLink}
                  className="link-blush text-blush-400 hover:underline"
                >
                  {sharedRecipe.source}
                </a>
              ) : (
                <span className="text-gray-600 dark:text-gray-200">
                  {sharedRecipe.source?.trim() || '—'}
                </span>
              )}
            </div>
          </div>
          <TagsSection tags={sharedRecipe.tags} editable={false} />
        </>
      }
      notes={<NotesSection notes={sharedRecipe.notes} editable={false} />}
      ingredients={
        <IngredientsSection ingredients={sharedRecipe.ingredients} editable={false} />
      }
      steps={<StepsSection steps={sharedRecipe.steps} editable={false} />}
    />
  );
};

export default SharedRecipeDetails;
