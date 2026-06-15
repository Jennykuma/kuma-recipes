import { Star } from 'lucide-react';
import type { LabVariant } from '../../../../../api/src/services/lab/lab.types';

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
              ? 'bg-sage-300 text-gray-800'
              : 'bg-sage-100 text-gray-600 hover:bg-sage-200 dark:bg-canvas-inset dark:text-gray-300 dark:hover:bg-canvas-hover'
          }`}
        >
          {variant.isBest && (
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" aria-hidden="true" />
          )}
          {variant.name}
          {variant.tag && (
            <span className="ml-1 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] dark:bg-black/20">
              {variant.tag}
            </span>
          )}
        </button>
      ))}
      <button
        type="button"
        onClick={onNew}
        className="
          rounded-full border bg-sage-300 text-white
          border-sage-300 px-3 py-1 text-xs
          transition hover:border-sage-400 hover:bg-sage-400
          dark:border-gray-600 dark:text-gray-400"
      >
        + New variant
      </button>
    </div>
  );
};

export default VariantSwitcher;
