import { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import IngredientsTable from '../../NewRecipe/components/IngredientsTable';
import type { IngredientsForm } from 'shared';
import useEditFormAutoSave from './useEditFormAutoSave';
import useEditFormViewportLimit from './useEditFormViewportLimit';

type IngredientsSectionProps = {
  ingredients?: string[];
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (ingredients: string[]) => void;
  onCancel?: () => void;
};

const getDefaultIngredientFormValues = (ingredients?: string[]): IngredientsForm => ({
  ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
});

const normalizeIngredients = ({ ingredients }: IngredientsForm) =>
  ingredients
    .map((ingredientRow) => ingredientRow.ingredient.trim())
    .filter((ingredient) => ingredient.length > 0);

const IngredientsSection = ({
  ingredients,
  editable = true,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
}: IngredientsSectionProps) => {
  const editFormRef = useRef<HTMLFormElement>(null);
  const form = useForm<IngredientsForm>({
    defaultValues: getDefaultIngredientFormValues(ingredients),
  });

  const resetForm = useCallback(() => {
    form.reset(getDefaultIngredientFormValues(ingredients));
  }, [form, ingredients]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEditFormViewportLimit(editFormRef, isEditing);

  const handleCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [onCancel, resetForm]);

  const handleSave = useCallback(() => {
    const normalizedIngredientValues = normalizeIngredients(form.getValues());

    if (normalizedIngredientValues.length === 0) {
      handleCancel();
      return;
    }

    onSave?.(normalizedIngredientValues);
  }, [form, handleCancel, onSave]);

  useEditFormAutoSave({
    formRef: editFormRef,
    isEditing,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  return (
    <div className="w-full max-w-125">
      <div className="flex flex-row items-baseline gap-1">
        <span
          className="
            text-[10px] uppercase font-bold text-gray-500
            rounded-full dark:text-gray-300 tracking-widest"
        >
          Ingredients
        </span>
        {editable && !isEditing && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit ingredients"
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
            <IngredientsTable keepAddButtonVisible />
          </form>
        </FormProvider>
      ) : (
        <ul>
          {ingredients?.map((ingredient) => {
            return (
              <li
                key={ingredient}
                className="
                  ml-4 list-disc max-w-2xl
                  text-sm/6 text-gray-800 dark:text-gray-100
                  marker:text-gray-400 marker:text-xs"
              >
                <span className="line-break">{ingredient}</span>
                <input
                  type="checkbox"
                  className="ml-2 h-3 w-3 pt-1 bg-white accent-blush-200 border border-gray-300/70 dark:bg-canvas-card dark:border-gray-500"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default IngredientsSection;
