import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepsTable from '../../pages/NewRecipe/components/StepsTable';
import { renderWithForm } from './testUtils';

describe('StepsTable', () => {
    it('renders one row and disables add when last step is empty', () => {
        renderWithForm(<StepsTable />);

        expect(screen.getAllByRole('textbox')).toHaveLength(1);
        expect(screen.getByRole('button', { name: /add step/i })).toBeDisabled();
    });

    it('adds a row on Enter when the current step is not empty', async () => {
        const user = userEvent.setup();
        renderWithForm(<StepsTable />);

        await user.type(screen.getAllByRole('textbox')[0], 'Mix{enter}');

        expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    it('does not add a row on Enter when the current step is only whitespace', async () => {
        const user = userEvent.setup();
        renderWithForm(<StepsTable />);

        await user.type(screen.getAllByRole('textbox')[0], '   {enter}');

        expect(screen.getAllByRole('textbox')).toHaveLength(1);
    });

    it('inserts a row after the focused step on Enter', async () => {
        const user = userEvent.setup();
        renderWithForm(<StepsTable />, {
            defaultValues: {
                steps: [{ step: 'First' }, { step: 'Second' }, { step: 'Third' }],
            },
        });

        const inputs = screen.getAllByRole('textbox');
        await user.click(inputs[1]);
        await user.keyboard('{Enter}');

        const updatedInputs = screen.getAllByRole('textbox');
        expect(updatedInputs).toHaveLength(4);
        expect(updatedInputs.map((input) => (input as HTMLInputElement).value)).toEqual([
            'First',
            'Second',
            '',
            'Third',
        ]);
        expect(updatedInputs[2]).toHaveFocus();
    });

    it('removes an empty row on Backspace when more than one row exists', async () => {
        const user = userEvent.setup();

        renderWithForm(<StepsTable />, {
            defaultValues: {
                steps: [{ step: 'First' }, { step: '' }],
            },
        });

        const inputs = screen.getAllByRole('textbox');
        await user.click(inputs[1]);
        await user.keyboard('{Backspace}');

        await waitFor(() => {
            expect(screen.getAllByRole('textbox')).toHaveLength(1);
        });
    });
});
