import { type KeyboardEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { type RecipeFormValues } from '../../../types/recipeForm';
import { Plus, Circle, CircleMinus } from 'lucide-react';

type IngredientsTableProps = {
  keepAddButtonVisible?: boolean;
  labelledBy?: string;
  describedBy?: string;
};

const IngredientsTable = ({
  keepAddButtonVisible = false,
  labelledBy,
  describedBy,
}: IngredientsTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const { control, register, setFocus } = useFormContext<RecipeFormValues>();
  const ingredientTableRows = useWatch({ control, name: 'ingredients' });

  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: 'ingredients',
    rules: {
      validate: (items) =>
        items.some((item) => item.ingredient.trim() !== '') ||
        'At least one ingredient is required',
    },
  });

  const lastIngredient =
    ingredientTableRows?.[ingredientTableRows.length - 1]?.ingredient ?? '';
  const isAddDisabled = lastIngredient.trim() === '';

  useEffect(() => {
    if (!keepAddButtonVisible) return;

    requestAnimationFrame(() => {
      const rows = rowsRef.current;
      if (!rows) return;
      rows.scrollTop = rows.scrollHeight;
    });
  }, [fields.length, keepAddButtonVisible]);

  const handleBlur = () => {
    // wait for the next focused element to be set
    requestAnimationFrame(() => {
      const el = document.activeElement;
      const stillInside = containerRef.current?.contains(el);

      if (!stillInside) {
        setActiveIndex(null);
      }
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    ingredient: string,
    index: number
  ) => {
    const isBlankIngredient = ingredient.trim() === '';

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isBlankIngredient) return;
      const nextIndex = index + 1;
      insert(nextIndex, { ingredient: '' });

      requestAnimationFrame(() => {
        setFocus(`ingredients.${nextIndex}.ingredient`);
        setActiveIndex(nextIndex);
      });
    }

    if (ingredient === '' && event.key === 'Backspace') {
      event.preventDefault();
      if (fields.length === 1) return;
      removeAndFocus(index);
    }
  };

  const removeAndFocus = (removeIndex: number) => {
    const nextIndex = Math.min(removeIndex, fields.length - 2);
    remove(removeIndex);

    requestAnimationFrame(() => {
      setFocus(`ingredients.${nextIndex}.ingredient`);
      setActiveIndex(nextIndex);
    });
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={classNames(
        !keepAddButtonVisible && 'space-y-2',
        keepAddButtonVisible && 'md:flex md:min-h-0 md:flex-1 md:flex-col'
      )}
    >
      <div
        ref={rowsRef}
        className={classNames(
          'space-y-2',
          keepAddButtonVisible && 'md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-2'
        )}
      >
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="flex items-center">
              <Circle
                className={classNames(
                  'w-3 h-1.5',
                  activeIndex === index ? 'text-gray-500' : 'text-gray-400'
                )}
              />
              <input
                className={classNames(
                  'w-full ml-1 text-sm rounded-md border transition-colors focus:outline-none dark:bg-canvas-deep dark:text-gray-100',
                  activeIndex === index
                    ? 'border-sage-300 dark:border-sage-300'
                    : 'border-gray-200 dark:border-gray-600'
                )}
                {...register(`ingredients.${index}.ingredient`)}
                onFocus={() => setActiveIndex(index)}
                onBlur={handleBlur}
                onKeyDown={(e) =>
                  handleKeyDown(e, ingredientTableRows?.[index]?.ingredient, index)
                }
              />
              {fields.length !== 1 && (
                <button
                  type="button"
                  className="ml-2 -translate-y-[1px]"
                  aria-label="Remove ingredient"
                  onClick={() => {
                    removeAndFocus(index);
                  }}
                >
                  <CircleMinus
                    className="w-4 h-4 text-red-300 hover:text-red-500 opacity-80 hover:opacity-100"
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          );
        })}
        <button
          type="button"
          className={classNames(
            'mt-2 inline-flex items-center gap-2 text-xs text-blush-400',
            'border border-blush-200 bg-white px-2.5 py-1.5 rounded-full',
            'hover:bg-blush-200 hover:text-white transition-colors disabled:cursor-not-allowed',
            'dark:border-blush-300/60 dark:bg-canvas-card dark:text-blush-300',
            'dark:hover:bg-blush-400 dark:hover:text-white',
            'disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
            'dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
            'self-start'
          )}
          onClick={() => {
            if (isAddDisabled) return;
            append({ ingredient: '' }, { shouldFocus: true });
          }}
          disabled={isAddDisabled}
        >
          <Plus className="w-4 h-4" />
          Add ingredient
        </button>
      </div>
    </div>
  );
};

export default IngredientsTable;
