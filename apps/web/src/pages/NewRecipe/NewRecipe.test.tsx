import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NewRecipe from './NewRecipe';

vi.mock('../../hooks', () => ({
    useCreateRecipe: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('../../hooks/tags/useTagsQuery', () => ({
    default: () => ({ data: [], isLoading: false }),
}));

vi.mock('../../hooks/tags/useCreateTag', () => ({
    default: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('../../hooks/tags/useDeleteTag', () => ({
    default: () => ({ mutateAsync: vi.fn() }),
}));

const renderNewRecipe = () =>
    render(
        <MemoryRouter initialEntries={['/', '/recipes/new']} initialIndex={1}>
            <Routes>
                <Route path="/" element={<div>Home page</div>} />
                <Route path="/recipes/new" element={<NewRecipe />} />
            </Routes>
        </MemoryRouter>
    );

describe('NewRecipe cancel guard', () => {
    it('goes back without a dirty modal when no fields changed', async () => {
        const user = userEvent.setup();
        renderNewRecipe();

        await new Promise((resolve) => window.setTimeout(resolve, 500));
        await user.click(screen.getByLabelText(/title/i));
        await user.click(screen.getByRole('button', { name: /back/i }));

        expect(screen.queryByText(/you have unsaved changes/i)).not.toBeInTheDocument();
        expect(screen.getByText('Home page')).toBeInTheDocument();
    });

    it('shows the dirty modal when the draft has content', async () => {
        const user = userEvent.setup();
        renderNewRecipe();

        await user.type(screen.getByLabelText(/title/i), 'Apple pie');
        await user.click(screen.getByRole('button', { name: /back/i }));

        expect(screen.getByText(/you have unsaved changes/i)).toBeInTheDocument();
        expect(screen.queryByText('Home page')).not.toBeInTheDocument();
    });
});
