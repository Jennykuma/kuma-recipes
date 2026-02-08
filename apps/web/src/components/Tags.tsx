import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCreateTag, useDeleteTag, useTagsQuery } from '../hooks';
import { type RecipeFormValues } from '../types/recipeForm';
import type { Tag } from '../../../api/src/services/tags/tags.types';
import { Plus, X } from 'lucide-react';

const Tags = () => {
    const { control, setValue } = useFormContext<RecipeFormValues>();
    const watchedTagIds = useWatch({ control, name: 'tagIds' });
    const selectedIds = useMemo(() => watchedTagIds ?? [], [watchedTagIds]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: options = [], isLoading } = useTagsQuery(debouncedQuery);
    const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
    const { mutateAsync: deleteTag } = useDeleteTag();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const id = window.setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => {
            window.clearTimeout(id);
        };
    }, [query]);

    const selectedIdsKey = useMemo(() => selectedIds.join('|'), [selectedIds]);

    useEffect(() => {
        setSelectedTags((prev) => {
            const map = new Map<string, Tag>();
            prev.forEach((tag) => map.set(tag.id, tag));
            options.forEach((tag) => {
                if (selectedIds.includes(tag.id)) {
                    map.set(tag.id, tag);
                }
            });

            const next = Array.from(map.values()).filter((tag) =>
                selectedIds.includes(tag.id)
            );

            const same =
                prev.length === next.length &&
                prev.every(
                    (tag, index) =>
                        tag.id === next[index]?.id && tag.name === next[index]?.name
                );

            return same ? prev : next;
        });
    }, [options, selectedIdsKey]);

    const selectTag = (tag: Tag) => {
        if (selectedIds.includes(tag.id)) return;
        setValue('tagIds', [...selectedIds, tag.id], {
            shouldDirty: true,
            shouldTouch: true,
        });
        setSelectedTags((prev) => [...prev, tag]);
        setQuery('');
    };

    const removeTag = (id: string) => {
        setValue(
            'tagIds',
            selectedIds.filter((tagId) => tagId !== id),
            { shouldDirty: true, shouldTouch: true }
        );
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    const handleDeleteTag = async (id: string) => {
        await deleteTag(id);
        removeTag(id);
    };

    const createTagFromQuery = async () => {
        const name = query.trim();
        if (!name) return;
        try {
            const tag = await createTag(name);
            if (tag) selectTag(tag);
        } finally {
            setQuery('');
        }
    };

    const hasExactMatch = useMemo(
        () =>
            options.some(
                (tag: Tag) => tag.name.toLowerCase() === query.trim().toLowerCase()
            ),
        [options, query]
    );

    return (
        <div ref={containerRef} className="w-full">
            <div
                className="min-h-[38px] w-full rounded-md border border-gray-200 bg-white px-2 py-1 flex flex-wrap gap-1 items-center"
                role="button"
                tabIndex={0}
                onClick={() => setDropdownOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        setDropdownOpen(true);
                    }
                }}
            >
                {selectedTags.map((tag) => (
                    <button
                        key={tag.id}
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-xs text-gray-700"
                        onClick={(event) => {
                            event.stopPropagation();
                            removeTag(tag.id);
                        }}
                    >
                        {tag.name}
                        <span className="text-gray-400">
                            <X className="w-2 h-2" />
                        </span>
                    </button>
                ))}
                <input
                    type="text"
                    className="flex-1 min-w-[120px] border-0 bg-transparent text-sm focus:outline-none"
                    placeholder="Add tags..."
                    value={query}
                    onFocus={() => setDropdownOpen(true)}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            if (!hasExactMatch) {
                                void createTagFromQuery();
                            }
                        }
                    }}
                />
            </div>

            {dropdownOpen && (
                <div className="mt-2 max-h-64 overflow-auto rounded-md border border-gray-100 bg-white shadow-sm">
                    {(isLoading || isCreating) && (
                        <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>
                    )}
                    {!isLoading && options.length === 0 && query.trim() === '' && (
                        <div className="px-3 py-2 text-xs text-gray-400">
                            No tags yet. Type to create.
                        </div>
                    )}
                    {!isLoading && query.trim() !== '' && !hasExactMatch && (
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-blush-400 hover:bg-blush-50"
                            onClick={createTagFromQuery}
                        >
                            <Plus className="w-3 h-3 mr-1 mb-0.5 inline" /> Create &quot;
                            {query.trim()}&quot;
                        </button>
                    )}
                    {options.map((tag: Tag) => {
                        const isSelected = selectedIds.includes(tag.id);
                        return (
                            <div
                                key={tag.id}
                                className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                            >
                                <button
                                    type="button"
                                    className="flex-1 text-left"
                                    onClick={() => selectTag(tag)}
                                    disabled={isSelected}
                                >
                                    {tag.name}
                                </button>
                                <span className="flex items-center gap-2">
                                    {isSelected && (
                                        <span className="text-[10px] text-gray-400">
                                            selected
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="text-[15px] text-gray-400 hover:text-red-400"
                                        onClick={() => {
                                            void handleDeleteTag(tag.id);
                                        }}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Tags;
