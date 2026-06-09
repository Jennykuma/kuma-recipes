import { type KeyboardEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import classNames from 'classnames';
import { type RecipeFormValues } from '../../../types/recipeForm';
import { Plus, CircleMinus } from 'lucide-react';

type StepsTableProps = {
    keepAddButtonVisible?: boolean;
    labelledBy?: string;
    describedBy?: string;
};

const StepsTable = ({
    keepAddButtonVisible = false,
    labelledBy,
    describedBy,
}: StepsTableProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rowsRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const { control, register, setFocus } = useFormContext<RecipeFormValues>();
    const stepTableRows = useWatch({ control, name: 'steps' });

    const { fields, append, insert, remove } = useFieldArray({
        control,
        name: 'steps',
        rules: {
            validate: (items) =>
                items.some((item) => item.step.trim() !== '') ||
                'At least one step is required',
        },
    });

    const lastStep = stepTableRows?.[stepTableRows.length - 1]?.step ?? '';
    const isAddDisabled = lastStep.trim() === '';

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
        step: string,
        index: number
    ) => {
        const isBlankStep = step.trim() === '';

        if (event.key === 'Enter') {
            event.preventDefault();
            if (isBlankStep) return;
            const nextIndex = index + 1;
            insert(nextIndex, { step: '' });

            requestAnimationFrame(() => {
                setFocus(`steps.${nextIndex}.step`);
                setActiveIndex(nextIndex);
            });
        }

        if (isBlankStep && event.key === 'Backspace') {
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
                    keepAddButtonVisible &&
                        'md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-2'
                )}
            >
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="flex items-center gap-1">
                            <span
                                className={classNames(
                                    'text-xs w-4 text-right',
                                    activeIndex === index
                                        ? 'text-gray-500'
                                        : 'text-gray-400'
                                )}
                            >
                                {index + 1}.
                            </span>
                            <input
                                className={classNames(
                                    'w-full text-sm pl-1 rounded-md border w-100 transition-colors focus:outline-none dark:bg-[#252525] dark:text-gray-100',
                                    activeIndex === index
                                        ? 'border-sage-300 dark:border-sage-300'
                                        : 'border-gray-200 dark:border-gray-600'
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
                                <button
                                    type="button"
                                    className="ml-2 -translate-y-[1px]"
                                    aria-label="Remove step"
                                    onClick={() => removeAndFocus(index)}
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
                        'dark:border-blush-300/60 dark:bg-[#2a2a2a] dark:text-blush-300',
                        'dark:hover:bg-blush-400 dark:hover:text-white',
                        'disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
                        'dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500',
                        'self-start'
                    )}
                    onClick={() => {
                        if (isAddDisabled) return;
                        append({ step: '' }, { shouldFocus: true });
                    }}
                    disabled={isAddDisabled}
                >
                    <Plus className="w-4 h-4" />
                    Add step
                </button>
            </div>
        </div>
    );
};

export default StepsTable;
