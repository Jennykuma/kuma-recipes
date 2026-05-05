import { useState } from 'react';
import {
    useForm,
    FormProvider,
    Controller,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import IngredientsTable from './components/IngredientsTable';
import Rating from '../../components/Rating';
import StepsTable from './components/StepsTable';
import { recipe as recipeApi } from '../../api';
import { type RecipeFormValues } from '../../types/recipeForm';
import BackButton from '../../components/BackButton';
import CancelModal from './components/CancelModal';
import Tags from '../../components/Tags';

const NewRecipe = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [showCancelModal, setShowCancelModal] = useState(false);

    // method also returns register, handleSubmit, control, setFocus, watch, etc
    const methods = useForm<RecipeFormValues>({
        defaultValues: {
            title: '',
            source: '',
            notes: '',
            rating: 0,
            remake: false,
            tagIds: [],
            ingredients: [{ ingredient: '' }],
            steps: [{ step: '' }],
        },
    });
    const { register, handleSubmit, control, formState, reset } = methods;
    const { errors } = formState;
    const shouldConfirmCancel = formState.isDirty;

    const onSubmit = async (data: RecipeFormValues) => {
        console.log('Submitting recipe with data:', data);
        const normalizedIngredients = data.ingredients
            .map((i) => i.ingredient.trim())
            .filter((ingredient) => ingredient !== '');
        const normalizedSteps = data.steps
            .map((s) => s.step.trim())
            .filter((step) => step !== '');

        const payload = {
            ...data,
            ingredients: normalizedIngredients,
            steps: normalizedSteps,
        };
        const token = await getToken();
        if (!token) {
            throw new Error('Missing auth token');
        }

        const response = await recipeApi.createRecipe(payload, token);
        navigate(`/recipes/${response.id}`);
    };

    const handleDiscard = () => {
        reset();
        navigate('/');
    };

    return (
        <div className="h-dvh p-6 box-border">
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col space-y-2">
                <BackButton
                    onClick={() =>
                        shouldConfirmCancel ? setShowCancelModal(true) : navigate(-1)
                    }
                />
                <header className="shrink-0 text-lg text-left font-bold">
                    Create new recipe
                </header>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-h-0">
                        <div className="h-full md:flex gap-8 min-h-0 items-stretch">
                            <div
                                className="
                            md:sticky top-6 w-full md:w-1/3 self-start
                            p-6 space-y-6 border border-sage-300/50
                            rounded-md shadow-sm shadow-gray-100"
                            >
                                <div className="space-y-1">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm text-left font-semibold"
                                    >
                                        Title
                                        <span className="align-top text-red-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="
                                        w-full pl-1 rounded-md border border-gray-200
                                        focus:border-sage-300 focus:outline-none"
                                        {...register('title', {
                                            setValueAs: (value) => value.trim(),
                                            validate: (value) =>
                                                value !== '' || 'Title is required',
                                        })}
                                    />
                                    {formState.isSubmitted && errors.title && (
                                        <p className="text-xs text-red-500">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 items-center">
                                    <label
                                        htmlFor="rating"
                                        className="block text-sm text-left font-semibold"
                                    >
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

                                <div className="flex gap-2 items-center">
                                    <label
                                        htmlFor="remake"
                                        className="block text-sm text-left font-semibold"
                                    >
                                        Remake?
                                    </label>
                                    <input type="checkbox" {...register('remake')} />
                                </div>

                                <div className="space-y-1">
                                    <div className="space-y-0.5">
                                        <label
                                            htmlFor="source"
                                            className="block text-sm text-left font-semibold"
                                        >
                                            Source
                                        </label>
                                        <span className="block text-[11px] text-left text-gray-400">
                                            Original recipe link
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="
                                        w-full p-2 rounded-md text-xs resize-none
                                        border border-gray-200 rounded-sm
                                        placeholder:text-sm focus:border-sage-300 focus:outline-none"
                                        placeholder="URL"
                                        {...register('source')}
                                    ></input>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="notes"
                                        className="block text-sm text-left font-semibold"
                                    >
                                        Notes
                                    </label>
                                    <span className="block text-[11px] text-left text-gray-400">
                                        Messy thoughts are welcome
                                    </span>
                                    <textarea
                                        className="
                                        w-full p-2 rounded-md text-xs resize-none
                                        border border-gray-200 rounded-sm placeholder:text-xs
                                        focus:border-sage-300 focus:outline-none"
                                        rows={4}
                                        placeholder="e.g. too sweet, bake 2 min longer next time"
                                        {...register('notes')}
                                    ></textarea>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="tags-input"
                                        className="block text-sm text-left font-semibold"
                                    >
                                        Tags
                                    </label>
                                    <Tags />
                                </div>
                            </div>

                            <div
                                className="
                            w-full md:w-2/3 md:h-full self-stretch
                            flex flex-col min-h-0 border border-sage-300/50
                            rounded-md shadow-sm shadow-gray-100"
                            >
                                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 pb-28">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="ingredients"
                                            className="block text-sm text-left font-semibold"
                                        >
                                            Ingredients
                                            <span className="align-top text-red-500">
                                                *
                                            </span>
                                        </label>
                                        {errors.ingredients?.root?.message && (
                                            <p className="text-xs text-red-500">
                                                {errors.ingredients.root.message}
                                            </p>
                                        )}
                                        <IngredientsTable />
                                    </div>

                                    <hr className="border-gray-100 border-t-1" />

                                    <div className="space-y-1">
                                        <label
                                            htmlFor="steps"
                                            className="block text-sm text-left font-semibold"
                                        >
                                            Steps
                                            <span className="align-top text-red-500">
                                                *
                                            </span>
                                        </label>
                                        {errors.steps?.root?.message && (
                                            <p className="text-xs text-red-500">
                                                {errors.steps.root.message}
                                            </p>
                                        )}
                                        <StepsTable />
                                    </div>
                                </div>

                                <div className="shrink-0 border-t border-gray-200 text-sm p-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="
                                        font-jua text-sage-400 border border-sage-300
                                        bg-surface hover:bg-sage-100 px-5 py-2.5
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
                                        px-5 py-2.5 rounded-xl text-white transition-colors"
                                    >
                                        Save recipe
                                    </button>
                                </div>
                            </div>
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
