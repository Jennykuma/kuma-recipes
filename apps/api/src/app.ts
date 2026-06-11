import fastify from 'fastify';
import recipesRoutes from './routes/recipes.routes.js';
import tagsRoutes from './routes/tags.routes.js';
import sharedRecipesRoutes from './routes/sharedRecipes.routes.js';
import multipart from '@fastify/multipart';

export function buildApp() {
  const app = fastify({ logger: true });

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
      files: 1,
    },
  });

  app.register(recipesRoutes, { prefix: '/recipes' });
  app.register(tagsRoutes, { prefix: '/tags' });
  app.register(sharedRecipesRoutes, { prefix: '/shared-recipes' });

  app.get('/health', async () => {
    return { ok: true };
  });

  return app;
}
