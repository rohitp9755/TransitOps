# TransitOps API

Node + Express + Prisma (SQLite). Modular by domain under `src/modules/*`,
each module owning its `schema` (Zod), `service` (business logic), `controller`,
and `routes`. Business rules live in pure, unit-tested functions.

## Setup
```bash
cd server
npm install
cp .env.example .env          # adjust JWT_SECRET for anything real
npm run db:migrate            # creates SQLite db + runs migrations
npm run db:seed               # loads demo data (see logins below)
npm run dev                   # http://localhost:4000/api
```

## Demo logins (password: `password123`)
| Role | Email |
|------|-------|
| Fleet Manager | fleet@transitops.in |
| Dispatcher | ravenk@transitops.in |
| Safety Officer | safety@transitops.in |
| Financial Analyst | finance@transitops.in |

## Architecture notes & decisions
- **Roles**: the PDF names the third actor "Driver"; the mockups (login + RBAC
  grid + user badge) name it **Dispatcher**. Mockups are the source of truth, and
  "Dispatcher" avoids colliding with the Driver *entity*, so the role is
  `DISPATCHER`. (Drivers remain a managed resource, not a login role.)
- **RBAC** is transcribed verbatim from the Settings mockup into
  `src/config/permissions.js` and enforced by one `authorize(module, action)`
  middleware. The same matrix is sent to the client to drive the UI.
- **Business rules** (dispatch eligibility) are pure functions in
  `modules/trips/trips.rules.js` — no I/O, fully unit-tested.
- **State transitions** (dispatch/complete/cancel, maintenance open/close) run
  inside Prisma transactions so vehicle + driver + trip never desync.
- **Derived-on-read**: dashboard KPIs, operational cost, and ROI are computed
  from live records, never stored, so they can't drift.

## Assumptions (brief was silent; flagged rather than hidden)
- **Revenue source for ROI**: the brief gives the ROI formula but no revenue
  field. Each Trip carries a `revenue` amount; vehicle revenue = sum of its
  completed trips. Swap to a dedicated billing source later without schema churn.
- **Region**: dashboard filters by region but no entity defines it, so Vehicle
  has an optional `region`.
- **Fuel efficiency** uses *actual* distance (end − start odometer) over fuel
  consumed, aggregated fleet-wide.
- **Account lockout after 5 attempts** (shown in the login mockup's error state)
  is out of scope for the core build; noted as a bonus.
