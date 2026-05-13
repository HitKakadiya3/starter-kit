# Module 4 — Cross-sell · PRD

**Parent scope:** [../scope.md](../scope.md) · **Depends on:** [module-1-load-questions.md](./module-1-load-questions.md), [module-2-pricing-display.md](./module-2-pricing-display.md), [module-3-first-payment.md](./module-3-first-payment.md) · **Status:** Live (verified against dev backend) · **Last updated:** 2026-04-23

## 1. Overview

Module 4 wires [CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) to its single backend endpoint. The cross-sell is a **one-click upsell**: the backend charges the payment method saved during first-sale (Module 3) — no Stripe SDK round-trip on the frontend — and returns the next `redirect_page`. The skip path is purely client-side, with a session-level workaround to avoid a guard loop (§4.4).

**Pages:** CrossSellPage
**Backend endpoints:**
- `POST /payment/cross-sale/payments/confirm` — accept; returns `redirect_page`.

**Success definition:** A user on `/cross-sell` can either (a) accept the IQ Pro upsell and be charged through the saved card without any Stripe UI, or (b) skip and continue to `/details`. Both paths land the user in the right next step, even after a mid-funnel refresh.

## 2. In scope

- "Yes, add the IQ test to my order" → POST `/payment/cross-sale/payments/confirm` → navigate per `redirect_page`.
- "Skip and get my personality report only" → session flag + navigate to `/details`.
- Visibility rules: `show_cross_sale_page` and `cross_sale_compulsory`.
- Inline error handling on accept failure.
- Dynamic price binding (already delivered in Module 2).
- Guard extension (§4.4) so a skipped user doesn't bounce back.

## 3. Out of scope

- Additional Stripe SDK flow (one-click charges saved card on the backend).
- Subscription changes (the main subscription was set up alongside first-sale in Module 3).
- Paypal / Solidgate cross-sale variants.
- A dedicated "cross-sale failed, retry with a different card" UX — the backend either succeeds one-click or fails cleanly; we don't re-prompt for card.
- Analytics events for accept / skip (not in any module yet).

## 4. Architecture

### 4.1 Endpoint shape

```
POST /payment/cross-sale/payments/confirm
{
  quiz_result_id: session.qidRaw,
  user_on_iqbooster: '',                                // REQUIRED — backend returns 422 without it
  prc_id: session.prcId ?? '',
  pricing_discount: session.mdid ? { mdid: session.mdid } : '',
}

// Response (per docs)
{
  meta: { success: true, ... },
  data: { redirect_page: string }
}
```

No `payment_intent_id` in the body — the backend uses the payment method reference it stored during first-sale confirm. From the frontend's perspective this is a plain POST with navigate on success.

**`user_on_iqbooster: ''` is required** on every payment-related body even when empty — confirmed 422 on dev when omitted. Shared assumption across Modules 3/4, see [scope.md](../scope.md) §6 assumption #17.

### 4.2 Visibility gates

On mount, after the Module 1 resume guard resolves:

1. If `session.pricingInfo.show_cross_sale_page === false`, the guard itself will have already routed the user past `/cross-sell`. But as a **belt-and-braces** check, if we somehow reach this page with that flag false, re-read `/questions/results` once and navigate per whatever `redirect_page` comes back. Don't render the card.
2. If `session.pricingInfo.cross_sale_compulsory === true`, the Skip link is hidden (accept is the only path forward). Header copy is also slightly adjusted — see §6.1.
3. If `session.pricingInfo.transactions.cross_sale` is missing (never populated by first-sale confirm — defensive), treat as "cross-sale not available" → navigate to `/details`.

### 4.3 Accept flow

```
User clicks "Yes, add the IQ test to my order"
  → Accept button enters loading, Skip link disabled.
  → POST /payment/cross-sale/payments/confirm
  → On success:
      clearSession.paymentIntent (already cleared in Module 3 but defensive)
      Mark session.crossSellResolved = true (see §4.4)
      navigate(`${resolveRedirect(response.redirect_page)}?qid=${qidEncrypted}`, { replace: true })
  → On error (meta.success === false or network):
      Inline alert: `Card on file couldn't be charged. Please continue without the add-on.` + Skip button (if not compulsory) promoted to primary.
      If cross_sale_compulsory is true, the same copy shows but with a "Retry" button instead of a skip — the user's only options are retry or abandon.
```

No backoff / auto-retry. One attempt per click; user can click Retry to fire again.

### 4.4 Skip & accept flow — `session.crossSellResolved` flag

**The problem — confirmed on dev 2026-04-23:** the backend has no "skip" endpoint, and `POST /payment/cross-sale/payments/confirm` does **not** advance the `/questions/results` state either. Until Module 5's `PUT /customer/update` succeeds, `/questions/results` keeps returning `redirect_page: CROSS_SELL_OFFER_PAGE` regardless of whether the user skipped OR accepted the cross-sale. Any resume-guard-mounted page downstream of cross-sell (Details, Results) would bounce back to `/cross-sell` on refresh — infinite loop.

**The fix:** a session-scoped boolean `crossSellResolved` that **both accept and skip** set to `true`. The resume guard (Module 1's `useRedirectGuard`) treats `CROSS_SELL_OFFER_PAGE` as "passed through" when the flag is set:

```ts
// src/hooks/useRedirectGuard.ts — resolveEffectiveRedirect helper
function resolveEffectiveRedirect(
  serverRedirect: string,
  session: FunnelSession,
): string | undefined {
  if (serverRedirect === 'CROSS_SELL_OFFER_PAGE' && session.crossSellResolved) {
    return 'CUSTOMER_DETAILS_PAGE';
  }
  if (serverRedirect === 'CUSTOMER_DETAILS_PAGE' && session.customerUpdateSubmitted) {
    return 'THANK_YOU_PAGE';
  }
  return serverRedirect;
}
```

Once Module 5's customer update succeeds, the backend state advances past cross-sell naturally — but the `customerUpdateSubmitted` override is needed for the same reason on that transition. See Module 5 §4 for details.

**Flag is quiz-scoped.** `crossSellResolved` is reset on new quiz submission (`EmailCapturePage` clears it alongside `customerUpdateSubmitted` and `paymentIntent` when writing a new `qidRaw` to session). Back-to-back funnel runs in the same tab therefore don't inherit stale overrides.

```
Accept path:
  POST /payment/cross-sale/payments/confirm
    → success:
        session.crossSellResolved = true
        navigate(withPromoParams(`${resolveRedirect(response.redirect_page)}?qid=${session.qidRaw}`))

Skip path:
  session.crossSellResolved = true
  navigate(withPromoParams(`/details?qid=${session.qidRaw}`))
```

`qid` in the URL is the **raw integer** `quiz_result_id`, not the encrypted form — `/questions/results` rejects encrypted ("must be a number"). Same fix as Module 1; same rationale applies here. `withPromoParams()` forwards `?prc_id` / `?mdid` to the destination so the user stays on their discount. Both paths use `replace: true` on navigate because cross-sell is terminal — back-navigating to `/cross-sell` would just re-route the user forward via the override anyway.

If the backend team later adds a real skip endpoint or auto-advances after cross-sale accept, we rip out the flag and the override; nothing else changes.

### 4.5 Session model

**Session field** (added to `FunnelSession` in `src/lib/session.ts`):

```ts
crossSellResolved?: boolean;
```

Lifecycle:
- Written to `true` by accept handler (on success) and skip handler.
- Reset to `undefined` by `EmailCapturePage` when a new `qidRaw` is persisted (see Module 1 §6.5) so that a fresh quiz run in the same tab doesn't inherit the previous run's override.
- Cleared by `clearSession()` at end of session.

### 4.6 Guard extension

[src/hooks/useRedirectGuard.ts](typestest/src/hooks/useRedirectGuard.ts) (created in Module 1) owns `resolveEffectiveRedirect` (§4.4). Module 4 adds only the `CROSS_SELL_OFFER_PAGE → CUSTOMER_DETAILS_PAGE` branch. Module 5 adds the `CUSTOMER_DETAILS_PAGE → THANK_YOU_PAGE` branch using the same pattern.

The override is explicit and traceable: tests in `src/hooks/useRedirectGuard.test.tsx` exercise both branches and the negative cases (flag set, but server returns a different redirect → no override fires).

## 5. Data flow

```
/checkout success → first-sale confirm response
  session.pricingInfo.transactions.cross_sale populated
  session.pricingInfo.cross_sale_compulsory populated
  session.paymentIntent cleared
  navigate /cross-sell?qid=...

/cross-sell mount
  ↓
Module 1 guard runs (with Module 4 override)
  POST /questions/results → redirect_page
    if redirect_page === 'CROSS_SELL_OFFER_PAGE' && !crossSellResolved → render
    if redirect_page === 'CROSS_SELL_OFFER_PAGE' && crossSellResolved → navigate /details (withPromoParams)
    if show_cross_sale_page === false → navigate per server redirect
  ↓
Page renders using usePricing() for cross-sale price label
  ↓
User decides:
  Accept:
    POST /payment/cross-sale/payments/confirm
    session.crossSellResolved = true
    navigate(withPromoParams(`${resolveRedirect(response.redirect_page)}?qid=${qidRaw}`))
  Skip:
    session.crossSellResolved = true
    navigate(withPromoParams(`/details?qid=${qidRaw}`))
```

## 6. Per-page PRD — CrossSellPage

### 6.1 Rendering

Existing [CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) layout is preserved. Content edits:

| Element | Current | Replacement |
|---|---|---|
| Header banner | `Payment Completed / Your Personality report is ready` | Unchanged — first-sale confirm has in fact succeeded by the time the user lands here. |
| Description paragraph price | `just $9.99` | `just ${pricing.current.cross_sale_price_label}` (from Module 2). |
| Accept button label | `Yes, add the IQ test to my order` | Unchanged. Adds loading spinner and disabled state during in-flight accept. |
| Skip button | Always visible | Hidden if `pricing.current.cross_sale_compulsory === true`. |
| Error slot | None | A new inline alert above the CTA buttons, rendered only when accept has failed. |
| Disclaimer | `*You will be charged for the add-on services or products selected at the time of purchase.` | Unchanged. |

**Copy variants when `cross_sale_compulsory` is true:**
- Hide the Skip link entirely.
- Replace the "Disclaimer" line with a short sentence: `This add-on is required to continue.` (One-line addition; copy subject to marketing sign-off.)

### 6.2 Button states

| State | Accept | Skip |
|---|---|---|
| Resume guard in flight | disabled | disabled |
| Idle | primary, enabled | enabled (or hidden if compulsory) |
| Accept submitting | loading spinner, disabled | disabled |
| Accept error | re-enabled | promoted to primary (if not compulsory), otherwise replaced by a "Retry" button |

### 6.3 Navigation & state side-effects

- **On accept success:** `session.crossSellResolved = true` + `navigate(withPromoParams(\`${resolveRedirect(redirect_page)}?qid=${qidRaw}\`), { replace: true })`.
- **On skip:** `session.crossSellResolved = true` + `navigate(withPromoParams(\`/details?qid=${qidRaw}\`), { replace: true })`.
- **On accept error:** No session change. User can click Retry or Skip.

The `qid` query param is the **raw integer** `quiz_result_id`, not the encrypted form. `withPromoParams` forwards any `prc_id` / `mdid` from the current URL onto the destination.

### 6.4 Guard interaction

The page mounts the Module 1 guard as its first effect. The guard's extended override (§4.6) ensures that if a post-skip user ever re-enters `/cross-sell` with `crossSellResolved === true`, they're bounced to `/details` automatically (instead of being stuck on the page they already resolved).

## 7. Changes to existing code

| File | Change |
|---|---|
| [typestest/src/pages/CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) | Replace hardcoded `navigate('/details', …)` fakes with (a) accept → `POST /payment/cross-sale/payments/confirm` flow, (b) skip → set `crossSellResolved` and navigate, (c) visibility/compulsory gates, (d) error alert slot. |
| [typestest/src/lib/session.ts](typestest/src/lib/session.ts) | Extend `FunnelSession` with `crossSellResolved?: boolean`. |
| [typestest/src/hooks/useRedirectGuard.ts](typestest/src/hooks/useRedirectGuard.ts) | Introduce `resolveEffectiveRedirect` helper and apply it before computing the expected route. No consumer changes. |

**Files added:** none — cross-sell logic is small enough to live inline in the page component.

## 8. Acceptance criteria

1. Arriving at `/cross-sell?qid=…` renders the card with `cross_sale_price_label` reflecting the dynamic price (Module 2 integration verified).
2. Clicking "Yes, add the IQ test to my order" triggers exactly one `POST /payment/cross-sale/payments/confirm` with `user_on_iqbooster: ''` in the body; on success, navigation uses `withPromoParams(\`${resolveRedirect(response.redirect_page)}?qid=${qidRaw}\`)`.
3. Clicking Skip does **not** call any backend endpoint, sets `session.crossSellResolved = true`, and navigates to `withPromoParams(\`/details?qid=${qidRaw}\`)`.
4. After **either** Skip or Accept → refresh `/details?qid=…` → the resume guard does **not** bounce back to `/cross-sell` because the `crossSellResolved` flag forces `CROSS_SELL_OFFER_PAGE` → `CUSTOMER_DETAILS_PAGE` override.
5. If `session.pricingInfo.cross_sale_compulsory === true`, the Skip link is not rendered.
6. If `session.pricingInfo.show_cross_sale_page === false`, `/cross-sell` auto-navigates without rendering the card.
7. On accept failure (backend error), an inline alert appears above the CTAs; the Accept button re-enables; Skip is promoted to primary (when not compulsory).
8. On compulsory accept failure, a Retry button replaces Skip and re-triggers the confirm endpoint when clicked.
9. Accept and Skip both disable all buttons while any request is in flight (prevents double-click).
10. Active promo (`prc_id` / `mdid`, both supported non-exclusively) is included in the confirm request body when present in session, and also forwarded onto the post-skip / post-accept navigate URL via `withPromoParams`.
11. After successful accept, `session.pricingInfo.transactions.cross_sale` and `session.pricingInfo.cross_sale_compulsory` are preserved (they remain correct for any late-mounting components).
12. `qid` in the URL is the **raw integer** `quiz_result_id` throughout (matches Module 1 convention; backend rejects encrypted on `/questions/results`).
13. Starting a new quiz in the same tab clears `session.crossSellResolved` so the previous run's override doesn't apply to the new funnel (verified via `EmailCapturePage`'s patchSession reset).

## 9. Risks & assumptions

- **R1 — No skip endpoint, and accept doesn't auto-advance `/questions/results` either.** Confirmed on dev 2026-04-23. Both skip AND accept need the `crossSellResolved` client flag to avoid the guard looping on refresh. Module 5's `customerUpdateSubmitted` flag works the same way for the next transition. If the backend team later adds an auto-advance on cross-sale confirm, the flag becomes redundant but harmless — nothing else changes.
- **R2 — Saved payment method reliability.** The backend must have stored a reusable payment method during first-sale confirm (Stripe customer + payment method id). If the backend's Stripe integration doesn't enable off-session charges, cross-sale will systematically fail. Out of our control; monitor during integration.
- **R3 — Promo applicability to cross-sale.** Docs show `prc_id` / `pricing_discount` are accepted on the cross-sale confirm body, but it's unclear whether the same discount applies to first-sale *and* cross-sale or whether passing it here is a no-op. We pass it defensively. Verify with backend if conversion metrics look off.
- **R4 — Compulsory cross-sale UX.** If `cross_sale_compulsory === true` and accept keeps failing, the user is stuck unless they refresh (guard will route per `redirect_page` which presumably still says `CROSS_SELL_OFFER_PAGE`). Acceptable for v1; product may want a "Pay with a different card" fallback later — out of scope.
- **R5 — Cross-tab race on accept.** If a user opens `/cross-sell` in two tabs and clicks accept in both, two confirm calls are fired. Backend should idempotency-guard this — same concern as Module 3 R4. Worth bundling into the same backend conversation.
- **R6 — `show_cross_sale_page` inside pricing_info.** Present only in post-submit pricing shapes, not in `POST /price`. We rely on it always being present by the time the user can reach `/cross-sell` (they must have submitted the quiz to get here). Guard-enforced by Module 1's resume logic — defensive check in §4.2 handles the edge case.

## 10. Open items

- ~~**O1** Backend confirmation: does the server auto-advance past `CROSS_SELL_OFFER_PAGE`?~~ **Resolved 2026-04-23:** backend does not auto-advance on cross-sale accept OR skip; flag is required.
- **O2** Confirm cross-sale confirm idempotency on duplicate `quiz_result_id` (same concern as Module 3 confirm).
- **O3** Marketing copy for the compulsory cross-sell variant — placeholder sentence used.
- **O4** Whether the first-sale response's `cross_sale` block ever disagrees with the `pricing_info.transactions.cross_sale` block from `/questions/results`. Module 3 merges them in; we rely on them being equivalent in Module 4.

## 11. Work plan (high level)

1. Extend `FunnelSession` in `src/lib/session.ts` with `crossSellResolved?: boolean`.
2. Add `resolveEffectiveRedirect` helper to `src/hooks/useRedirectGuard.ts`; update the guard to consult it.
3. Rewrite [CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) to:
   - Mount resume guard.
   - Apply visibility gates (`show_cross_sale_page`, missing `transactions.cross_sale`).
   - Apply compulsory rendering.
   - Wire accept to `POST /payment/cross-sale/payments/confirm` with loading / error states.
   - Wire skip to set the session flag and navigate to `/details`.
4. Manual QA:
   - Accept happy path (sandbox card that supports off-session charges).
   - Accept failure (force backend error).
   - Skip → refresh `/details` → verify no bounce.
   - Compulsory scenario (set `cross_sale_compulsory: true` in mock / backend override).
   - `show_cross_sale_page: false` scenario — verify guard bypass.
   - Promo run with `?mdid=50` and verify the discount param appears in the confirm body.
