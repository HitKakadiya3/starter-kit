# Task 01 — `pricingConstants.ts` + `PricingInfo` type tightening

**Phase:** 1 · Foundation
**Work plan task id:** 1.1
**Size:** Small (3 files)
**Dependencies:** none (Module 1 already shipped `apiTypes.ts`, `session.ts`, and `useRedirectGuard.ts` — this task only tightens types those files already declare as placeholders)

## Purpose / why this task exists

The Module 2 hook (`usePricing`, Task 02) and the three page bindings (Tasks 03–05) all read `session.pricingInfo` and render fields like `first_sale_price_label` and `subscription_price_label`. Today, `PricingInfo` is a placeholder (`{ [k: string]: unknown }`) in `src/lib/apiTypes.ts`, and `FunnelSession.pricingInfo` is typed `unknown` in `src/lib/session.ts`. Consumers cannot safely read named fields until the type is concrete. This task also lands the two static copy constants (`DEFAULT_SUBSCRIPTION_DAYS`, `TRIAL_DAYS`) that every price-bearing page uses for durations the backend doesn't ship pre-submit.

Landing the constants alongside the type tightening keeps the foundation phase to exactly one commit — neither file has downstream imports at this point, so nothing else in the tree needs to move.

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §4.2 (`PricingShape`)
- `docs/prd/module-2-pricing-display.md` §4.5 (`DEFAULT_SUBSCRIPTION_DAYS`)
- `docs/prd/module-2-pricing-display.md` §4.6 (`TRIAL_DAYS`)
- `docs/prd/module-2-pricing-display.md` §7 (files added)

## AC coverage

Foundation only — no PRD §8 AC is fully closed by this task. Enables:
- AC 1, 4, 5, 7 (price fields must be typed before pages can render them)
- AC 11 (defensive warn logic in the hook reads typed fields)
- AC 12 (the two constants are the only hardcoded durations allowed)

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/pricingConstants.ts`

**Modify:**
- `d:/Projects/TestIQ/typestest/src/lib/apiTypes.ts` — replace the placeholder `PricingInfo` interface with the concrete shape from PRD §4.2.
- `d:/Projects/TestIQ/typestest/src/lib/session.ts` — narrow `pricingInfo?: unknown` to `pricingInfo?: PricingInfo`; add `import type { PricingInfo } from './apiTypes'`.

**Verify (do NOT modify):**
- `d:/Projects/TestIQ/typestest/src/hooks/useRedirectGuard.ts` — this file already writes `pricingInfo: data.pricing_info` via `patchSession(...)` where `data.pricing_info` is locally typed `unknown`. After `FunnelSession.pricingInfo` narrows to `PricingInfo | undefined`, the assignment from `unknown → PricingInfo | undefined` will fail typecheck. Fix **inside the guard** at the boundary with a minimal cast (`pricingInfo: data.pricing_info as PricingInfo | undefined`) or by tightening the local `QuizResultResponse.pricing_info` field from `unknown` to `PricingInfo | undefined`. Do **not** widen `PricingInfo` to accommodate.

## Step-by-step implementation

### 1. Create `pricingConstants.ts`

Create `typestest/src/lib/pricingConstants.ts` with exactly:

```ts
/**
 * Static pricing-copy constants.
 *
 * These back the handful of duration strings the backend does NOT ship in
 * POST /price responses (pre-submit pages need a value for "every N days"
 * copy before session.pricingInfo is populated). Post-submit surfaces prefer
 * the backend's `subscription_day_label` with these as fallbacks.
 *
 * See PRD §4.5, §4.6.
 */

// String on purpose — backend's post-submit `subscription_day_label` is also
// a string, so consumers concatenate without type gymnastics.
export const DEFAULT_SUBSCRIPTION_DAYS = "28" as const;

// Number on purpose — used only inside `${TRIAL_DAYS}-Day Trial` template
// literals; widening to `number` doesn't matter for the string output but
// const-asserting keeps the intent visible.
export const TRIAL_DAYS = 7 as const;
```

### 2. Tighten `PricingInfo` in `apiTypes.ts`

Open `typestest/src/lib/apiTypes.ts`. Replace the existing `PricingInfo` block:

```ts
export interface PricingInfo {
  // Shape not fully known in Module 1. Module 2 tightens.
  [k: string]: unknown;
}
```

with:

```ts
export interface PricingPaymentGateway {
  id: string;
  name: string;
}

export interface PricingInfo {
  currency_code: string;
  /** Numeric string, e.g. "4.99". Kept as string so backend's locale-safe
   *  labels are the render surface and JS floats are not the source of truth. */
  first_sale_price: string;
  first_sale_price_label: string;
  cross_sale_price: string;
  cross_sale_price_label: string;
  subscription_price: string;
  subscription_price_label: string;
  /** Post-submit responses only (POST /price omits this pre-submit). */
  subscription_day_label?: string;
  /** Post-submit responses only. */
  first_and_cross_sale_price_label?: string;
  /** Post-submit responses only. Module 4 will consume these. */
  show_cross_sale_page?: boolean;
  cross_sale_compulsory?: boolean;
  payment_gateways: PricingPaymentGateway[];
  /** Backend occasionally adds fields; do not let that break typecheck. */
  [k: string]: unknown;
}
```

Leave every other export in the file untouched.

### 3. Narrow `FunnelSession.pricingInfo` in `session.ts`

Open `typestest/src/lib/session.ts`. Add an import at the top (below the file-level comment):

```ts
import type { PricingInfo } from "./apiTypes";
```

Then change:

```ts
  pricingInfo?: unknown;
```

to:

```ts
  pricingInfo?: PricingInfo;
```

Leave `getSession`, `patchSession`, `clearSession` bodies untouched. The narrowing is transparent at the storage layer because `JSON.parse` returns `unknown` and the function still casts via `parsed as FunnelSession`.

### 4. Reconcile `useRedirectGuard.ts`

Run `npx tsc --noEmit`. If the compiler complains about `pricingInfo: data.pricing_info` in `useRedirectGuard.ts` (expected, because the local `QuizResultResponse.pricing_info` is `unknown`), pick **one** of the following — whichever is smaller in your file:

- **Option A** (preferred — keeps the boundary explicit): change the local interface:
  ```ts
  interface QuizResultResponse {
    // ...
    pricing_info?: PricingInfo;
    // ...
  }
  ```
  and add `import type { PricingInfo } from "@/lib/apiTypes";` at the top.
- **Option B**: cast at the assignment site:
  ```ts
  pricingInfo: data.pricing_info as PricingInfo | undefined,
  ```

Do **not** widen `FunnelSession.pricingInfo` back to `unknown`.

### 5. Confirm no other call sites break

Run `npx tsc --noEmit`. Expect zero new errors outside the guard (which step 4 fixed). If a page or hook surfaces a new error, it means a file was quietly reading `session.pricingInfo as something` — flag in Notes and resolve before committing; do not loosen the type.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — zero errors. **This is the real gate for this task.**
- `npm run lint` — no new errors.
- `npm run build` — succeeds.
- `npm run test` — every existing test (`session.test.ts`, `api.test.ts`, `useRedirectGuard.test.tsx`, `useQuiz.test.ts`, etc.) still passes. **No test code is modified by this task.**

## Done-when

- `pricingConstants.ts` exists with `DEFAULT_SUBSCRIPTION_DAYS` (`"28"` literal type) and `TRIAL_DAYS` (`7` literal type).
- `PricingInfo` in `apiTypes.ts` is a concrete interface with all fields listed in PRD §4.2 plus a trailing `[k: string]: unknown` index signature.
- `FunnelSession.pricingInfo` is typed `PricingInfo | undefined` (not `unknown`).
- `useRedirectGuard.ts` still typechecks (either by narrowing its local response type or by casting at the boundary — not by widening).
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` lists only these files changed: `src/lib/pricingConstants.ts` (new), `src/lib/apiTypes.ts`, `src/lib/session.ts`, and **at most** `src/hooks/useRedirectGuard.ts` (type-level change only, no behavior change).

## Notes / ambiguities

- **No page code changes in this commit.** If a grep for `pricingInfo` inside `src/pages/` turns up a cast or a field read, resolve it here; otherwise leave pages untouched until Tasks 03–05.
- PRD §4.2 types `first_sale_price` as a `string`. The savings-math in §4.4 calls `parseFloat(...)` on these strings — preserve the string type; do not normalize to `number` in the interface.
- The `[k: string]: unknown` index signature is deliberate — backend occasionally adds fields (e.g. `iq_booster_validity`), and widening-by-extension is preferable to forcing every such addition through a schema bump.
