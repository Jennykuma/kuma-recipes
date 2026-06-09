# Repo Map

## Main areas

- `apps/web`: React frontend
- `apps/api`: Fastify API
- `packages/shared`: shared types/utilities

## Main routes

- `apps/web/src/routes.tsx`: browser routes for sign-in, sign-up, recipe details, new recipe, and shared recipe pages
- `apps/api/src/routes/recipes.routes.ts`: authenticated recipe CRUD, photo upload/delete, and share-link creation
- `apps/api/src/routes/tags.routes.ts`: authenticated tag list, create, and delete endpoints
- `apps/api/src/routes/sharedRecipes.routes.ts`: public shared recipe lookup by token

## Recipe flow

- New recipe page: `apps/web/src/pages/NewRecipe/NewRecipe.tsx`
- Details page: `apps/web/src/pages/RecipeDetails/RecipeDetails.tsx`
- API routes: `apps/api/src/routes/recipes.routes.ts`
- Service logic: `apps/api/src/services/recipes/recipes.service.ts`
- Web API client: `apps/web/src/api/recipe.ts`
- Main recipe hooks: `apps/web/src/hooks/recipes`

## Tag flow

- Tag editing UI in details view: `apps/web/src/pages/RecipeDetails/components/TagsSection.tsx`
- Reusable tag input/display component: `apps/web/src/components/Tags.tsx`
- Tag API client: `apps/web/src/api/tags.ts`
- Tag query hook: `apps/web/src/hooks/tags/useTagsQuery.ts`
- Tag route handlers: `apps/api/src/routes/tags.routes.ts`
- Tag service logic: `apps/api/src/services/tags/tags.service.ts`

## Share flow

- Share button UI: `apps/web/src/pages/RecipeDetails/components/ShareRecipe.tsx`
- Share-link mutation hook: `apps/web/src/hooks/recipes/useCreateRecipeShareLink.ts`
- Shared recipe page: `apps/web/src/pages/RecipeDetails/SharedRecipeDetails.tsx`
- Shared recipe fetch client: `apps/web/src/api/recipe.ts`
- Public shared recipe route: `apps/api/src/routes/sharedRecipes.routes.ts`
- Shared recipe service: `apps/api/src/services/recipes/sharedRecipes.service.ts`

## API and data layers

- Fastify app entry: `apps/api/src/app.ts`
- API server entry: `apps/api/src/index.ts`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Prisma migrations: `apps/api/prisma/migrations`
- Prisma client setup: `apps/api/src/prisma.ts`
- Shared recipe and tag types live under `apps/api/src/services/.../*.types.ts`

## Auth and environment

- Frontend auth pages: `apps/web/src/pages/Authentication`
- Protected route wrapper: `apps/web/src/components/ProtectedRoute.tsx`
- API auth guard: `apps/api/src/auth/require-user.ts`
- API env setup: `apps/api/src/env.ts`
- Web env example: `apps/web/.env.example`

## Tests

- Web app tests live under `apps/web/src`
- API route and service tests live under `apps/api/tests`
- Recipe route coverage: `apps/api/tests/routes/recipes.test.ts`
- Recipe service coverage: `apps/api/tests/services/recipes.service.test.ts`

## Commands

- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm --filter web test`
- `pnpm --filter api test`
- `pnpm lint`

## Working notes

- The web app usually runs on Vite and the API usually runs on port `3001`.
- Auth-protected API endpoints require a valid Clerk token.
- Recipe and tag data are scoped per authenticated user.
- Shared recipe lookup is public and uses a token rather than the authenticated recipe routes.
- If a task changes request or response shapes, treat it as cross-stack and inspect both the web client and API route/service files.
