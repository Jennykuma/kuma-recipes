import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Tag as TagIcon, X } from 'lucide-react';
import type { Tag } from 'shared';
import useTagsQuery from '../hooks/tags/useTagsQuery';

type RecipeTagFilterProps = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

const RecipeTagFilter = ({ selectedTags, onChange }: RecipeTagFilterProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSelectedTags = selectedTags.length > 0;
  const selectedIdSet = useMemo(
    () => new Set(selectedTags.map((tag) => tag.id)),
    [selectedTags]
  );

  const { data: tagOptions = [], isLoading } = useTagsQuery(debouncedQuery);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectTag = (tag: Tag) => {
    if (selectedIdSet.has(tag.id)) return;
    onChange([...selectedTags, tag]);
    setQuery('');
    setDropdownOpen(true);
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const toggleTag = (tag: Tag) => {
    if (selectedIdSet.has(tag.id)) {
      removeTag(tag.id);
      setDropdownOpen(true);
      return;
    }

    selectTag(tag);
  };

  const clearTags = () => {
    onChange([]);
    setQuery('');
    setDropdownOpen(false);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setDropdownOpen(true);
  };

  const caretOffsetClass = hasSelectedTags ? 'right-9' : 'right-3';

  return (
    <div ref={containerRef} className="relative w-full sm:w-96">
      <div
        className="
          group relative flex min-h-[30px] w-full flex-wrap items-center gap-1
          rounded-xl border border-blush-200 bg-white py-1 pl-10 pr-16
          text-gray-800
          focus-within:border-blush-300 focus-within:ring-2 focus-within:ring-blush-100
          dark:border-blush-300/70 dark:bg-canvas-card dark:text-gray-100
          dark:focus-within:ring-blush-400/20"
      >
        <TagIcon
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-400 pointer-events-none"
        />
        {selectedTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-xs text-gray-700 hover:bg-sage-100 dark:bg-sage-300/20 dark:text-sage-100 dark:hover:bg-sage-300/30"
            onClick={(event) => {
              event.stopPropagation();
              removeTag(tag.id);
              inputRef.current?.focus();
            }}
          >
            {tag.name}
            <X className="h-2.5 w-2.5 text-gray-400" />
          </button>
        ))}
        <input
          ref={inputRef}
          type="text"
          aria-label="Search recipes by tag"
          placeholder={hasSelectedTags ? 'Add another tag' : 'Search by tag'}
          value={query}
          onFocus={() => setDropdownOpen(true)}
          onChange={(event) => updateQuery(event.target.value)}
          className="
            min-w-[110px] flex-1 border-0 bg-transparent text-sm
            outline-none
            placeholder:text-gray-400
            dark:text-gray-100 dark:placeholder:text-gray-400"
        />
        <button
          type="button"
          aria-label={dropdownOpen ? 'Close tag dropdown' : 'Open tag dropdown'}
          onClick={(event) => {
            event.stopPropagation();
            setDropdownOpen((open) => !open);
            inputRef.current?.focus();
          }}
          className={`absolute top-1/2 -translate-y-1/2 ${caretOffsetClass} text-gray-300 hover:text-blush-400 focus:text-blush-400 group-hover:text-blush-400 group-focus-within:text-blush-400`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        {hasSelectedTags && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              clearTags();
            }}
            aria-label="Clear tag filters"
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-blush-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-blush-100 bg-white shadow-sm dark:border-gray-700 dark:bg-canvas-card dark:shadow-none">
          {hasSelectedTags && (
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-xs text-blush-500 hover:bg-blush-50 dark:text-blush-300 dark:hover:bg-blush-400/10"
              onClick={clearTags}
            >
              All tags
            </button>
          )}
          {isLoading && <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>}
          {!isLoading && tagOptions.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-400">No tags found</div>
          )}
          {tagOptions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag)}
              className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-blush-50 dark:text-gray-100 dark:hover:bg-blush-400/10"
            >
              <span className="min-w-0 truncate">{tag.name}</span>
              <span className="ml-2 flex items-center gap-2">
                {selectedIdSet.has(tag.id) && (
                  <span className="text-[10px] text-gray-400">selected</span>
                )}
                {typeof tag.count === 'number' && (
                  <span className="text-xs text-gray-400">{tag.count}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeTagFilter;
