import { Link, useSearchParams } from 'react-router-dom';
import type { RecipeListItem } from '../../api/src/services/recipes/recipes.types';
import type { Tag } from '../../api/src/services/tags/tags.types';
import useRecipes from './hooks/recipes/useRecipes';
import PageState from './components/PageState';
import PageShell from './components/PageShell';
import RecipeCard from './components/RecipeCard';
import RecipeTagFilter from './components/RecipeTagFilter';
import Search from './widgets/Search';
import { useTagsQuery } from './hooks';
import './App.css';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') || '';
  const selectedTagSlugs = searchParams.getAll('tags');
  const { data: allTags = [] } = useTagsQuery('');
  const { recipes, isLoading, error, refetch } = useRecipes(selectedTagSlugs);

  const filteredRecipes = recipes?.filter((recipe: RecipeListItem) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTags = allTags.filter((tag) => selectedTagSlugs.includes(tag.slug));

  const handleUpdateSearch = (nextSearchTerm: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    if (nextSearchTerm.trim()) updatedSearchParams.set('q', nextSearchTerm);
    else updatedSearchParams.delete('q');
    setSearchParams(updatedSearchParams, { replace: true });
  };

  const handleSelectedTagsChange = (nextTags: Tag[]) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.delete('tags');
    nextTags.forEach((tag) => updatedSearchParams.append('tags', tag.slug));
    setSearchParams(updatedSearchParams, { replace: true });
  };

  if (isLoading) {
    return (
      <PageState
        variant="loading"
        title="Warming up the kitchen"
        message="Getting your saved recipes and tags ready."
      />
    );
  }

  if (error) {
    return (
      <PageState
        variant="error"
        title="A little kitchen hiccup"
        message={error instanceof Error ? error.message : 'Please refresh and try again.'}
        actionLabel="Try again"
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <PageShell className="p-4 sm:p-6 xl:px-10">
      <div className="mx-auto flex w-full max-w-[120rem] flex-col">
        <header className="flex justify-between gap-4">
          <Link role="link" className="font-nanum text-2xl link-blush" to={'/'}>
            Kuma Recipes 🧸
          </Link>
          <Link
            role="link"
            tabIndex={0}
            className="
              inline-flex items-center gap-2 rounded-full
              bg-accent px-4 py-2 text-sm font-bold
              text-white shadow-sm transition hover:bg-blush-500"
            to={`/recipes/new`}
          >
            Add recipe
          </Link>
        </header>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
          <Search value={searchTerm} onChange={handleUpdateSearch} />
          <RecipeTagFilter
            selectedTags={selectedTags}
            onChange={handleSelectedTagsChange}
          />
          {searchTerm || selectedTags.length > 0 ? (
            <span className="self-center text-xs text-gray-500 dark:text-gray-400 italic">
              {filteredRecipes?.length} recipe
              {filteredRecipes?.length !== 1 ? 's' : ''} found
            </span>
          ) : null}
        </div>
        <div
          data-testid="recipe-list"
          className="
            grid grid-cols-1 gap-4 pt-6 pb-6
            sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
    </PageShell>
  );
};

export default App;
