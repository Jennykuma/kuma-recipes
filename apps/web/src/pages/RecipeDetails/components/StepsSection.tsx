import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import StepsTable from '../../NewRecipe/components/StepsTable';
import type { StepsForm } from '../../../../../api/src/services/recipes/recipes.types';

type StepsSectionProps = {
    steps?: string[];
    isEditing: boolean;
    onEdit: () => void;
    onSave: (steps: string[]) => void;
    onCancel: () => void;
};

const StepsSection = ({
    steps,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}: StepsSectionProps) => {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const form = useForm<StepsForm>({
        defaultValues: {
            steps: (steps ?? ['']).map((step) => ({ step })),
        },
    });

    const watchedSteps = useWatch({
        control: form.control,
        name: 'steps',
    });

    const canSave = watchedSteps.some((stepRow) => stepRow.step.trim() !== '');

    useEffect(() => {
        form.reset({
            steps: (steps ?? ['']).map((step) => ({ step })),
        });
    }, [steps, form]);

    const handleSubmit = (data: StepsForm) => {
        const normalizedSteps = data.steps
            .map((stepRow) => stepRow.step.trim())
            .filter((step) => step.length > 0);

        onSave(normalizedSteps);
    };

    const handleCancel = () => {
        form.reset({
            steps: (steps ?? ['']).map((step) => ({ step })),
        });
        onCancel();
    };

    const toggleStep = (step: string) => {
        setCompletedSteps((prev) => {
            const next = new Set(prev);

            if (next.has(step)) {
                next.delete(step);
            } else {
                next.add(step);
            }

            return next;
        });
    };

    return (
        <div className="w-full max-w-150">
            <div className="flex flex-row items-baseline gap-1">
                <span className="text-[10px] uppercase tracking-wide text-gray-600 rounded-full dark:text-gray-300">
                    Steps
                </span>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label="Edit steps"
                        className="inline-flex items-center"
                    >
                        <Pencil
                            className="w-3 h-4 pt-1 cursor-pointer link-blush"
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>

            {isEditing ? (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <StepsTable />
                        <div className="mt-1 flex gap-2 justify-end">
                            <button
                                className="font-jua text-xs text-gray-400 hover:text-gray-500"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="font-jua text-xs text-blush-400 hover:text-blush-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={!canSave}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <ol>
                    {steps?.map((step, index) => {
                        const stepComplete = completedSteps.has(step);
                        return (
                            <li
                                key={`${step}-${index}`}
                                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-1 text-sm/7 text-gray-800 dark:text-gray-100"
                            >
                                <span
                                    aria-hidden="true"
                                    className="w-6 pt-1.5 text-xs text-right tabular-nums text-gray-500"
                                >
                                    {index + 1}.
                                </span>
                                <span className="min-w-0 break-words">
                                    {stepComplete ? (
                                        <s className="text-gray-500">{step}</s>
                                    ) : (
                                        step
                                    )}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={stepComplete}
                                    aria-label={`Mark step ${index + 1} complete`}
                                    className="mt-2 h-3 w-3 bg-white accent-blush-200 border border-gray-300/70 dark:bg-[#2a2a2a] dark:border-gray-500"
                                    onChange={() => toggleStep(step)}
                                />
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
};

export default StepsSection;
