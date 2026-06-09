# AGENTS.md

Repo-specific guidance for coding agents working in `kuma-recipes`.

## Project shape

- `apps/web`: React + Vite frontend
- `apps/api`: Fastify API
- `packages/shared`: shared types and utilities

## Key flows

- Recipe creation: `apps/web/src/pages/NewRecipe/NewRecipe.tsx`
- Recipe details: `apps/web/src/pages/RecipeDetails/RecipeDetails.tsx`
- Recipe API routes: `apps/api/src/routes/recipes.routes.ts`
- Recipe service logic: `apps/api/src/services/recipes/recipes.service.ts`
- Tags API routes: `apps/api/src/routes/tags.routes.ts`
- Shared recipe route: `apps/api/src/routes/sharedRecipes.routes.ts`
- Prisma schema: `apps/api/prisma/schema.prisma`

## Working conventions

- Read `README.md` for setup, env, local database, and deploy details.
- If a task changes request or response shapes, treat it as a cross-stack change and inspect both `apps/web` and `apps/api`.
- Auth-protected API endpoints require a valid Clerk token.
- Recipe and tag data are scoped per authenticated user.
- Shared recipe lookup is public and uses a token-based route.
- For database changes, update the Prisma schema and migration state before making dependent API changes.

## Commands

- Install dependencies: `pnpm install`
- Start the local database: `docker compose up -d db`
- Run both apps in dev: `pnpm dev`
- Run only the web app: `pnpm dev:web`
- Run only the API: `pnpm dev:api`
- Lint the repo: `pnpm lint`
- Format the repo: `pnpm format`
- Check formatting: `pnpm format:check`

## Verification

- Run web tests: `pnpm --filter web test`
- Run API tests: `pnpm --filter api test`
- Run only web tests in watch mode: `pnpm --filter web test:watch`
- Run only API tests in watch mode: `pnpm --filter api test:watch`
- For UI-only changes, usually run `pnpm --filter web test` and `pnpm lint`.
- For API-only changes, usually run `pnpm --filter api test` and `pnpm lint`.
- For cross-stack changes, usually run `pnpm --filter api test`, `pnpm --filter web test`, and `pnpm lint`.

## Prisma and data

- Generate Prisma client: `pnpm --filter api exec prisma generate`
- Create and apply a local migration: `pnpm --filter api exec prisma migrate dev`
- Seed the database: `pnpm --filter api prisma db seed`
- Apply pending deployed migrations: `pnpm --filter api prisma:migrate:deploy`

## Environment notes

- API env lives in `apps/api/.env`.
- Web env lives in `apps/web/.env`.
- Local Postgres is exposed on `127.0.0.1:5433`.
- If `CLERK_SECRET_KEY` is missing in the API env, auth-protected endpoints return `500`.
- If the auth token is missing or invalid, auth-protected endpoints return `401`.
