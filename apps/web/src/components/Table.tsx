import React from 'react';
import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { CirclePlus, CircleMinus } from 'lucide-react';

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
                const ingredient = tableRows?.[index]?.ingredient ?? '';
                const showAdd =
                    index === fields.length - 1 && ingredient.trim().length > 0;

                return (
                    <div key={field.id} className="mt-2">
                        <input
                            className={classNames(
                                'border w-100 transition-colors pl-1',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900'
                                    : 'border-gray-300 text-gray-400'
                            )}
                            key={field.id}
                            {...register(`tableRows.${index}.ingredient`)}
                            onFocus={() => setActiveIndex(index)}
                        />
                        {showAdd && (
                            <CirclePlus
                                type="button"
                                className="w-5 h-5 ml-4 cursor-pointer inline-block"
                                aria-label="Add ingredient"
                                onClick={() =>
                                    append(
                                        { amount: '', ingredient: '' },
                                        { shouldFocus: true }
                                    )
                                }
                            />
                        )}
                        <CircleMinus
                            type="button"
                            className="w-5 h-5 ml-2 cursor-pointer text-red-500 inline-block"
                            aria-label="Remove ingredient"
                            onClick={() => {
                                remove(index);
                            }}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default Table;
