import { useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';

type EditableSourceProps = {
  source?: string;
  isEditing: boolean;
  draftValue?: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  hideLabel?: boolean;
};

const EditableSource = ({
  source,
  isEditing,
  draftValue,
  onEdit,
  onChange,
  onSave,
  onCancel,
  hideLabel = false,
}: EditableSourceProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const sourceText = source?.trim() ?? '';
  const sourceLink = (() => {
    if (!sourceText) return null;
    try {
      const withScheme =
        sourceText.startsWith('http://') || sourceText.startsWith('https://')
          ? sourceText
          : sourceText.startsWith('www.')
            ? `https://${sourceText}`
            : null;
      if (!withScheme) return null;
      return new URL(withScheme).href;
    } catch {
      return null;
    }
  })();

  return (
    <span className="flex items-baseline gap-2 w-full">
      {!hideLabel && (
        <span className="text-xs uppercase tracking-wide text-gray-600 rounded-full shrink-0">
          Source
        </span>
      )}
      {isEditing ? (
        <div className="flex w-full items-baseline gap-2">
          <input
            ref={inputRef}
            className="w-full max-w-125 border-b border-gray-300 bg-transparent text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:ring-offset-1 rounded-sm dark:border-gray-600 dark:text-gray-100"
            value={draftValue ?? ''}
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
            className="font-jua text-xs text-gray-400 hover:text-gray-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="font-jua text-xs text-blush-400 hover:text-blush-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 rounded-sm"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1 min-w-0 max-w-full leading-none">
          {sourceLink ? (
            <a
              href={sourceLink}
              target="_blank"
              rel="noreferrer"
              title={sourceLink}
              className="link-blush text-xs leading-none text-blush-400 hover:underline truncate"
            >
              {sourceText}
            </a>
          ) : (
            <span
              className="text-xs leading-none text-gray-600 truncate dark:text-gray-200"
              title={sourceText}
            >
              {sourceText || '—'}
            </span>
          )}
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit source"
            className="inline-flex items-center shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300"
          >
            <Pencil
              className="w-3 h-4 pb-0.5 cursor-pointer link-blush shrink-0"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </span>
  );
};

export default EditableSource;
