import React, { type KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { Plus, Circle, CircleMinus } from 'lucide-react';

type IngredientFormValues = {
    ingredientTableRows: { ingredient: string }[];
};

const IngredientTable = () => {
    const [data, setData] = useState<IngredientFormValues[]>([{}]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const { control, register, handleSubmit, setFocus } = useForm<IngredientFormValues>({
        defaultValues: {
            ingredientTableRows: [{ ingredient: '' }],
        },
    });
    const ingredientTableRows = useWatch({ control, name: 'ingredientTableRows' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ingredientTableRows',
    });

    const handleBlur = () => {
        // wait for the next focused element to be set
        requestAnimationFrame(() => {
            const el = document.activeElement;
            if (!containerRef.current?.contains(el)) {
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
            setFocus(`ingredientTableRows.${nextIndex}.ingredient`);
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
                                'text-sm border w-100 transition-colors pl-1',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900 bg-white'
                                    : 'border-gray-300 text-gray-600 bg-gray-50'
                            )}
                            {...register(`ingredientTableRows.${index}.ingredient`)}
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
                className="px-3 py-1.5 mt-2 text-xs flex items-center gap-2 rounded-md
                           bg-gray-50 hover:bg-gray-100
                           disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => append({ ingredient: '' }, { shouldFocus: true })}
                disabled={
                    ingredientTableRows[ingredientTableRows.length - 1].ingredient === ''
                }
            >
                <Plus className="w-4 h-4" />
                Add ingredient
            </button>
        </div>
    );
};

export default IngredientTable;
