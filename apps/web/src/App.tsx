import { Link } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes.types';
import useRecipes from './hooks/useRecipes';
import RecipeCard from './components/RecipeCard';
import './App.css';

const App = () => {
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <div className="p-6">
            <header className="flex justify-between">
                <h1>Kuma Recipes</h1>
                <Link
                    role="link"
                    tabIndex={0}
                    className="
                    inline-flex items-center gap-2 
                    text-xs text-blush-400
                    border border-blush-200 bg-white
                    px-2.5 py-1.5 rounded-full
                    hover:bg-blush-200 hover:text-white
                    transition-colors"
                    to={`/recipes/new`}
                >
                    Add recipe
                </Link>
            </header>
            <div
                className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                gap-4 p-6"
            >
                {recipes &&
                    recipes?.map((recipe: RecipeListItem) => {
                        return (
                            <RecipeCard
                                id={recipe.id}
                                rating={recipe.rating}
                                title={recipe.title}
                                key={recipe.id}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default App;
