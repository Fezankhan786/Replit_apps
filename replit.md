# Westview University — College Enrollment System

A full-stack college enrollment website where prospective students can browse courses, apply online, track their application status, and manage their profile. Administrators can review and manage applications, courses, and reports.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/college-enrollment run dev` — run the frontend (port 20621)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required env: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, shadcn/ui, Framer Motion, react-hook-form + Zod
- API: Express 5 + Clerk auth middleware
- Auth: Replit-managed Clerk (cookie-based, no token handling needed)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for API contracts
- `lib/db/src/schema/` — Drizzle schema: courses, applications, profiles, contacts
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/college-enrollment/src/` — React frontend (pages, components)

## Architecture decisions

- Contract-first OpenAPI → codegen generates React Query hooks and Zod validation schemas
- Clerk auth is cookie-based on web; no Authorization headers or token handling needed in frontend calls
- Admin role gated by `user.publicMetadata?.role === 'admin'` (set in Clerk dashboard / Auth pane)
- `fees` field is Postgres `numeric` → Drizzle returns string; always convert with `parseFloat()` on read and `String()` on write
- DB `numeric` columns must have Drizzle type cast when inserted — pass `String(fees)` not raw number

## Product

- **Home** (`/`) — Hero, admissions announcement, CTAs
- **Courses** (`/courses`) — Searchable/filterable course catalog with fees and duration
- **Admission** (`/admission`) — Online enrollment form with validation
- **About** (`/about`) — College history, mission, stats
- **Contact** (`/contact`) — Contact form + Google Maps embed
- **Student Dashboard** (`/dashboard`) — Application status tracking + profile management (requires sign-in)
- **Admin Dashboard** (`/admin`) — Stats, application accept/reject, course CRUD, reports (requires sign-in + admin role)
- **Auth** (`/sign-in`, `/sign-up`) — Clerk-powered with custom navy blue theme

## User preferences

- Blue and white color scheme (navy blue #1e3a5f as primary)
- Professional education theme

## Gotchas

- Always run `pnpm run typecheck:libs` after changing `lib/*` schema/types before checking artifact packages
- Drizzle `numeric` columns return strings — convert with `parseFloat()` when serving JSON responses
- Clerk `publishableKey` must use `publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)` — never the raw env var
- Admin role is set via `publicMetadata.role = 'admin'` in the Auth pane (user management)
- After each OpenAPI spec change, re-run codegen before using the updated types

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/clerk-auth/references/setup-and-customization.md` for Clerk auth patterns
