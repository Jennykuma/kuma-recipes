import React from 'react';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

type IngredientFormValues = {
    tableRows: { amount?: string; ingredient: string }[];
};

const Table = () => {
    const [data, setData] = useState<IngredientFormValues[]>([{}]);
    const { control, register, handleSubmit } = useForm<IngredientFormValues>({
        defaultValues: {
            tableRows: [{ amount: '', ingredient: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tableRows',
    });

    return (
        <>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <input
                        key={field.id}
                        {...register(`tableRows.${index}.ingredient`)}
                    />
                    {index === fields.length - 1 && (
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    amount: field.amount,
                                    ingredient: field.ingredient,
                                })
                            }
                        >
                            Add +
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            remove(index);
                        }}
                    >
                        Remove -
                    </button>
                </div>
            ))}
        </>
    );
};

export default Table;
