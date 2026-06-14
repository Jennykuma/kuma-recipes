import PageShell from './PageShell';
import { CircleAlert, LoaderCircle, RefreshCcw } from 'lucide-react';

type PageStateProps = {
  title: string;
  message: string;
  variant: 'loading' | 'error';
  actionLabel?: string;
  onAction?: () => void;
};

const stylesByVariant = {
  loading: {
    panel:
      'border-blush-100/80 bg-[linear-gradient(145deg,rgba(255,249,251,0.96),rgba(246,251,248,0.96))] dark:border-gray-700 dark:bg-canvas-card',
    badge:
      'border-blush-100 bg-white/90 text-blush-400 dark:border-gray-600 dark:bg-canvas-inset',
    eyebrow: 'text-blush-500/80 dark:text-blush-300',
    role: 'status' as const,
    live: 'polite' as const,
  },
  error: {
    panel:
      'border-rose-100/80 bg-[linear-gradient(145deg,rgba(255,247,248,0.97),rgba(255,252,249,0.95))] dark:border-gray-700 dark:bg-canvas-card',
    badge:
      'border-rose-100 bg-white/90 text-rose-500 dark:border-gray-600 dark:bg-canvas-inset',
    eyebrow: 'text-rose-500/80 dark:text-rose-300',
    role: 'alert' as const,
    live: 'assertive' as const,
  },
};

const PageState = ({
  title,
  message,
  variant,
  actionLabel,
  onAction,
}: PageStateProps) => {
  const styles = stylesByVariant[variant];

  return (
    <PageShell className="p-6">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center py-10 sm:py-16">
        <section
          role={styles.role}
          aria-live={styles.live}
          className={`relative w-full overflow-hidden rounded-[28px] border px-6 py-12 shadow-[0_22px_60px_rgba(88,32,48,0.08)] sm:px-10 ${styles.panel}`}
        >
          <div className="pointer-events-none absolute -left-12 top-0 h-36 w-36 rounded-full bg-blush-200/25 blur-3xl dark:bg-blush-300/10" />
          <div className="pointer-events-none absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-sage-200/35 blur-3xl dark:bg-sage-300/10" />

          <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-[22px] border shadow-sm ${styles.badge}`}
            >
              {variant === 'loading' ? (
                <>
                  <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
                </>
              ) : (
                <CircleAlert className="h-8 w-8" aria-hidden="true" />
              )}
            </div>

            <p
              className={`mt-5 font-jua text-xs uppercase tracking-[0.32em] ${styles.eyebrow}`}
            >
              {variant === 'loading' ? 'One moment' : 'Something went wrong'}
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-300">
              {message}
            </p>

            {actionLabel && onAction ? (
              <button
                type="button"
                onClick={onAction}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blush-200 bg-white px-4 py-2 text-sm font-jua text-gray-700 shadow-sm transition-colors hover:bg-blush-50 dark:border-gray-600 dark:bg-canvas-inset dark:text-gray-100 dark:hover:bg-canvas-hover"
              >
                {variant === 'error' ? (
                  <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                ) : null}
                {actionLabel}
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default PageState;
