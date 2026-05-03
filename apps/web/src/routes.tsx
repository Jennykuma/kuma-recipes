import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import NewRecipe from './pages/NewRecipe/NewRecipe';
import SignInPage from './pages/Authentication/SignIn';
import SignUpPage from './pages/Authentication/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

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
        { path: 'sign-in', element: <SignInPage /> },
        { path: 'sign-up', element: <SignUpPage /> },
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <App />
                </ProtectedRoute>
            ),
        },
        {
            path: 'recipes/:id',
            element: (
                <ProtectedRoute>
                    <RecipeDetails />
                </ProtectedRoute>
            ),
        },
        {
            path: 'recipes/new',
            element: (
                <ProtectedRoute>
                    <NewRecipe />
                </ProtectedRoute>
            ),
        },
    ],
    { basename: basePath }
);

export default router;
