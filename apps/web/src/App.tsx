import { Link } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes/recipes.types';
import useRecipes from './hooks/recipes/useRecipes';
import RecipeCard from './components/RecipeCard';
import './App.css';

const App = () => {
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <div className="p-6">
            <header className="flex justify-between">
                <Link role="link" className="font-nanum text-2xl link-blush" to={'/'}>
                    Kuma Recipes 🧸
                </Link>
                <Link
                    role="link"
                    tabIndex={0}
                    className="
                    inline-flex items-center gap-2 
                    font-jua text-sm text-blush-500
                    border border-blush-200 bg-white
                    px-4 py-2 rounded-xl
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
                gap-4 p-6 justify-items-center"
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
