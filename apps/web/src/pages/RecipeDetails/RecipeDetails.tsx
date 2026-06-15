import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarPlus, Link2, Star, PieChart } from 'lucide-react';
import {
  useRecipeDetails,
  useDeleteRecipe,
  useDeleteRecipePhoto,
  useUpdateRecipe,
  useUploadRecipePhoto,
  useToast,
  useLabData,
} from '../../hooks';
import { type Recipe } from '../../../../api/src/services/recipes/recipes.types';
import RDLabTab from '../RecipeLab/RDLabTab';
import { getRecipePhotoUrl } from '../../api/supabaseStorage';
import Rating from '../../components/Rating';
import BackButton from '../../components/BackButton';
import DeleteModal from './components/DeleteModal';
import EditableTitle from './components/EditableTitle';
import EditableSource from './components/EditableSource';
import IngredientsSection from './components/IngredientsSection';
import StepsSection from './components/StepsSection';
import NotesSection from './components/NotesSection';
import TagsSection from './components/TagsSection';
import RecipePhotoPicker from '../../components/RecipePhotoPicker';
import EditableYield from './components/EditableYield';
import DeleteRecipe from './components/DeleteRecipe';
import ShareRecipe from './components/ShareRecipe';
import RecipeDetailsView from './RecipeDetailsView';
import RecipeDetailsSkeleton from './RecipeDetailsSkeleton';
import PageState from '../../components/PageState';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const recipeId = id ?? '';
  const { recipe, isLoading, error, refetch } = useRecipeDetails(recipeId);
  const detailImageUrl = getRecipePhotoUrl(recipe?.imagePath);
  const { mutate: updateRecipe, mutateAsync: updateRecipeAsync } =
    useUpdateRecipe(recipeId);
  const { mutate: deleteRecipe } = useDeleteRecipe(recipeId);
  const {
    mutate: uploadRecipePhoto,
    isPending: isUploadingPhoto,
    error: uploadPhotoError,
  } = useUploadRecipePhoto();
  const {
    mutate: deleteRecipePhoto,
    isPending: isDeletingPhoto,
    error: deletePhotoError,
  } = useDeleteRecipePhoto();

  const { data: labData } = useLabData(recipeId);

  const [activeTab, setActiveTab] = useState<'recipe' | 'lab'>('recipe');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingField, setEditingField] = useState<keyof Recipe | null>(null);
  const [draft, setDraft] = useState<Partial<Recipe>>({});
  const [titleError, setTitleError] = useState<string | null>(null);

  const bestVariant = labData?.variants.find((v) => v.isBest);

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
    deleteRecipe(undefined, {
      onSuccess: () => {
        showToast({
          status: 'success',
          message: 'Recipe deleted successfully!',
        });
        navigate('/');
      },
    });
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

  const handlePhotoUpload = (photo: File) => {
    if (!recipeId) return;
    uploadRecipePhoto({ recipeId, photo });
  };

  const handlePhotoRemove = () => {
    if (!recipeId || !recipe?.imagePath) return;
    deleteRecipePhoto({ recipeId });
  };

  if (isLoading) {
    return <RecipeDetailsSkeleton />;
  }

  if (error || !recipe) {
    return (
      <PageState
        variant="error"
        title="A little kitchen hiccup"
        message={error instanceof Error ? error.message : 'Please refresh and try again.'}
        actionLabel="Try again"
        onAction={() => void refetch()}
      />
    );
  }

  const tabBar = (
    <div className="relative flex">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700" />
      <button
        type="button"
        onClick={() => setActiveTab('recipe')}
        className={`relative border-b-2 px-4 pb-2 pt-1 text-sm quicksand-semibold outline-none transition-colors ${
          activeTab === 'recipe'
            ? 'border-blush-400 text-accent dark:text-gray-100'
            : 'border-transparent text-gray-500 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
      >
        📖 Recipe
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('lab')}
        className={`relative inline-flex items-center gap-1.5 border-b-2 px-4 pb-2 pt-1 text-sm quicksand-semibold outline-none transition-colors ${
          activeTab === 'lab'
            ? 'border-blush-400 text-accent dark:text-gray-100'
            : 'border-transparent text-gray-500 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
      >
        🧪 R&amp;D Lab
      </button>
    </div>
  );

  return (
    <RecipeDetailsView
      backButton={<BackButton />}
      tabBar={tabBar}
      labTab={
        activeTab === 'lab' && labData ? (
          <RDLabTab recipeId={recipeId} recipe={recipe} labData={labData} />
        ) : undefined
      }
      title={
        <div className="flex flex-wrap items-center gap-2">
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
          {bestVariant && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              <Star className="h-3 w-3" aria-hidden="true" />
              Best version: {bestVariant.name}
            </span>
          )}
        </div>
      }
      headerActions={
        <>
          <ShareRecipe id={recipeId} />
          <DeleteRecipe onDelete={() => setShowDeleteModal(true)} />
        </>
      }
      modal={
        showDeleteModal ? (
          <DeleteModal
            title={recipe?.title}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        ) : null
      }
      photo={
        <RecipePhotoPicker
          alt={recipe?.title ?? 'Recipe photo'}
          imageUrl={detailImageUrl}
          error={uploadPhotoError?.message ?? deletePhotoError?.message}
          isUploading={isUploadingPhoto || isDeletingPhoto}
          busyText={isDeletingPhoto ? 'Removing...' : 'Uploading...'}
          onFileSelect={handlePhotoUpload}
          onRemovePhoto={recipe?.imagePath ? handlePhotoRemove : undefined}
          resetAfterChange
          tileClassName="h-[250px] w-full rounded-xl md:w-[250px]"
        />
      }
      summary={
        <>
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
            <span className="field-label inline-flex w-[110px] shrink-0 items-center gap-1 text-gray-500 dark:text-gray-300">
              <CalendarPlus className="h-3 w-3 text-gray-500" aria-hidden="true" />
              Created on
            </span>
            {recipe?.createdAt ? (
              <time dateTime={recipe.createdAt}>
                {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            ) : (
              <span>Unknown</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
            <span className="field-label inline-flex w-[110px] shrink-0 items-center gap-1 text-gray-500 dark:text-gray-300">
              <PieChart className="h-3 w-3 text-gray-500" aria-hidden="true" />
              Yield
            </span>
            <EditableYield
              recipeYield={recipe?.yield}
              isEditing={editingField === 'yield'}
              draftValue={draft.yield}
              onEdit={() => {
                setDraft({
                  ...draft,
                  yield: recipe?.yield ?? '',
                });
                setEditingField('yield');
              }}
              onChange={(value) => setDraft({ ...draft, yield: value })}
              onSave={() => handleSave('yield')}
              onCancel={() => handleCancel('yield')}
            />
          </div>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
            <span
              id="recipe-rating-label"
              className="field-label inline-flex w-[110px] shrink-0 items-center gap-1 text-gray-500 dark:text-gray-300"
            >
              <Star className="h-3 w-3 text-gray-500" aria-hidden="true" />
              Rating
            </span>
            <Rating
              value={recipe?.rating}
              onChange={handleChangeRating}
              ariaLabelledby="recipe-rating-label"
              className="justify-start"
            />
          </div>
          <div className="flex items-start gap-4 text-gray-600 dark:text-gray-300">
            <span className="field-label inline-flex w-[110px] shrink-0 items-center gap-1 text-gray-500 dark:text-gray-300">
              <Link2 className="h-3 w-3 text-gray-500" aria-hidden="true" />
              Source
            </span>
            <div className="-mt-0.5 min-w-0 flex-1 text-xs">
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
                onChange={(value) => setDraft({ ...draft, source: value })}
                onSave={() => handleSave('source')}
                onCancel={() => handleCancel('source')}
              />
            </div>
          </div>
          <TagsSection
            tags={recipe?.tags}
            isEditing={editingField === 'tags'}
            onEdit={() => setEditingField('tags')}
            onSave={handleTagsSave}
            onCancel={handleTagsCancel}
          />
        </>
      }
      notes={
        <NotesSection
          notes={recipe?.notes}
          isEditing={editingField === 'notes'}
          draftValue={draft.notes}
          onEdit={() => {
            setDraft({
              ...draft,
              notes: recipe?.notes ?? '',
            });
            setEditingField('notes');
          }}
          onChange={(value) => setDraft({ ...draft, notes: value })}
          onSave={() => handleSave('notes')}
          onCancel={() => handleCancel('notes')}
        />
      }
      ingredients={
        <IngredientsSection
          ingredients={recipe?.ingredients}
          isEditing={editingField === 'ingredients'}
          onEdit={() => setEditingField('ingredients')}
          onSave={handleIngredientsSave}
          onCancel={handleIngredientsCancel}
        />
      }
      steps={
        <StepsSection
          steps={recipe?.steps}
          isEditing={editingField === 'steps'}
          onEdit={() => setEditingField('steps')}
          onSave={handleStepsSave}
          onCancel={handleStepsCancel}
        />
      }
    />
  );
};

export default RecipeDetails;
