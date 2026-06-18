import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';
import type { LabVariant } from 'shared';
import Rating from '../../../components/Rating';

type VariantBarProps = {
  variant: LabVariant;
  onMarkBest: () => void;
  onClearBest: () => void;
  onUpdateDelta: (delta: string) => void;
};

const VariantBar = ({
  variant,
  onMarkBest,
  onClearBest,
  onUpdateDelta,
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-canvas-card">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {variant.name}
          </span>
          {variant.tag && (
            <span className="rounded-full bg-sage-100 px-3 py-0.5 text-sm font-bold text-primary border-sage-200">
              {variant.tag}
            </span>
          )}
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
      <div className="flex flex-shrink-0 flex-wrap items-center gap-4">
        {variant.rating != null && (
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold tracking-widest text-gray-400">
              RATING
            </span>
            <Rating value={variant.rating} readOnly className="gap-0.5" />
          </div>
        )}
        {variant.isBest ? (
          <button
            type="button"
            onClick={onClearBest}
            className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
          >
            <span className="text-amber-400">★</span>
            Best
          </button>
        ) : (
          <button
            type="button"
            onClick={onMarkBest}
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-600 transition hover:bg-amber-50 dark:bg-canvas-card"
          >
            ☆ Mark as best
          </button>
        )}
      </div>
    </div>
  );
};

export default VariantBar;
