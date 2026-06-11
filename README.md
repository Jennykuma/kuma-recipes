# Kuma Recipes

A cozy recipe journal for baking and matcha experiments.

## Prerequisites

- Node.js (LTS recommended)
- pnpm (install once globally if you don't have it)
- Docker Desktop (or Docker Engine) for the Postgres database

## Setup

1. Install dependencies

```
pnpm install
```

2. Start the database

```
docker compose up -d db
```

Note: This project maps Postgres to host port 5433 to avoid conflicts with a local Postgres on 5432.

3. Configure the API database connection

Create `apps/api/.env` with:

```
DATABASE_URL=postgresql://app:app@127.0.0.1:5433/app_dev
DIRECT_URL=postgresql://app:app@127.0.0.1:5433/app_dev
CLERK_SECRET_KEY=sk_test_...
```

4. Configure the web app auth env

Create `apps/web/.env` with:

```
VITE_API_BASE_URL=/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Optional (for subpath deploys):

```
VITE_BASE_PATH=/
```

5. Generate Prisma client and run migrations

```
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

6. Run the dev servers

```
pnpm dev
```

## Useful commands

- Run only the API (http://localhost:3001):

```
pnpm dev:api
```

- Run only the web app (Vite, usually http://localhost:5173):

```
pnpm dev:web
```

- Seed the database (optional):

```
pnpm --filter api prisma db seed
```

- Apply pending migrations to a deployed database:

```
pnpm --filter api prisma:migrate:deploy
```

## Authentication (Clerk)

- The web app uses Clerk for sign-in/sign-up (`/sign-in`, `/sign-up`).
- The frontend sends a Clerk bearer token on API requests.
- The API verifies the token using `CLERK_SECRET_KEY`.
- Data is scoped per authenticated user (`Recipe.userId`, `Tag.userId`).

If `CLERK_SECRET_KEY` is missing in the API environment, auth-protected endpoints will return `500`.
If the token is missing/invalid, auth-protected endpoints will return `401`.

## Deploy to `jennyle.dev/kuma-recipes`

Configure the web app with these env vars at build/deploy time:

```
VITE_BASE_PATH=/kuma-recipes/
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

And configure the API runtime with:

```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_live_...
```

Notes:

- `VITE_BASE_PATH` ensures built assets and React Router work under `/kuma-recipes`.
- If `VITE_API_BASE_URL` is not set, the app defaults to `${VITE_BASE_PATH}api`.
  - Example: with `VITE_BASE_PATH=/kuma-recipes/`, API requests go to `/kuma-recipes/api/*`.
- Set `VITE_API_BASE_URL` only if you need an override.
  - Use `/api` only if your production host proxies `/api/*` to the API service.
  - If API is hosted elsewhere, set a full API origin (for example `https://api.jennyle.dev`).
- Run `pnpm --filter api prisma:migrate:deploy` with the production `DATABASE_URL`
  whenever a deploy includes new files under `apps/api/prisma/migrations`.
- This repo includes a GitHub Actions workflow at
  [.github/workflows/production-prisma-migrate.yml](/Users/jenny/Documents/projects/kuma-recipes/.github/workflows/production-prisma-migrate.yml)
  that runs `pnpm db:migrate` for `main` when Prisma migration files change.
  Add these GitHub repository or environment secrets before relying on it:
  `PRODUCTION_DATABASE_URL` and, optionally, `PRODUCTION_DIRECT_URL`.
  Since Vercel production deploys can still happen in parallel, the safest long-term setup is to trigger production deploys only after this workflow passes.

### Vercel setup

Vercel allows a production domain to be attached to only one project. For `jennyle.dev/kuma-recipes`, use two projects:

1. `kuma-recipes` project (this repo, root dir: `apps/web`)

- Add env vars:

```
VITE_BASE_PATH=/kuma-recipes/
```

- This repo includes [apps/web/vercel.json](/Users/jenny/Documents/projects/kuma-recipes/apps/web/vercel.json) for SPA fallback under `/kuma-recipes/*`.

2. `jennyle.dev` project (your main site project)

- Add rewrites in that project's `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/kuma-recipes",
      "destination": "https://kuma-recipes.vercel.app/kuma-recipes"
    },
    {
      "source": "/kuma-recipes/:match*",
      "destination": "https://kuma-recipes.vercel.app/kuma-recipes/:match*"
    }
  ]
}
```

If your API is not already available at `https://jennyle.dev/api/*`, also add an `/api/:path*` rewrite in the main `jennyle.dev` project.
