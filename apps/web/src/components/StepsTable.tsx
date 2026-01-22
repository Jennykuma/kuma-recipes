import React, { type KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { useForm, useFieldArray, useWatch, type FieldArray } from 'react-hook-form';
import classNames from 'classnames';
import { Plus, CircleMinus } from 'lucide-react';

type StepFormValues = {
    stepTableRows: { index: string; step: string }[];
};

const StepsTable = () => {
    const [data, setData] = useState<StepFormValues[]>([{}]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const { control, register, handleSubmit, setFocus } = useForm<StepFormValues>({
        defaultValues: {
            stepTableRows: [{ index: '', step: '' }],
        },
    });
    const stepTableRows = useWatch({ control, name: 'stepTableRows' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'stepTableRows',
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
        step: string,
        index: number
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            append({ index: '', step: '' }, { shouldFocus: true });
        }

        if (step === '' && event.key === 'Backspace') {
            event.preventDefault();
            if (fields.length === 1) return;
            removeAndFocus(index);
        }
    };

    const removeAndFocus = (removeIndex: number) => {
        const nextIndex = Math.min(removeIndex, fields.length - 2);
        remove(removeIndex);

        requestAnimationFrame(() => {
            setFocus(`stepTableRows.${nextIndex}.step`);
            setActiveIndex(nextIndex);
        });
    };

    return (
        <div ref={containerRef} className="space-y-3">
            {fields.map((field, index) => {
                return (
                    <div key={field.id} className="flex items-center">
                        <span
                            className={classNames(
                                'text-xs w-8',
                                activeIndex === index ? 'text-gray-700' : 'text-gray-400'
                            )}
                        >
                            {index + 1}.
                        </span>
                        <input
                            className={classNames(
                                'w-full text-sm pl-1 rounded-md border w-100 transition-colors',
                                activeIndex === index
                                    ? 'border-blue-500 text-gray-900 bg-white'
                                    : 'border-gray-300 text-gray-600 bg-gray-50'
                            )}
                            {...register(`stepTableRows.${index}.step`)}
                            onFocus={() => setActiveIndex(index)}
                            onBlur={handleBlur}
                            onKeyDown={(e) =>
                                handleKeyDown(
                                    e,
                                    stepTableRows?.[index]?.step ?? '',
                                    index
                                )
                            }
                        />
                        {fields.length !== 1 && (
                            <CircleMinus
                                type="button"
                                className="w-4 h-4 ml-2 -translate-y-[1px] cursor-pointer 
                                           text-red-300 hover:text-red-500 opacity-80 hover:opacity-100"
                                aria-label="Remove step"
                                onClick={() => removeAndFocus(index)}
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
                onClick={() => append({ index: '', step: '' }, { shouldFocus: true })}
                disabled={stepTableRows[stepTableRows.length - 1].step === ''}
            >
                <Plus className="w-4 h-4" />
                Add step
            </button>
        </div>
    );
};

export default StepsTable;
