import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RecipeDetails from './pages/RecipeDetails';
import NewRecipe from './pages/NewRecipe';

const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: 'recipes/:id', element: <RecipeDetails /> },
    { path: 'recipes/new', element: <NewRecipe /> },
]);

export default router;
