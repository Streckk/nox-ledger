# Nox Ledger — Contexto del proyecto

> Documento de traspaso de contexto. Resume **arquitectura, features, fixes y convenciones**
> trabajados hasta ahora para que cualquier persona (o agente/chat) pueda continuar sin perder contexto.
> Última actualización: **2026-06-17**.

---

## 1. Qué es

**Nox Ledger** = app de **finanzas personales** (tarjetas de crédito, compras a meses, proyección de ahorro, simulador "¿Puedo comprar esto?").
Estética: **fintech premium**, escala de grises (blanco/negro/grises) con tipografía moderna, modo claro por defecto + oscuro.

## 2. Estructura del repo (monorepo pnpm)

```
nox-ledger/                      # raíz: workspace pnpm (NO es un framework)
├── package.json                 # root privado, scripts con --filter
├── pnpm-workspace.yaml          # packages: ["apps/*"]
├── pnpm-lock.yaml               # lockfile único de todo el monorepo
├── node_modules/                # store central (.pnpm); apps/* enlazan aquí por symlink
└── apps/
    ├── web/                     # Frontend (Next.js)
    ├── api/                     # Backend (NestJS)
    └── docs/                    # Documentación (este archivo)
```

- **El backend NO depende de Next.js**; Next vive solo en `apps/web`. Son dos paquetes independientes que se comunican por **HTTP/GraphQL**.
- Un solo repositorio (monorepo) es intencional; no hace falta repo aparte para el backend.
- Comandos desde la raíz: `pnpm --filter @nox-ledger/web <script>` y `pnpm --filter api <script>`.

---

## 3. Frontend — `apps/web`

### Stack
- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind CSS v4** (CSS-first, tokens con `@theme` en `globals.css`).
- `lucide-react` (iconos), `recharts` (solo en la gráfica), `react-hook-form` + `zod`, `next-themes`, `date-fns`, `clsx` + `tailwind-merge`.
- **GraphQL Codegen** + **graphql-request** + **TanStack Query** + **next-view-transitions**.
- Alias `@/*` → `src/*`. Archivos en **kebab-case**.

### Convenciones
- **Mobile-first** (base móvil, escalar con `sm:`/`lg:`); nunca `max-*`. Respetar `prefers-reduced-motion`.
- `app/` solo rutas/layouts/composición. La UI vive en `features/*` y `components/*`.
- `"use client"` solo donde se necesita (gráficas, formularios, interacción, theming).
- Tokens de color: `canvas, surface, elevated, hairline(-strong), ink, muted, faint, invert(-ink), accent, positive, negative`. Fuentes: **Archivo** (display/body) + **Space Mono** (datos/labels).

### Estructura `apps/web/src`
```
app/
  layout.tsx                 # <ViewTransitions><html><Providers>…  (root)
  page.tsx                   # redirect → /dashboard
  globals.css                # tokens claro/oscuro + animaciones + view-transitions
  (app)/                     # grupo autenticado → AuthGuard + DashboardShell
    layout.tsx
    dashboard/page.tsx        ingresos/ gastos/ tarjetas/ compras/
    simulador/ proyecciones/ configuracion/
  (auth)/                    # grupo auth → split panel (sin shell)
    layout.tsx
    login/ register/ recuperar/
components/
  providers.tsx              # QueryClientProvider + ThemeProvider
  theme-provider.tsx
  auth-guard.tsx             # protege (app): redirige a /login sin sesión
  ui/                        # button, card, badge, input, select, checkbox, switch, dialog
  layout/                    # app-sidebar, app-header, dashboard-shell, brand,
                             # theme-toggle, section-placeholder, use-sidebar (context)
features/
  dashboard/ cards/ installments/ purchase-simulator/ settings/ auth/
  (cada uno: components/, y según el caso data/, schemas/, api/*.graphql, hooks/)
lib/                         # cn, format-currency, format-date, constants,
                             # use-hydrated, graphql-client, graphql-fetcher, password-strength
mocks/  types/  gql/(generado, gitignored)
```

### GraphQL Codegen (importante)
- Config en `apps/web/codegen.ts`. **Fuente del schema = `../api/src/schema.gql`** (Opción A: archivo versionado, offline).
- Plugins: **`typescript-operations` + `typescript-react-query`** (se omite el plugin `typescript` a propósito para evitar duplicado de input types como `LoginInput`).
- Genera **hooks de TanStack Query** en `src/gql/` (gitignored, ignorado por eslint): `useMeQuery`, `useLoginMutation`, `useRegisterMutation`, `useLogoutMutation`, `useUpdateProfileMutation`.
- Las **operaciones** se escriben en archivos `.graphql` (p. ej. `features/auth/api/auth.graphql`, `features/settings/api/settings.graphql`). Codegen NO inventa operaciones; tú las escribes y él las tipa.
- Scripts: `codegen`, y `predev`/`prebuild` que regeneran antes de dev/build.
- **Flujo al cambiar el backend:** levantar el API → regenera `apps/api/src/schema.gql` → commitearlo → `pnpm --filter @nox-ledger/web codegen`.

### Cliente y sesión
- `lib/graphql-client.ts`: `GraphQLClient` (graphql-request) con **`credentials: 'include'`** (manda/recibe las cookies httpOnly).
- `lib/graphql-fetcher.ts`: fetcher que usan los hooks (convierte el documento a string para graphql-request).
- `features/auth/hooks/use-session.ts`: `useSession()` envuelve `useMeQuery` → `{ user, isLoading, isAuthenticated, refetch }`.
- **AuthGuard** en `(app)/layout.tsx`: si no hay sesión → `/login`.
- Login/Register: usan `useLoginMutation`/`useRegisterMutation`; **precargan `me`** (`queryClient.fetchQuery`) antes de navegar para evitar el spinner del guard. Logout en Configuración (`useLogoutMutation`).
- Header y Sidebar muestran el **usuario real** (nombre + imagen) desde `useSession`.

### Transiciones / animaciones
- **next-view-transitions**: todos los `Link` y `useRouter` se reemplazaron por `Link`/`useTransitionRouter` de la lib → cross-fade entre rutas vía View Transitions API.
- Transición actual: **cross-fade simple** (`::view-transition-old/new(root)`, 0.2s ease) en `globals.css`. Desactivada con `prefers-reduced-motion`. (Se probaron scale/slide/blur/skew/zoom/wipe; quedó el fade simple.)
- Entrada del panel de marca en auth: `nx-fade` + highlights con `nx-rise` escalonado.

---

## 4. Backend — `apps/api`

### Stack
- **NestJS 11** (Express 5), **GraphQL code-first** (Apollo Driver + `@as-integrations/express5`), **Prisma 7** + **PostgreSQL**.
- `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcryptjs`, `class-validator`/`class-transformer`, `helmet`, `cookie-parser`, `@nestjs/config`, `zod`, `@prisma/adapter-pg` + `pg`, `express` (dep directa).

### Convenciones (monolito modular por dominio)
- **Resolvers delgados** (solo reciben inputs y llaman services) → **Services** (reglas de negocio) → **Repositories** (único acceso a Prisma).
- kebab-case en archivos, PascalCase en clases. **Nunca exponer `passwordHash`**.
- Auth por **GraphQL**; Health por **REST** (`GET /health`).

### Estructura `apps/api/src`
```
main.ts                      # ValidationPipe global, helmet, cookieParser, CORS,
                             # body limit 6mb (bodyParser:false + express json/urlencoded), logs
app.module.ts                # ConfigModule(validate zod) + GraphQLModule(Apollo) + módulos + APP_INTERCEPTOR
config/                      # env.schema.ts (zod), app.config.ts
common/
  decorators/current-user.decorator.ts
  guards/gql-jwt-auth.guard.ts
  strategies/jwt.strategy.ts          # extractor dual: cookie 'nox_access_token' → o → Bearer
  interceptors/logging.interceptor.ts # loguea operaciones GraphQL
  validators/max-base64-size.validator.ts
  utils/token.util.ts                 # hashToken (sha256), parseDuration
  utils/auth-cookies.util.ts          # set/clear cookies httpOnly
database/                    # prisma.module.ts (@Global), prisma.service.ts (usa PrismaPg adapter)
health/                      # health.controller.ts (GET /health), health.module.ts
modules/
  auth/  inputs/(login, register, refresh)  models/auth-payload  auth.{service,resolver,module}  repositories/refresh-token.repository
  users/ inputs/update-user  models/user.model  repositories/users.repository  users.{service,resolver,module}
prisma/  schema.prisma  migrations/  (prisma.config.ts en la raíz de apps/api)
```

### Prisma 7 — particularidades (LEER)
- **`url` ya NO va en `schema.prisma`.** La conexión se configura en **`apps/api/prisma.config.ts`** (`datasource.url = env('DATABASE_URL')`, con `process.loadEnvFile()`).
- En runtime se usa **driver adapter**: `PrismaService` hace `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
- Generator `prisma-client-js` → `import { PrismaClient } from '@prisma/client'`.
- **Gotcha:** `prisma migrate dev` **no siempre regenera** el cliente, y `start:dev` ya en marcha **no recarga** `@prisma/client`. Regla: tras cambiar el schema → `pnpm --filter api exec prisma generate` **y reiniciar `start:dev`**.

### Modelos
```prisma
model User {
  id String @id @default(uuid())
  name String
  email String @unique
  passwordHash String
  image String?            // base64 / data URL (máx 4MB validado)
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  refreshTokens RefreshToken[]
}
model RefreshToken {
  id String @id @default(uuid())
  user User @relation(fields:[userId], references:[id], onDelete: Cascade)
  userId String
  tokenHash String @unique    // sha256 del refresh token
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime @default(now())
  @@index([userId])
}
```
Migraciones aplicadas: `init`, `add_refresh_token`, `add_user_image`.

### API GraphQL (esquema actual)
- **Query** `me: User!` (protegida con `GqlJwtAuthGuard` + `@CurrentUser`).
- **Mutations**: `register(input: RegisterInput!)`, `login(input: LoginInput!)`, `refresh(input: RefreshInput)`, `logout(input: RefreshInput): Boolean!`, `updateProfile(input: UpdateUserInput!)` (protegida).
- `AuthPayload { accessToken, refreshToken, user }`. `User { id, name, email, image, isActive, createdAt, updatedAt }` (sin passwordHash).
- `UpdateUserInput { name?, email?, image? }` — `image` validado con `@MaxBase64Size(4MB)`.

### Autenticación (híbrida: web cookies + móvil Bearer)
- JWT **access (15m)** + **refresh (7d)**. Se entregan como **cookies httpOnly** (`nox_access_token`, `nox_refresh_token`, `SameSite=Lax`, `Secure` en prod) **y** en el payload (para móvil).
- `JwtStrategy` extrae el token de **cookie → o → header `Authorization: Bearer`** (sirve a web y a futuro móvil).
- **Refresh rotation** con detección de reúso (si se reusa un refresh revocado → se revocan todas las sesiones del usuario). Estado en Postgres (`RefreshToken`, hasheado).
- `logout` revoca el refresh y limpia cookies.
- Secretos en `.env`: `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`. El **secreto nunca sale del servidor**.

### Variables de entorno (`apps/api/.env`)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgresadmin:noxledge115@localhost:5432/nox_ledger?schema=public
FRONTEND_URL=http://localhost:3000
JWT_ACCESS_SECRET=… JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=… JWT_REFRESH_EXPIRES_IN=7d
COOKIE_DOMAIN=            # vacío en dev
```
`.env` está gitignored; `.env.example` versionado.

---

## 5. Infraestructura / cómo correr

- **PostgreSQL**: contenedor Docker `nox-ledger-postgres` (`postgres:17-alpine`) en `:5432`. Credenciales reales: usuario `postgresadmin`, pass `noxledge115`, db `nox_ledger` (el `.env` ya está alineado).
- **Backend**: `pnpm --filter api start:dev` → `http://localhost:4000/graphql` (playground off; usar Apollo Sandbox o curl), health en `/health`.
- **Frontend**: `pnpm --filter @nox-ledger/web dev` → `http://localhost:3000` (`predev` corre codegen).
- **Migraciones**: `pnpm --filter api exec prisma migrate dev --name <nombre>` (requiere Postgres arriba). **No correr migraciones sin avisar al usuario** (su preferencia: primero indicar el comando exacto).

---

## 6. Estado actual

### Hecho ✅
- Monorepo ordenado (web + api), git limpio.
- Frontend completo en UI: dashboard, tarjetas (carrusel + alta con modal), compras (filtros por estado), simulador, configuración (con subida de imagen), auth (login/register/recuperar).
- Backend: auth (register/login/me/refresh/logout) con cookies httpOnly + JWT, rotación de refresh, `updateProfile` + imagen base64 (máx 4MB), health, logging.
- Frontend **conectado** al GraphQL real (codegen + hooks): login, registro, sesión (`me`), logout, subida de imagen.
- Transiciones de pantalla (cross-fade simple vía View Transitions).

### Pendiente / no implementado ⏳
- **Datos del dashboard/tarjetas/compras/simulador siguen MOCKEADOS** (en `features/*/data/*.mock.ts` y `mocks/`). Falta backend + conexión real de esos dominios.
- Botón **"Guardar cambios"** de Configuración: aún **no persiste `name`/`email`** (solo muestra "Guardado ✓" local; la imagen sí persiste vía `updateProfile`). Falta cablear `updateProfile` para name/email.
- Secciones **Ingresos, Gastos, Proyecciones**: placeholders.
- **Recuperar contraseña**: solo UI (sin backend). **Google OAuth**: solo UI.
- **Roles y permisos**: no implementados (diferidos a propósito).
- Sin verificación de correo, sin "cerrar sesión en todos los dispositivos", sin tests.

---

## 7. Convenciones de commits (preferencia del usuario)

Formato: `Tipo(scope--modulo): mensaje en español`. Ejemplos:
- `Feat(api--auth): Se agrega …`
- `Feat(web--graphql): Se agrega …`

El usuario maneja sus propios commits (no commitear/pushear sin pedírselo). Recordar versionar `prisma/migrations/` y `apps/api/src/schema.gql`; **no** commitear `src/gql/` (generado).

---

## 8. Gotchas / fixes ya resueltos (para no repetirlos)

- **Git push rechazado** por `.next` commiteado (archivos >100MB) → `.gitignore` con patrones **no anclados** + `git rm -r --cached` + amend.
- **Prisma 7**: `url` fuera del schema → `prisma.config.ts` + adapter `@prisma/adapter-pg`.
- **GraphQLModule** pedía `@as-integrations/express5` (Nest 11 usa Express 5 + Apollo 5) → instalado.
- **tsconfig `baseUrl`** marcado deprecado en TS 7 → eliminado (no había `paths` que lo usaran).
- **recharts** `width(-1)` en SSR → hook `useHydrated` (monta la gráfica tras hidratar).
- **Turbopack** "Unterminated regexp" tras editar con dev server activo → `rm -rf apps/web/.next` y reiniciar (caché incremental).
- **JWT `expiresIn`** tipo → cast `as JwtSignOptions['expiresIn']`.
- **Codegen duplicaba `LoginInput`** → quitar el plugin `typescript` (dejar `typescript-operations` + `typescript-react-query`).
- **Auth DB falló** → alinear `DATABASE_URL` del `.env` con las credenciales del contenedor Docker.
- **`PayloadTooLargeError`** al subir imagen → subir límite del body a **6MB** (`bodyParser:false` + `express.json/urlencoded`).
- **`Cannot find module 'express'`** → agregar `express` como **dependencia directa** de `apps/api` (pnpm estricto).
- **Prisma `Unknown argument image`** → regenerar cliente (`prisma generate`) **y reiniciar** `start:dev` (el cliente en memoria estaba viejo).

---

## 9. Cómo continuar (para el próximo agente/chat)

1. Lee este archivo completo antes de tocar código.
2. Respeta convenciones: monolito modular en api (resolver→service→repository), mobile-first en web, kebab-case, alias `@/`, no exponer datos sensibles.
3. Tras cambiar el schema de Prisma: `prisma generate` + reiniciar `start:dev`; regenerar `schema.gql` y luego `codegen` en el front.
4. No commitear/pushear ni correr migraciones sin confirmar con el usuario (indícale el comando exacto primero).
5. Verifica siempre con `pnpm build` y `pnpm lint` en el paquete que toques.
