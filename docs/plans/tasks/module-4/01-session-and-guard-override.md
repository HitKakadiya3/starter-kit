# Task T1 — `session.crossSellResolved` + `resolveEffectiveRedirect` guard override

**Phase:** 1 · Guard + session foundation
**Work plan task id:** T1
**Size:** Small (2 source files + 1 test file)
**Dependencies:** none (extends Module 1 primitives shipped on `develop`).

## Purpose / why this task exists

Module 4's skip flow is purely client-side — the backend has no "skip cross-sell" endpoint, so `/questions/results` continues returning `redirect_page: CROSS_SELL_OFFER_PAGE` until the next state-advancing action (Module 5's `PUT /customer/update`). Without a client-side escape hatch, a user who skipped cross-sell and then refreshes `/details?qid=…` would be bounced back to `/cross-sell` by `useRedirectGuard` — an infinite loop.

The fix (PRD §4.4 + §4.6) is a session-scoped boolean `crossSellResolved` + a new `resolveEffectiveRedirect` helper inside the guard that remaps `CROSS_SELL_OFFER_PAGE` → `CUSTOMER_DETAILS_PAGE` when the flag is set. T2 will flip the flag on both accept and skip. This task lands the plumbing and its unit-test coverage.

## PRD anchor

- `docs/prd/module-4-cross-sell.md` §4.4 — "the problem" and "the fix" paragraphs, including the `effectiveRedirect` logic verbatim.
- `docs/prd/module-4-cross-sell.md` §4.5 — `FunnelSession` extension (`crossSellResolved?: boolean`).
- `docs/prd/module-4-cross-sell.md` §4.6 — `resolveEffectiveRedirect(serverRedirect, session)` helper contract.
- `docs/prd/module-4-cross-sell.md` §7 — files touched table.

## AC coverage

- Foundation for **AC 3** (skip does not call API; guard-side behavior honors the flag).
- Foundation for **AC 4** (post-skip refresh on `/details` does not bounce back — fully closed once T2 lands; the guard half lives here).
- Foundation for **AC 11** (cross-sale fields preserved — the guard continues to refresh `session.pricingInfo` on every mount, unchanged).

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/lib/session.ts` — add `crossSellResolved?: boolean` to the `FunnelSession` interface.
- `d:/Projects/TestIQ/typestest/src/hooks/useRedirectGuard.ts` — add module-scoped `resolveEffectiveRedirect(serverRedirect, session)` helper; call it inside the existing `.then(data => …)` before `resolveRedirect`.
- `d:/Projects/TestIQ/typestest/src/hooks/useRedirectGuard.test.tsx` — add one new test case covering the override.

**Do NOT touch:**
- `src/pages/CrossSellPage.tsx` (T2's scope; this commit must not change page behavior).
- `src/lib/redirectRouter.ts` (enum mapping unchanged — `CROSS_SELL_OFFER_PAGE` → `/cross-sell` stays; the override happens **before** `resolveRedirect` is called).
- The guard's existing `/` fallback branches (no-qid, non-numeric qid, api reject) — unchanged.
- `clearSession()` semantics — already clears the whole session key, so `crossSellResolved` is cleared alongside everything else. No explicit handling needed.

## Step-by-step implementation

### 1. Extend `FunnelSession` (PRD §4.5)

In `src/lib/session.ts`, add one field to the interface after the existing optional fields. Suggested placement just after `mdid?: string;` (grouping session-level workflow flags):

```ts
export interface FunnelSession {
  // …existing fields unchanged…
  prcId?: string;
  mdid?: string;
  landingUrl?: string;
  landingTime?: number;
  /**
   * Set to `true` by CrossSellPage after the user has either accepted or
   * skipped the cross-sale offer (PRD §4.4). Consumed by `useRedirectGuard`
   * via `resolveEffectiveRedirect` to avoid a resume loop — the backend
   * keeps returning `redirect_page: CROSS_SELL_OFFER_PAGE` until Module 5's
   * customer update, so without this flag a post-skip refresh on `/details`
   * would bounce back to `/cross-sell`.
   *
   * Cleared by `clearSession()` at end of funnel.
   */
  crossSellResolved?: boolean;
}
```

No other change to this file — `getSession`, `patchSession`, `clearSession` already cover the new optional field through their `Partial<FunnelSession>` plumbing.

### 2. Add `resolveEffectiveRedirect` helper to `useRedirectGuard.ts` (PRD §4.6)

Introduce a module-scoped helper **above** the exported `useRedirectGuard` function (keep it module-scoped, not exported — the PRD §4.6 signature lists it as an internal helper):

```ts
import type { FunnelSession } from "@/lib/session";

/**
 * PRD §4.6 override: when the user has already resolved the cross-sell
 * (accepted or skipped, both set `session.crossSellResolved = true` in
 * Module 4), treat the backend's lingering `CROSS_SELL_OFFER_PAGE` as
 * `CUSTOMER_DETAILS_PAGE` so the guard routes forward instead of back.
 * No other redirect values are overridden.
 */
function resolveEffectiveRedirect(
  serverRedirect: string | undefined,
  session: FunnelSession,
): string | undefined {
  if (serverRedirect === "CROSS_SELL_OFFER_PAGE" && session.crossSellResolved) {
    return "CUSTOMER_DETAILS_PAGE";
  }
  return serverRedirect;
}
```

Then inside the existing `apiPost(...).then((data) => {...})` block, replace:

```ts
const expected = resolveRedirect(data.redirect_page);
```

with:

```ts
const effectiveRedirect = resolveEffectiveRedirect(data.redirect_page, getSession());
const expected = resolveRedirect(effectiveRedirect);
```

**Important:** call `getSession()` **after** `patchSession({...})` in the same `.then` block so the helper reads the freshly-merged session. In the current guard code, the order is:
1. `apiPost(...)` resolves with `data`
2. `patchSession({ qidRaw, qidEncrypted, email, pricingInfo })`
3. compute `expected` and navigate

The `crossSellResolved` flag is not part of the patch, so reading `getSession()` either before or after step 2 yields the same flag value — but reading after keeps the mental model of "session is fully up to date before we decide."

### 3. Update the guard unit test (at least one new case)

In `src/hooks/useRedirectGuard.test.tsx`, the existing mock setup already tracks `sessionState` and `patchCalls`. Extend `sessionState` to include the new field (TypeScript-level extension — the `any`-friendly mock objects tolerate it):

```ts
const sessionState: {
  qidRaw?: number;
  qidEncrypted?: string;
  prcId?: string;
  mdid?: string;
  crossSellResolved?: boolean;
} = {};
```

Reset it in `beforeEach`:

```ts
sessionState.crossSellResolved = undefined;
```

Add the new test case (sits alongside the existing five — place it after the "navigates to the resolved route" case for narrative flow):

```ts
it("treats CROSS_SELL_OFFER_PAGE as CUSTOMER_DETAILS_PAGE when session.crossSellResolved is true", async () => {
  sessionState.crossSellResolved = true;

  apiPostMock.mockResolvedValue({
    quiz_result_id: 42,
    encrypted_quiz_result_id: "ENC123",
    email: "a@b.co",
    pricing_info: { plan: "basic" },
    redirect_page: "CROSS_SELL_OFFER_PAGE",
  });

  // Caller is on /details. Without the override, the guard would navigate
  // to /cross-sell?qid=42 and loop the user. With the override, the guard
  // marks ready because the effective redirect resolves to CUSTOMER_DETAILS_PAGE → /details.
  renderAt("/details?qid=42", "/details");

  await waitFor(() => {
    expect(screen.getByTestId("ready").textContent).toBe("true");
  });

  expect(navigateMock).not.toHaveBeenCalled();
});
```

**Optionally** add a negative-control case to prove the override only fires for the specific enum value (nice-to-have, not required):

```ts
it("does NOT override other redirect values when crossSellResolved is true", async () => {
  sessionState.crossSellResolved = true;

  apiPostMock.mockResolvedValue({
    quiz_result_id: 42,
    encrypted_quiz_result_id: "ENC123",
    email: "a@b.co",
    pricing_info: { plan: "basic" },
    redirect_page: "INITIAL_PAYMENT_PAGE",
  });

  renderAt("/details?qid=42", "/details");

  await waitFor(() => {
    // Still navigates to /checkout — the flag only affects CROSS_SELL_OFFER_PAGE.
    expect(navigateMock).toHaveBeenCalledWith("/checkout?qid=42", { replace: true });
  });
});
```

One test case is the minimum per the user brief. Two is stronger and cheap to add.

### 4. Self-audit

From `typestest/`:

```sh
grep -n 'crossSellResolved' src/lib/session.ts src/hooks/useRedirectGuard.ts src/hooks/useRedirectGuard.test.tsx
```

Expected: one match in `session.ts` (the field declaration), one in `useRedirectGuard.ts` (inside `resolveEffectiveRedirect`), one or two in the test file (per the case count above).

```sh
grep -n 'CROSS_SELL_OFFER_PAGE' src/hooks/useRedirectGuard.ts
```

Expected: exactly one match — inside `resolveEffectiveRedirect`. The enum string should not leak elsewhere in this file.

```sh
grep -n 'resolveEffectiveRedirect' src/hooks/useRedirectGuard.ts
```

Expected: two matches — the declaration and the single call site.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/hooks/useRedirectGuard.test.tsx` — all existing cases pass + the new override case (5 → 6 tests, or 5 → 7 with the negative control).
- `npx tsc --noEmit` — zero errors.
- `npm run lint` — zero new errors.
- `npm run build` — succeeds.
- `npm run test` — full suite green (no Module 1 / 2 / 3 regressions).

## Done-when

- `FunnelSession.crossSellResolved?: boolean` typed with a short inline doc comment.
- `resolveEffectiveRedirect(serverRedirect, session)` helper defined at module scope in `useRedirectGuard.ts`; called exactly once inside the existing `.then(data => ...)` block before `resolveRedirect`.
- At least one new test case in `useRedirectGuard.test.tsx` exercises the override path and asserts `navigateMock` is not called (guard marks ready).
- The existing 5 guard test cases still pass without modification (the mock's `sessionState` extension is additive; default `undefined` preserves prior behavior).
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` lists exactly three files: `src/lib/session.ts`, `src/hooks/useRedirectGuard.ts`, `src/hooks/useRedirectGuard.test.tsx`. No other file drifted.

## Notes / ambiguities

- **Why module-scoped, not exported?** PRD §4.6 describes the helper as internal to the guard. No other consumer has a legitimate need to remap redirects — if one emerges, we export then. YAGNI for now.
- **Why not clear `crossSellResolved` anywhere?** PRD §4.5 says the flag is cleared implicitly by `clearSession()` (end of funnel) and that no explicit reset is needed within Module 4. Leaving it `true` past its useful window is harmless because, once Module 5 ships, the backend's `redirect_page` advances past `CROSS_SELL_OFFER_PAGE` on its own, making the override irrelevant.
- **Test mock typing.** The existing mock uses a plain object typed via an inline interface. The field addition here is additive — TypeScript won't complain, and the mock doesn't need to match `FunnelSession` exactly since it's a stub for the hook's `getSession`/`patchSession` mocks.
- **Do not refactor the guard's error path.** PRD §4.6 explicitly says the override is the only new behavior. The `.catch(() => navigate("/", { replace: true }))` branch stays exactly as Module 1 shipped it.
- **The enum literal `'CROSS_SELL_OFFER_PAGE'`** is the same value `redirectRouter.ts` keys on. If the backend ever renames this enum, both files change together — but that's a cross-cutting rename, not a Module 4 concern.
