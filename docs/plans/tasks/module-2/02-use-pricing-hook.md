# Task 02 — `usePricing()` hook + unit tests

**Phase:** 2 · Hook
**Work plan task id:** 2.1
**Size:** Small (2 files, both new)
**Dependencies:** `01-pricing-constants-and-type.md` (reads the concrete `PricingInfo` interface and the narrowed `FunnelSession.pricingInfo`)

## Purpose / why this task exists

Every price-bearing page in Module 2 (PricingPage, CheckoutPage, CrossSellPage) consumes the same abstraction: a single hook that resolves pricing from two different sources depending on funnel stage, applies promo-vs-base strikethrough logic, and surfaces loading / error / refetch so page bindings reduce to JSX. Landing this hook with unit tests **before** any page binding means each page task in Phase 3 is a bind-and-render diff with no new branching to test at the page level.

The hook is also where the PRD §4.3 backend-envelope ambiguity gets resolved empirically (see "Step-by-step implementation" step 0 and "Notes / ambiguities").

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §4.2 (hook contract + resolution logic, verbatim)
- `docs/prd/module-2-pricing-display.md` §4.3 (why `POST /price/after/submit` is skipped)
- `docs/prd/module-2-pricing-display.md` §4.4 (savings math — the math lives in CheckoutPage, the hook just surfaces `current` + `strikethrough`)
- `docs/prd/module-2-pricing-display.md` §4.5 (hook surfaces `subscription_day_label`; constant fallback applied at the page)
- `docs/prd/module-2-pricing-display.md` §9 R2 / R6 (fail-fast + defensive branches)

## AC coverage

Foundation for AC 1, 2, 3, 4, 5, 6, 8, 10, 11. **AC 11 is fully closed by this task** (the "both `prcId` and `mdid` → prefer `mdid` + warn" branch is testable in isolation here). The other ACs are fully closed only once Phase 3 pages consume the hook.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/hooks/usePricing.ts`
- `d:/Projects/TestIQ/typestest/src/hooks/usePricing.test.tsx`

**Do NOT touch** (in this task):
- Any file under `src/pages/` — page bindings are Tasks 03–05.
- `src/App.tsx` — the `QueryClientProvider` is already mounted from Module 1.

## Backend contract reference

- `docs/Frontend API List.postman_collection.json` — `POST /price` request shape.
- `apiPost` (from `src/lib/api.ts`) already unwraps one `{ meta, data }` envelope and returns `data`. Envelope-double-wrap is an **open question** — resolve empirically in step 0 before writing the `queryFn`.

## Step-by-step implementation

### Step 0 — Empirically resolve the `POST /price` envelope shape (prerequisite)

**Why:** Module 1 discovered that `GET /questions` wraps inside `{ questions: [...] }` under `data`. `POST /price` may behave the same way. Guessing either way produces `undefined` in every price string in the UI.

1. Boot the dev server: `npm run dev`.
2. Open the app in a browser, land on `/`, open DevTools → Console.
3. Run **one** scratch call using the already-exported `apiPost`:
   ```ts
   // DevTools console — not committed
   import('/src/lib/api.ts').then(m => m.apiPost('price', {}).then(console.log));
   ```
   (Vite's dev server resolves the dynamic import; alternately, add a temporary `useEffect(() => { apiPost('price', {}).then(console.log) }, [])` inside any page you can reach, run once, then delete.)
4. Inspect the logged object in the console:
   - **If** it has `currency_code`, `first_sale_price`, `first_sale_price_label` as top-level keys → `apiPost<PricingInfo>('price', body)` returns `PricingInfo` directly. Use that.
   - **If** it has a single wrapper like `{ pricing_info: { currency_code, ... } }` → use `apiPost<{ pricing_info: PricingInfo }>('price', body).then(r => r.pricing_info)`.
   - **If** some other wrapper key is used (e.g. `price`, `data`), adapt accordingly.
5. Document the observed shape in a code comment at the top of the hook's `queryFn` block, referencing PRD §4.3. Example:
   ```ts
   // Observed 2026-04-22: POST /price returns pricing_info directly under
   // data — no second wrapper. See PRD §4.3.
   ```
6. Delete the scratch call; do not commit it.

### Step 1 — Red phase (write failing tests first)

Create `typestest/src/hooks/usePricing.test.tsx`. Use `@testing-library/react` for `renderHook`, wrap every render in a fresh `QueryClient` + `QueryClientProvider` so cache state is isolated per test.

Suggested skeleton:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePricing } from "./usePricing";
import { clearSession, patchSession } from "@/lib/session";

function wrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

// Mock apiPost at the module boundary. Each test re-wires its behavior.
vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
}));
```

Cover the **eight** test cases (revised post-PRD §4.2 update — the post-submit branch now also runs the base query when `hasPromo` is true, so `/checkout` after a promoed funnel can still render the marketing strikethrough):

1. **Post-submit, no promo — no network:** `patchSession({ qidRaw: 42, pricingInfo: <mock PricingInfo> })`, no `prcId`/`mdid`. Render the hook. Assert `current === <the pricingInfo>`, `strikethrough === undefined`, `hasPromo === false`, `isLoading === false`. Assert `apiPost` was **never** called.
2. **Post-submit, with promo, different base price:** session has `qidRaw`, `pricingInfo` (current, discounted), and `mdid: "50"`. Base call resolves `first_sale_price: "6.99"`; pricingInfo has `first_sale_price: "4.99"`. Assert `current === pricingInfo`, `strikethrough === baseResult`, `hasPromo === true`, and that **only the base query fired** (no promo call — the current comes from session).
3. **Post-submit, with promo, identical base price (guard):** session has `mdid: "50"`, `pricingInfo.first_sale_price: "6.99"`. Base resolves with the same number. Assert `strikethrough === undefined` (equal-price guard), `current === pricingInfo`, `hasPromo === true`.
4. **Pre-submit, no promo:** no `qidRaw`, no `prcId`/`mdid`. Base resolves. Assert `current === base`, `strikethrough === undefined`, `hasPromo === false`; assert `apiPost` call count === 1.
5. **Pre-submit, promo with real discount:** session has `mdid: "50"`. Base resolves `first_sale_price: "6.99"`, promo resolves `first_sale_price: "4.99"`. Assert `current === promo`, `strikethrough === base`, `hasPromo === true`.
6. **Pre-submit, promo with identical price (bad discount):** session has `mdid: "50"`. Base and promo both resolve `first_sale_price: "6.99"`. Assert `current === promo`, `strikethrough === undefined`, `hasPromo === true`.
7. **Pre-submit, promo query errors, base succeeds:** session has `mdid: "50"`. Base resolves; promo rejects. Assert `isError === true` (fail-fast — no silent fallback to base per PRD §9 R2).
8. **AC 11 defensive — both `prcId` and `mdid` set:** `patchSession({ prcId: "ABC", mdid: "50" })`. Spy on `console.warn`. Assert the promo query body uses `{ mdid: "50" }`, the cache key discriminator is `"50"` (from `mdid`), and `console.warn` is called exactly once with a message containing `"prcId"` and `"mdid"`.

Between tests, call `clearSession()` in `afterEach` and create a fresh `QueryClient` in each test to avoid cross-test pollution. Reset the `apiPost` mock with `vi.mocked(apiPost).mockReset()`.

Run `npx vitest run src/hooks/usePricing.test.tsx` — all eight should fail with "Cannot find module './usePricing'". That's the red phase.

### Step 2 — Green phase (implement)

Create `typestest/src/hooks/usePricing.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { getSession } from "@/lib/session";

export interface UsePricingResult {
  current: PricingInfo | undefined;
  strikethrough: PricingInfo | undefined;
  hasPromo: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Observed <DATE>: POST /price returns <shape> — see PRD §4.3.
// (Fill in from Step 0's empirical observation.)

export function usePricing(): UsePricingResult {
  const session = getSession();
  const { qidRaw, pricingInfo, prcId, mdid } = session;

  // Defensive: both prcId and mdid set simultaneously should not happen per
  // Module 1 guarantees, but fall back to mdid and warn once per mount. See
  // PRD §8 AC 11 and §9 R6.
  const warnedRef = useRef(false);
  useEffect(() => {
    if (prcId && mdid && !warnedRef.current) {
      console.warn("[usePricing] both prcId and mdid set; preferring mdid");
      warnedRef.current = true;
    }
  }, [prcId, mdid]);

  // The discriminator used for both the promo request body and the cache key.
  // mdid wins over prcId when both are set (AC 11).
  const promoDiscriminator: string | undefined = mdid || prcId || undefined;
  const hasPromo = !!promoDiscriminator;
  const isPostSubmit = !!(qidRaw && pricingInfo);

  // Base query — enabled pre-submit (as the possible `current`) and also
  // post-submit when a promo is active (so we can show the strikethrough
  // anchor on /checkout for campaign-funnel users). Not enabled post-submit
  // without a promo, because there's nothing to compare against.
  const baseQuery = useQuery({
    queryKey: ["price", "base"],
    queryFn: () => apiPost<PricingInfo>("price", {}),
    enabled: !isPostSubmit || hasPromo,
    staleTime: Infinity,
    gcTime: 1_000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Promo query — pre-submit only. Post-submit the current price is already
  // in `session.pricingInfo` (fresh on every page mount via the Module 1
  // guard), so re-fetching the promoed variant would duplicate data.
  const promoQuery = useQuery({
    queryKey: ["price", "promo", promoDiscriminator],
    queryFn: () =>
      apiPost<PricingInfo>("price", {
        prc_id: prcId ?? "",
        // mdid wins over prcId (AC 11) — body mirrors the cache key choice.
        pricing_discount: mdid ? { mdid } : "",
      }),
    enabled: !isPostSubmit && hasPromo,
    staleTime: Infinity,
    gcTime: 1_000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Resolution (PRD §4.2).
  let current: PricingInfo | undefined;
  let strikethrough: PricingInfo | undefined;

  if (isPostSubmit) {
    current = pricingInfo;
    strikethrough =
      hasPromo &&
      baseQuery.data &&
      baseQuery.data.first_sale_price !== pricingInfo.first_sale_price
        ? baseQuery.data
        : undefined;
  } else if (hasPromo && promoQuery.data) {
    current = promoQuery.data;
    strikethrough =
      baseQuery.data &&
      baseQuery.data.first_sale_price !== promoQuery.data.first_sale_price
        ? baseQuery.data
        : undefined;
  } else if (!hasPromo) {
    current = baseQuery.data;
    strikethrough = undefined;
  }

  const anyEnabledLoading =
    (baseQuery.isFetching && !baseQuery.data && (!isPostSubmit || hasPromo)) ||
    (!isPostSubmit && hasPromo && promoQuery.isFetching && !promoQuery.data);
  const isLoading = current === undefined && anyEnabledLoading;

  const isError =
    ((!isPostSubmit || hasPromo) && baseQuery.isError && !baseQuery.data) ||
    (!isPostSubmit && hasPromo && promoQuery.isError && !promoQuery.data);

  return {
    current,
    strikethrough,
    hasPromo,
    isLoading,
    isError,
    refetch: () => {
      baseQuery.refetch();
      if (hasPromo) promoQuery.refetch();
    },
  };
}
```

**Important:** both `useQuery` calls must run on every render (stable hook count). The `enabled` flags above are the only thing that gates whether a network request goes out — the hooks themselves always execute. This preserves the React rules-of-hooks contract even if `isPostSubmit` toggles between renders (which shouldn't happen in practice).

Run the test file — all eight tests should pass.

### Step 3 — Refactor phase

- Confirm no `any` leaks out of the hook's public API (the exported `UsePricingResult` is `PricingInfo`-typed).
- Confirm the hook imports nothing from `src/pages/` or `src/components/` (one-way dependency).
- Confirm `apiPost` is the only network primitive in use (no direct `fetch`).
- Confirm the envelope-shape comment near `queryFn` accurately reflects what you observed in Step 0.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/hooks/usePricing.test.tsx` — 8/8 pass.
- `npm run test` — full suite still green (existing Module 1 tests untouched).
- `npx tsc --noEmit` — zero errors.
- `npm run lint` — no new errors.
- `npm run build` — succeeds.
- **Isolation check:** `git diff --stat` lists exactly `src/hooks/usePricing.ts` (new) and `src/hooks/usePricing.test.tsx` (new). No page imports the hook yet.

## Done-when

- `usePricing.ts` exports a `usePricing(): UsePricingResult` function whose public contract matches PRD §4.2 verbatim.
- All eight test cases pass.
- A code comment in the file records the observed `POST /price` envelope shape (direct `PricingInfo` vs. wrapped), referencing PRD §4.3.
- The hook uses `apiPost` (not `fetch`), imports only from `src/lib/*`, and does not import any page or component.
- React Query options are `staleTime: Infinity`, `gcTime: 1h`, `refetchOnWindowFocus: false`, `retry: false`.
- AC 11 defensive branch emits exactly one `console.warn` per hook instance when both `prcId` and `mdid` are set, and the hook uses `mdid` for both the request body and the cache key discriminator.
- No page file imports `usePricing` yet (isolation).

## Notes / ambiguities

- **Live-integration learning from Module 1:** `apiPost` returns `data` from the `{ meta, data }` envelope. The `/questions` endpoint wrapped further (`{ questions: [...] }` inside `data`). `POST /price` **may or may not** wrap similarly — resolve empirically per Step 0 before writing the final `queryFn`, and document the observed shape in a code comment. Do not guess.
- **Post-submit branch reads `session.pricingInfo` synchronously.** Module 1's `useRedirectGuard` already populates `session.pricingInfo` fresh on every post-submit page mount (`CheckoutPage`, `CrossSellPage`) before the page renders. The hook does not re-fetch post-submit; it trusts the guard.
- **`session.qidRaw` (not `qidEncrypted`) indicates post-submit state.** `qidEncrypted` is kept in session for Module 5's `/customer/thankyou` call; it is not a reliable signal of "post-submit and resumable" on its own.
- **Open Item O1 (PRD §10):** backend may or may not vary `POST /price` within a session. `staleTime: Infinity` assumes it does not. Do not change this default here; revisit only if backend confirms variance.
- **Open Item O2 (PRD §10):** the test case for "promo query errors, base succeeds" uses a fabricated error. The **real** backend behavior for an invalid `prc_id` / `mdid` (HTTP 4xx vs. silent fall-through to base pricing) is confirmed during Phase 3 manual QA in Task 99. If the backend silently ignores bad codes, the equal-price guard in step 4 of the resolution logic already handles it (no strikethrough rendered — correct UX).
- **Rules-of-hooks concern:** keep the hook's `useQuery` call count stable across renders. The implementation sketch above uses an early `return` in the post-submit branch for readability; if the hooks lint rule flags this, switch both `useQuery` calls to always run with `enabled: !isPostSubmit && <original enabled>` and pick the return shape at the bottom. Functional behavior is identical either way.
