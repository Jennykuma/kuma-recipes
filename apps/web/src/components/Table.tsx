import React from 'react';
import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { Plus, CircleMinus } from 'lucide-react';

type IngredientFormValues = {
    tableRows: { amount?: string; ingredient: string }[];
};

const Table = () => {
    const [data, setData] = useState<IngredientFormValues[]>([{}]);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const { control, register, handleSubmit } = useForm<IngredientFormValues>({
        defaultValues: {
            tableRows: [{ amount: '', ingredient: '' }],
        },
    });
    const tableRows = useWatch({ control, name: 'tableRows' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tableRows',
    });

    return (
        <>
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className="flex items-center">
                        <input
                            className={classNames(
                                'border w-100 transition-colors pl-1 mt-1',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900'
                                    : 'border-gray-300 text-gray-400'
                            )}
                            {...register(`tableRows.${index}.ingredient`)}
                            onFocus={() => setActiveIndex(index)}
                        />
                        {fields.length !== 1 && (
                            <CircleMinus
                                type="button"
                                className="w-5 h-5 ml-4 cursor-pointer text-red-500"
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
                disabled={tableRows[tableRows.length - 1].ingredient === ''}
            >
                <Plus className="w-4 h-4" />
                Add ingredient
            </button>
        </>
    );
};

export default Table;
