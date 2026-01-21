import React from 'react';
import { useState, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { Plus, Circle, CircleMinus } from 'lucide-react';

type IngredientFormValues = {
    ingredientTableRows: { amount?: string; ingredient: string }[];
};

const IngredientTable = () => {
    const [data, setData] = useState<IngredientFormValues[]>([{}]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const { control, register, handleSubmit } = useForm<IngredientFormValues>({
        defaultValues: {
            ingredientTableRows: [{ amount: '', ingredient: '' }],
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

    return (
        <div ref={containerRef} className="space-y-2">
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className="flex items-center">
                        <Circle className="w-8 h-1.5 text-gray-500" />
                        <input
                            className={classNames(
                                'text-sm border w-100 transition-colors pl-1',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900'
                                    : 'border-gray-300 text-gray-400'
                            )}
                            {...register(`ingredientTableRows.${index}.ingredient`)}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={handleBlur}
                        />
                        {fields.length !== 1 && (
                            <CircleMinus
                                type="button"
                                className="w-4 h-4 ml-2 -translate-y-[1px] cursor-pointer
                                           text-red-300 hover:text-red-500 opacity-80 hover:opacity-100"
                                aria-label="Remove ingredient"
                                onClick={() => {
                                    remove(index);
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
                onClick={() =>
                    append({ amount: '', ingredient: '' }, { shouldFocus: true })
                }
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
