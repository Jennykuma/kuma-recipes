import React from 'react';
import type { RecipeListItem } from '../../api/src/services/recipes.types';
import useRecipes from './hooks/useRecipes';
import './App.css';

const App = () => {
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) return (<div>Loading...</div>)
    if (error) return (<div>Error...</div>)

    return (
        <>
            {recipes && 
                recipes?.map((recipe: RecipeListItem) => {
                    return <div key={recipe.id}>{recipe.title}</div>
                })
            }
        </>
    );
}

export default App;
