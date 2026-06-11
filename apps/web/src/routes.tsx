import { createBrowserRouter } from 'react-router-dom';
import App from './App';
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
      lazy: async () => {
        const { default: RecipeDetails } =
          await import('./pages/RecipeDetails/RecipeDetails.tsx');

        return {
          Component: () => (
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          ),
        };
      },
    },
    {
      path: 'recipes/new',
      lazy: async () => {
        const { default: NewRecipe } = await import('./pages/NewRecipe/NewRecipe.tsx');

        return {
          Component: () => (
            <ProtectedRoute>
              <NewRecipe />
            </ProtectedRoute>
          ),
        };
      },
    },
    {
      path: 'shared-recipes/:token',
      lazy: async () => {
        const { default: SharedRecipeDetails } =
          await import('./pages/RecipeDetails/SharedRecipeDetails.tsx');

        return {
          Component: SharedRecipeDetails,
        };
      },
    },
  ],
  { basename: basePath }
);

export default router;
