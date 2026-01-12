import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RecipeDetails from './components/RecipeDetails';

const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: 'recipes/:id', element: <RecipeDetails /> },
]);

export default router;
