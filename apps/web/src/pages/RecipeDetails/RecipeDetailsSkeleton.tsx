import BackButton from '../../components/BackButton';
import RecipeDetailsView from './RecipeDetailsView';

const SkeletonBlock = ({ className }: { className: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-xl bg-sage-100/70 dark:bg-gray-700 ${className}`}
  />
);

const RecipeDetailsSkeleton = ({ shared = false }: { shared?: boolean }) => {
  return (
    <RecipeDetailsView
      backButton={shared ? undefined : <BackButton />}
      title={<SkeletonBlock className="h-8 w-56" />}
      headerActions={
        shared ? undefined : (
          <div className="flex gap-2">
            <SkeletonBlock className="h-9 w-10" />
            <SkeletonBlock className="h-9 w-10" />
          </div>
        )
      }
      photo={<SkeletonBlock className="h-[250px] w-full md:w-[250px]" />}
      summary={
        <>
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </>
      }
      notes={<SkeletonBlock className="h-40 w-full" />}
      ingredients={<SkeletonBlock className="h-64 w-full" />}
      steps={<SkeletonBlock className="h-64 w-full" />}
    />
  );
};

export default RecipeDetailsSkeleton;
