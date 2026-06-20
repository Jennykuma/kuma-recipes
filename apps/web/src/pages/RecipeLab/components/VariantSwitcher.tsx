import { Star } from 'lucide-react';
import type { LabVariant } from 'shared';

type VariantSwitcherProps = {
  variants: LabVariant[];
  selectedVariantId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

const VariantSwitcher = ({
  variants,
  selectedVariantId,
  onSelect,
  onNew,
}: VariantSwitcherProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant.id)}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedVariantId === variant.id
              ? 'bg-sage-300 text-white'
              : 'bg-sage-100 text-gray-600 hover:bg-sage-200 dark:bg-canvas-inset dark:text-gray-300 dark:hover:bg-canvas-hover'
          }`}
        >
          {variant.isBest && (
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" aria-hidden="true" />
          )}
          {variant.name}
        </button>
      ))}
      <button
        type="button"
        onClick={onNew}
        className="
          rounded-full border bg-accent text-white
          font-bold px-3 py-1 text-xs
          transition hover:bg-blush-500
          dark:border-gray-600 dark:text-gray-400"
      >
        + New variant
      </button>
    </div>
  );
};

export default VariantSwitcher;
