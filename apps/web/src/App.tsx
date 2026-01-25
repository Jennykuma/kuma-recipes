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
        <div>
            <Link
                role="link"
                tabIndex={0}
                className="border border-gray-200 rounded-sm shadow-sm hover:shadow-none cursor-pointer"
                to={`/recipes/new`}
            >
                Add recipe
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
