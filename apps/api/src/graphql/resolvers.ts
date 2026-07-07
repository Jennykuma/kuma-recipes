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
  },
};
