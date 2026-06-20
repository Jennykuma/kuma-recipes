import { useState, useRef } from 'react';
import { X, CircleMinus } from 'lucide-react';
import type { VariantItem } from 'shared';
import type { Recipe } from 'shared';
import { useCreateVariant } from '../../../hooks';

type NewVariantModalProps = {
  recipeId: string;
  recipe: Recipe;
  onCreated: (variantId: string) => void;
  onClose: () => void;
};

type ItemStatus = VariantItem['status'];

const STATUS_CYCLE: ItemStatus[] = ['original', 'tweaked', 'new'];

const STATUS_CLASS: Record<ItemStatus, string> = {
  original: 'bg-gray-100 text-gray-500',
  tweaked: 'bg-amber-100 text-amber-700',
  new: 'bg-green-100 text-green-700',
};

type EditableItem = { text: string; status: ItemStatus };

const cycleStatus = (items: EditableItem[], idx: number): EditableItem[] => {
  const currentIdx = STATUS_CYCLE.indexOf(items[idx].status);
  const next = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
  return items.map((it, i) => (i === idx ? { ...it, status: next } : it));
};

const insertAt = <T,>(arr: T[], idx: number, item: T): T[] => [
  ...arr.slice(0, idx + 1),
  item,
  ...arr.slice(idx + 1),
];

const removeAt = <T,>(arr: T[], idx: number): T[] => arr.filter((_, i) => i !== idx);

type EditableItemListProps = {
  items: EditableItem[];
  onChange: (items: EditableItem[]) => void;
  ordered?: boolean;
};

const EditableItemList = ({ items, onChange, ordered }: EditableItemListProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag className="mt-2 flex flex-col gap-1.5">
      {items.map((item, idx) => (
        <li
          key={idx}
          className={`flex gap-2 ${ordered ? 'items-start' : 'items-center'}`}
        >
          {ordered && (
            <span className="w-4 shrink-0 pt-2 text-right text-xs tabular-nums text-gray-500">
              {idx + 1}.
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(cycleStatus(items, idx))}
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition ${STATUS_CLASS[item.status]} ${ordered ? 'mt-1' : ''}`}
            aria-label={`Status: ${item.status}. Click to change`}
          >
            {item.status}
          </button>
          <input
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="text"
            value={item.text}
            onChange={(e) =>
              onChange(
                items.map((it, i) => (i === idx ? { ...it, text: e.target.value } : it))
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && item.text.trim()) {
                e.preventDefault();
                onChange(insertAt(items, idx, { text: '', status: 'new' }));
                requestAnimationFrame(() => refs.current[idx + 1]?.focus());
              }
              if (e.key === 'Backspace' && item.text === '' && items.length > 1) {
                e.preventDefault();
                onChange(removeAt(items, idx));
                requestAnimationFrame(() => refs.current[Math.max(0, idx - 1)]?.focus());
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
          />
          {items.length > 1 && (
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => onChange(removeAt(items, idx))}
              className={ordered ? 'mt-1.5' : undefined}
            >
              <CircleMinus
                className="h-4 w-4 text-red-300 opacity-80 hover:text-red-500 hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          )}
        </li>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { text: '', status: 'new' }])}
        className="mt-2 rounded-full px-2.5 py-1.5 text-xs text-sage-400 transition hover:bg-sage-400 hover:text-white"
      >
        + Add {ordered ? 'step' : 'ingredient'}
      </button>
    </Tag>
  );
};

const NewVariantModal = ({
  recipeId,
  recipe,
  onCreated,
  onClose,
}: NewVariantModalProps) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [delta, setDelta] = useState('');
  const [ingredients, setIngredients] = useState<EditableItem[]>(
    (recipe.ingredients ?? []).map((text) => ({ text, status: 'original' }))
  );
  const [steps, setSteps] = useState<EditableItem[]>(
    (recipe.steps ?? []).map((text) => ({ text, status: 'original' }))
  );

  const { mutate: createVariant, isPending } = useCreateVariant(recipeId);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const variantIngredients: VariantItem[] = ingredients
      .filter((it) => it.text.trim())
      .map((it) => ({ text: it.text.trim(), status: it.status }));

    const variantSteps: VariantItem[] = steps
      .filter((it) => it.text.trim())
      .map((it) => ({ text: it.text.trim(), status: it.status }));

    createVariant(
      {
        name: name.trim(),
        tag: tag.trim() || undefined,
        delta: delta.trim() || undefined,
        ingredients: variantIngredients,
        steps: variantSteps,
      },
      {
        onSuccess: (variant) => {
          onCreated(variant.id);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New variant"
        className="relative z-10 flex max-h-[90vh] w-[95vw] max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-lg dark:bg-canvas-card"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="font-jua text-sm font-bold text-gray-800 dark:text-gray-100">
            New variant
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="variant-name"
                className="field-label text-gray-600 dark:text-gray-300"
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="variant-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Brown Butter Version"
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="field-label text-gray-600 dark:text-gray-300">Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. dairy-free"
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="variant-summary"
                className="field-label text-gray-600 dark:text-gray-300"
              >
                Summary of changes
              </label>
              <textarea
                id="variant-summary"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                rows={2}
                placeholder="e.g. Reduced butter by 30%, added vanilla extract"
                className="mt-1 w-full resize-none rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs placeholder:text-gray-400 dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="field-label text-gray-600 dark:text-gray-300">
                  Ingredients
                </span>
                <span className="text-[10px] text-gray-400">
                  click badge to cycle status
                </span>
              </div>
              <EditableItemList items={ingredients} onChange={setIngredients} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="field-label text-gray-600 dark:text-gray-300">
                  Steps
                </span>
                <span className="text-[10px] text-gray-400">
                  click badge to cycle status
                </span>
              </div>
              <EditableItemList items={steps} onChange={setSteps} ordered />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="font-jua rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-canvas-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
            className="font-jua rounded-md bg-sage-300 px-3 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Creating…' : 'Create variant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewVariantModal;
