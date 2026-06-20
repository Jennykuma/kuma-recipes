import { useEffect, useState } from 'react';
import useParseRecipe from '../../../hooks/ai/useParseRecipe';
import type { ParsedRecipe } from '../../../api/ai';
import { X, Loader2, ClipboardPaste, Link } from 'lucide-react';
import classNames from 'classnames';

interface RecipeImporterProps {
  onParsed: (parsed: ParsedRecipe) => void;
  onClose: () => void;
}

type ImportMode = 'url' | 'text';

const RecipeImporter = ({ onParsed, onClose }: RecipeImporterProps) => {
  const [mode, setMode] = useState<ImportMode>('url');
  const [url, setUrl] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: parseRecipe, isPending } = useParseRecipe();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleImport = async () => {
    const input = mode === 'url' ? url : recipeText;
    if (!input.trim()) return;

    setError(null);
    try {
      const parsedRecipe = await parseRecipe(input);
      onParsed(parsedRecipe);
      mode === 'url' ? setUrl('') : setRecipeText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const canImportRecipe = !!(mode === 'url' ? url : recipeText).trim() && !isPending;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="importer-title"
        className={classNames(
          'w-full p-4 max-w-lg rounded-xl bg-white shadow-xl dark:bg-canvas-card',
          mode === 'text' ? 'min-h-96' : 'min-h-32'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="importer-title" className="font-bold text-md">
            Import a recipe
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close importer"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {(['url', 'text'] as const).map((importMode) => (
            <label
              key={importMode}
              className="flex items-center gap-1.5 cursor-pointer field-label text-gray-600 dark:text-gray-300"
            >
              <input
                type="radio"
                name="import-mode"
                value={importMode}
                checked={mode === importMode}
                onChange={() => {
                  setMode(importMode);
                  setError(null);
                }}
                className="sr-only"
              />
              <span
                className={classNames(
                  'w-3.5 h-3.5 rounded-full border flex items-center justify-center',
                  mode === importMode ? 'border-sage-400' : 'border-gray-300'
                )}
              >
                {mode === importMode && (
                  <span className="w-2 h-2 rounded-full bg-sage-400" />
                )}
              </span>
              {importMode === 'url' ? (
                <>
                  <Link className="h-3 w-3 text-gray-400" aria-hidden="true" /> Recipe URL
                </>
              ) : (
                <>
                  <ClipboardPaste
                    className="h-3.5 w-3.5 text-gray-400"
                    aria-hidden="true"
                  />
                  Recipe Text
                </>
              )}
            </label>
          ))}
        </div>

        {mode === 'url' ? (
          <input
            type="text"
            className="
              w-full p-1.5 rounded-md text-xs resize-none
              border border-gray-200 focus:border-sage-300 focus:outline-none"
            placeholder="Recipe URL"
            id="recipe-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleImport();
              }
            }}
          />
        ) : (
          <textarea
            id="recipe-text"
            aria-label="Recipe text"
            placeholder="Paste your recipe here..."
            className="
              h-64 w-full p-2 rounded-md text-xs resize-none
              bg-white border border-gray-200 focus:border-sage-300
              focus:outline-none"
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
          />
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="
              rounded-md bg-sage-300 px-3 py-1.5 text-xs text-white transition hover:bg-sage-400 disabled:cursor-not-allowed disabled:opacity-50
            "
            disabled={isPending || !canImportRecipe}
            onClick={handleImport}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Importing...
              </>
            ) : (
              'Import'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeImporter;
