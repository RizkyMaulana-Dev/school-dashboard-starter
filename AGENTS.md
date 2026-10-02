# AGENTS.md — School Dashboard Starter

Read this before touching code. It is the short version; full detail lives in `docs/ARCHITECTURE.md`.

## What this is

npm-workspaces monorepo for a school management system.

- `apps/server` — Express 5 + TypeScript + Prisma + Zod + JWT/RBAC API → Cloudflare Workers
- `apps/client` — React 19 + Vite 8 + Tailwind 4 + TanStack Query + Zustand SPA → GitHub Pages
- `packages/shared` — types, Zod schemas, enums, constants shared across apps

## Before you edit: query the graph, don't grep

A pre-built knowledge graph is in `graphify-out/`. It maps every module, function, class, import, and call site. Cheaper and more complete than grep for "what uses this" / "what does this touch".

```bash
graphify query "how does attendance marking work end to end"
graphify path "bookLoanController" "prisma"        # shortest dependency path
graphify explain "BaseService"                     # what a node is + its neighbours
graphify affected "role.service"                   # reverse traversal: what breaks if I change this
graphify god-nodes                                 # architectural hubs
```

Read `graphify-out/GRAPH_REPORT.md` for the community map.

## The 10 files that explain the codebase

| #   | File                                                                      | Why                                  |
| --- | ------------------------------------------------------------------------- | ------------------------------------ |
| 1   | `package.json`                                                            | workspaces + scripts                 |
| 2   | `apps/server/src/app.ts`                                                  | every request enters here            |
| 3   | `apps/server/src/routes/index.ts`                                         | endpoint map                         |
| 4   | `apps/server/src/modules/role/` (all 7 files)                             | smallest fully-representative module |
| 5   | `apps/server/prisma/schema.prisma`                                        | 17 models, data truth                |
| 6   | `apps/server/src/middlewares/{auth.middleware,authorize,errorHandler}.ts` | security + response contract         |
| 7   | `apps/client/src/routes/route.paths.ts`                                   | page map                             |
| 8   | `apps/client/src/lib/axios.ts`                                            | client auth flow                     |
| 9   | `apps/client/src/hooks/{useEntityQuery,useEntityMutation}.ts`             | data-fetching pattern                |
| 10  | `apps/client/src/features/user-management/`                               | vertical slice example               |

## Non-negotiable conventions

**Backend — new domain = 7 files in `apps/server/src/modules/<domain>/`:**
`.routes.ts` `.controller.ts` `.service.ts` `.repository.ts` `.mapper.ts` `.types.ts` `.validation.ts`

Then: add permissions to `prisma/seed/constants.ts`, mount in `routes/index.ts`, add messages to `constant/messages.ts`, add a seeder in `prisma/seed/seeders/`.

- Throw errors from `errors/`, never hand-build error responses — `globalErrorHandler` maps them
- DB queries **only** in `.repository.ts`
- Prisma row → DTO mapping **only** in `.mapper.ts`
- Every route needs `authenticate` + `authorize("domain.action")` (except auth/health)
- Permission string is always `<domain>.<read|create|update|delete>`
- Local imports **must** carry the `.js` extension (ESM, `"type": "module"`)
- Never `new PrismaClient()` outside `lib/prisma.ts` — the AsyncLocalStorage pattern in `app.ts` is what makes Workers work

**Frontend — new page = 5 steps:**

1. path in `routes/route.paths.ts` 2. service in `services/` 3. hook in `features/<domain>/hooks/` via `createEntityQuery`/`createEntityMutation` 4. component in `features/<domain>/components/` 5. register route with `lazy()` + `ProtectedRoute`

- Never call `axios` or `fetch` in a component — go through the service layer
- Server state → TanStack Query. Never put it in Zustand.
- Zustand is only `auth.store` and `ui.store`
- Client-side validation is UX only. `validate(schema)` on the server is the trust boundary — never skip it.
- Client permission gates are cosmetic. RBAC lives in `authorize()` on the server.

## Commands

```bash
npm run dev                  # server + client together
npm run server               # API only
npm run client               # Vite only
npm run type:check           # tsc --noEmit
npm run format               # prettier --write  (run before every commit)
npm run seed --workspace=apps/server
```

Local dev gotcha: `vite.config.ts` proxies `/api` to `localhost:4000`, but the server's default `PORT` is `3000`. Set `PORT=4000` in `apps/server/.env`.

Deploy: push to `main` → GH Actions builds the client to GitHub Pages and deploys the server to Cloudflare Workers in parallel.

## Response contract (both directions)

```jsonc
{ "success": true, "message": "...", "data": {} }                     // single
{ "success": true, "message": "...", "data": [], "meta": {...} }     // paginated
{ "success": false, "message": "..." }                               // error
```

Typed on the client as `ApiResponse<T>` / `PaginatedResponse<T>` in `apps/client/src/types/api.ts`. Change one side, change the other.

## Response envelope for you (the agent)

When you report back: lead with what changed and the file paths, then anything you verified, then what you did not do or could not verify. Do not narrate your own tool calls. Do not claim something works unless you ran it.
