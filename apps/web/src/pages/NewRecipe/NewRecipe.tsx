import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import IngredientsTable from './components/IngredientsTable';
import Rating from '../../components/Rating';
import StepsTable from './components/StepsTable';
import { type RecipeFormValues } from '../../types/recipeForm';
import { useCreateRecipe } from '../../hooks';
import BackButton from '../../components/BackButton';
import CancelModal from './components/CancelModal';
import Tags from '../../components/Tags';
import RecipePhotoPicker from '../../components/RecipePhotoPicker';
import { MAX_SOURCE_PHOTO_SIZE } from '../../utils/resizeImageFile';
import { IdCard, PieChart, Star, RotateCcw, Link2, TagIcon } from 'lucide-react';

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
    const [showCancelModal, setShowCancelModal] = useState(false);

    // method also returns register, handleSubmit, control, setFocus, watch, etc
    const methods = useForm<RecipeFormValues>({
        defaultValues: defaultRecipeFormValues,
    });
    const { register, handleSubmit, control, formState, reset, resetField } = methods;
    const { errors } = formState;
    const watchedFormValues = useWatch({ control });
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

        const createdRecipe = await createRecipe({ recipe: payload, photo: photoFile });
        navigate(`/recipes/${createdRecipe.id}`);
    };

    const handleDiscard = () => {
        reset();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white p-6 text-gray-900 md:h-dvh md:overflow-hidden dark:bg-[#1f1f1f] dark:text-gray-100">
            <div className="mx-auto flex w-full max-w-7xl flex-col md:h-full md:min-h-0">
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col md:flex-1 md:min-h-0"
                    >
                        <div className="shrink-0">
                            <BackButton
                                onClick={() =>
                                    shouldConfirmCancel
                                        ? setShowCancelModal(true)
                                        : navigate(-1)
                                }
                            />
                            <header className="mb-1 flex min-h-9 items-center justify-between">
                                <h1 className="text-lg font-bold">Create new recipe</h1>
                            </header>
                            <div className="mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-[250px_minmax(0,1fr)] md:items-stretch">
                                <div className="h-full space-y-2">
                                    {/* <span className="block text-sm text-left font-semibold">
                                    Photo
                                </span> */}
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
                                                        file.size <=
                                                            MAX_SOURCE_PHOTO_SIZE ||
                                                        'Photo must be 15 MB or smaller'
                                                    );
                                                },
                                            }),
                                        }}
                                        error={errors.photo?.message}
                                    />
                                </div>
                                <div
                                    className="
                                md:sticky top-6 w-full self-start
                                p-4 border border-sage-300/50
                                rounded-xl shadow-sm shadow-gray-100
                                text-gray-600 dark:text-gray-300"
                                >
                                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                                        <div className="flex min-w-0 flex-col space-y-2">
                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor="title"
                                                    className="flex gap-1 items-center text-[10px] text-left uppercase tracking-wide"
                                                >
                                                    <IdCard
                                                        className="h-3 w-3 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span>
                                                        Title
                                                        <span className="align-top text-red-500">
                                                            *
                                                        </span>
                                                    </span>
                                                </label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    className="
                                                    w-full p-1.5 rounded-md text-xs resize-none
                                                    border border-gray-200 rounded-sm
                                                    placeholder:text-sm focus:border-sage-300 focus:outline-none"
                                                    placeholder="e.g. Grandma's apple pie"
                                                    {...register('title', {
                                                        setValueAs: (value) =>
                                                            value.trim(),
                                                        validate: (value) =>
                                                            value !== '' ||
                                                            'Title is required',
                                                    })}
                                                />
                                                {formState.isSubmitted &&
                                                    errors.title && (
                                                        <p className="text-xs text-red-500">
                                                            {errors.title.message}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor="yield"
                                                    className="flex gap-1 items-center text-[10px] text-left uppercase tracking-wide"
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
                                                    className="
                                        w-full p-1.5 rounded-md text-xs resize-none
                                        border border-gray-200 rounded-sm
                                        placeholder:text-sm focus:border-sage-300 focus:outline-none"
                                                    placeholder="e.g. 4 servings or 12 cookies"
                                                    {...register('yield')}
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label
                                                    htmlFor="rating"
                                                    className="flex gap-1 items-center text-[10px] text-left uppercase tracking-wide"
                                                >
                                                    <Star
                                                        className="h-3 w-3 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    Rating
                                                </label>
                                                <Controller
                                                    name="rating"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Rating
                                                            id="rating"
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
                                                    className="flex gap-1 items-center text-[10px] text-left uppercase tracking-wide"
                                                >
                                                    <Link2
                                                        className="h-3 w-3 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    Source
                                                </label>
                                                <input
                                                    type="text"
                                                    className="
                                        w-full p-1.5 rounded-md text-xs resize-none
                                        border border-gray-200 rounded-sm
                                        placeholder:text-sm focus:border-sage-300 focus:outline-none"
                                                    placeholder="Original recipe URL"
                                                    {...register('source')}
                                                ></input>
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="tags-input"
                                                    className="flex gap-1 items-center text-[10px] text-left uppercase tracking-wide"
                                                >
                                                    <TagIcon
                                                        className="h-3 w-3 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    Tags
                                                </label>
                                                <Tags />
                                            </div>
                                        </div>
                                        <div className="flex w-full min-w-0 flex-col lg:self-stretch">
                                            <label
                                                htmlFor="notes"
                                                className="text-[10px] uppercase tracking-wide text-gray-600 rounded-full dark:text-gray-300"
                                            >
                                                Notes
                                            </label>
                                            <textarea
                                                className="
                                            h-20 sm:h-24 lg:h-full w-full p-2 rounded-md text-xs
                                            resize-none bg-white border border-gray-200
                                            rounded-sm placeholder:text-xs focus:border-sage-300
                                            focus:outline-none dark:border-gray-700
                                            dark:bg-[#2a2a2a] dark:text-gray-100"
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
                                <div className="flex w-full min-w-0 max-w-125 flex-col gap-3 md:min-h-0 md:flex-1">
                                    <div className="flex flex-col md:min-h-0 md:flex-1">
                                        <div className="flex flex-row items-baseline gap-1">
                                            <label
                                                htmlFor="ingredients"
                                                className="text-[10px] uppercase tracking-wide text-gray-500 rounded-full dark:text-gray-300"
                                            >
                                                Ingredients
                                                <span className="align-top text-red-500">
                                                    *
                                                </span>
                                            </label>
                                        </div>
                                        {errors.ingredients?.root?.message && (
                                            <p className="text-xs text-red-500">
                                                {errors.ingredients.root.message}
                                            </p>
                                        )}
                                        <IngredientsTable keepAddButtonVisible />
                                    </div>
                                </div>
                            </div>

                            <div className="order-2 flex flex-col gap-3 md:order-none md:col-start-2 md:min-h-0">
                                <div className="flex w-full max-w-150 flex-col md:min-h-0 md:flex-1">
                                    <div className="flex flex-row items-baseline gap-1">
                                        <label
                                            htmlFor="steps"
                                            className="text-[10px] uppercase tracking-wide text-gray-600 rounded-full dark:text-gray-300"
                                        >
                                            Steps
                                            <span className="align-top text-red-500">
                                                *
                                            </span>
                                        </label>
                                    </div>
                                    {errors.steps?.root?.message && (
                                        <p className="text-xs text-red-500">
                                            {errors.steps.root.message}
                                        </p>
                                    )}
                                    <StepsTable keepAddButtonVisible />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex shrink-0 justify-end gap-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
                            <button
                                type="button"
                                className="
                                        font-jua text-sage-400 border border-sage-300
                                        bg-surface hover:bg-sage-100 px-4 py-1.5
                                        rounded-xl transition-colors"
                                onClick={() =>
                                    shouldConfirmCancel
                                        ? setShowCancelModal(true)
                                        : navigate(-1)
                                }
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="
                                        font-jua bg-blush-200 hover:bg-blush-400
                                        px-4 py-1.5 rounded-xl text-white transition-colors"
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
            </div>
        </div>
    );
};

export default NewRecipe;
