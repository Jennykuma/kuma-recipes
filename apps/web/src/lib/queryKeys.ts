export const queryKeys = {
  recipes: {
    all: ['recipes'] as const,
    list: (tagSlugs?: string[]) => ['recipes', tagSlugs] as const,
  },
  recipe: {
    all: ['recipe'] as const,
    detail: (id: string) => ['recipe', id] as const,
  },
  sharedRecipe: {
    detail: (token: string) => ['sharedRecipe', token] as const,
  },
  tags: {
    all: ['tags'] as const,
    list: (query?: string) => ['tags', query] as const,
  },
  lab: {
    detail: (recipeId: string) => ['lab', recipeId] as const,
  },
};
