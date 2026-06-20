import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import IngredientsTable from './components/IngredientsTable';
import Rating from '../../components/Rating';
import StepsTable from './components/StepsTable';
import BackButton from '../../components/BackButton';
import CancelModal from './components/CancelModal';
import Tags from '../../components/Tags';
import RecipePhotoPicker from '../../components/RecipePhotoPicker';
import RecipeImporter from './components/RecipeImporter';
import type { ParsedRecipe } from '../../api/ai';
import { type RecipeFormValues } from '../../types/recipeForm';
import { useCreateRecipe, useToast } from '../../hooks';
import { MAX_SOURCE_PHOTO_SIZE } from '../../utils/resizeImageFile';
import { IdCard, PieChart, Star, Link2, TagIcon } from 'lucide-react';
import classNames from 'classnames';

const defaultRecipeFormValues: RecipeFormValues = {
  title: '',
  source: '',
  notes: '',
  rating: 0,
  tagIds: [],
  ingredients: [{ ingredient: '' }],
  steps: [{ step: '' }],
  yield: '',
};

type RecipeFormDraftValues = Partial<
  Omit<RecipeFormValues, 'ingredients' | 'steps'> & {
    ingredients: { ingredient?: string }[];
    steps: { step?: string }[];
  }
>;

const hasDraftContent = (values: RecipeFormDraftValues) =>
  (values.title?.trim() ?? '') !== '' ||
  (values.source?.trim() ?? '') !== '' ||
  (values.notes?.trim() ?? '') !== '' ||
  (values.yield?.trim() ?? '') !== '' ||
  Boolean(values.rating) ||
  (values.tagIds?.length ?? 0) > 0 ||
  Boolean(
    values.ingredients?.some(({ ingredient }) => (ingredient?.trim() ?? '') !== '')
  ) ||
  Boolean(values.steps?.some(({ step }) => (step?.trim() ?? '') !== '')) ||
  Boolean(values.photo?.length);

const NewRecipe = () => {
  const navigate = useNavigate();
  const { mutateAsync: createRecipe } = useCreateRecipe();
  const { showToast } = useToast();
  const [showImporter, setShowImporter] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // method also returns register, handleSubmit, control, setFocus, watch, etc
  const methods = useForm<RecipeFormValues>({
    defaultValues: defaultRecipeFormValues,
  });
  const { register, handleSubmit, control, formState, reset, resetField } = methods;
  const { errors } = formState;
  const watchedFormValues = useWatch({ control });
  const hasIngredient = Boolean(
    watchedFormValues.ingredients?.some(({ ingredient }) => ingredient?.trim() !== '')
  );
  const hasStep = Boolean(
    watchedFormValues.steps?.some(({ step }) => step?.trim() !== '')
  );
  const canSaveRecipe = !!watchedFormValues.title?.trim() && hasIngredient && hasStep;

  const shouldConfirmCancel = hasDraftContent(watchedFormValues);
  const selectedPhoto = watchedFormValues.photo;
  const photoPreviewUrl = useMemo(() => {
    const file = selectedPhoto?.[0];
    return file ? URL.createObjectURL(file) : null;
  }, [selectedPhoto]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const onSubmit = async (data: RecipeFormValues) => {
    const { photo, ...recipeFields } = data;
    const photoFile = photo?.[0];
    const normalizedIngredients = data.ingredients
      .map((i) => i.ingredient.trim())
      .filter((ingredient) => ingredient !== '');
    const normalizedSteps = data.steps
      .map((s) => s.step.trim())
      .filter((step) => step !== '');

    const payload = {
      ...recipeFields,
      ingredients: normalizedIngredients,
      steps: normalizedSteps,
    };

    try {
      const createdRecipe = await createRecipe({
        recipe: payload,
        photo: photoFile,
      });
      showToast({
        status: 'success',
        message: 'Recipe created successfully!',
      });
      navigate(`/recipes/${createdRecipe.id}`, { replace: true });
    } catch (error) {
      showToast({
        status: 'error',
        message: 'Failed to create recipe. Please try again.',
      });
    }
  };

  const handleDiscard = () => {
    reset();
    navigate('/');
  };

  const handleParsedRecipe = (parsedRecipe: ParsedRecipe): void => {
    reset({
      title: parsedRecipe.title,
      yield: parsedRecipe.yield,
      source: parsedRecipe.source,
      notes: parsedRecipe.notes,
      ingredients: parsedRecipe.ingredients.map((ingredient) => ({ ingredient })),
      steps: parsedRecipe.steps.map((step) => ({ step })),
      tagIds: [],
      rating: 0,
      photo: undefined,
    });
    setShowImporter(false);
  };

  return (
    <PageShell className="p-6 md:h-dvh md:overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col md:h-full md:min-h-0">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-1 md:min-h-0"
          >
            <div className="shrink-0">
              <BackButton
                onClick={() =>
                  shouldConfirmCancel ? setShowCancelModal(true) : navigate(-1)
                }
              />
              <header className="mb-1 flex min-h-9 items-center justify-between">
                <h1 className="text-lg font-bold">Create new recipe</h1>
                <button
                  className="px-4 py-1.5 rounded-full flex gap-2 items-center
                    button-sm bg-accent text-sm font-bold text-white
                    shadow-sm transition hover:bg-blush-500"
                  type="button"
                  onClick={() => setShowImporter(true)}
                >
                  Import a recipe
                </button>
              </header>
              <div className="mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-[250px_minmax(0,1fr)] md:items-stretch">
                <div className="h-full space-y-2">
                  <RecipePhotoPicker
                    alt="Selected recipe"
                    imageUrl={photoPreviewUrl}
                    onRemovePhoto={() => resetField('photo')}
                    tileClassName="h-[250px] w-full rounded-xl md:w-[250px]"
                    inputProps={{
                      id: 'photo',
                      ...register('photo', {
                        validate: (files) => {
                          const file = files?.[0];
                          if (!file) return true;
                          return (
                            file.size <= MAX_SOURCE_PHOTO_SIZE ||
                            `Photo must be ${MAX_SOURCE_PHOTO_SIZE / (1024 * 1024)} MB or smaller`
                          );
                        },
                      }),
                    }}
                    error={errors.photo?.message}
                  />
                </div>
                <div
                  className="
                    relative z-20 md:sticky top-6 w-full self-start
                    p-4 border border-sage-300/50
                    rounded-xl shadow-sm shadow-gray-100
                    text-gray-600 dark:text-gray-300"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
                    <div className="flex min-w-0 flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="title"
                          className="field-label flex gap-1 items-center"
                        >
                          <IdCard className="h-3 w-3 text-gray-400" aria-hidden="true" />
                          <span>
                            Title
                            <span className="align-top text-red-500">*</span>
                          </span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          className="input-sm"
                          placeholder="e.g. Grandma's apple pie"
                          {...register('title', {
                            setValueAs: (value) => value.trim(),
                            validate: (value) => value !== '' || 'Title is required',
                          })}
                        />
                        {formState.isSubmitted && errors.title && (
                          <p className="text-xs text-red-500">{errors.title.message}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="yield"
                          className="field-label flex gap-1 items-center"
                        >
                          <PieChart
                            className="h-3 w-3 text-gray-400"
                            aria-hidden="true"
                          />
                          Yield
                        </label>
                        <input
                          id="yield"
                          type="text"
                          className="input-sm"
                          placeholder="e.g. 4 servings or 12 cookies"
                          {...register('yield')}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span
                          id="rating-label"
                          className="field-label flex gap-1 items-center"
                        >
                          <Star className="h-3 w-3 text-gray-400" aria-hidden="true" />
                          Rating
                        </span>
                        <Controller
                          name="rating"
                          control={control}
                          render={({ field }) => (
                            <Rating
                              id="rating"
                              ariaLabelledby="rating-label"
                              value={field.value}
                              onChange={field.onChange}
                              interactive
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="source"
                          className="field-label flex gap-1 items-center"
                        >
                          <Link2 className="h-3 w-3 text-gray-400" aria-hidden="true" />
                          Source
                        </label>
                        <input
                          type="text"
                          className="input-sm"
                          placeholder="Original recipe URL"
                          id="source"
                          {...register('source')}
                        ></input>
                      </div>
                      <div className="space-y-1 mb-4">
                        <label
                          htmlFor="tags-input"
                          className="field-label flex gap-1 items-center"
                        >
                          <TagIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
                          Tags
                        </label>
                        <Tags />
                      </div>
                    </div>
                    <div className="flex w-full min-w-0 flex-col lg:self-stretch">
                      <label
                        htmlFor="notes"
                        className="field-label text-gray-600 rounded-full dark:text-gray-300"
                      >
                        Notes
                      </label>
                      <textarea
                        className="
                          h-24 lg:h-full w-full p-2 rounded-md text-xs
                          resize-none bg-white border border-gray-200
                          focus:border-sage-300 focus:outline-none dark:border-gray-700
                          dark:bg-canvas-card dark:text-gray-100"
                        id="notes"
                        rows={4}
                        placeholder="e.g. too sweet, bake 2 min longer next time"
                        {...register('notes')}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-2 md:overflow-y-auto md:overflow-x-hidden md:pb-2 md:pr-2">
              <div className="order-1 flex flex-col md:order-none md:col-start-1 md:min-h-0">
                <div className="flex w-full min-w-0 max-w-125 flex-col gap-3 mt-4 md:mt-0 md:min-h-0 md:flex-1">
                  <div className="flex flex-col md:min-h-0 md:flex-1">
                    <div className="flex flex-row items-baseline gap-1">
                      <span
                        id="ingredients-label"
                        className="field-label text-gray-500 rounded-full dark:text-gray-300"
                      >
                        Ingredients
                        <span className="align-top text-red-500">*</span>
                      </span>
                    </div>
                    {errors.ingredients?.root?.message && (
                      <p id="ingredients-error" className="text-xs text-red-500">
                        {errors.ingredients.root.message}
                      </p>
                    )}
                    <IngredientsTable
                      keepAddButtonVisible
                      labelledBy="ingredients-label"
                      describedBy={
                        errors.ingredients?.root?.message
                          ? 'ingredients-error'
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="order-2 flex flex-col gap-3 md:order-0 md:col-start-2 md:min-h-0">
                <div className="flex w-full max-w-150 flex-col md:min-h-0 md:flex-1">
                  <div className="flex flex-row items-baseline gap-1">
                    <span
                      id="steps-label"
                      className="field-label text-gray-600 rounded-full dark:text-gray-300"
                    >
                      Steps
                      <span className="align-top text-red-500">*</span>
                    </span>
                  </div>
                  {errors.steps?.root?.message && (
                    <p id="steps-error" className="text-xs text-red-500">
                      {errors.steps.root.message}
                    </p>
                  )}
                  <StepsTable
                    keepAddButtonVisible
                    labelledBy="steps-label"
                    describedBy={errors.steps?.root?.message ? 'steps-error' : undefined}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex shrink-0 justify-end gap-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
              <button
                type="button"
                className="
                  text-white font-bold bg-gray-300 hover:bg-gray-400 px-4 py-1.5
                  rounded-full transition-colors text-sm shadow-sm"
                onClick={() =>
                  shouldConfirmCancel ? setShowCancelModal(true) : navigate(-1)
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSaveRecipe}
                className={classNames(
                  canSaveRecipe
                    ? 'bg-accent hover:bg-blush-500'
                    : 'bg-blush-200 cursor-not-allowed',
                  'font-bold px-4 py-1.5 rounded-full text-white transition-colors text-sm shadow-sm'
                )}
              >
                Save recipe
              </button>
            </div>
          </form>
        </FormProvider>
        {shouldConfirmCancel && showCancelModal && (
          <CancelModal
            onClose={() => setShowCancelModal(false)}
            onDiscard={() => handleDiscard()}
          />
        )}
        {showImporter && (
          <RecipeImporter
            onParsed={handleParsedRecipe}
            onClose={() => setShowImporter(false)}
          />
        )}
      </div>
    </PageShell>
  );
};

export default NewRecipe;
