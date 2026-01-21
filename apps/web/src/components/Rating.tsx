import React, { useState } from 'react';
import classNames from 'classnames';

const MAX_NUMBER_OF_STARS = 5;

interface RatingProps {
    interactive?: boolean;
    rating?: number;
    className?: string;
    onChange?: (rating: number) => void;
}

const Rating = ({
    rating = 0,
    interactive = false,
    className,
    onChange,
}: RatingProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const activeRating = hoverRating ?? rating;
    const starValue = (index: number) => MAX_NUMBER_OF_STARS - index;
    const isFilled = (index: number) => starValue(index) <= activeRating;

    const star = (index: number) => (
        <svg
            className={classNames(
                'rating-star w-5 h-5',
                interactive && 'cursor-pointer',
                isFilled(index) ? 'text-yellow-500' : 'text-gray-300'
            )}
            onClick={interactive ? () => onChange?.(starValue(index)) : undefined}
            onMouseEnter={
                interactive ? () => setHoverRating(starValue(index)) : undefined
            }
            onMouseLeave={interactive ? () => setHoverRating(null) : undefined}
            key={`${index}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>
    );

    return (
        // flex-row-reverse causes the star rating to start from the right
        // index 4 3 2 1 0
        // star  ★ ★ ★ ★ ★
        <div className={classNames('flex flex-row-reverse justify-center', className)}>
            {[...Array(MAX_NUMBER_OF_STARS)].map((_, index) => star(index))}
        </div>
    );
};

export default Rating;
