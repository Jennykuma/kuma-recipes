import React from 'react';
import { useParams } from 'react-router-dom';
import useRecipeDetails from '../hooks/useRecipeDetails';
import Rating from './Rating';

const RecipeDetails = () => {
    const { id } = useParams();
    const { recipe } = useRecipeDetails(id || '');

    return (
        <div>
            <span>{recipe?.title}</span>
            <Rating rating={recipe?.rating} />
        </div>
    );
};

export default RecipeDetails;
