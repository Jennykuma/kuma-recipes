import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import NewRecipe from './pages/NewRecipe/NewRecipe';

const configuredBasePath =
    import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '');

const currentPath = window.location.pathname;
const isConfiguredBasePathActive =
    configuredBasePath === '/' ||
    currentPath === configuredBasePath ||
    currentPath.startsWith(`${configuredBasePath}/`);

const basePath = isConfiguredBasePathActive ? configuredBasePath : '/';

const router = createBrowserRouter(
    [
        { path: '/', element: <App /> },
        { path: 'recipes/:id', element: <RecipeDetails /> },
        { path: 'recipes/new', element: <NewRecipe /> },
    ],
    { basename: basePath }
);

export default router;
