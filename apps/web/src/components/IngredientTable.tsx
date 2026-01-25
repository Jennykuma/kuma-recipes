import { type KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { type RecipeFormValues } from '../types/recipeForm';
import { Plus, Circle, CircleMinus } from 'lucide-react';

const IngredientTable = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const { control, register, setFocus, getValues } = useFormContext<RecipeFormValues>();
    const ingredientTableRows = useWatch({ control, name: 'ingredients' });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const lastIngredient =
        ingredientTableRows?.[ingredientTableRows.length - 1]?.ingredient ?? '';

    const handleBlur = () => {
        // wait for the next focused element to be set
        requestAnimationFrame(() => {
            const el = document.activeElement;
            const stillInside = containerRef.current?.contains(el);

            if (!stillInside) {
                setActiveIndex(null);

                const rows = getValues('ingredients') ?? [];
                const next = normalizeIngredients(rows);

                // avoid extra replace if nothing changed
                const same =
                    rows.length === next.length &&
                    rows.every((row, index) => row.ingredient === next[index].ingredient);

                if (!same) replace(next);
            }
        });
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
        ingredient: string,
        index: number
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (ingredient === '') return;
            append({ ingredient: '' }, { shouldFocus: true });
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

    const normalizeIngredients = (rows: { ingredient: string }[]) => {
        const nonEmpty = rows.filter((r) => r.ingredient.trim() !== '');

        // always keep one empty row at the bottom
        return nonEmpty.length === 0
            ? [{ ingredient: '' }]
            : [...nonEmpty, { ingredient: '' }];
    };

    return (
        <div ref={containerRef} className="space-y-2">
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className="flex items-center">
                        <Circle
                            className={classNames(
                                'w-8 h-1.5',
                                activeIndex === index ? 'text-gray-600' : 'text-gray-400'
                            )}
                        />
                        <input
                            className={classNames(
                                'w-full text-sm pl-1 rounded-md border w-100 transition-colors',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900 bg-white'
                                    : 'border-gray-300 text-gray-600 bg-gray-50'
                            )}
                            {...register(`ingredients.${index}.ingredient`)}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={handleBlur}
                            onKeyDown={(e) =>
                                handleKeyDown(
                                    e,
                                    ingredientTableRows?.[index]?.ingredient,
                                    index
                                )
                            }
                        />
                        {fields.length !== 1 && (
                            <CircleMinus
                                type="button"
                                className="w-4 h-4 ml-2 -translate-y-[1px] cursor-pointer
                                           text-red-300 hover:text-red-500 opacity-80 hover:opacity-100"
                                aria-label="Remove ingredient"
                                onClick={() => {
                                    removeAndFocus(index);
                                }}
                            />
                        )}
                    </div>
                );
            })}

            <button
                type="button"
                className="px-3 py-1.5 mt-2 text-xs flex items-center gap-2 rounded-lg
                           bg-gray-50 hover:bg-gray-100
                           disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => append({ ingredient: '' }, { shouldFocus: true })}
                disabled={lastIngredient === ''}
            >
                <Plus className="w-4 h-4" />
                Add ingredient
            </button>
        </div>
    );
};

export default IngredientTable;
