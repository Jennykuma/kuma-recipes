import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useFormContext } from 'react-hook-form';
import TagsSection from './TagsSection';

vi.mock('../../../components/Tags', () => ({
  default: function MockTags({ autoFocusInput = false }: { autoFocusInput?: boolean }) {
    const { getValues, setValue } = useFormContext<{ tagIds: string[] }>();

    return (
      <div>
        <input
          aria-label="Mock tags input"
          ref={(element) => {
            if (element && autoFocusInput) {
              element.focus();
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            setValue('tagIds', [...(getValues('tagIds') ?? []), 'tag-2']);
          }}
        >
          Matcha
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(
              'tagIds',
              (getValues('tagIds') ?? []).filter((tagId) => tagId !== 'tag-1')
            );
          }}
        >
          Remove dessert
        </button>
        <button type="button">Inside</button>
      </div>
    );
  },
}));

const defaultTags = [{ id: 'tag-1', name: 'Dessert', slug: 'dessert' }];

describe('TagsSection', () => {
  it('saves when focus leaves the tags editor', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <>
        <TagsSection isEditing tags={defaultTags} onSave={onSave} />
        <button type="button">Outside</button>
      </>
    );

    const input = screen.getByRole('textbox', { name: 'Mock tags input' });
    const matchaButton = screen.getByRole('button', { name: 'Matcha' });
    const removeDessertButton = screen.getByRole('button', { name: 'Remove dessert' });
    const insideButton = screen.getByRole('button', { name: 'Inside' });

    input.focus();
    await user.tab();
    expect(matchaButton).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();

    await user.tab();
    expect(removeDessertButton).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();

    await user.tab();
    expect(insideButton).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();

    await user.tab();

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith(['tag-1']);
  });

  it('cancels editing when escape is pressed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <TagsSection isEditing tags={defaultTags} onSave={onSave} onCancel={onCancel} />
    );

    screen.getByRole('textbox', { name: 'Mock tags input' }).focus();
    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('keeps internal clicks from closing before a tag is added', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <>
        <TagsSection isEditing tags={defaultTags} onSave={onSave} />
        <button type="button">Outside</button>
      </>
    );

    screen.getByRole('textbox', { name: 'Mock tags input' }).focus();
    await user.click(screen.getByRole('button', { name: 'Matcha' }));

    expect(onSave).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith(['tag-1', 'tag-2']);
  });

  it('keeps internal clicks from closing before a tag is removed', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <>
        <TagsSection isEditing tags={defaultTags} onSave={onSave} />
        <button type="button">Outside</button>
      </>
    );

    screen.getByRole('textbox', { name: 'Mock tags input' }).focus();
    await user.click(screen.getByRole('button', { name: 'Remove dessert' }));

    expect(onSave).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith([]);
  });
});
