import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes/recipes.types';
import type { Tag } from '../../api/src/services/tags/tags.types';
import useRecipes from './hooks/recipes/useRecipes';
import RecipeCard from './components/RecipeCard';
import RecipeTagFilter from './components/RecipeTagFilter';
import { Search, X } from 'lucide-react';
import './App.css';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const selectedTagSlugs = useMemo(
        () => selectedTags.map((tag) => tag.slug),
        [selectedTags]
    );
    const { recipes, isLoading, error } = useRecipes(selectedTagSlugs);

    const filteredRecipes = recipes?.filter((recipe: RecipeListItem) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error...</div>;

    return (
        <div className="min-h-screen bg-white p-6 text-gray-900 dark:bg-[#1f1f1f] dark:text-gray-100">
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
                    transition-colors
                    dark:border-blush-300/60 dark:bg-[#2a2a2a] dark:text-blush-300
                    dark:hover:bg-blush-400 dark:hover:text-white"
                    to={`/recipes/new`}
                >
                    Add recipe
                </Link>
            </header>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="relative w-full sm:w-100">
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
                        border border-blush-200 w-full bg-white text-gray-800
                        pl-10 pr-9 py-1 rounded-xl text-sm
                        outline-none focus:border-blush-300 focus:ring-2 focus:ring-blush-100
                        placeholder:text-gray-400
                        dark:border-blush-300/70 dark:bg-[#2a2a2a] dark:text-gray-100
                        dark:placeholder:text-gray-400 dark:focus:ring-blush-400/20
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

                <RecipeTagFilter selectedTags={selectedTags} onChange={setSelectedTags} />
            </div>
            <div
                className="
                grid grid-cols-[repeat(auto-fill,minmax(20rem,26rem))]
                gap-4 p-6 justify-start"
            >
                {filteredRecipes?.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        id={recipe.id}
                        rating={recipe.rating}
                        tags={recipe.tags}
                        title={recipe.title}
                        imagePath={recipe.imagePath}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
