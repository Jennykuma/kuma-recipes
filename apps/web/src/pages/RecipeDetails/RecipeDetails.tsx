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

const RecipeDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const recipeId = id ?? '';
    const { recipe } = useRecipeDetails(recipeId);
    const { mutate: updateRecipe } = useUpdateRecipe(recipeId);
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

    const handleIngredientsSave = (normalizedIngredients: string[]) => {
        updateRecipe({ ingredients: normalizedIngredients });
        setEditingField(null);
    };

    const handleIngredientsCancel = () => {
        setEditingField(null);
    };

    const handleStepsSave = (normalizedSteps: string[]) => {
        updateRecipe({ steps: normalizedSteps });
        setEditingField(null);
    };

    const handleStepsCancel = () => {
        setEditingField(null);
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

    return (
        <div className="p-6">
            <BackButton to="/" />
            <header className="flex items-center justify-between mb-1">
                <EditableTitle
                    title={recipe?.title}
                    isEditing={editingField === 'title'}
                    draftValue={draft.title}
                    onEdit={() => setEditingField('title')}
                    onChange={(value) => setDraft({ ...draft, title: value })}
                    onSave={() => handleSave('title')}
                    onCancel={() => handleCancel('title')}
                />
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

            <div className="text-sm flex flex-col space-y-4 items-start">
                <Rating value={recipe?.rating} onChange={handleChangeRating} />
                <RemakeToggle checked={recipe?.remake} onToggle={handleToggleRemake} />

                <EditableSource
                    source={recipe?.source}
                    isEditing={editingField === 'source'}
                    draftValue={draft.source}
                    onEdit={() => setEditingField('source')}
                    onChange={(value) => setDraft({ ...draft, source: value })}
                    onSave={() => handleSave('source')}
                    onCancel={() => handleCancel('source')}
                />

                <IngredientsSection
                    ingredients={recipe?.ingredients}
                    isEditing={editingField === 'ingredients'}
                    onEdit={() => setEditingField('ingredients')}
                    onSave={handleIngredientsSave}
                    onCancel={handleIngredientsCancel}
                />

                <StepsSection
                    steps={recipe?.steps}
                    isEditing={editingField === 'steps'}
                    onEdit={() => setEditingField('steps')}
                    onSave={handleStepsSave}
                    onCancel={handleStepsCancel}
                />

                <NotesSection notes={recipe?.notes} />
            </div>
        </div>
    );
};

export default RecipeDetails;
