import { useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import type { ShareLinkItem } from '../../../../api/src/services/recipes/recipes.types';
import { useAuth } from '@clerk/clerk-react';

const useCreateRecipeShareLink = () => {
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (id: string): Promise<ShareLinkItem> => {
            const token = await getToken();
            if (!token) {
                throw new Error('Missing auth token');
            }

            const data = await recipeApi.createRecipeShareLink(id, token);
            return data;
        },
    });
};

export default useCreateRecipeShareLink;
