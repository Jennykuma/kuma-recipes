import { useEffect, useState } from 'react';
import useParseRecipe from '../../../hooks/ai/useParseRecipe';
import type { ParsedRecipe } from '../../../api/ai';
import { X, Loader2 } from 'lucide-react';
import classNames from 'classnames';

type RecipeImporterProps = {
  onParsed: (parsed: ParsedRecipe) => void;
  onClose: () => void;
};

const RecipeImporter = ({ onParsed, onClose }: RecipeImporterProps) => {
  const [text, setText] = useState('');
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
    if (!text.trim()) return;

    try {
      const parsedRecipe = await parseRecipe(text);
      onParsed(parsedRecipe);
      setText('');
    } catch (error) {
      console.error('Failed to parse recipe: ', error);
    }
  };

  const canImportRecipe = !!text.trim() && !isPending;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="importer-title"
        className="
          w-full h-96 max-w-lg rounded-xl bg-white
          p-6 shadow-xl dark:bg-[#2a2a2a]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="importer-title" className="font-bold text-sm">
            Import from text
          </h2>
          <button type="button" onClick={onClose} aria-label="Close importer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <textarea
          aria-label="Recipe text"
          placeholder="Paste your recipe here..."
          className="
            h-64 w-full p-2 rounded-md text-xs resize-none
          bg-white border border-gray-200 focus:border-sage-300
            focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className={classNames(
              'font-jua',
              'text-sm',
              'flex',
              'items-center',
              'gap-2',
              canImportRecipe
                ? 'bg-blush-400 hover:bg-blush-500'
                : 'bg-blush-200 cursor-not-allowed',
              'px-4 py-1.5 rounded-xl text-white transition-colors'
            )}
            disabled={isPending || !text.trim()}
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
