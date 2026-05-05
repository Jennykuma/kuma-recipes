import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Tag as TagIcon, X } from 'lucide-react';
import type { Tag } from '../../../api/src/services/tags/tags.types';
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
        <div ref={containerRef} className="relative w-full sm:w-72">
            <div className="group relative">
                <TagIcon
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blush-400 pointer-events-none"
                />
                <input
                    type="search"
                    aria-label="Search recipes by tag"
                    placeholder={hasSelectedTags ? 'Add another tag' : 'Search by tag'}
                    value={query}
                    onFocus={() => setDropdownOpen(true)}
                    onChange={(event) => updateQuery(event.target.value)}
                    className="
                    border border-blush-200 w-full bg-white text-gray-800
                    pl-10 pr-16 py-1 rounded-xl text-sm
                    outline-none focus:border-blush-300 focus:ring-2 focus:ring-blush-100
                    placeholder:text-gray-400
                    dark:border-blush-300/70 dark:bg-[#2a2a2a] dark:text-gray-100
                    dark:placeholder:text-gray-400 dark:focus:ring-blush-400/20
                    "
                />
                <button
                    type="button"
                    aria-label={dropdownOpen ? 'Close tag dropdown' : 'Open tag dropdown'}
                    onClick={() => setDropdownOpen((open) => !open)}
                    className={`absolute top-1/2 -translate-y-1/2 ${caretOffsetClass} text-gray-300 hover:text-blush-400 focus:text-blush-400 group-hover:text-blush-400 group-focus-within:text-blush-400`}
                >
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${
                            dropdownOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </button>
                {hasSelectedTags && (
                    <button
                        type="button"
                        onClick={clearTags}
                        aria-label="Clear tag filters"
                        className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-blush-500
                    "
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {hasSelectedTags && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-xs text-gray-700 hover:bg-sage-100 dark:bg-sage-300/20 dark:text-sage-100 dark:hover:bg-sage-300/30"
                            onClick={() => removeTag(tag.id)}
                        >
                            {tag.name}
                            <X className="h-2.5 w-2.5 text-gray-400" />
                        </button>
                    ))}
                </div>
            )}

            {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-blush-100 bg-white shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a] dark:shadow-none">
                    {hasSelectedTags && (
                        <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-xs text-blush-500 hover:bg-blush-50 dark:text-blush-300 dark:hover:bg-blush-400/10"
                            onClick={clearTags}
                        >
                            All tags
                        </button>
                    )}
                    {isLoading && (
                        <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>
                    )}
                    {!isLoading && tagOptions.length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-400">
                            No tags found
                        </div>
                    )}
                    {tagOptions.map((tag) => (
                        <label
                            key={tag.id}
                            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-blush-50 dark:text-gray-100 dark:hover:bg-blush-400/10"
                        >
                            <span className="flex min-w-0 items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedIdSet.has(tag.id)}
                                    onChange={() => toggleTag(tag)}
                                    className="h-3.5 w-3.5 accent-blush-400"
                                />
                                <span className="truncate">{tag.name}</span>
                            </span>
                            {typeof tag.count === 'number' && (
                                <span className="ml-2 text-xs text-gray-400">
                                    {tag.count}
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeTagFilter;
