import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link2, RotateCcw, Star } from 'lucide-react';
import { useRecipeDetails, useDeleteRecipe, useUpdateRecipe } from '../../hooks';
import { type Recipe } from '../../../../api/src/services/recipes/recipes.types';
import Rating from '../../components/Rating';
import BackButton from '../../components/BackButton';
import DeleteModal from './components/DeleteModal';
import EditableTitle from './components/EditableTitle';
import EditableSource from './components/EditableSource';
import IngredientsSection from './components/IngredientsSection';
import StepsSection from './components/StepsSection';
import RemakeToggle from './components/RemakeToggle';
import NotesSection from './components/NotesSection';
import PhotosSection from './components/PhotosSection';
import TagsSection from './components/TagsSection';

const RecipeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const recipeId = id ?? '';
    const { recipe } = useRecipeDetails(recipeId);
    const { mutate: updateRecipe, mutateAsync: updateRecipeAsync } =
        useUpdateRecipe(recipeId);
    const { mutate: deleteRecipe } = useDeleteRecipe(recipeId);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingField, setEditingField] = useState<keyof Recipe | null>(null);
    const [draft, setDraft] = useState<Partial<Recipe>>({});
    const [titleError, setTitleError] = useState<string | null>(null);

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
        if (field === 'title') {
            setTitleError(null);
        }
        setEditingField(null);
    };

    const handleDelete = () => {
        if (!recipeId) return;
        setShowDeleteModal(false);
        deleteRecipe(undefined, { onSuccess: () => navigate('/') });
    };

    const handleIngredientsSave = async (normalizedIngredients: string[]) => {
        try {
            await updateRecipeAsync({ ingredients: normalizedIngredients });
            setEditingField(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleIngredientsCancel = () => {
        setEditingField(null);
    };

    const handleStepsSave = async (normalizedSteps: string[]) => {
        try {
            await updateRecipeAsync({ steps: normalizedSteps });
            setEditingField(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStepsCancel = () => {
        setEditingField(null);
    };

    const handleTagsSave = async (tagIds: string[]) => {
        try {
            await updateRecipeAsync({ tagIds });
            setEditingField(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTagsCancel = () => {
        setEditingField(null);
    };

    const handleTitleSave = async () => {
        const title = (draft.title ?? recipe?.title ?? '').trim();
        if (!title) {
            setTitleError('Title is required');
            return;
        }

        try {
            await updateRecipeAsync({ title });
            setDraft((prev) => ({ ...prev, title }));
            setTitleError(null);
            setEditingField(null);
        } catch (err) {
            console.error(err);
            handleCancel('title');
        }
    };

    const handleSave = async (field: keyof Recipe) => {
        const value = draft[field] ?? recipe?.[field];
        if (value === undefined) return;

        try {
            await updateRecipeAsync({ [field]: value });
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

    return (
        <div className="p-8">
            <div className="mx-auto w-full max-w-7xl">
                <BackButton to="/" />
                <header className="flex items-center justify-between mb-1">
                    <EditableTitle
                        title={recipe?.title}
                        isEditing={editingField === 'title'}
                        draftValue={draft.title}
                        error={titleError ?? undefined}
                        onEdit={() => {
                            setDraft({ ...draft, title: recipe?.title ?? '' });
                            setTitleError(null);
                            setEditingField('title');
                        }}
                        onChange={(value) => {
                            setDraft({ ...draft, title: value });
                            if (value.trim()) {
                                setTitleError(null);
                            }
                        }}
                        onSave={handleTitleSave}
                        onCancel={() => handleCancel('title')}
                    />
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="
                        font-jua text-sm text-red-500
                        ml-2 px-3 py-1.5 rounded-xl
                        bg-red-50 hover:bg-red-100
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
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

                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="w-full rounded-xl border border-sage-300/50 bg-gradient-to-br from-white to-sage-50/30 p-4 shadow-sm shadow-gray-100 md:col-span-2">
                        <div className="w-full flex flex-col gap-4 text-sm">
                            <TagsSection
                                tags={recipe?.tags}
                                isEditing={editingField === 'tags'}
                                onEdit={() => setEditingField('tags')}
                                onSave={handleTagsSave}
                                onCancel={handleTagsCancel}
                            />

                            <div className="h-px w-full bg-gray-100" />

                            <div className="flex items-center gap-4">
                                <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-xs uppercase tracking-wide text-gray-600">
                                    <Star
                                        className="h-3 w-3 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Rating
                                </span>
                                <Rating
                                    value={recipe?.rating}
                                    onChange={handleChangeRating}
                                    className="justify-start"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-xs uppercase tracking-wide text-gray-600">
                                    <RotateCcw
                                        className="h-3 w-3 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Remake
                                </span>
                                <RemakeToggle
                                    checked={recipe?.remake}
                                    onToggle={handleToggleRemake}
                                    label="Would remake"
                                />
                            </div>

                            <div className="h-px w-full bg-gray-100" />

                            <div className="flex items-center gap-4">
                                <span className="inline-flex w-[110px] shrink-0 items-center gap-1 text-xs uppercase tracking-wide text-gray-600">
                                    <Link2
                                        className="h-3 w-3 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    Source
                                </span>
                                <div className="min-w-0 flex-1">
                                    <EditableSource
                                        source={recipe?.source}
                                        isEditing={editingField === 'source'}
                                        draftValue={draft.source}
                                        hideLabel
                                        onEdit={() => {
                                            setDraft({
                                                ...draft,
                                                source: recipe?.source ?? '',
                                            });
                                            setEditingField('source');
                                        }}
                                        onChange={(value) =>
                                            setDraft({ ...draft, source: value })
                                        }
                                        onSave={() => handleSave('source')}
                                        onCancel={() => handleCancel('source')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-none md:col-start-1 flex flex-col gap-3">
                        <IngredientsSection
                            ingredients={recipe?.ingredients}
                            isEditing={editingField === 'ingredients'}
                            onEdit={() => setEditingField('ingredients')}
                            onSave={handleIngredientsSave}
                            onCancel={handleIngredientsCancel}
                        />
                        <NotesSection
                            notes={recipe?.notes}
                            isEditing={editingField === 'notes'}
                            draftValue={draft.notes}
                            onEdit={() => {
                                setDraft({ ...draft, notes: recipe?.notes ?? '' });
                                setEditingField('notes');
                            }}
                            onChange={(value) => setDraft({ ...draft, notes: value })}
                            onSave={() => handleSave('notes')}
                            onCancel={() => handleCancel('notes')}
                        />
                    </div>

                    <div className="order-2 md:order-none md:col-start-2 flex flex-col gap-3">
                        <StepsSection
                            steps={recipe?.steps}
                            isEditing={editingField === 'steps'}
                            onEdit={() => setEditingField('steps')}
                            onSave={handleStepsSave}
                            onCancel={handleStepsCancel}
                        />
                        <PhotosSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
