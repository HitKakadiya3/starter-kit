# Task 01 — `.env.example` + env var typing

**Phase:** 1 · Foundation primitives
**Work plan task id:** 1.1
**Size:** Small (2 files)
**Dependencies:** none (but see "Notes / ambiguities" — confirm bearer token + `x-host` with user before starting)

## Purpose / why this task exists

Declare the environment-variable contract that every other Module 1 task depends on. Until `VITE_API_BASE_URL`, `VITE_API_TOKEN`, and `VITE_X_HOST` exist and are typed, the HTTP client (Task 02) cannot be written safely and `npm run dev` would fail on first API call.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.1 Environment.

## AC coverage

Foundation only — no PRD §8 AC fully closed here, but this task is a prerequisite for AC 12 (headers on every request) which is verified in Task 02 / Task 15.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/.env.example`

**Modify:**
- `d:/Projects/TestIQ/typestest/src/vite-env.d.ts` — extend `ImportMetaEnv` with the three keys.

**Verify (do NOT modify unless missing):**
- `d:/Projects/TestIQ/typestest/.gitignore` — confirm `.env` (not `.env.example`) is ignored. If `.env` is not already ignored, add it.

**Also create (local only, NOT committed):**
- `d:/Projects/TestIQ/typestest/.env` — with the real bearer token supplied by the user. This file must remain git-ignored.

## Step-by-step implementation

1. Create `.env.example` at `typestest/.env.example` with exactly these keys (values are placeholders):
   ```
   VITE_API_BASE_URL=http://localhost:3003/api/v1/
   VITE_API_TOKEN=<public bearer key for this tenant>
   VITE_X_HOST=16persons.com
   ```
2. Open `typestest/src/vite-env.d.ts`. It currently contains only the Vite triple-slash reference. Extend it with a typed `ImportMetaEnv`:
   ```ts
   /// <reference types="vite/client" />

   interface ImportMetaEnv {
     readonly VITE_API_BASE_URL: string;
     readonly VITE_API_TOKEN: string;
     readonly VITE_X_HOST: string;
   }

   interface ImportMeta {
     readonly env: ImportMetaEnv;
   }
   ```
3. Open `typestest/.gitignore` and confirm a line matching `.env` exists (and does NOT also match `.env.example`). If missing, add:
   ```
   .env
   .env.local
   ```
   Keep `.env.example` tracked.
4. Locally create `typestest/.env` with the real values supplied by the user. Do not commit this file.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — passes.
- `npm run build` — succeeds.
- `npm run dev` — dev server starts without env-related errors.
- `git status` — `.env` must NOT appear as tracked/untracked new content to commit (it should either be in `.gitignore` or already ignored).

## Done-when

- `.env.example` exists and contains the three keys verbatim from PRD §4.1.
- `import.meta.env.VITE_API_BASE_URL`, `VITE_API_TOKEN`, `VITE_X_HOST` typecheck as `string` without `as` casts in any consumer file.
- Real `.env` exists locally; `git status` shows it ignored.
- `npm run build` and `npx tsc --noEmit` both succeed.

## Notes / ambiguities

- **Hard dependency before starting:** Confirm the real `VITE_API_TOKEN` and `VITE_X_HOST` values with the user. The work plan Risk section explicitly calls this out: "Real backend not reachable during dev (CORS, bearer token drift, x-host mismatch). Confirm credentials and network reachability during Phase 1 Task 1.1 (before writing anything else)." If values are not available, pause and ask.
- `typestest/tsconfig.json` disables `strictNullChecks` and `noImplicitAny`. The typed `ImportMetaEnv` still provides useful completion/typecheck even in a relaxed tsconfig.
