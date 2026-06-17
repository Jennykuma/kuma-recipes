import { Trash2 } from 'lucide-react';
import type { LabAttempt, LabVariant } from 'shared';
import Rating from '../../../components/Rating';

type AttemptLogProps = {
  attempts: LabAttempt[];
  variants: LabVariant[];
  onLogAttempt: () => void;
  onDeleteAttempt: (id: string) => void;
};

const AttemptLog = ({
  attempts,
  variants,
  onLogAttempt,
  onDeleteAttempt,
}: AttemptLogProps) => {
  const sorted = [...attempts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const variantById = Object.fromEntries(variants.map((v) => [v.id, v]));

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 md:justify-between">
        <span className="text-xs font-bold tracking-widest text-gray-400 dark:text-gray-300">
          ATTEMPT LOG
        </span>
        <button
          type="button"
          onClick={onLogAttempt}
          className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-blush-500 sm:px-4 sm:py-2 sm:text-sm"
        >
          + Log an attempt
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No attempts logged yet.
        </p>
      ) : (
        <div className="border-l-2 border-gray-100 pl-5 space-y-4 dark:border-gray-700">
          {sorted.map((attempt) => {
            const variant = attempt.variantId ? variantById[attempt.variantId] : null;
            const isBest = variant?.isBest ?? false;
            return (
              <div key={attempt.id} className="relative">
                <div
                  className="absolute -left-[27.5px] top-4 h-3 w-3 rounded-full border-2 border-white dark:border-canvas-bg"
                  style={{ backgroundColor: isBest ? '#f59e0b' : '#F2A1B3' }}
                />
                <div
                  className={[
                    'rounded-2xl border bg-white p-3.5 shadow-sm transition-colors dark:bg-canvas-card',
                    isBest ? 'border-amber-200' : 'border-gray-100 dark:border-gray-700',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <time
                          dateTime={String(attempt.date)}
                          className="text-sm font-bold text-gray-800 dark:text-gray-200"
                        >
                          {(() => {
                            const [y, m, d] = String(attempt.date)
                              .slice(0, 10)
                              .split('-')
                              .map(Number);
                            return new Date(y, m - 1, d).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            });
                          })()}
                        </time>
                        {variant && (
                          <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-xs font-bold text-blush-500 whitespace-nowrap">
                            {variant.name}
                          </span>
                        )}
                      </div>
                      {attempt.changes && attempt.changes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {attempt.changes.map((change, i) => (
                            <span
                              key={i}
                              className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-500 whitespace-nowrap dark:bg-canvas-inset dark:text-gray-400"
                            >
                              {change}
                            </span>
                          ))}
                        </div>
                      )}
                      {attempt.note && (
                        <p className="text-sm leading-snug text-gray-700 dark:text-gray-300">
                          {attempt.note}
                        </p>
                      )}
                      {attempt.rating != null && (
                        <Rating value={attempt.rating} readOnly className="gap-0.5" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAttempt(attempt.id)}
                      aria-label="Delete attempt"
                      className="shrink-0 text-gray-300 transition hover:text-red-400 dark:text-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttemptLog;
