# Task 01 — Install Stripe SDKs + `VITE_STRIPE_PUBLISHABLE_KEY` env + `src/lib/stripe.ts`

**Phase:** 1 · Foundation (env + SDK + singleton)
**Work plan task id:** 1.1
**Size:** Small (2 files new, 3 files modified)
**Dependencies:** none (first task of Module 3)

## Purpose / why this task exists

Module 3 adds the **only two new npm dependencies in the entire project** (`@stripe/stripe-js` + `@stripe/react-stripe-js`) and the **only new env var** (`VITE_STRIPE_PUBLISHABLE_KEY`). Landing them first, behind a pure utility module (`src/lib/stripe.ts`) with zero runtime consumers, guarantees:

- Subsequent tasks (hook + components) can import a memoised `stripePromise` without re-deciding SDK init.
- `assertKeyMatchesMode` is unit-tested in isolation before any page wires it.
- If the install or the env wiring is wrong, the failure is contained to this commit and caught by its own tests.

This task has **zero visible behaviour change** for the running app; it's a pure prerequisite.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §4.1 — env var + `assertKeyMatchesMode` contract (verbatim code block).
- `docs/prd/module-3-first-payment.md` §4.2 — `loadStripe()` called once at module scope and memoised.
- `docs/prd/module-3-first-payment.md` §7 — "Dependencies added" (both packages) + "Env" (env var line) + "Files added" (`src/lib/stripe.ts`).

## AC coverage

Foundation for **AC 10** (dev build throws a clear setup error when `VITE_STRIPE_PUBLISHABLE_KEY` doesn't match backend `payment_mode`). AC 10 is fully closed only once Task 05 wires the call site at CheckoutForm mount; it is verified end-to-end in Task 99.

No other AC is fully closed by this task.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/stripe.ts`
- `d:/Projects/TestIQ/typestest/src/lib/stripe.test.ts`

**Modify:**
- `d:/Projects/TestIQ/typestest/package.json` — add both Stripe packages under `dependencies`.
- `d:/Projects/TestIQ/typestest/package-lock.json` and/or `d:/Projects/TestIQ/typestest/bun.lockb` — refreshed by the install. Include whichever lockfile the repo already tracks (do not introduce a new one).
- `d:/Projects/TestIQ/typestest/.env.example` — append one new line, `VITE_STRIPE_PUBLISHABLE_KEY=` (blank value).

**Do NOT touch** (in this task):
- Any file under `src/pages/`, `src/components/`, or `src/hooks/`.
- `src/lib/session.ts` (Task 02 owns the `paymentIntent` field).
- `.env` or `.env.local` (user-managed, untracked).

## Backend contract reference

- No backend call in this task. The key is consumed by Stripe's JS SDK only. The backend `payment_mode` is compared against the key prefix at CheckoutForm mount (Task 05).

## Step-by-step implementation

### Step 1 — Install the two new packages

From `d:/Projects/TestIQ/typestest/`:

```sh
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Version policy: pin to the latest stable at implementation time. If `package.json` already uses carets (`^`) for other dependencies, match that convention; otherwise pin exact.

Commit the lockfile update alongside the `package.json` change.

### Step 2 — Add the env var to `.env.example`

Append exactly one line:

```
VITE_STRIPE_PUBLISHABLE_KEY=
```

Leave the value blank (same pattern as other `.env.example` entries in this repo). The real `pk_test_…` / `pk_live_…` is supplied by the user out-of-band in each developer's untracked `.env.local`.

### Step 3 — Red phase (write failing tests first)

Create `typestest/src/lib/stripe.test.ts`. Use Vitest with `vi.stubEnv` / per-test import-reset so `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` and `import.meta.env.DEV` can be varied between cases.

Minimum test cases (all six must be written before any `stripe.ts` implementation exists):

1. `pk_test_xxx` key + `mode: 'sandbox'` → `assertKeyMatchesMode('sandbox')` does not throw, does not `console.error`.
2. `pk_live_xxx` key + `mode: 'live'` → does not throw.
3. `pk_live_xxx` key + `mode: 'sandbox'` + DEV=true → throws `Error('Stripe key / backend payment_mode mismatch')`; `console.error` called with a message containing both `key is live` and `backend is sandbox`.
4. `pk_test_xxx` key + `mode: 'live'` + DEV=true → throws.
5. Mismatched prefix + DEV=false → does NOT throw but `console.error` is called (assert via `vi.spyOn(console, 'error')`).
6. Undefined / empty key + `mode: 'sandbox'` → treated as non-test (`.startsWith('pk_test_')` returns false), so effectively mismatched for sandbox; in DEV=true throws; in DEV=false logs only.

Test isolation note: each case must reset `import.meta.env` state via `vi.unstubAllEnvs()` in `afterEach` so order is irrelevant.

Run the suite — all six cases fail with "module not found" or similar. That's the red phase.

### Step 4 — Green phase (create `src/lib/stripe.ts`)

Create `typestest/src/lib/stripe.ts` with exactly the contents from PRD §4.1:

```ts
import { loadStripe, type Stripe } from '@stripe/stripe-js';

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise: Promise<Stripe | null> = loadStripe(pk);

export function assertKeyMatchesMode(mode: 'sandbox' | 'live'): void {
  const isTest = pk.startsWith('pk_test_');
  const expectedTest = mode === 'sandbox';
  if (isTest !== expectedTest) {
    console.error(`[stripe] key mode mismatch: key is ${isTest ? 'test' : 'live'}, backend is ${mode}`);
    if (import.meta.env.DEV) throw new Error('Stripe key / backend payment_mode mismatch');
  }
}
```

Guardrails:
- `loadStripe(pk)` is evaluated at module load; `stripePromise` is the memoised handle per PRD §4.2. Do NOT wrap it in a function — callers import `stripePromise` directly.
- If `pk` is `undefined`, `String.prototype.startsWith` on an undefined would throw; guard defensively by coercing: `const isTest = typeof pk === 'string' && pk.startsWith('pk_test_')`. The undefined-key test case (6) should pass under that coercion.

Re-run the test suite. Six green.

### Step 5 — Refactor phase

- Add a short JSDoc block above `assertKeyMatchesMode` documenting the PRD §4.1 rationale ("asserts the published key's test/live prefix matches the backend's `payment_mode` to prevent a live key silently charging against a sandbox backend or vice versa").
- Do NOT add any other exports. The module's contract is exactly `stripePromise` + `assertKeyMatchesMode`.

### Step 6 — Isolation check

After the commit, confirm no other file in `src/` imports from `src/lib/stripe.ts`:

```sh
grep -rn "from.*lib/stripe" typestest/src
```

Expected output: only `typestest/src/lib/stripe.test.ts` matches. Anything else means an accidental cross-commit leak — revert.

## Completion criteria (done-when)

- [x] `@stripe/stripe-js` and `@stripe/react-stripe-js` appear in `typestest/package.json` `dependencies`.
- [x] The lockfile (`package-lock.json` or `bun.lockb`, whichever the repo tracks) is refreshed.
- [x] `typestest/.env.example` has the new `VITE_STRIPE_PUBLISHABLE_KEY=` line and no other change.
- [x] `typestest/src/lib/stripe.ts` exports exactly `stripePromise` and `assertKeyMatchesMode`, typed as per the PRD §4.1 contract.
- [x] `typestest/src/lib/stripe.test.ts` has six passing cases (listed in step 3).
- [x] No file in `src/pages/`, `src/components/`, or `src/hooks/` imports `src/lib/stripe.ts` yet (grep check in step 6).
- [x] All verification commands below pass.

## Verification commands

Run each from `d:/Projects/TestIQ/typestest`:

```sh
npm install                                       # Idempotent; confirms lockfile is synced.
npx vitest run src/lib/stripe.test.ts             # → 6 passing.
npx tsc --noEmit                                  # Zero errors.
npm run lint                                      # Zero errors.
npm run build                                     # Succeeds.
npm run test                                      # Full project suite green (Module 1 + 2 tests still pass).
```

No `npm run dev` smoke is required in this task — the module has zero consumers, so dev-mode rendering is unaffected.

## Notes / ambiguities

- The real `pk_test_` value is user-supplied and goes into each developer's untracked `.env.local`. This task only adds the key name to `.env.example`.
- If the repo tracks `bun.lockb` but the installer used was `npm`, also update `bun.lockb` via `bun install` to keep both lockfiles consistent. If only one is tracked, ignore the other.
- Do not add `.env`, `.env.local`, or any other environment file beyond `.env.example`.
