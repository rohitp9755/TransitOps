# TransitOps Client

React + Vite + Tailwind SPA. Talks to the API via a small fetch wrapper with
JWT injection; permissions returned at login drive both routing and the UI.

## Setup
```bash
cd client
npm install
npm run dev        # http://localhost:5173 (proxies /api -> localhost:4000)
```
Run the server first (see `../server/README.md`). For a production build,
set `VITE_API_URL` to the API origin and run `npm run build`.

## Structure
- `lib/` — API client, shared constants (status colours, nav, RBAC labels), `useFetch`
- `context/AuthContext` — session, login/logout, `can(module, action)`
- `components/` — reusable UI primitives, Layout (sidebar + topbar), Modal, route guards
- `pages/` — one file per screen (Dashboard, Vehicles, Drivers, Trips, Maintenance,
  Expenses, Analytics, Settings, Login)

## Design
Tokens are derived from the mockups (`tailwind.config.js`): near-black surfaces,
amber primary accent, and consistent status colours — green Available, blue On Trip,
orange In Shop, red Retired — reused everywhere via the `<Badge>` component.

## Role-aware UI
The sidebar only shows sections the role can view; edit-only controls (Add, Dispatch,
Save) are hidden when the role lacks edit rights. This mirrors the server-side RBAC —
the client never becomes the security boundary, it just avoids dead ends.
