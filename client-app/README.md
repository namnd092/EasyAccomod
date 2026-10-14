# EasyAccomod client

React 19, Vite, Tailwind CSS 4 and Redux Toolkit. See the root README for how to run the whole stack.

## Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` (or `npm start`) | Dev server on http://localhost:3000 |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serves `dist/` locally |
| `npm run lint` | ESLint over the client, tests included |
| `npm test` | Vitest unit and component tests |
| `npx playwright test` | End-to-end tests (needs the API; see the root README) |

## Layout

- `src/api`: one module per API area; `axiosClient` adds the access token (kept in memory only, `accessToken.js`), sends the refresh cookie, and on a 401 renews the token once and repeats the request; the session ends only when the refresh is rejected.
- `src/redux`: `auth` holds the token and a `restoring` flag, `user` the account info; `session.js` has the login, logout, restore-on-reload and account-info thunks. A reload restores the session from the HttpOnly refresh cookie; `localStorage` keeps only a non-secret `hasSession` flag.
- `src/helper/notify.js` and `src/ui/Toaster.jsx`: user-facing notifications (`notifyError(error, fallback)` after a failed request).
- `src/ui`: shared UI components; `src/page`: one folder per route.
