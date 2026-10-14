# EasyAccomod

An assignment in web application development subject that we are learning in college.

A rental-accommodation website with three roles: Renter, Owner and Admin.

## Stack

- Server: ASP.NET Core (net10.0), EF Core, PostgreSQL, ASP.NET Core Identity, JWT bearer
- Client: React 19, Tailwind CSS 4, Redux Toolkit, Vite

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
- `server-app/EasyAccomod.Api/appsettings.json`: CORS origin, JWT issuer and audience, and the token lifetimes `Jwt:AccessTokenMinutes` (default 15) and `Jwt:RefreshTokenDays` (default 30).
- `appsettings.Development.json` holds a dev-only database password and JWT key. Outside Development, set the connection string (`ConnectionStrings__DefaultConnection`) and `Jwt__Key` (at least 32 characters) through environment variables; the API refuses to start without a valid key.

## Authentication

`POST /api/Account/Token` returns a short-lived access token (JWT, `Jwt:AccessTokenMinutes`, 15 minutes by default) in the response body, which the client keeps in memory and sends as `Authorization: Bearer ...`. It also sets a rotating refresh token in an HttpOnly cookie named `refresh_token` (`Path=/api/Account`, valid for `Jwt:RefreshTokenDays`).

- `POST /api/Account/Refresh` (no body) trades the cookie for a new access token (same response shape as `Token`) and a new cookie; the old refresh token stops working. Without a valid cookie it answers 401 and clears the cookie.
- `POST /api/Account/Logout` revokes the session of the cookie and clears it; it needs no access token (so it works after the access token expired) and always answers 200.
- Only a hash of each refresh token is stored (`RefreshTokens` table). Presenting a refresh token that was already rotated, or whose session was logged out, is treated as theft: the whole session is revoked and the call gets 401. The client serializes refreshes across browser tabs (Web Locks), so racing tabs do not trigger this. Optionally, `Auth__RefreshReuseGraceSeconds` (default 0, off) lets a token rotated less than that many seconds ago be presented again and get another fresh token in the same session; this weakens theft detection, because a stolen token replayed inside the window also gets a working session. A deleted user cannot refresh. A locked-out user gets `423 Locked` and keeps the session (the cookie is not cleared or revoked), which works again once the lockout ends; otherwise anyone who knows a user name could log that user out by locking the account.

## Deployment notes

- The API serves plain HTTP; terminate TLS at a reverse proxy. Outside Development it also sends an HSTS header (browsers only honor it over HTTPS).
- Behind a proxy, list it in `ForwardedHeaders__KnownProxies__0` (an IP) or `ForwardedHeaders__KnownNetworks__0` (a CIDR such as `10.0.0.0/8`). The API then takes the client address and scheme from `X-Forwarded-For` / `X-Forwarded-Proto`, honoring only the entry the nearest trusted proxy added, so a client cannot spoof its address. Without these settings the headers are ignored and every client behind the proxy shares one address (and one login rate limit).
- `GET /health` returns 200 when the API can reach the database and 503 otherwise; point the load balancer or orchestrator probe at it.
- Five failed logins lock an account for five minutes, and a locked account is rejected even with the right password; the reply is the same as for a wrong password. Because the lockout is per account, anyone who knows a user name can lock that account for five minutes, so logins are also limited per client address: `POST /api/Account/Token` allows 10 requests per 60 seconds (`RateLimiting__LoginPermitLimit`, `RateLimiting__LoginWindowSeconds`) and answers 429 with `Retry-After` beyond that. Behind a proxy, configure the trusted proxies (above), otherwise every client shares the proxy's address. IPv6 clients are counted per /64, and clients behind one NAT address share the budget, so raise the limit if that is a concern.
- Set `Cors__Origins__0` to the real client origin, and keep the demo accounts out of Production (they are only seeded in Development). The origin must be exact (no `*`): the API answers with `Access-Control-Allow-Credentials: true` so the browser may send the refresh cookie.
- The refresh cookie is `SameSite=Strict` and `Secure` by default (`Secure` is off only in Development, where the API runs over plain http). Strict works when the client and the API share a site (for example `app.example.com` and `api.example.com`, or `localhost` on any ports). If they are on different sites, set `Auth__RefreshCookieSameSite=None` together with `Auth__RefreshCookieSecure=true` (both served over HTTPS) and the exact client origin in `Cors__Origins__0`; the API refuses to start with `None` and a non-Secure cookie. `Lax` is also accepted. `Auth__RefreshCookieSecure=false` is for plain-http setups only (for example `docker compose` on `localhost`); `docker-compose.yml` reads these from `REFRESH_COOKIE_SAMESITE` and `REFRESH_COOKIE_SECURE`.
- `POST /api/Account/Refresh` has its own per-address limit, 30 requests per 60 seconds (`RateLimiting__RefreshPermitLimit`, `RateLimiting__RefreshWindowSeconds`), and answers 429 with `Retry-After` beyond that; the same proxy and NAT remarks as for logins apply.
- `AllowedHosts` (host filtering) defaults to `localhost` outside Development, where it is `*`. Set the `AllowedHosts` environment variable to the host names clients and probes use, separated by semicolons (for example `AllowedHosts=api.example.com`); `docker-compose.yml` reads it from `ALLOWED_HOSTS`. A request with any other `Host` header, including a load balancer probe of `/health`, gets a 400.
- List endpoints take `_page` (at least 1) and `_limit` (1 to 100) and answer 400 for anything else.
- A visit to a post counts as one view per viewer (the signed-in account, or the client address for visitors) per `Views__DedupeWindowMinutes` (default 60); views by the post's owner and by Admins are not counted.

## Continuous integration

`.github/workflows/ci.yml` builds the client (including `npm audit`, ESLint and the Vitest suite), builds the API, runs the API tests (`dotnet test`), the smoke test and the Playwright e2e tests against a PostgreSQL service for every pull request.

## Client tests

```bash
cd client-app
npm run lint
npm test
```

## End-to-end tests

Playwright drives the real client against the real API (visitor, owner, admin and renter flows). They create their own posts, and the home page lists only the first 15 posts, so run them against a fresh database with the API in Development:

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

## Server tests

`server-app/EasyAccomod.Api.Tests` (xUnit) hosts the real API in-process and talks to a real PostgreSQL. Each run creates its own database next to the one in the connection string and drops it afterwards. It covers paging limits, search, role-based access, view counting, the login lockout and the refresh-token flow (rotation, reuse detection, logout, expiry).

With the database from `docker compose up -d db` running:

```bash
dotnet test server-app/EasyAccomod.slnx
```

It uses the server in `ConnectionStrings__DefaultConnection` (the database name is replaced), or `localhost:5433` with the docker-compose credentials when that is unset.
