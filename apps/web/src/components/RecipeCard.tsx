import Rating from './Rating';
import { Link } from 'react-router-dom';
import type { Tag } from '../../../api/src/services/tags/tags.types';

interface RecipeCardProps {
    id: string;
    rating?: number;
    tags?: Tag[];
    title: string;
}

const VISIBLE_TAG_COUNT = 2;

const RecipeCard = ({ id, rating, tags = [], title }: RecipeCardProps) => {
    const visibleTags = tags.slice(0, VISIBLE_TAG_COUNT);
    const hiddenTags = tags.slice(VISIBLE_TAG_COUNT);
    const tagListLabel = tags.map((tag) => tag.name).join(', ');

    return (
        <Link
            role="link"
            tabIndex={0}
            className="
                flex flex-col w-full max-w-[26rem]
                gap-4 p-4 bg-white border border-gray-200
                rounded-xl shadow-md shadow-gray-100
                hover:shadow-none cursor-pointer"
            to={`/recipes/${id}`}
        >
            <div className="flex items-center gap-4">
                <div className="flex min-w-0 flex-1 flex-col text-center text-sm">
                    <div className="flex h-16 flex-col items-center justify-center">
                        <span className="font-jua text-md">{title}</span>
                        <Rating value={rating} />
                    </div>

                    {tags.length > 0 && (
                        <div
                            className="mt-2 flex max-w-full flex-nowrap items-center justify-center gap-1.5"
                            title={tagListLabel}
                        >
                            {visibleTags.map((tag) => (
                                <span
                                    key={tag.id}
                                    title={tag.name}
                                    className="inline-flex h-6 min-w-0 max-w-24 items-center rounded-full bg-sage-50 px-2.5 text-xs leading-none text-gray-700"
                                >
                                    <span className="min-w-0 truncate">{tag.name}</span>
                                </span>
                            ))}
                            {hiddenTags.length > 0 && (
                                <span className="group relative inline-flex">
                                    <span
                                        aria-label={`${hiddenTags.length} more tags: ${hiddenTags
                                            .map((tag) => tag.name)
                                            .join(', ')}`}
                                        className="inline-flex h-6 items-center rounded-full bg-sage-100 px-2.5 text-xs leading-none text-gray-700"
                                    >
                                        +{hiddenTags.length}
                                    </span>
                                    <div
                                        className="
                                            pointer-events-none absolute bottom-full left-1/2 z-10 mb-2
                                            w-52 -translate-x-1/2 rounded-lg border border-sage-200
                                            bg-white px-3 py-2 text-left text-xs text-gray-700 break-words
                                            opacity-0 shadow-lg shadow-gray-100 transition-opacity
                                            group-hover:opacity-100"
                                    >
                                        {hiddenTags.map((tag) => tag.name).join(', ')}
                                    </div>
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 md:h-28 md:w-28"></div>
            </div>
        </Link>
    );
};

export default RecipeCard;
