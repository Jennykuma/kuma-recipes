import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import useRecipes from '../hooks/recipes/useRecipes';

vi.mock('../hooks/recipes/useRecipes');

const mockUseRecipes = vi.mocked(useRecipes);

describe('App recipe search', () => {
    it('clears the search input and restores filtered recipes', async () => {
        const user = userEvent.setup();

        mockUseRecipes.mockReturnValue({
            recipes: [
                { id: '1', title: 'Chocolate Cake', rating: 5 },
                { id: '2', title: 'Miso Soup', rating: 4 },
            ],
            isLoading: false,
            error: null,
        });

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
});
