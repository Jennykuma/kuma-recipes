import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Table from './Table';
import Rating from './Rating';

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
                                className="border border-gray-200 w-full mb-8"
                                {...register('title')}
                            ></input>

                            <label htmlFor="rating">Rating</label>
                            <Rating interactive />
                        </div>

                        <div className="w-5/8 p-8 border border-gray-200 rounded-sm shadow-sm">
                            <label htmlFor="ingredients">Ingredients</label>
                            <Table />

                            <label htmlFor="steps" className="block mt-8">
                                Steps
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NewRecipe;
