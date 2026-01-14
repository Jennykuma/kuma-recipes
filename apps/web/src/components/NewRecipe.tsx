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
        <div>
            <span>Create new recipe</span>
            <form>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    className="border border-gray-200 w-full"
                    {...register('title')}
                ></input>

                <label htmlFor="rating">Rating</label>
                <Rating interactive />

                <label htmlFor="ingredients">Ingredients</label>
                <Table />
            </form>
        </div>
    );
};

export default NewRecipe;
