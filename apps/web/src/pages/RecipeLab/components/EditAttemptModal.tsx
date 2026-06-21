import { useState } from 'react';
import { X } from 'lucide-react';
import type { LabAttempt, LabVariant } from 'shared';
import { useUpdateAttempt, useToast } from '../../../hooks';
import Rating from '../../../components/Rating';

type EditAttemptModalProps = {
  recipeId: string;
  attempt: LabAttempt;
  variants: LabVariant[];
  onClose: () => void;
};

const EditAttemptModal = ({
  recipeId,
  attempt,
  variants,
  onClose,
}: EditAttemptModalProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(String(attempt.date).slice(0, 10));
  const [variantId, setVariantId] = useState(attempt.variantId ?? '');
  const [changeInput, setChangeInput] = useState('');
  const [changes, setChanges] = useState<string[]>(attempt.changes);
  const [note, setNote] = useState(attempt.note ?? '');
  const [rating, setRating] = useState(attempt.rating ?? 0);

  const { mutate: updateAttempt, isPending } = useUpdateAttempt(recipeId);
  const { showToast } = useToast();

  const isFormEmpty = !variantId && changes.length === 0 && !note.trim() && rating === 0;

  const addChange = () => {
    const trimmed = changeInput.trim();
    if (trimmed && !changes.includes(trimmed)) {
      setChanges((prev) => [...prev, trimmed]);
    }
    setChangeInput('');
  };

  const handleSubmit = () => {
    if (!date) return;

    updateAttempt(
      {
        attemptId: attempt.id,
        body: {
          date,
          variantId: variantId || null,
          changes,
          note: note.trim() || null,
          rating: rating > 0 ? rating : null,
        },
      },
      {
        onSuccess: onClose,
        onError: (err) => {
          console.error(err);
          showToast({
            status: 'error',
            message: 'Failed to save attempt. Please try again.',
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
        aria-label="Edit attempt"
        className="relative z-10 w-[90vw] max-w-md rounded-xl bg-white p-5 shadow-lg dark:bg-canvas-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Edit attempt
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
              htmlFor="edit-attempt-date"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Date
            </label>
            <input
              id="edit-attempt-date"
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
                htmlFor="edit-attempt-variant"
                className="field-label text-gray-600 dark:text-gray-300"
              >
                Variant
              </label>
              <select
                id="edit-attempt-variant"
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
              htmlFor="edit-attempt-change"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Changes
            </label>
            <div className="mt-1 flex gap-1">
              <input
                id="edit-attempt-change"
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
                disabled={!changeInput.trim()}
                className="rounded-md bg-sage-300 px-2 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50"
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
              htmlFor="edit-attempt-note"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Note
            </label>
            <textarea
              id="edit-attempt-note"
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
              htmlFor="edit-attempt-rating"
              className="field-label text-gray-600 dark:text-gray-300"
            >
              Rating
            </label>
            <Rating
              id="edit-attempt-rating"
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
            className="rounded-md px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-canvas-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!date || isFormEmpty || isPending}
            className="rounded-md bg-sage-300 px-3 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAttemptModal;
