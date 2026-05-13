# Task 04 — IP resolution `src/lib/ip.ts`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.1
**Size:** Small (2 files)
**Dependencies:** `02-api-client.md`, `03-session-accessor.md`

## Purpose / why this task exists

The backend requires an `ip_address` header on every request (injected by `api.ts`). The browser can't know its public IP without asking an external service; we use `api.ipify.org`. This task provides a single `resolveIp()` function that's called once on app boot, caches into session, and is idempotent on reload.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.4 IP resolution.

## AC coverage

- AC 12 (headers present on every request) — the `ip_address` header is populated by this task's write into session.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/ip.ts`
- `d:/Projects/TestIQ/typestest/src/lib/ip.test.ts`

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/lib/ip.test.ts`. Stub global `fetch`. Cover:

1. **Cached path:** session already has `ipAddress: '9.9.9.9'` → `resolveIp()` does NOT call fetch; returns `{ ok: true }`.
2. **Success path:** empty session → fetch resolves with `{ ip: '1.2.3.4' }` → `resolveIp()` writes `patchSession({ ipAddress: '1.2.3.4' })`; returns `{ ok: true }`.
3. **Failure path:** fetch rejects with `new TypeError('Failed to fetch')` → `resolveIp()` returns `{ ok: false, error: <the error> }`; session is NOT modified.
4. **Non-2xx response:** fetch resolves with a Response whose `.ok === false` → `resolveIp()` returns `{ ok: false, ... }`; session not modified.

### Green phase — implement

```ts
import { getSession, patchSession } from './session';

export type ResolveIpResult =
  | { ok: true }
  | { ok: false; error: Error };

export async function resolveIp(): Promise<ResolveIpResult> {
  if (getSession().ipAddress) return { ok: true };
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) {
      return { ok: false, error: new Error(`ipify HTTP ${res.status}`) };
    }
    const body = await res.json() as { ip?: string };
    if (!body.ip) return { ok: false, error: new Error('ipify response missing ip') };
    patchSession({ ipAddress: body.ip });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
```

### Refactor phase

- Confirm no silent swallow: failure is returned as a typed result, not a thrown exception, so the App.tsx caller can choose to show a toast (per PRD §4.4).
- Confirm `fetch` is called with the exact URL from PRD (`https://api.ipify.org?format=json`).

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/ip.test.ts` — all 4 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.

## Done-when

- [x] All 4 tests pass.
- [x] `resolveIp` returns `{ ok: true }` or `{ ok: false, error }` — never throws.
- [x] Cached path avoids the network call.

## Notes / ambiguities

- **PRD §10 / work plan Risk A2:** ipify may be blocked on corporate networks. Module 1 deliberately picks blocking behavior — the App.tsx caller (Task 09) shows a toast on failure. This task only needs to return the failure so the caller can react.
- Fail-fast principle from `ai-development-guide`: we do NOT silently default `ipAddress` to empty and continue. The explicit `{ ok: false, error }` return surfaces the failure.
