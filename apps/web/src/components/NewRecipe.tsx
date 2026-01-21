import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import IngredientTable from './IngredientTable';
import Rating from './Rating';
import StepsTable from './StepsTable';

interface IRecipeFormInput {
    ingredients: JSON;
    notes: string;
    rating: number;
    remake: boolean;
    steps: JSON;
    tags: string[];
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

const NewRecipe = () => {
    const { register, handleSubmit } = useForm<IRecipeFormInput>();

    return (
        <>
            <span>Create new recipe</span>
            <div className="w-full h-screen">
                <form>
                    <div className="flex gap-8 items-start">
                        <div className="sticky top-6 w-3/8 p-6 space-y-6 border border-gray-200 rounded-md shadow-sm self-start">
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
                                    className="w-full border border-gray-200 pl-1"
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
                                <textarea
                                    className="w-full text-xs resize-none border border-gray-200 rounded-sm p-2 placeholder:text-xs"
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
                                    className="w-full text-xs resize-none border border-gray-200 rounded-sm p-2 placeholder:text-sm"
                                    placeholder="URL"
                                    {...register('url')}
                                ></input>
                            </div>
                        </div>

                        <div className="w-5/8 p-6 space-y-6 border border-gray-200 rounded-md shadow-sm">
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
                                    Steps<span className="align-top text-red-500">*</span>
                                </label>
                                <StepsTable />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewRecipe;
