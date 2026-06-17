import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import useRecipes from '../hooks/recipes/useRecipes';
import useTagsQuery from '../hooks/tags/useTagsQuery';

vi.mock('../hooks/recipes/useRecipes');
vi.mock('../hooks/tags/useTagsQuery');

const mockUseRecipes = vi.mocked(useRecipes);
const mockUseTagsQuery = vi.mocked(useTagsQuery);

describe('App recipe search', () => {
  beforeEach(() => {
    mockUseRecipes.mockReturnValue({
      recipes: [
        { id: '1', title: 'Chocolate Cake', rating: 5 },
        { id: '2', title: 'Miso Soup', rating: 4 },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseTagsQuery.mockReturnValue({
      data: [
        { id: 'tag-1', name: 'Dessert', slug: 'dessert', count: 1 },
        { id: 'tag-2', name: 'Quick', slug: 'quick', count: 1 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTagsQuery>);
  });

  it('clears the search input and restores filtered recipes', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search recipes by name/i);
    await user.type(searchInput, 'cake');

    expect(searchInput).toHaveValue('cake');
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.queryByText('Miso Soup')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear search/i }));

    expect(searchInput).toHaveValue('');
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText('Miso Soup')).toBeInTheDocument();
  });

  it('selects multiple tag filters', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await user.click(screen.getByLabelText(/search recipes by tag/i));
    await user.click(screen.getByRole('button', { name: /dessert/i }));
    await user.click(screen.getByRole('button', { name: /quick/i }));

    expect(screen.getAllByText(/^selected$/)).toHaveLength(2);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(mockUseRecipes).toHaveBeenLastCalledWith(['dessert', 'quick']);
  });

  it('keeps the desktop grid at three columns for a single recipe', () => {
    mockUseRecipes.mockReturnValue({
      recipes: [{ id: '1', title: 'Cookie Latte', rating: 4, tags: [], imagePath: null }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('recipe-list')).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3'
    );
    expect(screen.getByText('Cookie Latte')).toBeInTheDocument();
  });
});
