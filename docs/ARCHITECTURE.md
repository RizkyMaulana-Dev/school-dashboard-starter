# Arsitektur Codebase — School Dashboard Starter

Dokumen ini adalah peta mental codebase untuk developer (termasuk AI agent seperti OpenCode/Claude Code) yang baru masuk ke repo ini. Tujuannya: supaya Anda bisa menjawab "file mana yang harus disentuh" tanpa menebak.

Version: 1.0.0 · Branch: `agent/add-some-detail` · Terakhir di-update: 2026-10-02

---

## 1. Ringkasan Satu Paragraf

Ini adalah **monorepo npm workspaces** untuk sistem manajemen sekolah. Backend (`apps/server`) adalah REST API Express + TypeScript + Prisma dengan RBAC, di-deploy ke **Cloudflare Workers**. Frontend (`apps/client`) adalah SPA React 19 + Vite + Tailwind 4 + TanStack Query + Zustand, di-deploy ke **GitHub Pages** (base path `/school-dashboard-starter/`). Domain bisnisnya: siswa, guru, kelas, absensi, perpustakaan (buku/peminjaman), inventaris (barang/peminjaman), user/role/permission.

---

## 2. Peta Direktori

```
school-dashboard-starter/
├── apps/
│   ├── server/                  # REST API (Express 5 + Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # 17 model, 6 enum — sumber kebenaran DB
│   │   │   ├── migrations/      # SQL migration
│   │   │   └── seed/            # seeders per domain + constants
│   │   ├── src/
│   │   │   ├── server.ts        # entrypoint lokal + export default untuk Vercel
│   │   │   ├── worker.ts        # entrypoint Cloudflare Workers (nodejs_compat)
│   │   │   ├── app.ts           # Express app: CORS, JSON, logger, ALS, routes
│   │   │   ├── routes/index.ts  # mount semua modul di /api/v1
│   │   │   ├── modules/         # 14 domain modules (lihat §4)
│   │   │   ├── core/            # BaseRepository / BaseService (helper)
│   │   │   ├── middlewares/     # auth, authorize, validate, errorHandler, logger
│   │   │   ├── lib/             # prisma, jwt, password, logger
│   │   │   ├── errors/          # ApiError + subclass HTTP
│   │   │   ├── utils/           # response helpers, pagination
│   │   │   ├── config/env.ts    # validasi env via Zod
│   │   │   └── constant/messages.ts  # semua string pesan per domain
│   │   └── wrangler.toml        # config Cloudflare Workers
│   └── client/                  # SPA React (Vite)
│       ├── src/
│       │   ├── main.tsx         # entry
│       │   ├── app/App.tsx      # ErrorBoundary > AppProviders > RouterProvider
│       │   ├── routes/          # route objects + ROUTE_PATHS constants
│       │   ├── features/        # 10 feature folders (vertical slices)
│       │   ├── layouts/         # AuthLayout, PublicLayout, DashboardLayout
│       │   ├── components/      # ui/ (shadcn), feedback/, guard/, shared/
│       │   ├── services/        # 1 file per entity, memanggil apiClient
│       │   ├── hooks/           # generic factories (query/mutation/pagination)
│       │   ├── stores/          # Zustand: auth.store, ui.store
│       │   ├── providers/       # AppProviders, AuthProvider, ThemeProvider
│       │   ├── lib/             # axios instance, validations (zod), constants
│       │   ├── types/           # ApiResponse, entities, common
│       │   └── utils/           # cn, formatters, storage, validators
│       └── vite.config.ts       # alias @, proxy /api, base path GitHub Pages
├── packages/shared/             # types/schemas/enums/constants lintas app
├── scripts/                     # setup.js, seed.js
├── docs/                        # dokumen ini + INSTALLATION/CONTRIBUTING/CHANGELOG/ROADMAP
└── .github/workflows/main.yml   # CI: deploy client ke Pages + server ke Cloudflare
```

---

## 3. Arsitektur Backend

### 3.1 Entry Point — dual target

Satu codebase Express berjalan di dua target berbeda:

| File            | Target             | Cara jalan                                                                                |
| --------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `src/server.ts` | Lokal / Vercel     | `app.listen(PORT)` **hanya** kalau `NODE_ENV !== "production"`, lalu `export default app` |
| `src/worker.ts` | Cloudflare Workers | `httpServerHandler({ port: 3000 })` + flag `nodejs_compat`                                |

Keduanya meng-import `app.ts` yang sama. Jadi **perubahan routing cukup di `app.ts`**, tidak perlu sentuh entry point.

### 3.2 Prisma Client — pola AsyncLocalStorage (penting)

`src/lib/prisma.ts` tidak memakai singleton global. Alasannya: Cloudflare Workers mengisolasi I/O per-request; singleton global akan.share connection antar-request.

```ts
// app.ts — middleware yang membungkus setiap request
app.use((_req, _res, next) => {
  const client = createPrismaClient();
  asyncLocalStorage.run(client, () => next());
});

// lib/prisma.ts — Proxy yang resolve client dari ALS per property access
export const prisma = new Proxy({} as ExtendedPrismaClient, {
  get(_t, prop) {
    const client = asyncLocalStorage.getStore() ?? createPrismaClient();
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
```

**Konsekuensi untuk developer:** di repository manapun, cukup `import { prisma } from "../../lib/prisma"` dan panggil langsung. Jangan pernah membuat `new PrismaClient()` sendiri — akan melewati ALS dan malfunction di Workers.

`createPrismaClient()` juga otomatis memasang `withAccelerate()` kalau `DATABASE_URL` diawali `prisma://` atau `prisma+postgres://`. Jadi Accelerate cukup dengan ganti URL, tanpa ubah kode.

### 3.3 Pattern module: Controller → Service → Repository → Mapper

Setiap domain di `src/modules/<domain>/` punya file yang konsisten:

```
<domain>.routes.ts       # URL + middleware chain (authenticate, authorize, validate)
<domain>.controller.ts   # HTTP concern: baca req, panggil service, bungkus response
<domain>.service.ts      # business logic, lempar NotFoundError/ConflictError
<domain>.repository.ts   # Prisma query murni, tanpa HTTP concern
<domain>.mapper.ts       # Prisma row → response DTO (to<X>Response, to<X>sResponse)
<domain>.types.ts        # tipe domain
<domain>.validation.ts   # Zod schema untuk body
index.ts                 # re-export (hanya di sebagian modul)
```

Baca satu modul (misal `role/`) untuk memahami semua yang lain — mereka semua identik secara bentuk.

### 3.4 Error handling

Semua error dilempar, tidak pernah di-try/catch per-controller. `globalErrorHandler` (registered terakhir di `app.ts`) yang memetakan:

| Error                     | Status             | Sumber                                                          |
| ------------------------- | ------------------ | --------------------------------------------------------------- |
| `jwt.TokenExpiredError`   | 401                | Sesi habis                                                      |
| `jwt.JsonWebTokenError`   | 401                | Token malformed                                                 |
| `ApiError` (dan subclass) | `error.statusCode` | `errors/` — BadRequest/Unauthorized/Forbidden/NotFound/Conflict |
| `ZodError`                | 400                | Validasi `validate()` middleware                                |
| `Prisma` P2002            | 409                | Unique constraint                                               |
| `Prisma` P2025            | 404                | Record not found                                                |
| lainnya                   | 500                | Di-log, fallback message generik                                |

**Pola wajib untuk kode baru:** lempar `new NotFoundError(...)`, jangan `res.status(404).json(...)`.

### 3.5 Auth & RBAC

Dua middleware, dua tahap:

```ts
authenticate; // baca Authorization: Bearer <token> → verifyAccessToken → req.user = { userId, email }
authorize(perm); // cek PermissionService.hasPermission(req.user.userId, perm) → ForbiddenError kalau tidak
```

JWT: HS256, payload `{ userId, email }`, secret dari `env.JWT_SECRET` (min 32 karakter, divalidasi Zod di `config/env.ts`). Expires default `7d`.

Route declaration selalu berbentuk:

```ts
router.post("/", authenticate, authorize("student.create"), validate(schema), controller.create);
```

**Permission string = `<domain>.<action>`**, dengan action ∈ `read | create | update | delete`. Domain yang ada: `user`, `role`, `class`, `student`, `teacher`, `attendance`, `attendance-session`, `book`, `book-category`, `book-loan`, `item`, `item-category`, `item-loan`, `dashboard`.

### 3.6 Pagination

`utils/pagination/index.ts` → `getPagination(req)` membaca query string dan mengembalikan `{ page, limit, skip, search, sort, order }`. Default: `page=1`, `limit=10` (**di-clamp maks 100**), `sort=createdAt`, `order=desc`.

Controller list selalu: `getPagination(req)` → `service.findAll(pagination)` → `successResponseWithMeta(res, data, meta, MESSAGE)`. Meta dibangun oleh `createPaginationMeta()` di `utils/pagination/PaginatedResponse.ts` dengan bentuk `{ page, limit, total, totalPages, hasNext, hasPrevious }`.

### 3.7 Response contract

Semua endpoint mengembalikan salah satu dari dua bentuk (`utils/response.ts`):

```jsonc
// single
{ "success": true, "message": "...", "data": { } }
// paginated
{ "success": true, "message": "...", "data": [ ], "meta": { page, limit, total, totalPages, hasNext, hasPrevious } }
// error
{ "success": false, "message": "..." }
```

Client punya tipe persis untuk ini di `apps/client/src/types/api.ts` (`ApiResponse<T>`, `PaginatedResponse<T>`). Ubah server → ubah tipe client, bukan sebaliknya.

### 3.8 Daftar endpoint

Base: `/api/v1`. Semua kecuali `/auth/login`, `/auth/google`, `/health` butuh token.

| Prefix                | Modul             | Endpoint                                                        |
| --------------------- | ----------------- | --------------------------------------------------------------- |
| `/auth`               | auth              | `POST /login`, `POST /google`, `GET /me`, `POST /refresh-token` |
| `/users`              | users             | CRUD + `PATCH /:id/roles`                                       |
| `/roles`              | role              | read-only: `GET /`, `GET /:id`                                  |
| `/class`              | schoolClass       | CRUD                                                            |
| `/student`            | students          | CRUD                                                            |
| `/teacher`            | teacher           | CRUD                                                            |
| `/attendance-session` | attendanceSession | CRUD                                                            |
| `/attendance`         | attendances       | CRUD                                                            |
| `/book`               | books             | CRUD                                                            |
| `/book-category`      | bookCategories    | CRUD                                                            |
| `/book-loan`          | bookLoan          | CRUD                                                            |
| `/item`               | items             | CRUD                                                            |
| `/item-category`      | itemCategories    | CRUD                                                            |
| `/item-loan`          | itemLoan          | CRUD                                                            |
| `/health`             | —                 | `GET /health` — cek koneksi DB (`SELECT 1`)                     |
| `/permission-test`    | —                 | `GET /permission-test` — smoke test RBAC                        |

### 3.9 Database schema

17 model. Ringkas:

```
User ──┬── roles[] (m2m implicit via Role.users)
       ├── Student?  (1:1, userId UNIQUE, cascade delete)
       ├── Teacher?  (1:1, userId UNIQUE, cascade delete)
       ├── ItemLoan[]
       └── BookLoan[]

Role ── users[], permissions[]      Permission
SchoolClass ── student[], teachers[] (m2m), attendanceSessions[]
AttendanceSession ── records[]      Attendance (uniq: sessionId+studentId)
ItemCategory ── items[]
Item  ── category, stockTotal/stockAvailable, condition, loans[]
ItemLoan ── item, user, qty, borrow/due/return, status
BookCategory ── books[]
Book  ── category, isbn, stockTotal/stockAvailable, shelfLocation, loans[]
BookLoan ── book, user, borrow/due/return, fineAmount, status
```

Enum:

- `Gender`: MALE, FEMALE
- `AttendanceStatus`: PRESENT, LATE, EXCUSED, ABSENT
- `ItemCondition`: BAIK, RUSAK_RINGAN, RUSAK_BERAT
- `ItemLoanStatus`: DIPINJAM, DIKEMBALIKAN, HILANG, RUSAK
- `BookLoanStatus`: DIPINJAM, DIKEMBALIKAN, TERLAMBAT, HILANG

Pola penting untuk inventaris & perpustakaan: `stockTotal` vs `stockAvailable` adalah dua kolom terpisah. Pinjam harus decrement `stockAvailable`, **tidak boleh** menyentuh `stockTotal`. Ini yang membuat aset bisa hilang/rusak tanpa mengurangi total.

Catatan: `datasource` di `schema.prisma` saat ini `provider = "sqlite"` dengan `prisma/database.db` — komentar README menyebut MySQL sebagai recommended untuk produksi. Sebelum deploy production, ganti provider sesuai DB target lalu `prisma migrate`.

### 3.10 Seed

`prisma/seed/index.ts` mengorkestrasi seeders per-domain di `prisma/seed/seeders/` (permissions, roles, users, classes, teachers, bulkStudents, books, bookLoans, items, itemLoans, attendances) plus `constants.ts` (data statis) dan `prisma.ts` (client sendiri, **tidak** lewat ALS — seed bukan request).

Jalankan: `npm run seed --workspace=apps/server`.

---

## 4. Arsitektur Frontend

### 4.1 Feature-sliced, bukan layer-based

Struktur `src/features/<domain>/` adalah vertical slice:

```
features/<domain>/
├── components/   # List, Form, Detail
├── hooks/        # use<Entity>, use<Entity>Mutations
├── types/
└── index.ts      # barrel export
```

Sepuluh feature: `auth`, `dashboard`, `user-management`, `class-management`, `student-management`, `teacher-management`, `attendance`, `library`, `inventory`, `public-activity`.

**Aturan:** komponen tidak pernah memanggil axios langsung. Component → feature hook → service → apiClient → axios instance.

### 4.2 Lapisan data

```
Component
   ↓ panggil
Feature hook (useStudents, useStudentMutations)   ← hasil createEntityQuery/createEntityMutation
   ↓ panggil
Service (student.service.ts)                      ← hardcode URL + tipe params
   ↓ panggil
apiClient (services/apiClient.ts)                 ← tipis: get/post/patch/put/delete generik
   ↓ panggil
axios instance (lib/axios.ts)                     ← baseURL, interceptor token + refresh
```

### 4.3 Auth di client

- **Storage:** `localStorage`, key `access_token` / `refresh_token` (`lib/axios.ts`).
- **Request interceptor:** sisipkan `Authorization: Bearer` ke setiap request.
- **Response interceptor (401):** coba refresh sekali (`_retry` flag). Kalau ada request lain yang gagal 401 bersamaan, antre di `failedQueue` — satu refresh, banyak request replay. Kalau refresh gagal → `clearTokens()` + redirect ke `/login`.
- **Hydrasi session:** `AuthProvider` (mount) baca `refreshToken` dari store; kalau ada, panggil `authService.refreshToken()` untuk dapat access token baru, kalau gagal → logout.
- **Route guard:** `ProtectedRoute` cek `isAuthenticated`; belum auth → `<Navigate to="/login" state={{from}} />`.

**Known gap:** `protected.route.tsx` menerima prop `requiredPermissions` / `requiredRoles` tapi **belum dipakai** (ada TODO). Permission dicek server-side via `authorize()`. Ada `components/guard/PermissionGate.tsx` yang tersedia tapi belum di-wire ke router. Kalau menambah halaman yang butuh permission, dua opsi: andalkan `authorize()` di server (sudah ada, cukup) atau wire `PermissionGate`. Jangan investasi gate di client sebagai pengganti RBAC server.

### 4.4 Routing

Semua path dicegah dari hardcode oleh `routes/route.paths.ts` → `ROUTE_PATHS` (object `as const`) + helper `generatePath(path, params)` untuk path dinamis (`:id`).

Tiga route group:

- `auth.routes.tsx` → `AuthLayout`, path `/login` dkk
- `dashboard.routes.tsx` → dibungkus `ProtectedRoute` + `DashboardLayout`, semua di bawah `/app/**`
- `public.routes.tsx` → `PublicLayout`, semua di bawah `/activity/**` (tanpa auth: katalog buku/barang, absensi, riwayat peminjaman, profil)

Semua komponen halaman di-`lazy()` via `React.lazy` untuk code splitting.

### 4.5 Form & validasi

- **Client:** Zod per entity di `lib/validations/<entity>.schema.ts` + `react-hook-form` + `@hookform/resolvers`.
- **Server:** Zod per entity di `modules/<domain>/<domain>.validation.ts`, dijalankan middleware `validate(schema)`.

Dua-duanya ada, dan itu disengaja — client untuk UX, server untuk trust boundary. **Jangan skip validasi server dengan alasan "client sudah validasi".**

### 4.6 Styling

Tailwind 4 via `@tailwindcss/vite` (tanpa `tailwind.config.js` — konfigurasi lewat CSS). Token warna/CSS variable di `src/styles/` (`variables.css`, `theme.css`, `globals.css`, `tailwind.css`, `animation.css`). Komponen UI di `components/ui/` bergaya shadcn/ui (`@base-ui/react` primitives + `class-variance-authority` + `cn()` merge). Merge class pakai `cn()` (`utils/cn.ts` = clsx + tailwind-merge).

### 4.7 State management

Hanya 2 store Zustand, dan itu cukup:

- `stores/auth.store.ts` — user, tokens, isAuthenticated, isLoading
- `stores/ui.store.ts` — toast queue (`addToast`), dll

Server state **tidak** lewat Zustand — itu urusan TanStack Query (`queryKey = [entityKey, params]`). Aturan: data server → TanStack Query; state UI/session → Zustand.

### 4.8 Base URL client

`apps/client/.env` → `VITE_API_URL`. Karena di-deploy ke GitHub Pages (bukan same-origin), env var wajib diisi — tidak ada fallback hardcoded. `vite.config.ts` set `base: "/school-dashboard-starter/"` untuk sub-path Pages.

---

## 5. Deployment

Dictated oleh `.github/workflows/main.yml`, trigger `push` ke `main`, dua job paralel:

**deploy-client → GitHub Pages**

1. `npm ci` di root, `npm run build --workspace=apps/client`
2. Verify artifact (`dist/index.html` harus ada)
3. Upload `./apps/client/dist` sebagai Pages artifact

Env: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` dari repo **variables** (bukan secret — memang harus public di bundle).

**deploy-server → Cloudflare Workers**
`cloudflare/wrangler-action@v3` dengan `DATABASE_URL` + `JWT_SECRET` dari **secrets**, di-inject lewat `secrets:` block.

CORS di `app.ts` mengizinkan production origin: `https://rizkymaulana-dev.github.io`, `https://school-dashboard-server.rzkymln-dev.workers.dev`, dan semua `*.github.io`. Development: semua origin diizinkan (aman karena lewat Vite proxy).

---

## 6. Environment Variables

**`apps/server/.env`** — consumed via `tsx --env-file=.env` dan divalidasi Zod di `config/env.ts`:

| Var                                         | Wajib | Default     | Catatan                                     |
| ------------------------------------------- | ----- | ----------- | ------------------------------------------- |
| `DATABASE_URL`                              | ya    | —           | `prisma://` → otomatis aktifkan Accelerate  |
| `JWT_SECRET`                                | ya    | —           | min 32 karakter, boot gagal keras tanpa ini |
| `PORT`                                      | tidak | 3000        | default Vite proxy: 4000 (lihat §7)         |
| `NODE_ENV`                                  | tidak | development | `production` = jangan `app.listen`          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | tidak | —           | untuk `POST /auth/google`                   |
| `VITE_API_URL` / `PROD_API_URL`             | tidak | —           |                                             |

**`apps/client/.env`** — consumed Vite:

| Var                     | Wajib | Catatan                             |
| ----------------------- | ----- | ----------------------------------- |
| `VITE_API_URL`          | ya    | URL API absolut; tidak ada fallback |
| `VITE_GOOGLE_CLIENT_ID` | tidak | OAuth button                        |

---

## 7. Menjalankan secara lokal

```bash
# sekali
npm install                      # root — postinstall jalan prisma generate
npm run seed --workspace=apps/server

# development (server + client bersamaan)
npm run dev
#   server → http://localhost:<PORT dari .env>
#   client → http://localhost:5173

# terpisah
npm run server
npm run client
```

Type-check: `npm run type:check`. Format: `npm run format`.

**Known gotcha:** `vite.config.ts` proxy `/api` → `http://localhost:4000`, tapi default `PORT` di `config/env.ts` adalah `3000`. Kalau `.env` tidak set `PORT=4000`, proxy tidak kena. Set `PORT=4000` di `apps/server/.env`.

---

## 8. Konvensi yang Harus Diikuti

Tambah fitur baru = ikuti pola yang sudah ada, jangan improvise.

**Backend — menambah domain baru:**

1. Tambah model di `prisma/schema.prisma` + `prisma migrate dev`
2. `mkdir src/modules/<domain>/` — buat 7 file: `.routes`, `.controller`, `.service`, `.repository`, `.mapper`, `.types`, `.validation`
3. Tambah permission string `<domain>.{read,create,update,delete}` di `prisma/seed/constants.ts`
4. Mount di `src/routes/index.ts` dengan `router.use("/<domain>", <domain>Routes)`
5. Tambah pesan di `constant/messages.ts`
6. Tambah seeder di `prisma/seed/seeders/`

**Backend — aturan tambahan:**

- Lempar error dari `errors/`, jangan kirim response manual
- Query database **hanya** di `.repository.ts`
- Mapping Prisma row → DTO **hanya** di `.mapper.ts`
- Validasi Zod di `.validation.ts`, pasang dengan `validate()`
- Semua route wajib `authenticate` + `authorize()` kecuali auth/health

**Frontend — menambah halaman:**

1. Tambah path di `routes/route.paths.ts`
2. Tambah service di `services/<entity>.service.ts`
3. Tambah hook di `features/<domain>/hooks/` pakai `createEntityQuery` / `createEntityMutation`
4. Tambah komponen di `features/<domain>/components/` (List / Form / Detail)
5. Daftarkan route di `routes/dashboard.routes.tsx` atau `public.routes.tsx` dengan `lazy()` + `ProtectedRoute`

**Frontend — aturan tambahan:**

- Jangan pernah `axios` langsung di komponen — selalu lewat service
- Jangan pernah `fetch` langsung — selalu lewat `apiClient`
- Jangan tambah state server ke Zustand — pakai TanStack Query
- Toast selalu lewat `addToast()` (dipanggil otomatis oleh `createEntityMutation`)
- Confirm delete pakai `useConfirm` hook, bukan `window.confirm`

**Umum:**

- Format wajib: `npm run format` sebelum commit (Prettier + Husky/lint-staged)
- Import client pakai alias `@/` (configured di `vite.config.ts`)
- Import server **harus** pakai ekstensi `.js` untuk file lokal (ESM, `"type": "module"`) — `import { prisma } from "../../lib/prisma.js"`

---

## 9. Index File untuk Agent

Kalau Anda agent dan cuma mau cepat orientasi, baca file ini berurutan:

| #   | File                                                                                  | Kenapa                                     |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | `package.json` (root)                                                                 | workspace layout, script commands          |
| 2   | `apps/server/src/app.ts`                                                              | seluruh request masuk lewat sini           |
| 3   | `apps/server/src/routes/index.ts`                                                     | peta endpoint                              |
| 4   | `apps/server/src/modules/role/` (semua 7 file)                                        | modul contoh terkecil, representatif penuh |
| 5   | `apps/server/prisma/schema.prisma`                                                    | model data                                 |
| 6   | `apps/server/src/middlewares/auth.middleware.ts` + `authorize.ts` + `errorHandler.ts` | security + contract response               |
| 7   | `apps/client/src/routes/route.paths.ts`                                               | peta halaman                               |
| 8   | `apps/client/src/lib/axios.ts`                                                        | auth flow client                           |
| 9   | `apps/client/src/hooks/useEntityQuery.ts` + `useEntityMutation.ts`                    | pattern data fetching                      |
| 10  | `apps/client/src/features/user-management/`                                           | contoh vertical slice                      |

**Untuk query graph terstruktur** (node, relasi, path, affected), pakai knowledge graph di `graphify-out/` — `graphify query "..."`, `graphify path "A" "B"`, `graphify explain "X"`, `graphify affected "X"`. Jauh lebih murah daripada grep untuk pertanyaan "apa yangYOUchine file ini".
