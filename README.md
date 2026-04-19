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
```

4. Generate Prisma client and run migrations

```
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

5. Run the dev servers

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

## Deploy to `jennyle.dev/kuma-recipes`

Configure the web app with these env vars at build/deploy time:

```
VITE_BASE_PATH=/kuma-recipes/
VITE_API_BASE_URL=/api
```

Notes:

- `VITE_BASE_PATH` ensures built assets and React Router work under `/kuma-recipes`.
- Keep `VITE_API_BASE_URL=/api` only if your production host proxies `/api` to the API service.
- If API is hosted elsewhere, set `VITE_API_BASE_URL` to the full API origin (for example `https://api.jennyle.dev`).

### Vercel setup

Vercel allows a production domain to be attached to only one project. For `jennyle.dev/kuma-recipes`, use two projects:

1. `kuma-recipes` project (this repo, root dir: `apps/web`)
- Add env vars:

```
VITE_BASE_PATH=/kuma-recipes/
VITE_API_BASE_URL=/api
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
