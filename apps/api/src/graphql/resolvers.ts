import { GraphQLError } from 'graphql';
import { GraphQLContext } from './context.js';

export const resolvers = {
  Query: {
    tags: async (
      parent: unknown,
      args: Record<string, never>,
      context: GraphQLContext
    ) => {
      const userId = context.userId;
      if (!userId) {
        throw new GraphQLError('User ID cannot be found', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const { listTags } = await import('../services/tags/tags.service.js');
      const tags = await listTags(userId);
      return tags;
    },
    recipes: async (
      parent: unknown,
      args: { tag?: string[] },
      context: GraphQLContext
    ) => {
      const userId = context.userId;
      if (!userId) {
        throw new GraphQLError('User ID cannot be found', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const { listRecipes } = await import('../services/recipes/recipes.service.js');
      const recipes = await listRecipes(userId, args.tag);
      return recipes;
    },
    recipe: async (parent: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = context.userId;
      if (!userId) {
        throw new GraphQLError('User ID cannot be found', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const { recipeDetails } = await import('../services/recipes/recipes.service.js');
      const recipe = await recipeDetails(args.id, userId);
      return recipe;
    },
  },
  Mutation: {
    createTag: async (
      parent: unknown,
      args: { input: { name: string } },
      context: GraphQLContext
    ) => {
      const userId = context.userId;
      if (!userId) {
        throw new GraphQLError('User ID cannot be found', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const { createOrGetTag } = await import('../services/tags/tags.service.js');
      const { input } = args;
      return createOrGetTag(input.name, userId);
    },
    createRecipe: async (
      parent: unknown,
      args: {
        input: {
          ingredients?: string[];
          notes?: string;
          rating?: number;
          steps?: string[];
          tagIds?: string[];
          title: string;
          source?: string;
          imagePath?: string | null;
          yield?: string;
        };
      },
      context: GraphQLContext
    ) => {
      const userId = context.userId;
      if (!userId) {
        throw new GraphQLError('User ID cannot be found', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const { createNewRecipe } = await import('../services/recipes/recipes.service.js');
      const { input } = args;
      return createNewRecipe(input, userId);
    },
  },
};
