import { useState } from 'react';
import { useCreateRecipeShareLink } from '../../../hooks';
import { Share } from 'lucide-react';
import { getAppBasePath } from '../../../utils/basePath';

type ShareRecipeProps = { id: string };

function buildSharedRecipeUrl(token: string) {
    const basePath = getAppBasePath();
    const sharedRecipePath =
        basePath === '/'
            ? `/shared-recipes/${token}`
            : `${basePath}/shared-recipes/${token}`;

    return new URL(sharedRecipePath, window.location.origin).toString();
}

const ShareRecipe = (props: ShareRecipeProps) => {
    const { id } = props;
    const [showTooltip, setShowTooltip] = useState(false);
    const { mutateAsync: shareRecipe } = useCreateRecipeShareLink();

    const handleClickShare = async () => {
        const shareLinkItem = await shareRecipe(id);
        const recipeShareLink = buildSharedRecipeUrl(shareLinkItem.token);
        if (recipeShareLink) {
            setShowTooltip(true);
            navigator.clipboard.writeText(recipeShareLink);
        }
    };

    return (
        <div className="relative ml-2 inline-flex">
            <button
                aria-describedby="share-recipe-tooltip"
                onClick={() => handleClickShare()}
                onMouseLeave={() => setShowTooltip(false)}
                className="
                    inline-flex h-9 w-9 items-center justify-center rounded-full
                    text-blush-400 hover:text-blush-500 hover:bg-pink-50"
                aria-label="Share recipe"
                title="Share recipe"
            >
                <Share className="h-4 w-4" aria-hidden="true" />
            </button>
            {showTooltip && (
                <div
                    role="tooltip"
                    id="share-recipe-tooltip"
                    className="absolute left-1/2 top-full z-10 mt-2 w-max -translate-x-1/2 rounded-md bg-gray-800 p-2 text-sm text-white"
                >
                    <div className="caret-up"></div>
                    Copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default ShareRecipe;
