import type {
    ChangeEvent,
    ChangeEventHandler,
    InputHTMLAttributes,
    RefAttributes,
    ReactNode,
} from 'react';
import { RECIPE_PHOTO_ACCEPT } from '../utils/resizeImageFile';

type RecipePhotoPickerProps = {
    alt: string;
    emptyText?: ReactNode;
    error?: string;
    imageUrl?: string | null;
    inputProps?: InputHTMLAttributes<HTMLInputElement> & RefAttributes<HTMLInputElement>;
    isUploading?: boolean;
    onFileSelect?: (file: File) => void;
    replaceText?: string;
    resetAfterChange?: boolean;
    tileClassName?: string;
};

const RecipePhotoPicker = ({
    alt,
    emptyText = 'Click to choose a photo',
    error,
    imageUrl,
    inputProps,
    isUploading = false,
    onFileSelect,
    replaceText = 'Replace photo',
    resetAfterChange = false,
    tileClassName = 'aspect-square w-full',
}: RecipePhotoPickerProps) => {
    const registeredOnChange = inputProps?.onChange as
        | ChangeEventHandler<HTMLInputElement>
        | undefined;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        registeredOnChange?.(event);

        const file = event.currentTarget.files?.[0];
        if (file) {
            onFileSelect?.(file);
        }

        if (resetAfterChange) {
            event.currentTarget.value = '';
        }
    };

    return (
        <div className="space-y-1">
            <label
                className={`
                group relative flex cursor-pointer items-center justify-center
                overflow-hidden rounded-md border border-dashed border-sage-300
                bg-surface text-center text-sm text-gray-500 transition-colors
                hover:border-sage-400 hover:bg-sage-50
                focus-within:ring-2 focus-within:ring-sage-300
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
                dark:hover:bg-white/5 ${tileClassName}`}
            >
                <input
                    {...inputProps}
                    type="file"
                    accept={inputProps?.accept ?? RECIPE_PHOTO_ACCEPT}
                    className="sr-only"
                    disabled={isUploading || inputProps?.disabled}
                    onChange={handleChange}
                />
                {imageUrl ? (
                    <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
                ) : (
                    <span className="px-4">{emptyText}</span>
                )}
                <span
                    className="
                    absolute inset-x-0 bottom-0 bg-white/85 px-3 py-2
                    text-center text-xs font-semibold text-sage-400 opacity-0
                    transition-opacity group-hover:opacity-100
                    group-focus-within:opacity-100 dark:bg-gray-900/85"
                >
                    {isUploading ? 'Uploading...' : imageUrl ? replaceText : 'Add photo'}
                </span>
            </label>
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
        </div>
    );
};

export default RecipePhotoPicker;
