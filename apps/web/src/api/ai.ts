import { buildApiUrl } from './client';

export type ParsedRecipe = {
  title: string;
  yield: string;
  source: string;
  notes: string;
  ingredients: string[];
  steps: string[];
  suggestedTags: string[];
};

const ai = {
  async parseRecipe(recipeInput: string, token?: string): Promise<ParsedRecipe> {
    const response = await fetch(buildApiUrl('/ai/parse-recipe'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ recipeInput }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error((error as { error?: string }).error ?? 'Failed to parse recipe');
    }

    return response.json() as Promise<ParsedRecipe>;
  },
};

export default ai;
