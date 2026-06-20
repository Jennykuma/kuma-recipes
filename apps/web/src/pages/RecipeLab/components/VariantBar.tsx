import { useState, useRef } from 'react';
import { Pencil, Star, Trash2 } from 'lucide-react';
import type { LabVariant } from 'shared';

type VariantBarProps = {
  variant: LabVariant;
  onMarkBest: () => void;
  onClearBest: () => void;
  onUpdateDelta: (delta: string) => void;
  onDelete: () => void;
};

const VariantBar = ({
  variant,
  onMarkBest,
  onClearBest,
  onUpdateDelta,
  onDelete,
}: VariantBarProps) => {
  const [editingDelta, setEditingDelta] = useState(false);
  const [deltaValue, setDeltaValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDeltaValue(variant.delta != null ? String(variant.delta) : '');
    setEditingDelta(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const commitEdit = () => {
    setEditingDelta(false);
    onUpdateDelta(deltaValue.trim());
  };

  const cancelEdit = () => {
    setEditingDelta(false);
  };

  return (
    <div
      className="
        flex flex-wrap items-center justify-between gap-4 rounded-2xl
        border border-sage-300/50 bg-white p-4 shadow-sm shadow-gray-100
        dark:border-gray-700 dark:bg-canvas-card dark:bg-none dark:shadow-none"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {variant.name}
          </span>
        </div>
        {editingDelta ? (
          <input
            ref={inputRef}
            value={deltaValue}
            onChange={(e) => setDeltaValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            placeholder="Describe changes…"
            className="mt-0.5 w-full sm:w-1/2 text-sm text-gray-500 bg-transparent border-b border-gray-300 outline-none focus:border-primary dark:border-gray-600 dark:text-gray-400"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="mt-0.5 w-full sm:w-1/2 flex items-center gap-1 text-left text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 group overflow-hidden"
          >
            <span className="truncate">
              {variant.delta != null && String(variant.delta) ? (
                String(variant.delta)
              ) : (
                <span className="italic">+ Add change summary</span>
              )}
            </span>
            <Pencil
              className="w-3 h-3 shrink-0 link-blush opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-4">
        {variant.isBest ? (
          <button
            type="button"
            onClick={onClearBest}
            aria-label="Clear best variant"
            title="Best variant"
            className="flex items-center justify-center rounded-full p-2 text-amber-500 transition hover:bg-amber-100"
          >
            <Star className="h-4 w-4 fill-amber-400" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkBest}
            aria-label="Mark as best"
            title="Mark as best"
            className="flex items-center justify-center rounded-full border border-amber-500 bg-white p-2 text-amber-500 transition hover:bg-amber-100 dark:bg-canvas-card"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete()}
          aria-label="Delete variant"
          className="flex shrink-0 items-center justify-center rounded-full p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-400/20 dark:hover:text-red-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default VariantBar;
