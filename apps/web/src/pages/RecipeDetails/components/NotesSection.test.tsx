import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NotesSection from './NotesSection';

const defaultProps = {
  isEditing: false,
  onEdit: vi.fn(),
  onChange: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('NotesSection', () => {
  it('renders links in saved notes as clickable anchors', () => {
    render(
      <NotesSection
        {...defaultProps}
        notes={'Use this version: https://example.com/recipe.'}
      />
    );

    const link = screen.getByRole('link', { name: 'https://example.com/recipe' });

    expect(link).toHaveAttribute('href', 'https://example.com/recipe');
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('adds https to www links', () => {
    render(<NotesSection {...defaultProps} notes="Original at www.example.com/recipe" />);

    expect(screen.getByRole('link', { name: 'www.example.com/recipe' })).toHaveAttribute(
      'href',
      'https://www.example.com/recipe'
    );
  });

  it('keeps editing notes in a textarea', () => {
    render(<NotesSection {...defaultProps} isEditing draftValue="https://example.com" />);

    expect(screen.getByRole('textbox')).toHaveValue('https://example.com');
  });

  it('focuses the textarea when editing starts', () => {
    render(<NotesSection {...defaultProps} isEditing draftValue="plain note" />);

    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveFocus();
    expect(textarea).toHaveProperty('selectionStart', 'plain note'.length);
    expect(textarea).toHaveProperty('selectionEnd', 'plain note'.length);
  });

  it('does not save when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <NotesSection
        {...defaultProps}
        isEditing
        draftValue="plain note"
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('does not save on blur', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <NotesSection {...defaultProps} isEditing draftValue="plain note" onSave={onSave} />
    );

    await user.tab();

    expect(onSave).not.toHaveBeenCalled();
  });

  it('starts editing when the saved notes area is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<NotesSection {...defaultProps} notes="plain note" onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: 'plain note' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
