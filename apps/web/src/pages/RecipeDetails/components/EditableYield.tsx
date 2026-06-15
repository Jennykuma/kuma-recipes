import { useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';

type EditableYieldProps = {
  recipeYield?: string;
  isEditing: boolean;
  draftValue?: string;
  error?: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const EditableYield = ({
  recipeYield,
  isEditing,
  draftValue,
  error,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: EditableYieldProps) => {
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
            className="text-xs w-full max-w-125 border-b border-gray-300 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:ring-offset-1 rounded-sm"
            value={draftValue ?? ''}
            aria-invalid={error ? 'true' : undefined}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => onSave()}
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
        </span>
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  return (
    <span className="flex w-full items-center gap-1 min-w-0 max-w-full leading-none">
      <span className="text-xs leading-none truncate h-4" title={recipeYield}>
        {recipeYield || 'N/A'}
      </span>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit yield"
        className="
          inline-flex items-center rounded-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
      >
        <Pencil className="w-3 h-4 pb-1 cursor-pointer link-blush" aria-hidden="true" />
      </button>
    </span>
  );
};

export default EditableYield;
