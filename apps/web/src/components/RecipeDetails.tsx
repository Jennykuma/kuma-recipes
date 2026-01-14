import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecipeDetails, useRecipeRating } from '../hooks/';
import Rating from './Rating';

const RecipeDetails = () => {
    const { id } = useParams();
    const { recipe } = useRecipeDetails(id || '');
    const { mutate: updateRating } = useRecipeRating(id || '');

    return (
        <div>
            <span>{recipe?.title}</span>
            <Rating
                rating={recipe?.rating}
                onChange={(rating: number) => updateRating(rating)}
                interactive
            />
        </div>
    );
};

export default RecipeDetails;
