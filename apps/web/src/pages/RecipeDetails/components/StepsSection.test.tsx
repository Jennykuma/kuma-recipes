import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StepsSection from './StepsSection';

describe('StepsSection', () => {
  it('saves on blur when there is a trailing empty row', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <>
        <StepsSection
          steps={['Whisk']}
          isEditing
          onEdit={vi.fn()}
          onSave={onSave}
          onCancel={vi.fn()}
        />
        <button type="button">Outside</button>
      </>
    );

    await user.click(screen.getByRole('button', { name: /add step/i }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith(['Whisk']);
  });

  it('cancels editing on escape without saving', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <StepsSection
        steps={['Whisk']}
        isEditing
        onEdit={vi.fn()}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByDisplayValue('Whisk'));
    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });
});
