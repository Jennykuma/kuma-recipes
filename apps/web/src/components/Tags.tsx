import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import useCreateTag from '../hooks/tags/useCreateTag';
import useDeleteTag from '../hooks/tags/useDeleteTag';
import useTagsQuery from '../hooks/tags/useTagsQuery';
import type { Tag } from '../../../api/src/services/tags/tags.types';
import { Plus, X } from 'lucide-react';

const EMPTY_SELECTED_IDS: string[] = [];
const TAG_NAME_MAX_LENGTH = 24;
type TagsFormValues = {
    tagIds: string[];
};

type TagsProps = {
    autoFocusInput?: boolean;
};

const Tags = ({ autoFocusInput = false }: TagsProps) => {
    const { control, setValue } = useFormContext<TagsFormValues>();
    const watchedTagIds = useWatch({ control, name: 'tagIds' });
    const selectedIds = watchedTagIds ?? EMPTY_SELECTED_IDS;
    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownMaxHeight, setDropdownMaxHeight] = useState(256);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showTagNameLimitMessage, setShowTagNameLimitMessage] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectedTagCacheRef = useRef<Map<string, Tag>>(new Map());

    const { data: options = [], isLoading } = useTagsQuery(debouncedQuery);
    const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
    const { mutateAsync: deleteTag } = useDeleteTag();
    const hasReachedTagNameLimit =
        showTagNameLimitMessage || query.length >= TAG_NAME_MAX_LENGTH;

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

    useEffect(() => {
        if (!autoFocusInput) return;
        setDropdownOpen(true);
        inputRef.current?.focus();
    }, [autoFocusInput]);

    useEffect(() => {
        if (!dropdownOpen) return;

        const updateDropdownMaxHeight = () => {
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - containerRect.bottom - 8;
            const clampedMaxHeight = Math.max(120, Math.min(256, spaceBelow));
            setDropdownMaxHeight(clampedMaxHeight);
        };

        updateDropdownMaxHeight();
        window.addEventListener('resize', updateDropdownMaxHeight);
        window.addEventListener('scroll', updateDropdownMaxHeight, true);

        return () => {
            window.removeEventListener('resize', updateDropdownMaxHeight);
            window.removeEventListener('scroll', updateDropdownMaxHeight, true);
        };
    }, [dropdownOpen]);

    const selectedTags = useMemo(() => {
        options.forEach((tag) => {
            if (selectedIdSet.has(tag.id)) {
                selectedTagCacheRef.current.set(tag.id, tag);
            }
        });

        return selectedIds
            .map((id) => selectedTagCacheRef.current.get(id))
            .filter((tag): tag is Tag => Boolean(tag));
    }, [options, selectedIds, selectedIdSet]);

    const selectTag = (tag: Tag) => {
        if (selectedIdSet.has(tag.id)) return;
        setValue('tagIds', [...selectedIds, tag.id], {
            shouldDirty: true,
            shouldTouch: true,
        });
        selectedTagCacheRef.current.set(tag.id, tag);
        setQuery('');
    };

    const removeTag = (id: string) => {
        setValue(
            'tagIds',
            selectedIds.filter((tagId) => tagId !== id),
            { shouldDirty: true, shouldTouch: true }
        );
    };

    const updateQuery = (value: string) => {
        const nextQuery = value.slice(0, TAG_NAME_MAX_LENGTH);
        setQuery(nextQuery);
        setShowTagNameLimitMessage(value.length >= TAG_NAME_MAX_LENGTH);
    };

    const handleDeleteTag = async (id: string) => {
        await deleteTag(id);
        removeTag(id);
    };

    const createTagFromQuery = async () => {
        const name = query.trim();
        if (!name) return;
        if (name.length > TAG_NAME_MAX_LENGTH) {
            setShowTagNameLimitMessage(true);
            return;
        }
        try {
            const tag = await createTag(name);
            if (tag) selectTag(tag);
        } finally {
            setQuery('');
            setShowTagNameLimitMessage(false);
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
        <div ref={containerRef} className="relative w-full">
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
                    ref={inputRef}
                    id="tags-input"
                    type="text"
                    aria-describedby={
                        hasReachedTagNameLimit ? 'tags-input-limit-message' : undefined
                    }
                    className="flex-1 min-w-[120px] border-0 bg-transparent text-sm focus:outline-none"
                    placeholder="Add tags..."
                    value={query}
                    onFocus={() => setDropdownOpen(true)}
                    maxLength={TAG_NAME_MAX_LENGTH}
                    onChange={(event) => updateQuery(event.target.value)}
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
                <div
                    className="absolute left-0 right-0 top-full z-30 overflow-y-auto rounded-md border border-gray-100 bg-white shadow-sm"
                    style={{ maxHeight: `${dropdownMaxHeight}px` }}
                >
                    {hasReachedTagNameLimit && (
                        <div
                            id="tags-input-limit-message"
                            className="px-3 py-2 text-xs text-blush-500"
                        >
                            Tag names can be up to {TAG_NAME_MAX_LENGTH} characters.
                        </div>
                    )}
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
                        const isSelected = selectedIdSet.has(tag.id);
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
