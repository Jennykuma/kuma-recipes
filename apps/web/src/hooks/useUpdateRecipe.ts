import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../api';
import type {
    UpdateRecipeBody,
    Recipe,
    RecipeListItem,
} from '../../../api/src/services/recipes.types';

const useUpdateRecipe = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedRecipe: UpdateRecipeBody) =>
            recipeApi.updateRecipe(id, updatedRecipe),
        onMutate: async (updatedRecipe) => {
            await queryClient.cancelQueries({ queryKey: ['recipe', id] });
            await queryClient.cancelQueries({ queryKey: ['recipes'] });

            const previousRecipe = queryClient.getQueryData<Recipe>(['recipe', id]);
            const previousRecipes = queryClient.getQueryData<RecipeListItem[]>([
                'recipes',
            ]);

            if (previousRecipe) {
                queryClient.setQueryData<Recipe>(['recipe', id], {
                    ...previousRecipe,
                    ...updatedRecipe,
                });
            }

            if (previousRecipes) {
                queryClient.setQueryData<RecipeListItem[]>(
                    ['recipes'],
                    previousRecipes.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  ...(updatedRecipe.title !== undefined && {
                                      title: updatedRecipe.title,
                                  }),
                                  ...(updatedRecipe.rating !== undefined && {
                                      rating: updatedRecipe.rating,
                                  }),
                              }
                            : item
                    )
                );
            }

            return { previousRecipe, previousRecipes };
        },
        onError: (_error, _updatedRecipe, context) => {
            if (context?.previousRecipe) {
                queryClient.setQueryData<Recipe>(['recipe', id], context.previousRecipe);
            }
            if (context?.previousRecipes) {
                queryClient.setQueryData<RecipeListItem[]>(
                    ['recipes'],
                    context.previousRecipes
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
};

export default useUpdateRecipe;
