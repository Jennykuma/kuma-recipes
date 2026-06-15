import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import IngredientsTable from '../../NewRecipe/components/IngredientsTable';
import type { IngredientsForm } from '../../../../../api/src/services/recipes/recipes.types';

type IngredientsSectionProps = {
  ingredients?: string[];
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (ingredients: string[]) => void;
  onCancel?: () => void;
};

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
    defaultValues: {
      ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
    },
  });

  useEffect(() => {
    form.reset({
      ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
    });
  }, [ingredients, form]);

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

  const normalizeIngredients = (data: IngredientsForm) =>
    data.ingredients
      .map((ingredientRow) => ingredientRow.ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);

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
        const normalizedIngredients = normalizeIngredients(currentValues);

        if (normalizedIngredients.length === 0) {
          form.reset({
            ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
          });
          onCancel?.();
          return;
        }

        onSave?.(normalizedIngredients);
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
        ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
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
  }, [form, ingredients, isEditing, onCancel, onSave]);

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
