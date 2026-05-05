import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes/recipes.types';
import useRecipes from './hooks/recipes/useRecipes';
import RecipeCard from './components/RecipeCard';
import { Search, X } from 'lucide-react';
import './App.css';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { recipes, isLoading, error } = useRecipes();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    const filteredRecipes = recipes?.filter((recipe: RecipeListItem) =>
        recipe?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="relative w-100">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-400 pointer-events-none"
                />
                <input
                    type="search"
                    placeholder="Search recipes by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                    border border-blush-200 w-full
                    pl-10 pr-9 py-1 rounded-xl text-sm
                    outline-none focus:border-blush-300 focus:ring-2 focus:ring-blush-100
                    "
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                        className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-blush-500
                    "
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <div
                className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                gap-4 p-6 justify-items-center"
            >
                {filteredRecipes?.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        id={recipe.id}
                        rating={recipe.rating}
                        title={recipe.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
