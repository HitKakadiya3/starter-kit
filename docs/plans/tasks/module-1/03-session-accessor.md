# Task 03 — Session accessor `src/lib/session.ts`

**Phase:** 1 · Foundation primitives
**Work plan task id:** 1.3
**Size:** Small (2 files)
**Dependencies:** none (Task 02's tests mock this module; once it exists, tests use the real one)

## Purpose / why this task exists

The funnel needs a single typed accessor over `sessionStorage` key `testiq.session`. Every downstream module (campaign capture, ipify result, quiz-submit response, resume guard) reads and writes this one object. Keeping access behind three functions (`getSession`, `patchSession`, `clearSession`) prevents the typo-prone `JSON.parse(sessionStorage.getItem(...))` pattern from spreading across the codebase.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.3 Session storage.

## AC coverage

- AC 13 (session data survives a single-tab refresh on `/email`) — the storage layer behind this AC is built here; end-to-end verified in Task 15.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/session.ts`
- `d:/Projects/TestIQ/typestest/src/lib/session.test.ts`

**Do NOT touch:**
- `localStorage['user_gender']` — PRD §4.3 explicitly preserves it. This module does not read or write that key.

## Session shape (PRD §4.3)

All fields optional:

- `qidRaw?: number` — raw `quiz_result_id`.
- `qidEncrypted?: string` — `encrypted_quiz_result_id`, used in URLs.
- `email?: string`
- `gender?: 'male' | 'female'`
- `ipAddress?: string` — ipify result.
- `pricingInfo?: unknown` — keep loose; Module 2 tightens.
- `prcId?: string`
- `mdid?: string`
- `landingUrl?: string`
- `landingTime?: number` — ms timestamp.

Storage key: `testiq.session`.

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/lib/session.test.ts`. Use `beforeEach(() => sessionStorage.clear())`. Cover:

1. **`getSession` with empty storage returns `{}`** (not `null`, not `undefined`).
2. **`patchSession({ email: 'a@b.co' })` then `getSession().email === 'a@b.co'`.**
3. **`patchSession` merges shallowly:** set `{ email: 'a@b.co' }`, then `patchSession({ prcId: 'X' })`, then `getSession()` returns `{ email: 'a@b.co', prcId: 'X' }`.
4. **`patchSession` does not clobber unspecified fields:** follows from #3.
5. **`clearSession()` empties storage:** after clear, `getSession()` returns `{}`.
6. **Invalid JSON in storage → returns `{}` and logs warn:** manually set `sessionStorage.setItem('testiq.session', '{not json')`, then `getSession()` must return `{}` without throwing; spy on `console.warn` and assert it was called.

### Green phase — implement

```ts
export interface FunnelSession {
  qidRaw?: number;
  qidEncrypted?: string;
  email?: string;
  gender?: 'male' | 'female';
  ipAddress?: string;
  pricingInfo?: unknown;
  prcId?: string;
  mdid?: string;
  landingUrl?: string;
  landingTime?: number;
}

const KEY = 'testiq.session';

export function getSession(): FunnelSession {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed as FunnelSession : {};
  } catch {
    console.warn('[session] invalid JSON in sessionStorage; resetting to empty');
    return {};
  }
}

export function patchSession(partial: Partial<FunnelSession>): void {
  const current = getSession();
  const next = { ...current, ...partial };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}
```

### Refactor phase

- Confirm no `try/catch` swallows errors silently (the only catch logs a warn and returns `{}` — fail-soft ONLY for parse errors, per PRD acceptance).
- Confirm `localStorage['user_gender']` is NOT read or written from this file.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/session.test.ts` — all 6 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `grep -rn "localStorage" typestest/src/lib/session.ts` — returns nothing.

## Done-when

- All 6 tests pass.
- `getSession`, `patchSession`, `clearSession` exported.
- Invalid JSON does not throw.
- `session.ts` never reads or writes `localStorage`.
- Task 02's `api.test.ts` still passes (it mocks `./session`; the real file doesn't break the mock contract).

## Notes / ambiguities

- `pricingInfo` is typed as `unknown` intentionally. Module 2 will narrow it. Do not tighten here.
- `clearSession` is exported for completeness; Module 1 has no caller today. Do not delete — Module 5 uses it.
