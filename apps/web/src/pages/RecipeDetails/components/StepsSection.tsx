import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import StepsTable from '../../NewRecipe/components/StepsTable';
import type { StepsForm } from 'shared';
import useEditFormAutoSave from './useEditFormAutoSave';
import useEditFormViewportLimit from './useEditFormViewportLimit';

type StepsSectionProps = {
  steps?: string[];
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (steps: string[]) => void;
  onCancel?: () => void;
};

const getDefaultStepFormValues = (steps?: string[]): StepsForm => ({
  steps: (steps ?? ['']).map((step) => ({ step })),
});

const normalizeSteps = ({ steps }: StepsForm) =>
  steps.map((stepRow) => stepRow.step.trim()).filter((step) => step.length > 0);

const StepsSection = ({
  steps,
  editable = true,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
}: StepsSectionProps) => {
  const editFormRef = useRef<HTMLFormElement>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const form = useForm<StepsForm>({
    defaultValues: getDefaultStepFormValues(steps),
  });

  const resetForm = useCallback(() => {
    form.reset(getDefaultStepFormValues(steps));
  }, [form, steps]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEditFormViewportLimit(editFormRef, isEditing);

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [onCancel, resetForm]);

  const handleSave = useCallback(() => {
    const normalizedStepValues = normalizeSteps(form.getValues());

    if (normalizedStepValues.length === 0) {
      handleCancel();
      return;
    }

    onSave?.(normalizedStepValues);
  }, [form, handleCancel, onSave]);

  useEditFormAutoSave({
    formRef: editFormRef,
    isEditing,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  return (
    <div className="w-full max-w-150">
      <div className="flex flex-row items-baseline gap-1">
        <span className="text-[10px] uppercase font-bold text-gray-500 rounded-full dark:text-gray-300 tracking-widest">
          Steps
        </span>
        {editable && !isEditing && (
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
          <form ref={editFormRef} className="flex flex-col md:min-h-0 md:overflow-hidden">
            <StepsTable keepAddButtonVisible />
          </form>
        </FormProvider>
      ) : (
        <ol>
          {steps?.map((step, index) => {
            const stepComplete = completedSteps.has(index);
            return (
              <li
                key={`${step}-${index}`}
                className="
                  grid grid-cols-[auto_minmax(0,1fr)_auto]
                  items-start gap-2 text-sm/7
                  text-gray-800 dark:text-gray-100"
              >
                <span
                  aria-hidden="true"
                  className="w-4 pt-1.5 text-xs text-right tabular-nums text-gray-500"
                >
                  {index + 1}.
                </span>
                <span className="min-w-0 break-words">
                  {stepComplete ? <s className="text-gray-500">{step}</s> : step}
                </span>
                <input
                  type="checkbox"
                  checked={stepComplete}
                  aria-label={`Mark step ${index + 1} complete`}
                  className="mt-2 h-3 w-3 bg-white accent-blush-200 border border-gray-300/70 dark:bg-canvas-card dark:border-gray-500"
                  onChange={() => toggleStep(index)}
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
