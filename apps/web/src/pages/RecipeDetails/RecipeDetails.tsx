import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeDetails, useRecipeRating, useDeleteRecipe } from '../../hooks';
import { Pencil } from 'lucide-react';
import Rating from '../../components/Rating';
import BackButton from '../../components/BackButton';
import DeleteModal from './components/DeleteModal';

const RecipeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const recipeId = id ?? '';
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutate: updateRating, isPending } = useRecipeRating(recipeId);
    const { mutate: deleteRecipe } = useDeleteRecipe(recipeId);
    const { recipe } = useRecipeDetails(recipeId);

    const handleChangeRating = (rating: number) => {
        if (!recipe) {
            return;
        }

        if (recipe?.rating !== rating) {
            updateRating(rating);
        }
    };

    const handleDelete = () => {
        if (!recipeId) return;
        setShowDeleteModal(false);
        deleteRecipe(undefined, { onSuccess: () => navigate('/') });
    };

    const sourceText = recipe?.source?.trim() ?? '';
    const sourceLink = (() => {
        if (!sourceText) return null;
        try {
            const withScheme =
                sourceText.startsWith('http://') || sourceText.startsWith('https://')
                    ? sourceText
                    : sourceText.startsWith('www.')
                      ? `https://${sourceText}`
                      : null;
            if (!withScheme) return null;
            return new URL(withScheme).href;
        } catch {
            return null;
        }
    })();

    return (
        <div className="p-6">
            <BackButton to="/" />
            <header className="flex items-center justify-between">
                <span className="flex items-baseline gap-2">
                    <h1 className="shrink-0 text-lg text-left font-bold">
                        {recipe?.title}
                    </h1>
                    <Pencil className="w-4 h-4 cursor-pointer text-blush-400" />
                </span>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-xs text-white border border-blush-400 bg-blush-400 px-2.5 py-1 rounded hover:bg-blush-200 hover:text-white transition-colors"
                >
                    Delete
                </button>
            </header>
            {showDeleteModal ? (
                <DeleteModal
                    title={recipe?.title}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                />
            ) : null}

            <div className="text-sm flex flex-col space-y-3 items-start">
                <Rating
                    value={recipe?.rating}
                    onChange={handleChangeRating}
                    interactive={!isPending}
                />
                <span className="flex items-center gap-2">
                    <input type="checkbox" checked={recipe?.remake} disabled />
                    Would remake
                </span>

                <span className="flex items-baseline gap-2 w-full min-w-0">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full shrink-0">
                        Source
                    </span>
                    {sourceLink ? (
                        <a
                            href={sourceLink}
                            target="_blank"
                            rel="noreferrer"
                            title={sourceLink}
                            className="text-sm text-blush-400 hover:underline truncate overflow-hidden text-ellipsis flex-1 min-w-0"
                        >
                            {sourceText}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-700 truncate overflow-hidden text-ellipsis flex-1 min-w-0">
                            {sourceText || 'N/A'}
                        </span>
                    )}
                </span>

                <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                        Ingredients
                    </span>
                    <ul>
                        {recipe?.ingredients.map((ingredient) => {
                            return (
                                <li className="ml-4 list-disc" key={ingredient}>
                                    {ingredient}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                        Steps
                    </span>
                    <ul>
                        {recipe?.steps.map((step) => {
                            return (
                                <li className="ml-4 list-decimal text-sm/6" key={step}>
                                    {step}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="flex flex-col w-full min-w-0">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                        Notes
                    </span>
                    <textarea
                        className="flex-1 min-w-0 p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-xs"
                        rows={4}
                        value={recipe?.notes}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
