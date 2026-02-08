import { type KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { type RecipeFormValues } from '../../../types/recipeForm';
import { Plus, Circle, CircleMinus } from 'lucide-react';

const IngredientsTable = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const { control, register, setFocus } = useFormContext<RecipeFormValues>();
    const ingredientTableRows = useWatch({ control, name: 'ingredients' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const lastIngredient =
        ingredientTableRows?.[ingredientTableRows.length - 1]?.ingredient ?? '';
    const isAddDisabled = lastIngredient.trim() === '';

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
                                'w-full text-sm pl-1 rounded-md border w-100 transition-colors focus:outline-none',
                                activeIndex === index
                                    ? 'border-sage-300'
                                    : 'border-gray-200'
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
                className="mt-2 inline-flex items-center gap-2
                           text-xs text-blush-400
                           border border-blush-200 bg-white
                           px-2.5 py-1.5 rounded-full
                           hover:bg-blush-200 hover:text-white
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    );
};

export default IngredientsTable;
