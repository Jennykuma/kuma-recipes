import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipePhotoPicker from '../RecipePhotoPicker';

describe('RecipePhotoPicker', () => {
  it('shows a remove button only when an image can be removed', () => {
    const { rerender } = render(<RecipePhotoPicker alt="Recipe photo" />);

    expect(
      screen.queryByRole('button', { name: /remove photo/i })
    ).not.toBeInTheDocument();

    rerender(
      <RecipePhotoPicker
        alt="Recipe photo"
        imageUrl="/recipe-photo.png"
        onRemovePhoto={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /remove photo/i })).toBeInTheDocument();
  });

  it('clears the selected file when removing a photo', async () => {
    const user = userEvent.setup();
    const onRemovePhoto = vi.fn();
    const onFileSelect = vi.fn();
    const { container } = render(
      <RecipePhotoPicker
        alt="Recipe photo"
        imageUrl="/recipe-photo.png"
        onFileSelect={onFileSelect}
        onRemovePhoto={onRemovePhoto}
      />
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(['fake image bytes'], 'photo.png', {
      type: 'image/png',
    });

    expect(input).not.toBeNull();

    await user.upload(input!, file);
    expect(input!.files?.[0]).toBe(file);
    expect(onFileSelect).toHaveBeenCalledWith(file);

    await user.click(screen.getByRole('button', { name: /remove photo/i }));

    expect(onRemovePhoto).toHaveBeenCalledTimes(1);
    expect(input!.value).toBe('');
  });
});
