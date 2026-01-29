import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import StepsTable from '../../NewRecipe/components/StepsTable';
import type { StepsForm } from '../../../../../api/src/services/recipes.types';

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
    const form = useForm<StepsForm>({
        defaultValues: {
            steps: (steps ?? ['']).map((step) => ({ step })),
        },
    });

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

    return (
        <div className="w-full max-w-150">
            <div className="flex flex-row items-baseline gap-1">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                    Steps
                </span>
                {!isEditing && (
                    <Pencil
                        className="w-3 h-4 pt-1 cursor-pointer link-blush"
                        onClick={onEdit}
                    />
                )}
            </div>

            {isEditing ? (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <StepsTable />
                        <div className="mt-2 flex gap-2 justify-end">
                            <button
                                className="text-xs text-gray-400"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button className="text-xs text-blush-400" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <ul>
                    {steps?.map((step) => {
                        return (
                            <li key={step} className="ml-4 list-decimal text-sm/6">
                                {step}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default StepsSection;
