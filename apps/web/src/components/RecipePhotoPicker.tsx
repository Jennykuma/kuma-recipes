import type {
  ChangeEvent,
  ChangeEventHandler,
  InputHTMLAttributes,
  MutableRefObject,
  RefAttributes,
  ReactNode,
} from 'react';
import { useRef } from 'react';
import { X } from 'lucide-react';
import { RECIPE_PHOTO_ACCEPT } from '../utils/resizeImageFile';

type RecipePhotoPickerProps = {
  alt: string;
  busyText?: string;
  emptyText?: ReactNode;
  error?: string;
  imageUrl?: string | null;
  inputProps?: InputHTMLAttributes<HTMLInputElement> & RefAttributes<HTMLInputElement>;
  isUploading?: boolean;
  onFileSelect?: (file: File) => void;
  onRemovePhoto?: () => void;
  removeText?: string;
  replaceText?: string;
  resetAfterChange?: boolean;
  tileClassName?: string;
};

const RecipePhotoPicker = ({
  alt,
  busyText = 'Uploading...',
  emptyText = 'Click to choose a photo',
  error,
  imageUrl,
  inputProps,
  isUploading = false,
  onFileSelect,
  onRemovePhoto,
  removeText = 'Remove photo',
  replaceText = 'Replace photo',
  resetAfterChange = false,
  tileClassName = 'aspect-square w-full',
}: RecipePhotoPickerProps) => {
  const {
    accept,
    disabled,
    onChange: registeredOnChange,
    ref: registeredRef,
    ...fileInputProps
  } = inputProps ?? {};
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setInputRef = (element: HTMLInputElement | null) => {
    inputRef.current = element;

    if (typeof registeredRef === 'function') {
      registeredRef(element);
      return;
    }

    if (registeredRef) {
      (registeredRef as MutableRefObject<HTMLInputElement | null>).current = element;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    (registeredOnChange as ChangeEventHandler<HTMLInputElement> | undefined)?.(event);

    const file = event.currentTarget.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }

    if (resetAfterChange) {
      event.currentTarget.value = '';
    }
  };

  const handleRemovePhoto = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemovePhoto?.();
  };

  return (
    <div className="space-y-1">
      <div className="relative">
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
            {...fileInputProps}
            ref={setInputRef}
            type="file"
            accept={accept ?? RECIPE_PHOTO_ACCEPT}
            className="sr-only"
            disabled={isUploading || disabled}
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
            {isUploading ? busyText : imageUrl ? replaceText : 'Add photo'}
          </span>
        </label>
        {imageUrl && onRemovePhoto ? (
          <button
            type="button"
            className="
              absolute right-2 top-2 inline-flex h-7 w-7 items-center
              justify-center rounded-full bg-white/90 text-gray-500
              shadow-sm transition-colors hover:bg-red-50 hover:text-red-500
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-red-300 disabled:cursor-not-allowed
              disabled:opacity-60 dark:bg-gray-900/90
              dark:text-gray-200 dark:hover:bg-red-400/15
              dark:hover:text-red-200"
            aria-label={removeText}
            title={removeText}
            disabled={isUploading || disabled}
            onClick={handleRemovePhoto}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default RecipePhotoPicker;
