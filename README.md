# EasyAccomod

An assignment in web application development subject that we are learning in college.

A rental-accommodation website with three roles: Renter, Owner and Admin.

## Stack

- Server: ASP.NET Core (net10.0), EF Core, PostgreSQL, ASP.NET Core Identity, JWT bearer
- Client: React, Material-UI, Redux Toolkit, Vite

## Prerequisites

- Docker
- .NET SDK 10
- Node.js and npm

## Run locally

Start PostgreSQL (host port 5433):

```bash
docker compose up -d
```

Start the API (http://localhost:5100). In the Development environment it applies the migrations and seeds roles, addresses and demo accounts on startup:

```bash
cd server-app/EasyAccomod.Api
dotnet run --launch-profile http
```

Or run the API in a container instead (set `ASPNETCORE_ENVIRONMENT=Development` to seed the demo accounts):

```bash
JWT_KEY=<at least 32 characters> docker compose --profile api up -d --build
```

Start the client (http://localhost:3000):

```bash
cd client-app
cp .env.example .env
npm install
npm run dev
```

## Demo accounts (Development only)

| Username | Password    | Role                                   |
| -------- | ----------- | -------------------------------------- |
| Admin    | Admin1234.  | Admin                                  |
| Owner1   | Owner1234.  | Owner                                  |
| Renter1  | Renter1234. | Renter                                 |
| Owner2   | Owner1234.  | Owner waiting for Admin to confirm     |

## Configuration

- `client-app/.env`: `VITE_API_URL` is the API base URL (default `http://localhost:5100`).
- `client-app/.env` also takes `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` (an unsigned upload preset); without them, attaching pictures to a post fails with a clear error. Keep the Cloudinary API secret out of the client.
- `server-app/EasyAccomod.Api/appsettings.json`: CORS origin, JWT issuer, audience and lifetime.
- `appsettings.Development.json` holds a dev-only database password and JWT key. Outside Development, set the connection string (`ConnectionStrings__DefaultConnection`) and `Jwt__Key` (at least 32 characters) through environment variables; the API refuses to start without a valid key.

## Deployment notes

- The API serves plain HTTP; terminate TLS at a reverse proxy and set `ASPNETCORE_FORWARDEDHEADERS_ENABLED=true` so the API trusts `X-Forwarded-Proto`. Outside Development it also sends an HSTS header (browsers only honor it over HTTPS).
- `GET /health` returns 200 when the API can reach the database and 503 otherwise; point the load balancer or orchestrator probe at it.
- Five failed logins lock an account for five minutes, and a locked account is rejected even with the right password; the reply is the same as for a wrong password. Because the lockout is per account, anyone who knows a user name can lock that account for five minutes, so logins are also limited per client address: `POST /api/Account/Token` allows 10 requests per 60 seconds (`RateLimiting__LoginPermitLimit`, `RateLimiting__LoginWindowSeconds`) and answers 429 with `Retry-After` beyond that. Behind a proxy, enable forwarded headers (above), otherwise every client shares the proxy's address.
- Set `Cors__Origins__0` to the real client origin, and keep the demo accounts out of Production (they are only seeded in Development).

## Continuous integration

`.github/workflows/ci.yml` builds the client (including `npm audit` and the Vitest suite), builds the API and runs the smoke test and the Playwright e2e tests against a PostgreSQL service for every pull request.

## Client tests

```bash
cd client-app
npm test
```

## End-to-end tests

Playwright drives the real client against the real API (visitor, owner, admin and renter flows). They create their own posts, and the owner's post list shows only the first 15 posts, so run them against a fresh database with the API in Development:

```bash
cd client-app
npx playwright install chromium          # once
npx playwright test                      # starts `npm run dev` on port 3000 unless it is already running
```

Set `E2E_BASE_URL` and `E2E_API_URL` to point at other hosts. In CI (`CI=1`) the tests run against the production build served by `vite preview`.

## Smoke test

With the API running in Development:

```bash
python3 scripts/smoke_test.py            # defaults to http://localhost:5100
```

It exercises login, authorization, post creation and moderation, search, interactions and the owner workflows.
