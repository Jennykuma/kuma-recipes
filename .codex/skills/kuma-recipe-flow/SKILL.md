---
name: kuma-recipe-flow
description: Help with feature work in the Kuma Recipes app. Use when working on recipe creation, recipe details, tags, share links, or full-stack changes in this repository. Choose the checklist that matches the change type: UI, API, database, or cross-stack.
---

When working in this repo:

- Read `README.md` to understand the project structure and for env, database, and dev server setup.
- If the task requires repo structure or workflow context, read `references/repo-map.md`.

Start by identifying the change type:

- UI only: changes under `apps/web` that do not modify API contracts or database schema
- API only: changes under `apps/api` that do not modify Prisma schema
- DB change: changes to Prisma schema or migrations
- Cross-stack: changes that affect both frontend and backend behaviour

## UI Change Checklist

1. Inspect the relevant route in `apps/web/src/routes.tsx`.
2. Edit the page or component files under `apps/web/src`.
3. If the change affects recipe creation or details flows, check:
   - `apps/web/src/pages/NewRecipe/NewRecipe.tsx`
   - `apps/web/src/pages/RecipeDetails/RecipeDetails.tsx`
4. Run:
   - `pnpm --filter web test`
   - `pnpm lint`
5. Confirm the UI payload still matches the existing API contract.

## API Change Checklist

1. Inspect the relevant route file under `apps/api/src/routes`.
2. Edit the route and corresponding service under `apps/api/src/services`.
3. If the change affects recipes, check:
   - `apps/api/src/routes/recipes.routes.ts`
   - `apps/api/src/services/recipes/recipes.service.ts`
4. Run:
   - `pnpm --filter api test`
   - `pnpm lint`
5. If request or response shapes changed, mark the task as cross-stack and update the web client too.

## DB Change Checklist

1. Inspect `apps/api/prisma/schema.prisma`.
2. Determine whether the change requires a new migration.
3. Update Prisma schema and generate or update the required migration files before editing API behaviour that depends on them.
4. If migration generation or application fails, stop and inspect:
   - the schema change for invalid field definitions or relation mismatches
   - existing migration files for conflicts or drift
   - local environment setup in `README.md`, especially database connection and Prisma setup
5. Do not continue with dependent API changes until the schema and migration state are consistent.
6. Review affected services and routes for schema assumptions.
7. Run the relevant API tests.
8. If tests fail after a schema change, check whether payload shapes, required fields, seed data, or route/service assumptions still match the new schema.
9. Run `pnpm lint`.
10. If lint or tests still fail and the failure is unrelated to the schema change, note the blocker clearly before proceeding with more database edits.

## Cross-Stack Checklist

1. Identify the frontend entry point and backend route involved.
2. Update the API contract first or document the intended contract clearly before editing both sides.
3. Edit the backend route/service files.
4. Edit the corresponding frontend page, hooks, or API client files.
5. Run:
   - `pnpm --filter api test`
   - `pnpm --filter web test`
   - `pnpm lint`
6. Verify field names and behaviour match on both sides.
