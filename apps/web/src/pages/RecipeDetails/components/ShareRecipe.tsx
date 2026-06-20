import { useCreateRecipeShareLink, useToast } from '../../../hooks';
import { Share } from 'lucide-react';
import { getAppBasePath } from '../../../utils/basePath';

type ShareRecipeProps = { id: string };

function buildSharedRecipeUrl(token: string) {
  const basePath = getAppBasePath();
  const sharedRecipePath =
    basePath === '/' ? `/shared-recipes/${token}` : `${basePath}/shared-recipes/${token}`;

  return new URL(sharedRecipePath, window.location.origin).toString();
}

const ShareRecipe = (props: ShareRecipeProps) => {
  const { id } = props;
  const { showToast } = useToast();
  const { mutateAsync: shareRecipe } = useCreateRecipeShareLink();

  const handleClickShare = async () => {
    const shareLinkItem = await shareRecipe(id);
    const recipeShareLink = buildSharedRecipeUrl(shareLinkItem.token);
    if (recipeShareLink) {
      navigator.clipboard.writeText(recipeShareLink);
      showToast({
        status: 'info',
        message: 'Recipe link copied to clipboard!',
      });
    }
  };

  return (
    <button
      onClick={() => handleClickShare()}
      className="
        inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 md:px-3
        text-blush-400 hover:text-blush-500 hover:bg-pink-50 text-xs"
      aria-label="Share recipe"
      title="Share recipe"
    >
      <Share className="h-4 w-4" aria-hidden="true" />
      <span className="hidden text-sm md:inline">Share</span>
    </button>
  );
};

export default ShareRecipe;
