import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import IngredientTable from '../components/IngredientTable';
import Rating from '../components/Rating';
import StepsTable from '../components/StepsTable';

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
            <header className="text-lg text-left font-bold">Create new recipe</header>
            <div className="w-full h-screen">
                <form>
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                        <div className="md:sticky top-6 w-full md:w-2/8 p-6 space-y-6 border border-gray-200 rounded-md shadow-sm shadow-gray-100 self-start">
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

                        <div className="w-full md:w-6/8 p-6 space-y-6 border border-gray-200 rounded-md shadow-sm shadow-gray-100">
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
