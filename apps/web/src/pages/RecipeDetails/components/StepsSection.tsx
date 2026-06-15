import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import StepsTable from '../../NewRecipe/components/StepsTable';
import type { StepsForm } from '../../../../../api/src/services/recipes/recipes.types';

type StepsSectionProps = {
  steps?: string[];
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (steps: string[]) => void;
  onCancel?: () => void;
};

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
    defaultValues: {
      steps: (steps ?? ['']).map((step) => ({ step })),
    },
  });

  useEffect(() => {
    form.reset({
      steps: (steps ?? ['']).map((step) => ({ step })),
    });
  }, [steps, form]);

  useEffect(() => {
    if (!isEditing) return;

    const updateFormMaxHeight = () => {
      const editForm = editFormRef.current;
      if (!editForm) return;

      if (!window.matchMedia('(min-width: 768px)').matches) {
        editForm.style.maxHeight = '';
        return;
      }

      const viewportPadding = 32;
      const formTop = editForm.getBoundingClientRect().top;
      const maxHeight = Math.max(160, window.innerHeight - formTop - viewportPadding);

      editForm.style.maxHeight = `${maxHeight}px`;
    };

    updateFormMaxHeight();
    window.addEventListener('resize', updateFormMaxHeight);
    window.addEventListener('scroll', updateFormMaxHeight, true);

    return () => {
      window.removeEventListener('resize', updateFormMaxHeight);
      window.removeEventListener('scroll', updateFormMaxHeight, true);
    };
  }, [isEditing]);

  const normalizeSteps = (data: StepsForm) =>
    data.steps
      .map((stepRow) => stepRow.step.trim())
      .filter((step) => step.length > 0);

  useEffect(() => {
    const formElement = editFormRef.current;
    if (!formElement || !isEditing) {
      return;
    }

    let saveTimeoutId: number | null = null;

    const handleFocusOut = (event: FocusEvent) => {
      const nextFocusedElement = event.relatedTarget as Node | null;

      if (nextFocusedElement instanceof Node && formElement.contains(nextFocusedElement)) {
        return;
      }

      if (saveTimeoutId !== null) {
        window.clearTimeout(saveTimeoutId);
      }

      saveTimeoutId = window.setTimeout(() => {
        if (formElement.contains(document.activeElement)) {
          return;
        }

        const currentValues = form.getValues();
        const normalizedSteps = normalizeSteps(currentValues);

        if (normalizedSteps.length === 0) {
          form.reset({
            steps: (steps ?? ['']).map((step) => ({ step })),
          });
          onCancel?.();
          return;
        }

        onSave?.(normalizedSteps);
      }, 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();

      if (saveTimeoutId !== null) {
        window.clearTimeout(saveTimeoutId);
      }

      form.reset({
        steps: (steps ?? ['']).map((step) => ({ step })),
      });
      onCancel?.();
    };

    formElement.addEventListener('focusout', handleFocusOut);
    formElement.addEventListener('keydown', handleKeyDown);

    return () => {
      if (saveTimeoutId !== null) {
        window.clearTimeout(saveTimeoutId);
      }

      formElement.removeEventListener('focusout', handleFocusOut);
      formElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [form, isEditing, onCancel, onSave, steps]);

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
