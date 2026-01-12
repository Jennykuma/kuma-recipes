import React from 'react';
import { useParams } from 'react-router-dom';
import useRecipeDetails from '../hooks/useRecipeDetails';

const RecipeDetails = () => {
    const { id } = useParams();
    const { recipe } = useRecipeDetails(id || '');
    console.log('recipe: ', recipe);

    return <div>{recipe?.title}</div>;
};

export default RecipeDetails;
