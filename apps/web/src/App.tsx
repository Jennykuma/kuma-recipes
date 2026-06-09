import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes/recipes.types';
import type { Tag } from '../../api/src/services/tags/tags.types';
import useRecipes from './hooks/recipes/useRecipes';
import RecipeCard from './components/RecipeCard';
import RecipeTagFilter from './components/RecipeTagFilter';
import Search from './widgets/Search';
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
            <div className="mx-auto flex w-full max-w-[82rem] flex-col">
                <header className="flex justify-between gap-4">
                    <Link role="link" className="font-nanum text-2xl link-blush" to={'/'}>
                        Kuma Recipes 🧸
                    </Link>
                    <Link
                        role="link"
                        tabIndex={0}
                        className="
                            inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                            font-jua text-sm text-white transition-colors
                            bg-blush-400 hover:bg-blush-500 hover:text-white"
                        to={`/recipes/new`}
                    >
                        Add recipe
                    </Link>
                </header>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
                    <Search value={searchTerm} onChange={setSearchTerm} />
                    <RecipeTagFilter selectedTags={selectedTags} onChange={setSelectedTags} />
                    {searchTerm || selectedTags.length > 0 ? (
                        <span className="self-center text-xs text-gray-500 dark:text-gray-400 italic">
                            {filteredRecipes?.length} recipe
                            {filteredRecipes?.length !== 1 ? 's' : ''} found
                        </span>
                    ) : null}
                </div>
                <div
                    className="
                        grid grid-cols-1 gap-4 pt-6 pb-6
                        md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
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
        </div>
    );
};

export default App;
