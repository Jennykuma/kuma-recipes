import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../api';

const useRecipeRating = (id: string) => {
    const queryClient = useQueryClient();

    // TODO: If the rating is the same, just return the cached version or cancel the mutation
    return useMutation({
        mutationFn: (rating: number) => recipeApi.updateRecipeRating(id, rating),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes', id] }),
    });
};

export default useRecipeRating;
