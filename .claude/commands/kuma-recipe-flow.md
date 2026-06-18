---
description: Help with feature work in the Kuma Recipes app. Use when working on recipe creation, recipe details, tags, share links, or full-stack changes in this repository. Choose the checklist that matches the change type: UI, API, database, or cross-stack.
---

When working in this repo:

- Read `AGENTS.md` for repo-specific commands, verification, and working conventions.
- Read `README.md` to understand the project structure and for env, database, and dev server setup.

## Repo map

### Main areas

- `apps/web`: React frontend
- `apps/api`: Fastify API
- `packages/shared`: shared types/utilities

### Main routes

- `apps/web/src/routes.tsx`: browser routes for sign-in, sign-up, recipe details, new recipe, and shared recipe pages
- `apps/api/src/routes/recipes.routes.ts`: authenticated recipe CRUD, photo upload/delete, and share-link creation
- `apps/api/src/routes/tags.routes.ts`: authenticated tag list, create, and delete endpoints
- `apps/api/src/routes/sharedRecipes.routes.ts`: public shared recipe lookup by token

### Recipe flow

- New recipe page: `apps/web/src/pages/NewRecipe/NewRecipe.tsx`
- Details page: `apps/web/src/pages/RecipeDetails/RecipeDetails.tsx`
- API routes: `apps/api/src/routes/recipes.routes.ts`
- Service logic: `apps/api/src/services/recipes/recipes.service.ts`
- Web API client: `apps/web/src/api/recipe.ts`
- Main recipe hooks: `apps/web/src/hooks/recipes`

### Tag flow

- Tag editing UI in details view: `apps/web/src/pages/RecipeDetails/components/TagsSection.tsx`
- Reusable tag input/display component: `apps/web/src/components/Tags.tsx`
- Tag API client: `apps/web/src/api/tags.ts`
- Tag query hook: `apps/web/src/hooks/tags/useTagsQuery.ts`
- Tag route handlers: `apps/api/src/routes/tags.routes.ts`
- Tag service logic: `apps/api/src/services/tags/tags.service.ts`

### Import flow

- Recipe importer UI: `apps/web/src/pages/NewRecipe/components/RecipeImporter.tsx`
- Web API client: `apps/web/src/api/ai.ts`
- Parse recipe hook: `apps/web/src/hooks/ai/useParseRecipe.ts`
- AI route (POST /ai/parse-recipe): `apps/api/src/routes/ai.routes.ts`
- Parse Request service (owns URL-vs-text detection): `apps/api/src/services/ai/parseRequest.service.ts`
- Parse from URL service: `apps/api/src/services/ai/parseRecipeFromUrl.service.ts`
- Parse from raw text service: `apps/api/src/services/ai/parseRecipe.service.ts`

The `/ai/parse-recipe` endpoint accepts a single `recipeInput` string. The route delegates entirely to `parseRequest.service.ts`, which owns the URL-vs-text detection (`isUrl`) and dispatches to the appropriate service. Returns `{ ok: true, recipe }` or `{ ok: false, reason: 'url_no_recipe' }`.

### Share flow

- Share button UI: `apps/web/src/pages/RecipeDetails/components/ShareRecipe.tsx`
- Share-link mutation hook: `apps/web/src/hooks/recipes/useCreateRecipeShareLink.ts`
- Shared recipe page: `apps/web/src/pages/RecipeDetails/SharedRecipeDetails.tsx`
- Shared recipe fetch client: `apps/web/src/api/recipe.ts`
- Public shared recipe route: `apps/api/src/routes/sharedRecipes.routes.ts`
- Shared recipe service: `apps/api/src/services/recipes/sharedRecipes.service.ts`

### Lab flow (Research & Design Lab tab)

The Lab tab lives on the recipe details page and lets users track variants, attempts, and pins for a recipe.

- Lab API routes (8 endpoints under `/recipes/:id/lab/*`): `apps/api/src/routes/lab.routes.ts`
- Lab service logic: `apps/api/src/services/lab/lab.service.ts`
- Lab types (LabData, CreateVariantBody, UpdateVariantBody, CreateAttemptBody, CreatePinBody): `apps/api/src/services/lab/lab.types.ts`
- Models in Prisma schema: `RecipeVariant`, `RecipeAttempt`, `RecipePin` (all cascade-delete from `Recipe`)
- Web API client: `apps/web/src/api/lab.ts`
- Lab hooks: `apps/web/src/hooks/lab/` (`useLabData`, `useCreateVariant`, `useUpdateVariant`, `useDeleteVariant`, `useLogAttempt`, `useDeleteAttempt`, `useCreatePin`, `useDeletePin`)
- Lab UI root: `apps/web/src/pages/RecipeLab/RDLabTab.tsx` — owns `selectedVariantId` state; renders VariantSwitcher, VariantBar, PinnedRecipePane, AttemptLog, and the two modals
- Lab UI components: `apps/web/src/pages/RecipeLab/components/` — `VariantSwitcher.tsx` (pill buttons), `VariantBar.tsx` (name/delta/rating/best badge), `PinnedRecipePane.tsx` (ingredients+steps with tweaked/new chips and sticky notes), `StickyNote.tsx`, `AttemptLog.tsx`, `LogAttemptModal.tsx`, `NewVariantModal.tsx`
- `NewVariantModal` takes `onCreated(variantId: string)` — a plain callback, not the `selectedVariantId` setter — so `RDLabTab` owns wiring it to its own state instead of the setter leaking through the modal's props
- `VariantItem` (`{ text, status }`) is defined in `apps/api/src/services/lab/lab.types.ts` via Zod (`VariantItemSchema`) and imported directly by PinnedRecipePane and NewVariantModal — `labTypes.ts` was deleted
- `VariantItem[]` is the typed shape of `ingredients` and `steps` on `LabVariant`; Zod validates these at write time in `createVariant`/`updateVariant`, so no cast is needed when reading in PinnedRecipePane
- Tab bar and `activeTab` state live in `RecipeDetails.tsx`; `RecipeDetailsView.tsx` accepts `tabBar?: ReactNode` and `labTab?: ReactNode` (when provided, replaces the recipe layout)
- Best badge (amber pill with trophy icon) renders in the recipe header `headerActions` when a variant has `isBest: true`

Endpoints:

- `GET /recipes/:id/lab` — returns `{ variants, attempts, pins }` for a recipe
- `POST /recipes/:id/lab/variants` — create variant; `order` auto-assigned if omitted
- `PATCH /recipes/:id/lab/variants/:variantId` — update variant; setting `isBest: true` clears all other variants' `isBest` in a transaction
- `DELETE /recipes/:id/lab/variants/:variantId`
- `POST /recipes/:id/lab/attempts` — log an attempt
- `DELETE /recipes/:id/lab/attempts/:attemptId`
- `POST /recipes/:id/lab/pins` — create a pin annotation
- `DELETE /recipes/:id/lab/pins/:pinId`

All lab endpoints are auth-gated via `requireUser` and enforce userId ownership through the Recipe relation.

### React Query cache keys

- Central registry: `apps/web/src/lib/queryKeys.ts` — `queryKeys.recipes.all/.list(tagSlugs)`, `queryKeys.recipe.all/.detail(id)`, `queryKeys.sharedRecipe.detail(token)`, `queryKeys.tags.all/.list(query)`, `queryKeys.lab.detail(recipeId)`
- All hooks under `apps/web/src/hooks/` import from this registry instead of inline string arrays — new query/mutation hooks should add a key here rather than hardcoding a string

### API and data layers

- Fastify app entry: `apps/api/src/app.ts`
- API server entry: `apps/api/src/index.ts`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Prisma migrations: `apps/api/prisma/migrations`
- Prisma client setup: `apps/api/src/prisma.ts`
- Canonical domain types and Zod schemas live in `packages/shared/src/` (`recipes.ts`, `tags.ts`, `lab.ts`). Both apps import from `'shared'`. Schema naming convention: `<Concept>Schema` (e.g. `NewRecipeBodySchema`, `CreateTagBodySchema`, `VariantItemSchema`). Types are derived via `z.infer<>`.
- API `*.types.ts` files (`apps/api/src/services/*/`) are thin re-exports from `shared` — add new types to `packages/shared/src/`, not here.
- `ParsedRecipe` and `ParsedRecipeSchema` are AI-specific and live in `apps/api/src/services/ai/parseRecipe.service.ts` (not in shared — the web never imports them directly).

### Auth and environment

- Frontend auth pages: `apps/web/src/pages/Authentication`
- Protected route wrapper: `apps/web/src/components/ProtectedRoute.tsx`
- API auth guard: `apps/api/src/auth/require-user.ts`
- API env setup: `apps/api/src/env.ts`
- Web env example: `apps/web/.env.example`

### Tests

- Web app tests live under `apps/web/src`
- API route and service tests live under `apps/api/tests`
- Recipe route coverage: `apps/api/tests/routes/recipes.test.ts`
- Recipe service coverage: `apps/api/tests/services/recipes.service.test.ts`

### Working notes

- The web app usually runs on Vite and the API usually runs on port `3001`.
- Auth-protected API endpoints require a valid Clerk token.
- Recipe and tag data are scoped per authenticated user.
- Shared recipe lookup is public and uses a token rather than the authenticated recipe routes.
- If a task changes request or response shapes, treat it as cross-stack and inspect both the web client and API route/service files.
- All API input validation uses Zod; parse in the service (not the route) so validation applies even in tests that call the service directly. The route's existing `try/catch` catches `ZodError` and returns a 400.

---

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
4. Run the relevant web verification commands from `AGENTS.md`.
5. Confirm the UI payload still matches the existing API contract.

## API Change Checklist

1. Inspect the relevant route file under `apps/api/src/routes`.
2. Edit the route and corresponding service under `apps/api/src/services`.
3. If the change affects recipes, check:
   - `apps/api/src/routes/recipes.routes.ts`
   - `apps/api/src/services/recipes/recipes.service.ts`
4. Run the relevant API verification commands from `AGENTS.md`.
5. If request or response shapes changed, mark the task as cross-stack and update the web client too.

## DB Change Checklist

1. Inspect `apps/api/prisma/schema.prisma`.
2. Determine whether the change requires a new migration.
3. Update Prisma schema and generate or update the required migration files before editing API behaviour that depends on them.
4. If migration generation or application fails, stop and inspect:
   - the schema change for invalid field definitions or relation mismatches
   - existing migration files for conflicts or drift
   - local environment setup in `README.md` and `AGENTS.md`, especially database connection and Prisma setup
5. Do not continue with dependent API changes until the schema and migration state are consistent.
6. Review affected services and routes for schema assumptions.
7. Run the relevant schema and API verification commands from `AGENTS.md`.
8. If tests fail after a schema change, check whether payload shapes, required fields, seed data, or route/service assumptions still match the new schema.
9. If lint or tests still fail and the failure is unrelated to the schema change, note the blocker clearly before proceeding with more database edits.

## Cross-Stack Checklist

1. Identify the frontend entry point and backend route involved.
2. Update the API contract first or document the intended contract clearly before editing both sides.
3. Edit the backend route/service files.
4. Edit the corresponding frontend page, hooks, or API client files.
5. Run the relevant cross-stack verification commands from `AGENTS.md`.
6. Verify field names and behaviour match on both sides.
