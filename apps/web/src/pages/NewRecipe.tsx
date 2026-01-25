import React from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import IngredientTable from '../components/IngredientTable';
import Rating from '../components/Rating';
import StepsTable from '../components/StepsTable';

type RecipeFormValues = {
    title: string;
    url: string;
    notes: string;
    rating: number;
    remake: boolean;
    tags: string[];
    ingriedients: { ingriedient: string }[];
    steps: { step: string }[];
};

const NewRecipe = () => {
    const { register, handleSubmit } = useForm<RecipeFormValues>();
    const onSubmit = (data: RecipeFormValues) => {
        const payload = {
            ...data,
            ingredients: data.ingriedients.map((i) => i.ingriedient),
            steps: data.steps.map((s) => s.step),
        };

        console.log(payload);
    };

    return (
        <div className="h-dvh flex flex-col p-6 box-border">
            <header className="shrink-0 text-lg text-left font-bold">
                Create new recipe
            </header>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-h-0">
                <div className="h-full md:flex gap-8 min-h-0 items-stretch">
                    <div className="md:sticky top-6 w-full md:w-1/3 self-start p-6 space-y-6 border border-gray-200 rounded-md shadow-sm shadow-gray-100">
                        <div className="space-y-1">
                            <label
                                htmlFor="title"
                                className="block text-sm text-left font-semibold"
                            >
                                Title<span className="align-top text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="w-full pl-1 rounded-md border border-gray-200"
                                {...register('title')}
                            ></input>
                        </div>

                        <div className="flex gap-2 items-center">
                            <label
                                htmlFor="rating"
                                className="block text-sm text-left font-semibold"
                            >
                                Rating
                            </label>
                            <Rating interactive />
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
                                className="w-full p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-xs"
                                rows={4}
                                placeholder="e.g. too sweet, bake 2 min longer next time"
                                {...register('notes')}
                            ></textarea>
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
                                type="url"
                                className="w-full p-2 rounded-md text-xs resize-none border border-gray-200 rounded-sm placeholder:text-sm"
                                placeholder="URL"
                                {...register('url')}
                            ></input>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 md:h-full self-stretch flex flex-col min-h-0 border border-gray-200 rounded-md shadow-sm shadow-gray-100">
                        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 pb-28">
                            <div className="space-y-1">
                                <label
                                    htmlFor="ingredients"
                                    className="block text-sm text-left font-semibold"
                                >
                                    Ingredients
                                    <span className="align-top text-red-500">*</span>
                                </label>
                                <IngredientTable />
                            </div>

                            <hr className="border-gray-100 border-t-1" />

                            <div className="space-y-1">
                                <label
                                    htmlFor="steps"
                                    className="block text-sm text-left font-semibold"
                                >
                                    Steps
                                    <span className="align-top text-red-500">*</span>
                                </label>
                                <StepsTable />
                            </div>
                        </div>

                        <div className="shrink-0 bg-white border-t border-gray-200 text-xs p-4 flex justify-end gap-3">
                            <button type="button">Cancel</button>
                            <button type="submit">Save recipe</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewRecipe;
