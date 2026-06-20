import { useState } from 'react';
import { X } from 'lucide-react';
import type { LabVariant } from 'shared';
import { useLogAttempt } from '../../../hooks';
import Rating from '../../../components/Rating';

type LogAttemptModalProps = {
  recipeId: string;
  variants: LabVariant[];
  selectedVariantId: string | null;
  onClose: () => void;
};

const LogAttemptModal = ({
  recipeId,
  variants,
  selectedVariantId,
  onClose,
}: LogAttemptModalProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [variantId, setVariantId] = useState(selectedVariantId ?? '');
  const [changeInput, setChangeInput] = useState('');
  const [changes, setChanges] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);

  const { mutate: logAttempt, isPending } = useLogAttempt(recipeId);

  const addChange = () => {
    const trimmed = changeInput.trim();
    if (trimmed && !changes.includes(trimmed)) {
      setChanges((prev) => [...prev, trimmed]);
    }
    setChangeInput('');
  };

  const handleSubmit = () => {
    logAttempt(
      {
        date,
        variantId: variantId || undefined,
        changes: changes.length > 0 ? changes : undefined,
        note: note.trim() || undefined,
        rating: rating > 0 ? rating : undefined,
      },
      { onSuccess: onClose }
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
        aria-label="Log an attempt"
        className="relative z-10 w-[90vw] max-w-md rounded-xl bg-white p-5 shadow-lg dark:bg-canvas-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Log an attempt
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

        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="attempt-date"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Date
            </label>
            <input
              id="attempt-date"
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="
                mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs
                dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100
                focus:border-sage-300 focus:outline-none"
            />
          </div>

          {variants.length > 0 && (
            <div>
              <label
                htmlFor="attempt-variant"
                className="field-label text-gray-600 dark:text-gray-300"
              >
                Variant
              </label>
              <select
                id="attempt-variant"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100 focus:border-sage-300 focus:outline-none"
              >
                <option value="">No variant</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="attempt-change"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Changes
            </label>
            <div className="mt-1 flex gap-1">
              <input
                id="attempt-change"
                type="text"
                value={changeInput}
                onChange={(e) => setChangeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChange();
                  }
                }}
                placeholder="Type a change, press Enter (e.g. 1 bump vanilla)"
                className="
                  min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs
                  placeholder:text-gray-400 dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100
                  focus:border-sage-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={addChange}
                className="rounded-md bg-sage-200 px-2 py-1.5 text-xs text-gray-700 transition hover:bg-sage-300 hover:text-white"
              >
                Add
              </button>
            </div>
            {changes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {changes.map((change) => (
                  <span
                    key={change}
                    className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-gray-600"
                  >
                    {change}
                    <button
                      type="button"
                      onClick={() =>
                        setChanges((prev) => prev.filter((c) => c !== change))
                      }
                      aria-label={`Remove ${change}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="attempt-note"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Note
            </label>
            <textarea
              id="attempt-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="How did it go?"
              className="
                mt-1 w-full resize-none rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs
                placeholder:text-gray-400 dark:border-gray-700 dark:bg-canvas-deep dark:text-gray-100
                focus:border-sage-300 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="attempt-rating"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Rating
            </label>
            <Rating
              id="attempt-rating"
              value={rating}
              onChange={setRating}
              className="mt-1 justify-start"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
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
            disabled={!date || isPending}
            className="rounded-md bg-sage-300 px-3 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogAttemptModal;
