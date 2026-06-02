import { useState } from 'react';
import classNames from 'classnames';

const MAX_NUMBER_OF_STARS = 5;

interface RatingProps {
    interactive?: boolean;
    readOnly?: boolean;
    value?: number;
    rating?: number;
    className?: string;
    onChange?: (rating: number) => void;
    id?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const Rating = ({
    value,
    rating,
    interactive,
    readOnly = false,
    className,
    onChange,
    id,
    ariaLabel,
    ariaLabelledby,
}: RatingProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const isInteractive = !readOnly && (interactive ?? Boolean(onChange));
    const canChange = isInteractive && Boolean(onChange);
    const currentRating = value ?? rating ?? 0;
    const activeRating = hoverRating ?? currentRating;
    const starValue = (index: number) => MAX_NUMBER_OF_STARS - index;
    const isFilled = (index: number) => starValue(index) <= activeRating;

    const star = (index: number) => {
        const valueForStar = starValue(index);
        return (
            <button
                type="button"
                key={`${index}`}
                className={classNames(
                    'rating-star',
                    isInteractive && '!cursor-pointer',
                    !isInteractive && '!cursor-default'
                )}
                onClick={canChange ? () => onChange?.(valueForStar) : undefined}
                onMouseEnter={canChange ? () => setHoverRating(valueForStar) : undefined}
                onMouseLeave={canChange ? () => setHoverRating(null) : undefined}
                role={isInteractive ? 'radio' : undefined}
                aria-checked={isInteractive ? valueForStar === currentRating : undefined}
                aria-label={`${valueForStar} ${valueForStar === 1 ? 'star' : 'stars'}`}
                tabIndex={isInteractive ? 0 : -1}
                disabled={!canChange}
            >
                <svg
                    className={classNames(
                        'w-5 h-5',
                        isFilled(index) ? 'text-yellow-500' : 'text-gray-300'
                    )}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                </svg>
            </button>
        );
    };

    return (
        // flex-row-reverse causes the star rating to start from the right
        // index 4 3 2 1 0
        // star  ★ ★ ★ ★ ★
        <div
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            role={isInteractive ? 'radiogroup' : undefined}
            aria-readonly={isInteractive && !canChange ? true : undefined}
            className={classNames('flex flex-row-reverse justify-center', className)}
        >
            {[...Array(MAX_NUMBER_OF_STARS)].map((_, index) => star(index))}
        </div>
    );
};

export default Rating;
