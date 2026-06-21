import { Pencil, Star, Trash2 } from 'lucide-react';
import type { LabVariant } from 'shared';

type VariantBarProps = {
  variant: LabVariant;
  onMarkBest: () => void;
  onClearBest: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const VariantBar = ({
  variant,
  onMarkBest,
  onClearBest,
  onEdit,
  onDelete,
}: VariantBarProps) => {
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
        <span className="mt-0.5 block w-full sm:w-1/2 truncate text-sm text-gray-400">
          {variant.delta != null && String(variant.delta) ? (
            String(variant.delta)
          ) : (
            <span className="italic">+ Add change summary</span>
          )}
        </span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit variant"
          className="flex items-center justify-center rounded-full p-2 text-blush-500 transition hover:bg-blush-100 hover:text-blush-700"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
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
