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

## Continuous integration

`.github/workflows/ci.yml` builds the client (including `npm audit` and the Vitest suite), builds the API and runs the smoke test against a PostgreSQL service for every pull request.

## Client tests

```bash
cd client-app
npm test
```

## Smoke test

With the API running in Development:

```bash
python3 scripts/smoke_test.py            # defaults to http://localhost:5100
```

It exercises login, authorization, post creation and moderation, search, interactions and the owner workflows.
