import type { ReactNode } from 'react';
import PageShell from '../../components/PageShell';

type RecipeDetailsViewProps = {
  backButton?: ReactNode;
  title: ReactNode;
  headerActions?: ReactNode;
  modal?: ReactNode;
  tabBar?: ReactNode;
  labTab?: ReactNode;
  photo: ReactNode;
  summary: ReactNode;
  notes: ReactNode;
  ingredients: ReactNode;
  steps: ReactNode;
};

const RecipeDetailsView = ({
  backButton,
  title,
  headerActions,
  modal,
  tabBar,
  labTab,
  photo,
  summary,
  notes,
  ingredients,
  steps,
}: RecipeDetailsViewProps) => {
  return (
    <PageShell className="p-6">
      <div className="mx-auto w-full max-w-7xl">
        {backButton}
        <header className="mb-1 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">{title}</div>
          {headerActions ? (
            <div className="ml-2 flex shrink-0 items-center">{headerActions}</div>
          ) : null}
        </header>
        {modal}
        {tabBar ? <div className="mb-4 mt-2">{tabBar}</div> : null}

        {labTab ? (
          labTab
        ) : (
          <>
            <div className="mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-[250px_minmax(0,1fr)] md:items-stretch">
              {photo}
              <div className="w-full rounded-xl border border-sage-300/50 p-4 shadow-sm shadow-gray-100 dark:border-gray-700 dark:bg-canvas-card dark:bg-none dark:shadow-none">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
                  <div className="flex min-w-0 flex-col gap-4">{summary}</div>
                  <div className="min-w-0 lg:self-stretch">{notes}</div>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              <div className="order-1 flex flex-col gap-3 md:order-none md:col-start-1">
                {ingredients}
              </div>
              <div className="order-2 flex flex-col gap-3 md:order-none md:col-start-2">
                {steps}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
};

export default RecipeDetailsView;
