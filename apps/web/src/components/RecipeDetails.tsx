import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecipeDetails, useRecipeRating } from '../hooks/';
import Rating from './Rating';

const RecipeDetails = () => {
    const { id } = useParams();
    const { recipe } = useRecipeDetails(id || '');
    const { mutate: updateRating, isPending } = useRecipeRating(id || '');

    const handleChangeRating = (rating: number) => {
        if (!recipe) {
            return;
        }

        if (recipe?.rating !== rating) {
            updateRating(rating);
        }
    };

    return (
        <div>
            <span>{recipe?.title}</span>
            <Rating
                rating={recipe?.rating}
                onChange={handleChangeRating}
                interactive={!isPending}
            />
        </div>
    );
};

export default RecipeDetails;
