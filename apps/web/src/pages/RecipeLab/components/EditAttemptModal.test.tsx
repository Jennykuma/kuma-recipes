import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { LabAttempt, LabVariant } from 'shared';
import EditAttemptModal from './EditAttemptModal';

const updateAttemptMock = vi.fn();
const showToastMock = vi.fn();
let isPending = false;

vi.mock('../../../hooks', () => ({
  useUpdateAttempt: () => ({ mutate: updateAttemptMock, isPending }),
  useToast: () => ({ showToast: showToastMock }),
}));

const baseAttempt: LabAttempt = {
  id: 'attempt-1',
  recipeId: 'recipe-1',
  variantId: null,
  date: '2026-06-01T00:00:00.000Z' as unknown as LabAttempt['date'],
  changes: [],
  note: null,
  rating: null,
  createdAt: new Date('2026-06-01') as unknown as LabAttempt['createdAt'],
  updatedAt: new Date('2026-06-01') as unknown as LabAttempt['updatedAt'],
};

const variants: LabVariant[] = [];

describe('EditAttemptModal', () => {
  beforeEach(() => {
    updateAttemptMock.mockReset();
    showToastMock.mockReset();
    isPending = false;
  });

  it('disables save when the attempt has a date but no other content', () => {
    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={baseAttempt}
        variants={variants}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('enables save once a change is added', async () => {
    const user = userEvent.setup();
    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={baseAttempt}
        variants={variants}
        onClose={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText(/changes/i), 'less sugar');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  });

  it('disables save while the date is cleared', () => {
    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={{ ...baseAttempt, note: 'already has content' }}
        variants={variants}
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '' } });

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('disables save while the mutation is pending', () => {
    isPending = true;
    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={{ ...baseAttempt, note: 'already has content' }}
        variants={variants}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('submits the patch payload and closes on success', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    updateAttemptMock.mockImplementation((_vars, { onSuccess }) => onSuccess());

    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={baseAttempt}
        variants={variants}
        onClose={onClose}
      />
    );

    await user.type(screen.getByLabelText(/note/i), 'tasted great');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(updateAttemptMock).toHaveBeenCalledWith(
      {
        attemptId: 'attempt-1',
        body: {
          date: '2026-06-01',
          variantId: null,
          changes: [],
          note: 'tasted great',
          rating: null,
        },
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error toast when the update fails', async () => {
    const user = userEvent.setup();
    updateAttemptMock.mockImplementation((_vars, { onError }) =>
      onError(new Error('boom'))
    );

    render(
      <EditAttemptModal
        recipeId="recipe-1"
        attempt={{ ...baseAttempt, note: 'already has content' }}
        variants={variants}
        onClose={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(showToastMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Failed to save attempt. Please try again.',
    });
  });
});
