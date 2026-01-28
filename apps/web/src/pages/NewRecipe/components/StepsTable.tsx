import { type KeyboardEvent } from 'react';
import { useState, useRef } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { type RecipeFormValues } from '../../../types/recipeForm';
import { Plus, CircleMinus } from 'lucide-react';

const StepsTable = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const { control, register, setFocus, getValues } = useFormContext<RecipeFormValues>();
    const stepTableRows = useWatch({ control, name: 'steps' });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'steps',
    });

    const lastStep = stepTableRows?.[stepTableRows.length - 1]?.step ?? '';

    const handleBlur = () => {
        // wait for the next focused element to be set
        requestAnimationFrame(() => {
            const el = document.activeElement;
            const stillInside = containerRef.current?.contains(el);

            if (!stillInside) {
                setActiveIndex(null);

                const rows = getValues('steps') ?? [];
                const next = normalizeSteps(rows);

                // avoid extra replace if nothing changed
                const same =
                    rows.length === next.length &&
                    rows.every((row, index) => row.step === next[index].step);

                if (!same) replace(next);
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
            if (step === '') return;
            append({ step: '' }, { shouldFocus: true });
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
            setFocus(`steps.${nextIndex}.step`);
            setActiveIndex(nextIndex);
        });
    };

    const normalizeSteps = (rows: { step: string }[]) => {
        const nonEmpty = rows.filter((r) => r.step.trim() !== '');

        // keep at least one row, but don't auto-append an empty row on blur
        return nonEmpty.length === 0 ? [{ step: '' }] : nonEmpty;
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
                            {...register(`steps.${index}.step`)}
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
                onClick={() => append({ step: '' }, { shouldFocus: true })}
                disabled={lastStep === ''}
            >
                <Plus className="w-4 h-4" />
                Add step
            </button>
        </div>
    );
};

export default StepsTable;
