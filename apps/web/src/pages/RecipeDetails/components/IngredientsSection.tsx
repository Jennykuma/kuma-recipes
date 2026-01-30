import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import IngredientsTable from '../../NewRecipe/components/IngredientsTable';
import type { IngredientsForm } from '../../../../../api/src/services/recipes.types';

type IngredientsSectionProps = {
    ingredients?: string[];
    isEditing: boolean;
    onEdit: () => void;
    onSave: (ingredients: string[]) => void;
    onCancel: () => void;
};

const IngredientsSection = ({
    ingredients,
    isEditing,
    onEdit,
    onSave,
    onCancel,
}: IngredientsSectionProps) => {
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

    const handleSubmit = (data: IngredientsForm) => {
        const normalizedIngredients = data.ingredients
            .map((ingredientRow) => ingredientRow.ingredient.trim())
            .filter((ingredient) => ingredient.length > 0);

        onSave(normalizedIngredients);
    };

    const handleCancel = () => {
        form.reset({
            ingredients: (ingredients ?? ['']).map((ingredient) => ({ ingredient })),
        });
        onCancel();
    };

    return (
        <div className="w-full max-w-125">
            <div className="flex flex-row items-baseline gap-1">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-sage-50 rounded-full">
                    Ingredients
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
                        <IngredientsTable />
                        <div className="mt-1 flex gap-2 justify-end">
                            <button
                                className="font-jua text-xs text-gray-400 hover:text-gray-500"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="font-jua text-xs text-blush-400 hover:text-blush-500"
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </FormProvider>
            ) : (
                <ul>
                    {ingredients?.map((ingredient) => {
                        return (
                            <li
                                key={ingredient}
                                className="ml-4 list-disc max-w-2xl text-sm/6"
                            >
                                {ingredient}
                                <input
                                    type="checkbox"
                                    className="ml-2 h-3 w-3 pt-1 bg-white accent-blush-200 border border-gray-300/70"
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
