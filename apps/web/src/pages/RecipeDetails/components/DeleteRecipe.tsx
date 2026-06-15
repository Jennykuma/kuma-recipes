import { Trash2 } from 'lucide-react';

type DeleteRecipeProps = {
  onDelete: () => void;
};

const DeleteRecipe = ({ onDelete }: DeleteRecipeProps) => {
  return (
    <button
      onClick={onDelete}
      className="
        ml-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-2 md:px-3
        text-red-500 hover:bg-red-50 hover:text-red-600
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300
        dark:text-red-300 dark:hover:bg-red-400/10 dark:hover:text-red-200"
      aria-label="Delete recipe"
      title="Delete recipe"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      <span className="hidden text-sm md:inline">Delete</span>
    </button>
  );
};

export default DeleteRecipe;
