import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeDetails, useDeleteRecipe } from '../../hooks';
import { Pencil } from 'lucide-react';
import { type Recipe } from '../../../../api/src/services/recipes.types';
import Rating from '../../components/Rating';
import BackButton from '../../components/BackButton';
import DeleteModal from './components/DeleteModal';
import useUpdateRecipe from '../../hooks/useUpdateRecipe';

const RecipeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const recipeId = id ?? '';

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingField, setEditingField] = useState<keyof Recipe | null>(null);
    const [draft, setDraft] = useState<Partial<Recipe>>({});

    const { mutate: updateRecipe } = useUpdateRecipe(recipeId);
    const { mutate: deleteRecipe } = useDeleteRecipe(recipeId);
    const { recipe } = useRecipeDetails(recipeId);

    useEffect(() => {});

    const handleChangeRating = (rating: number) => {
        if (!recipe) {
            return;
        }

        if (recipe?.rating !== rating) {
            updateRecipe({ rating });
        }
    };

    const handleCancel = (field: keyof Recipe) => {
        setDraft((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
        setEditingField(null);
    };

    const handleDelete = () => {
        if (!recipeId) return;
        setShowDeleteModal(false);
        deleteRecipe(undefined, { onSuccess: () => navigate('/') });
    };

    const handleSave = (field: keyof Recipe) => {
        const value = draft[field] ?? recipe?.[field];
        if (value === undefined) return;

        try {
            updateRecipe({ [field]: value });
            setEditingField(null);
        } catch (err) {
            console.error(err);
            handleCancel(field);
        }
    };

    const handleToggleRemake = () => {
        if (!recipeId || recipe?.remake === undefined) return;

        try {
            updateRecipe({ remake: !recipe.remake });
        } catch (err) {
            console.error(err);
        }
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
            <header className="flex items-center justify-between mb-1">
                <span className="flex w-full items-baseline gap-1">
                    {editingField === 'title' ? (
                        <>
                            <input
                                className="text-lg w-full max-w-125 font-bold border-b border-gray-300 bg-transparent focus:outline-none"
                                value={draft?.title}
                                onChange={(e) =>
                                    setDraft({ ...draft, title: e.target.value })
                                }
                            />
                            <button
                                className="text-xs text-blush-400"
                                onClick={() => handleSave('title')}
                            >
                                Save
                            </button>
                            <button
                                className="text-xs text-gray-400"
                                onClick={() => handleCancel('title')}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-lg font-bold">{recipe?.title}</h1>
                            <Pencil
                                className="w-3 h-4 pt-1 cursor-pointer link-blush"
                                onClick={() => setEditingField('title')}
                            />
                        </>
                    )}
                </span>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-xs text-white border border-blush-400 bg-blush-400 px-2.5 py-1 ml-8 rounded hover:bg-blush-200 hover:text-white transition-colors"
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
                <Rating value={recipe?.rating} onChange={handleChangeRating} />
                <span className="flex items-center gap-2 text-xs text-gray-500">
                    <input
                        type="checkbox"
                        checked={recipe?.remake}
                        onClick={handleToggleRemake}
                    />
                    Would remake
                </span>

                <span className="flex items-baseline gap-2 w-full min-w-0">
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full shrink-0">
                        Source
                    </span>
                    {editingField === 'source' ? (
                        <>
                            <input
                                className="w-full max-w-125 border-b border-gray-300 bg-transparent focus:outline-none"
                                value={draft?.source}
                                onChange={(e) =>
                                    setDraft({ ...draft, source: e.target.value })
                                }
                            />
                            <button
                                className="text-xs text-blush-400"
                                onClick={() => handleSave('source')}
                            >
                                Save
                            </button>
                            <button
                                className="text-xs text-gray-400"
                                onClick={() => handleCancel('source')}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            {sourceLink ? (
                                <a
                                    href={sourceLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={sourceLink}
                                    className="link-blush text-sm text-blush-400 hover:underline truncate overflow-hidden text-ellipsis"
                                >
                                    {sourceText}
                                </a>
                            ) : (
                                <span className="text-sm text-gray-700 truncate overflow-hidden text-ellipsis">
                                    {sourceText || 'N/A'}
                                </span>
                            )}
                            <Pencil
                                className="w-3 h-4 pt-1 cursor-pointer link-blush"
                                onClick={() => setEditingField('source')}
                            />
                        </>
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
