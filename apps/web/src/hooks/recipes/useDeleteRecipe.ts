import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';

const useDeleteRecipe = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            if (!id) throw new Error('Missing recipe id');
            return recipeApi.deleteRecipe(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

export default useDeleteRecipe;
