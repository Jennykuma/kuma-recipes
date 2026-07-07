import fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { buildContext, GraphQLContext } from './graphql/context.js';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import recipesRoutes from './routes/recipes.routes.js';
import tagsRoutes from './routes/tags.routes.js';
import sharedRecipesRoutes from './routes/sharedRecipes.routes.js';
import aiRoutes from './routes/ai.routes.js';
import labRoutes from './routes/lab.routes.js';
import multipart from '@fastify/multipart';

export async function buildApp() {
  const app = fastify({ logger: true });

  const apollo = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
  });
  await apollo.start();

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
      files: 1,
    },
  });

  await app.register(fastifyApollo(apollo), { context: buildContext });
  app.register(recipesRoutes, { prefix: '/recipes' });
  app.register(labRoutes, { prefix: '/recipes' });
  app.register(tagsRoutes, { prefix: '/tags' });
  app.register(sharedRecipesRoutes, { prefix: '/shared-recipes' });
  app.register(aiRoutes, { prefix: '/ai' });

  app.get('/health', async () => {
    return { ok: true };
  });

  return app;
}
