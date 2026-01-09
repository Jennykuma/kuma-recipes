import React from 'react';
import type { RecipeListItem } from '../../api/src/services/recipes.types';
import useRecipes from './hooks/useRecipes';
import RecipeCard from './components/RecipeCard';
import './App.css';

const App = () => {
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes &&
                recipes?.map((recipe: RecipeListItem) => {
                    // return <div key={recipe.id}>{recipe.title}</div>
                    return <RecipeCard title={recipe.title} key={recipe.id} />;
                })}
        </div>
    );
};

export default App;
