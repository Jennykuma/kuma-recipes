import { useQueryClient, useMutation } from '@tanstack/react-query';
import { recipe as recipeApi } from '../../api';
import type { UpdateRecipeBody, Recipe, RecipeListItem } from 'shared';
import { useAuth } from '@clerk/clerk-react';
import { queryKeys } from '../../lib/queryKeys';

const useUpdateRecipe = (id: string) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (updatedRecipe: UpdateRecipeBody) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      return recipeApi.updateRecipe(id, updatedRecipe, token);
    },
    onMutate: async (updatedRecipe) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.recipe.detail(id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.recipes.all });

      // snapshot the previous recipe/recipes
      const previousRecipe = queryClient.getQueryData<Recipe>(
        queryKeys.recipe.detail(id)
      );
      const previousRecipes = queryClient.getQueryData<RecipeListItem[]>(
        queryKeys.recipes.all
      );

      // optimistically update to the new recipe
      if (previousRecipe) {
        queryClient.setQueryData<Recipe>(queryKeys.recipe.detail(id), {
          ...previousRecipe,
          ...updatedRecipe,
        });
      }

      // optimistically update the recipe in the recipes list
      if (previousRecipes) {
        queryClient.setQueryData<RecipeListItem[]>(
          queryKeys.recipes.all,
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
                  ...(updatedRecipe.notes !== undefined && {
                    notes: updatedRecipe.notes,
                  }),
                }
              : item
          )
        );
      }

      // return a context object with the snapshotted recipe/recipes
      return { previousRecipe, previousRecipes };
    },
    // if the mutation fails, roll back to the previous recipe/recipes
    onError: (_error, _updatedRecipe, context) => {
      if (context?.previousRecipe) {
        queryClient.setQueryData<Recipe>(
          queryKeys.recipe.detail(id),
          context.previousRecipe
        );
      }
      if (context?.previousRecipes) {
        queryClient.setQueryData<RecipeListItem[]>(
          queryKeys.recipes.all,
          context.previousRecipes
        );
      }
    },
    // always refetch after error/success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

export default useUpdateRecipe;
