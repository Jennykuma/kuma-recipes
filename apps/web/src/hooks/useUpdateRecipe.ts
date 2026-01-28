import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../api';
import type { UpdateRecipeBody } from '../../../api/src/services/recipes.types';

const useUpdateRecipe = (id: string) => {
    const queryClient = useQueryClient();

    // TODO: If the rating is the same, just return the cached version or cancel the mutation
    return useMutation({
        mutationFn: (updatedRecipe: UpdateRecipeBody) =>
            recipeApi.updateRecipe(id, updatedRecipe),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

export default useUpdateRecipe;
