import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import IngredientsSection from './IngredientsSection';

describe('IngredientsSection', () => {
    it('saves in one click when there is a trailing empty row', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(
            <IngredientsSection
                ingredients={['Sugar']}
                isEditing
                onEdit={vi.fn()}
                onSave={onSave}
                onCancel={vi.fn()}
            />
        );

        await user.click(screen.getByRole('button', { name: /add ingredient/i }));
        await user.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledTimes(1);
        });
        expect(onSave).toHaveBeenCalledWith(['Sugar']);
    });
});
