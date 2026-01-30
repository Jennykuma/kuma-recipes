import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipeDetails, useDeleteRecipe, useUpdateRecipe } from '../../hooks';
import { type Recipe } from '../../../../api/src/services/recipes.types';
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
            <BackButton to="/" />
            <header className="flex items-center justify-between mb-1">
                <EditableTitle
                    title={recipe?.title}
                    isEditing={editingField === 'title'}
                    draftValue={draft.title}
                    onEdit={() => {
                        setDraft({ ...draft, title: recipe?.title ?? '' });
                        setEditingField('title');
                    }}
                    onChange={(value) => setDraft({ ...draft, title: value })}
                    onSave={() => handleSave('title')}
                    onCancel={() => handleCancel('title')}
                />
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="
                        font-jua text-sm text-red-500
                        px-3 py-1.5 rounded-xl
                        bg-red-50 hover:bg-red-100"
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
                <div className="text-sm flex flex-col space-y-3 items-start md:col-span-2">
                    <Rating
                        value={recipe?.rating}
                        onChange={handleChangeRating}
                        className="justify-end"
                    />
                    <RemakeToggle
                        checked={recipe?.remake}
                        onToggle={handleToggleRemake}
                    />

                    <EditableSource
                        source={recipe?.source}
                        isEditing={editingField === 'source'}
                        draftValue={draft.source}
                        onEdit={() => {
                            setDraft({ ...draft, source: recipe?.source ?? '' });
                            setEditingField('source');
                        }}
                        onChange={(value) => setDraft({ ...draft, source: value })}
                        onSave={() => handleSave('source')}
                        onCancel={() => handleCancel('source')}
                    />
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
    );
};

export default RecipeDetails;
