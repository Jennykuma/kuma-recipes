import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { ai as aiApi } from '../../api';
import type { ParsedRecipe } from '../../api/ai';

const useParseRecipe = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (recipeInput: string): Promise<ParsedRecipe> => {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      const parsedRecipe = await aiApi.parseRecipe(recipeInput, token);
      return parsedRecipe;
    },
  });
};

export default useParseRecipe;
