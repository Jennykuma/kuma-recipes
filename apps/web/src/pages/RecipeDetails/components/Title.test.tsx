import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Title from './Title';

const defaultProps = {
  title: 'Matcha Cookies',
  isEditing: true,
  draftValue: 'Matcha Cookies',
  onEdit: vi.fn(),
  onChange: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('Title', () => {
  it('saves when the input blurs', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <>
        <Title {...defaultProps} onSave={onSave} />
        <button type="button">Outside</button>
      </>
    );

    await user.tab();

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('cancels editing when escape is pressed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<Title {...defaultProps} onSave={onSave} onCancel={onCancel} />);

    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });
});
