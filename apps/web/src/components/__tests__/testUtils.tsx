import { type PropsWithChildren, type ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render } from '@testing-library/react';
import { type RecipeFormValues } from '../../types/recipeForm';

const baseDefaults: RecipeFormValues = {
    title: '',
    source: '',
    notes: '',
    rating: 0,
    yield: '',
    tagIds: [],
    ingredients: [{ ingredient: '' }],
    steps: [{ step: '' }],
};

type RenderOptions = {
    defaultValues?: Partial<RecipeFormValues>;
};

export const renderWithForm = (
    ui: ReactElement,
    { defaultValues }: RenderOptions = {}
) => {
    const Wrapper = ({ children }: PropsWithChildren) => {
        const methods = useForm<RecipeFormValues>({
            defaultValues: {
                ...baseDefaults,
                ...defaultValues,
            },
        });

        return (
            <FormProvider {...methods}>
                <form>{children}</form>
            </FormProvider>
        );
    };

    return render(ui, { wrapper: Wrapper });
};
