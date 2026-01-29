import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientsTable from '../../pages/NewRecipe/components/IngredientsTable';
import { renderWithForm } from './testUtils';

describe('IngredientTable', () => {
    it('renders one row and disables add when last ingredient is empty', () => {
        renderWithForm(<IngredientsTable />);

        expect(screen.getAllByRole('textbox')).toHaveLength(1);
        expect(screen.getByRole('button', { name: /add ingredient/i })).toBeDisabled();
    });

    it('enables add and appends a new row when the add button is clicked', async () => {
        const user = userEvent.setup();
        renderWithForm(<IngredientsTable />);

        await user.type(screen.getAllByRole('textbox')[0], 'Sugar');

        const addButton = screen.getByRole('button', { name: /add ingredient/i });
        expect(addButton).toBeEnabled();

        await user.click(addButton);

        expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it('adds a row on Enter when the current ingredient is not empty', async () => {
        const user = userEvent.setup();
        renderWithForm(<IngredientsTable />);

        await user.type(screen.getAllByRole('textbox')[0], 'Salt{enter}');

        expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it('removes an empty row on Backspace and focuses the previous row', async () => {
        const user = userEvent.setup();

        renderWithForm(<IngredientsTable />, {
            defaultValues: {
                ingredients: [{ ingredient: 'A' }, { ingredient: '' }],
            },
        });

        const inputs = screen.getAllByRole('textbox');
        await user.click(inputs[1]);
        await user.keyboard('{Backspace}');

        await waitFor(() => {
            expect(screen.getAllByRole('textbox')).toHaveLength(1);
        });
    });

    it('normalizes empty rows on blur and keeps only filled rows', async () => {
        const user = userEvent.setup();

        renderWithForm(
            <div>
                <IngredientsTable />
                <button type="button">Outside</button>
            </div>,
            {
                defaultValues: {
                    ingredients: [
                        { ingredient: 'A' },
                        { ingredient: '' },
                        { ingredient: 'B' },
                        { ingredient: '' },
                    ],
                },
            }
        );

        const renderedInputs = screen.getAllByRole('textbox');
        await user.click(renderedInputs[0]);
        await user.click(screen.getByRole('button', { name: /outside/i }));

        await waitFor(() => {
            expect(screen.getAllByRole('textbox')).toHaveLength(2);
        });
    });
});
