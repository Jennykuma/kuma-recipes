import { useId, useState } from 'react';
import classNames from 'classnames';

const MAX_NUMBER_OF_STARS = 5;
const STAR_VALUES = Array.from({ length: MAX_NUMBER_OF_STARS }, (_, index) => index + 1);

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
    const ratingGroupName = useId();
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const isInteractive = !readOnly && (interactive ?? Boolean(onChange));
    const canChange = isInteractive && Boolean(onChange);
    const currentRating = value ?? rating ?? 0;
    const activeRating = hoverRating ?? currentRating;
    const accessibleReadOnlyLabel =
        ariaLabel ??
        (currentRating > 0
            ? `${currentRating} out of ${MAX_NUMBER_OF_STARS} stars`
            : 'No rating');

    if (!isInteractive) {
        return (
            <div
                id={id}
                aria-label={accessibleReadOnlyLabel}
                aria-labelledby={ariaLabelledby}
                className={classNames('flex items-center gap-1', className)}
            >
                {STAR_VALUES.map((starValue) => (
                    <svg
                        key={starValue}
                        className={classNames(
                            'h-5 w-5',
                            starValue <= currentRating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
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
                ))}
            </div>
        );
    }

    return (
        <div
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            className={classNames('flex items-center gap-1', className)}
        >
            {STAR_VALUES.map((starValue) => (
                <label
                    key={starValue}
                    className={classNames(
                        'inline-flex',
                        canChange ? 'cursor-pointer' : 'cursor-default'
                    )}
                    onMouseEnter={
                        canChange ? () => setHoverRating(starValue) : undefined
                    }
                    onMouseLeave={canChange ? () => setHoverRating(null) : undefined}
                >
                    <input
                        type="radio"
                        name={ratingGroupName}
                        value={starValue}
                        checked={currentRating === starValue}
                        onChange={() => onChange?.(starValue)}
                        disabled={!canChange}
                        className="peer sr-only"
                    />
                    <span className="sr-only">
                        {starValue} {starValue === 1 ? 'star' : 'stars'}
                    </span>
                    <svg
                        className={classNames(
                            'h-5 w-5 rounded-sm transition',
                            starValue <= activeRating
                                ? 'text-yellow-500'
                                : 'text-gray-300',
                            'peer-focus-visible:ring-2 peer-focus-visible:ring-blush-300 peer-focus-visible:ring-offset-1',
                            'peer-disabled:opacity-60'
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
                </label>
            ))}
        </div>
    );
};

export default Rating;
