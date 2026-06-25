import PageShell from '../../components/PageShell';
import BackButton from '../../components/BackButton';

const TagExplorer = () => {
  return (
    <PageShell className="p-6">
      <div className="mx-auto w-full max-w-7xl">
        <BackButton />
        <header className="mb-1 flex flex-col min-h-9">
          <h1 className="text-lg font-bold">Tag Explorer</h1>
          <span className="text-xs text-gray-500">
            See how your tags connect across recipes
          </span>
        </header>
      </div>
    </PageShell>
  );
};

export default TagExplorer;
