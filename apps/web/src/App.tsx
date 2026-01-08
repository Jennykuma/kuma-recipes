import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { RecipeListItem } from '../../api/src/services/recipes.types';
import './App.css';

const listRecipes = async (): Promise<RecipeListItem[]> => {
    const response = await fetch('/api/recipes');
    if(!response.ok) { throw new Error('Error fetching recipes') }
    
    const json = await response.json();
    return json.recipes;
}

const App = () => {
    const { data: recipes, isLoading, error } = useQuery({
        queryKey: ['recipes'],
        queryFn: () => listRecipes()
    })

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
