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
                    <div className="flex gap-8">
                        <div className="w-3/8 p-8 border border-gray-200 rounded-sm shadow-sm">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                className="border border-gray-200 w-full mb-4"
                                {...register('title')}
                            ></input>

                            <label htmlFor="rating">Rating</label>
                            <Rating interactive />

                            <label htmlFor="remake" className="block mt-4">
                                Remake?
                                <input
                                    type="checkbox"
                                    className="ml-2"
                                    {...register('remake')}
                                />
                            </label>

                            <label htmlFor="notes" className="block mt-4">
                                Notes
                            </label>
                            <textarea
                                className="w-full resize-none border border-gray-200 rounded-sm p-2"
                                rows={4}
                                placeholder="Notes (e.g. too sweet, bake 2 min longer next time)"
                            ></textarea>
                        </div>

                        <div className="w-5/8 p-8 border border-gray-200 rounded-sm shadow-sm">
                            <label htmlFor="ingredients">Ingredients</label>
                            <IngredientTable />
                            <hr className="mt-8 border-gray-200 border-t-1" />
                            <label htmlFor="steps" className="block mt-8">
                                Steps
                            </label>
                            <StepsTable />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewRecipe;
