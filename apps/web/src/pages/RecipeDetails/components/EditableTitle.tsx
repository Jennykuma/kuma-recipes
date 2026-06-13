import { useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';

type EditableTitleProps = {
  title?: string;
  isEditing: boolean;
  draftValue?: string;
  error?: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const EditableTitle = ({
  title,
  isEditing,
  draftValue,
  error,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: EditableTitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="w-full">
        <span className="flex w-full items-baseline gap-2">
          <input
            ref={inputRef}
            className="text-lg w-full max-w-125 font-bold border-b border-gray-300 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:ring-offset-1 rounded-sm"
            value={draftValue ?? ''}
            aria-invalid={error ? 'true' : undefined}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSave();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
              }
            }}
          />
          <button
            type="button"
            className="font-jua text-xs text-gray-400 hover:text-gray-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="font-jua text-xs text-blush-400 hover:text-blush-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 rounded-sm"
            onClick={onSave}
          >
            Save
          </button>
        </span>
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  return (
    <span className="inline-flex min-w-0 max-w-full items-baseline gap-1 sm:max-w-125">
      <h1 className="font-jua min-w-0 flex-1 text-lg font-bold truncate" title={title}>
        {title}
      </h1>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit title"
        className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
      >
        <Pencil className="w-3 h-4 pt-1 cursor-pointer link-blush" aria-hidden="true" />
      </button>
    </span>
  );
};

export default EditableTitle;
