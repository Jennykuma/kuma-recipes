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
