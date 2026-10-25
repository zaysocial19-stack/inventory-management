# Current Session

This file is the short-term handoff document between coding sessions.

Update it at the end of meaningful sessions.

## Date

2026-10-25

## Current Phase

Phase 7 COMPLETE ➔ Moving to Phase 8/9 (RBAC on Frontend & Inventory Module)

## Current Task

Phase 7 completed. User registration with bcrypt hashing, JWT issuance and Passport Bearer authentication, and Role-Based Access Control (@Roles('ADMIN', 'MANAGER'), RolesGuard) implemented and verified live.

## Completed This Session

- Mastered Phase 0: System architecture, request flows, transaction atomicity, client vs. server boundaries.
- Completed Phase 1: Verified Node.js (v24.15), npm (11.12), Git (v2.53).
- Completed Phase 2: Git repository initialized, `.gitignore` created, root commit pushed to GitHub.
- Completed Phase 3 (Frontend Foundation): React + Vite + Tailwind CSS v4, ProductCard, AddProductModal, react-router-dom multi-page routing.
- Completed Phase 4 (Backend Foundation): NestJS CommonJS scaffold, `/api` prefix, CORS, Swagger docs, live `/api/health`.
- Completed Phase 5 (PostgreSQL & Database Design): 9 entities modeled, Neon cloud DB provisioned, Prisma migrations & seed applied.
- Completed Phase 6 (Connect Backend to Database): Built centralized `PrismaService`, `ProductsModule` with full CRUD, transactions, DTOs, and historical ledger protection.
- Completed Phase 7 (Authentication & Role-Based Access Control):
  - Configured `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, and `bcrypt`.
  - Implemented `AuthService` with salted password hashing (10 rounds) and JWT token emission (`accessToken`).
  - Implemented `JwtStrategy` and `JwtAuthGuard` extracting and verifying Bearer tokens.
  - Implemented `@Roles(...)` metadata decorator and `RolesGuard` evaluating user role permissions against endpoints.
  - Protected `ProductsController`:
    - `GET /api/products`: any authenticated user (`STAFF`, `MANAGER`, `ADMIN`).
    - `POST` & `PATCH`: restricted to `ADMIN` and `MANAGER`.
    - `DELETE`: strictly restricted to `ADMIN`.
  - Verified live in Swagger: `STAFF` user allowed to read products, but blocked with `403 Forbidden` when attempting to delete products.

## What I Learned

- Stateless JWT: By eliminating server-side session DB queries, the backend verifies tokens in CPU memory in microseconds, preventing database lag.
- Defense-in-Depth Hashing: `bcrypt.hash(password, 10)` generates a salted, one-way hash preventing rainbow table attacks.
- Guard Chaining: Combining `@UseGuards(JwtAuthGuard, RolesGuard)` first verifies who the user is, then enforces what they are allowed to do.
- 401 Unauthorized vs 403 Forbidden:
  - `401 Unauthorized`: "I don't know who you are" (no token or invalid token).
  - `403 Forbidden`: "I know who you are, but you don't have permission for this resource" (e.g. `STAFF` trying to execute an `ADMIN` delete).

## Current Problems

None. All systems operational.

## Next Task (When Resuming)

1. Connect Frontend to Live Authenticated Backend:
   - Build a Login / Auth form in React.
   - Store JWT in memory / state.
   - Attach `Authorization: Bearer <token>` to Axios / fetch requests.
   - Conditionally show/hide Admin actions based on user role.
2. Or proceed to Phase 9 (Dedicated Inventory & Stock Movement API endpoints).

## Instructions For Next AI Session

Read these files before making changes:

1. `PROJECT.md`
2. `ROADMAP.md`
3. `ARCHITECTURE.md`
4. `SESSION.md`

Continue from the current task.

Do not redo completed work.

Do not build the whole project automatically.

Teach me and pair-program with me.
