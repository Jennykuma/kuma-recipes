import { useState } from 'react';
import { X } from 'lucide-react';
import type { VariantItem } from 'shared';
import type { Recipe } from 'shared';
import { useCreateVariant, useToast } from '../../../hooks';
import ItemList from './ItemList';

type NewVariantModalProps = {
  recipeId: string;
  recipe: Recipe;
  onCreated: (variantId: string) => void;
  onClose: () => void;
};

const NewVariantModal = ({
  recipeId,
  recipe,
  onCreated,
  onClose,
}: NewVariantModalProps) => {
  const [name, setName] = useState('');
  const [delta, setDelta] = useState('');
  const [ingredients, setIngredients] = useState<VariantItem[]>(
    (recipe.ingredients ?? []).map((text) => ({
      id: crypto.randomUUID(),
      text,
      status: 'original',
    }))
  );
  const [steps, setSteps] = useState<VariantItem[]>(
    (recipe.steps ?? []).map((text) => ({
      id: crypto.randomUUID(),
      text,
      status: 'original',
    }))
  );

  const { mutate: createVariant, isPending } = useCreateVariant(recipeId);
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!name.trim()) return;

    const variantIngredients: VariantItem[] = ingredients
      .filter((it) => it.text.trim())
      .map((it) => ({ id: it.id, text: it.text.trim(), status: it.status }));

    const variantSteps: VariantItem[] = steps
      .filter((it) => it.text.trim())
      .map((it) => ({ id: it.id, text: it.text.trim(), status: it.status }));

    createVariant(
      {
        name: name.trim(),
        delta: delta.trim() || undefined,
        ingredients: variantIngredients,
        steps: variantSteps,
      },
      {
        onSuccess: (variant) => {
          onCreated(variant.id);
          onClose();
        },
        onError: (err) => {
          console.error(err);
          showToast({
            status: 'error',
            message: 'Failed to create variant. Please try again.',
          });
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
        className="relative z-10 flex max-h-[90vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-lg dark:bg-canvas-card"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="field-label text-gray-600 dark:text-gray-300">
                    Ingredients
                  </span>
                  <span className="text-[10px] text-gray-400">
                    click badge to cycle status
                  </span>
                </div>
                <ItemList items={ingredients} onChange={setIngredients} />
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
                <ItemList items={steps} onChange={setSteps} ordered />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-canvas-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
            className="rounded-md bg-sage-300 px-3 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Creating…' : 'Create variant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewVariantModal;
