import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Rating from '../Rating';

const InteractiveRating = () => {
  const [value, setValue] = useState(3);

  return (
    <>
      <span id="rating-label">Rating</span>
      <Rating
        value={value}
        onChange={setValue}
        interactive
        ariaLabelledby="rating-label"
      />
      <button type="button">After rating</button>
    </>
  );
};

describe('Rating', () => {
  it('uses the current selection as the only tab stop in the radio group', async () => {
    const user = userEvent.setup();

    render(<InteractiveRating />);

    await user.tab();
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'After rating' })).toHaveFocus();
  });

  it('updates the selected star when a new rating is chosen', async () => {
    const user = userEvent.setup();

    render(<InteractiveRating />);

    const fourthStar = screen.getByRole('radio', { name: '4 stars' });

    await user.click(fourthStar);

    expect(fourthStar).toBeChecked();
  });
});
