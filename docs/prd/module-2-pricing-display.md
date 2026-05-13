# Module 2 — Pricing Display · PRD

**Parent scope:** [../scope.md](../scope.md) · **Depends on:** [module-1-load-questions.md](./module-1-load-questions.md) · **Status:** Live · **Last updated:** 2026-04-23

## 1. Overview

Module 2 replaces every hardcoded price string across the funnel with dynamic values fetched from the backend. Pricing is consistent for the full user session and respects the campaign discount params (`prc_id` / `mdid`) captured in Module 1.

**Pages:** PricingPage · CheckoutPage · CrossSellPage
**Backend endpoints:**
- `POST /price` — pre-submit pricing (for PricingPage; also used to derive strikethrough base)
- `pricing_info` block embedded in `POST /questions/submit` and `POST /questions/results` responses — post-submit pricing (used by Checkout and Cross-sell)

**Success definition:** Every price shown in the funnel matches the backend, reflects any active promo, and stays stable across route transitions within a single session.

## 2. In scope

- Dynamic price rendering on PricingPage, CheckoutPage, CrossSellPage.
- Strikethrough / "was" price on CheckoutPage rendered by comparing promo-discounted price against base list price.
- A single `usePricing()` hook that every price-bearing component consumes.
- Graceful loading and error states for price fetches.

## 3. Out of scope

- IntroPage pricing UI (no price text is rendered there today — if you add price later, the hook is ready).
- `/price/after/submit` — see §4.3.
- Per-country / per-region manual overrides beyond what the backend's IP-based geo-pricing already handles.
- Currency conversion or localization (backend is authoritative for `currency_code` and all labels).
- Stripe / payment wiring — Module 3.
- Cross-sell accept/skip wiring — Module 4.

## 4. Architecture

### 4.1 Pricing data sources

Two distinct sources depending on where the user is in the funnel:

| Stage | Source of truth | Fetched via |
|---|---|---|
| **Pre-submit** (before `/quiz` finishes) | `POST /price` | React Query (on component mount) |
| **Post-submit** (after `/email` submits) | `session.pricingInfo` | Populated by `POST /questions/submit` response and refreshed by `POST /questions/results` inside the Module 1 resume guard |

The hook in §4.2 hides this dual-source logic from consumers.

### 4.2 `usePricing()` hook — `src/hooks/usePricing.ts`

Single entry point for all price-rendering components.

```ts
type PricingShape = {
  currency_code: string;
  first_sale_price: string;          // numeric string for math, e.g. "4.99"
  first_sale_price_label: string;    // localized display, e.g. "$4.99"
  cross_sale_price: string;
  cross_sale_price_label: string;
  subscription_price: string;
  subscription_price_label: string;
  subscription_day_label?: string;   // present in post-submit only
  first_and_cross_sale_price_label?: string; // present in post-submit only
  show_cross_sale_page?: boolean;    // present in post-submit only
  cross_sale_compulsory?: boolean;   // present in post-submit only
  payment_gateways: Array<{ id: string; name: string }>;
  // … other fields ignored by Module 2
};

type UsePricingResult = {
  current: PricingShape | undefined;       // price actually charged
  strikethrough: PricingShape | undefined; // undefined when no promo
  hasPromo: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export function usePricing(): UsePricingResult;
```

**Resolution logic:**

Let `hasPromo = !!(session.prcId || session.mdid)` and `isPostSubmit = !!(session.qidRaw && session.pricingInfo)`. Note that `prcId` and `mdid` can **co-exist** — scope §6 assumption #9 was updated after backend confirmation. Both are forwarded on every promo-enabled API body.

React Query calls:

- `['price', 'base']` → `apiPost('price', {})` — **enabled:** `!isPostSubmit || hasPromo`. The base is used either (a) as `current` pre-submit without promo, or (b) as the `strikethrough` source whenever a promo is active (pre- or post-submit).
- `['price', 'promo', prcId, mdid]` → `apiPost('price', { prc_id: prcId ?? '', pricing_discount: mdid ? { mdid } : '' })` — **enabled:** `!isPostSubmit && hasPromo`. The cache key includes **both** params so that a route change from `?prc_id=A` to `?prc_id=A&mdid=50` yields a fresh fetch instead of a stale hit. Post-submit the current price already lives in `session.pricingInfo`; re-fetching the promo variant would duplicate it.

Returned values:

1. `current`
   - **post-submit:** `session.pricingInfo`.
   - **pre-submit with promo:** `promoPrice`.
   - **pre-submit without promo:** `basePrice`.
2. `strikethrough`
   - **has promo**, and `basePrice.first_sale_price !== current.first_sale_price`: `basePrice`.
   - otherwise: `undefined`. (Guards against the backend returning identical numbers when the promo doesn't actually apply.)
3. `hasPromo` and `isLoading` / `isError` are derived in the obvious way — `isLoading` is `true` until `current` is resolved.

This keeps the "single source of truth post-submit is `session.pricingInfo`" contract intact (no extra promo refetch), while still producing the marketing strikethrough anchor on CheckoutPage when a user walked through with a campaign code.

**React Query config:** `staleTime: Infinity`, `gcTime: 1_000 * 60 * 60` (1 h). Price should not refetch on window focus or refresh within a session — that would violate the "same price for whole session" guarantee. When session changes (`prcId` / `mdid` mutate), the cache key changes naturally.

### 4.3 Why we skip `POST /price/after/submit`

The Postman collection documents the endpoint but not its purpose. Its body accepts `test_token`, optional `prc_id`, and optional `pricing_discount` — with no response sample or semantic description. Everything Module 2 needs post-submit is already in `session.pricingInfo` (from `/questions/submit` and refreshed by `/questions/results`), so calling `/price/after/submit` would duplicate data we already have.

**Decision:** do not call `/price/after/submit` in Module 2. If a future requirement surfaces (e.g. variant-specific post-submit repricing), revisit with the backend team.

### 4.4 Savings badge math

On CheckoutPage, the "Discount Applied! You're saving X%" badge is rendered **only when a promo is active and `strikethrough` is defined**. The percentage is computed client-side:

```ts
const savings = Math.round(
  (1 - parseFloat(current.first_sale_price) / parseFloat(strikethrough.first_sale_price)) * 100
);
```

Rounded to the nearest integer. Hidden entirely when not applicable.

### 4.5 Subscription "N days" copy

Backend's `subscription_day_label` (e.g. `"28"`) ships in post-submit `pricing_info` only. Pre-submit pages (PricingPage) don't have it, so copy like "billed every 28 days" has two code paths:

- **Post-submit** (CheckoutPage): use `pricingInfo.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS`.
- **Pre-submit** (PricingPage): use the static constant `DEFAULT_SUBSCRIPTION_DAYS` from a new `src/lib/pricingConstants.ts` (`DEFAULT_SUBSCRIPTION_DAYS = "28"`).

If a tenant ever ships with a non-28 billing cadence, updating one constant handles pre-submit; post-submit is already dynamic. This is a known, scoped compromise due to the `/price` response shape; revisit only if it becomes a problem.

### 4.6 Trial duration copy

Current UI says "7-day free trial" (InstructionsPage, CheckoutPage disclaimer, PricingPage). Backend exposes `iq_booster_validity` (seen as `null` in samples), which may or may not represent the trial window. Without clearer contract:

- Keep **"7 days"** as a static string in `src/lib/pricingConstants.ts` (`TRIAL_DAYS = 7`).
- Treat the trial window as marketing-copy-level, not price-level, dynamic.
- Revisit if / when the backend starts populating `iq_booster_validity` meaningfully.

## 5. Data flow

```
App boot (Module 1): ipify → campaign params captured → session ready
  ↓
PricingPage /pricing mounts
  → usePricing() → Query cache empty for 'price'
    → POST /price (base) [+ POST /price with promo if prcId or mdid]
    → populate cache
  → render labels from `current`
  ↓
User clicks "Start your journey" → /instructions → /quiz → ... → /email
  → POST /questions/submit returns pricing_info
  → session.pricingInfo = pricing_info
  ↓
CheckoutPage /checkout mounts
  → resume guard (Module 1) runs → refreshes session.pricingInfo from /questions/results
  → usePricing() hits post-submit branch → returns session.pricingInfo as `current`
  → strikethrough and savings badge only rendered if prcId/mdid present
  ↓
CrossSellPage /cross-sell mounts
  → resume guard runs → session.pricingInfo refreshed again
  → usePricing() returns current; render cross_sale_price_label
```

**Guarantee:** once `session.pricingInfo` is populated after submit, every subsequent page reads the same reference (modulo guard refreshes which preserve price unless the backend changes it).

## 6. Per-page PRD

### 6.1 PricingPage · `/pricing`

**Intent:** Marketing / landing page describing the offer with real prices.

**Data:** `usePricing()`.

**Rendering map** — [PricingPage.tsx:44](typestest/src/pages/PricingPage.tsx#L44):

| Element | Current string | Replace with |
|---|---|---|
| Today's price in blurb | `$6.99 today` | `${first_sale_price_label} today` |
| Subscription cadence in blurb | `$29.99 billed every 28 days` | `${subscription_price_label} billed every ${DEFAULT_SUBSCRIPTION_DAYS} days` |
| Footer renewal disclaimer | `renews automatically at $29.99 every 28 days` | `renews automatically at ${subscription_price_label} every ${DEFAULT_SUBSCRIPTION_DAYS} days` |
| Add-on IQ Pro price | `$9.99` | `${cross_sale_price_label}` |
| Trial mention | `7‑Day Trial` | `${TRIAL_DAYS}‑Day Trial` (static) |

**Loading state:** Replace each price token with a subtle pulsing placeholder (`<span className="inline-block h-5 w-16 bg-muted rounded animate-pulse" />`) while `isLoading`. Do not block the rest of the page.

**Error state:** Full-page error card with retry button, same pattern as QuizPage in Module 1. Message: "Couldn't load pricing. Please try again."

**Navigation:** Unchanged — "Start your journey" → `/instructions`.

### 6.2 CheckoutPage · `/checkout`

**Intent:** Primary conversion page showing the offer, benefits, and payment CTA. Module 3 adds the Stripe Payment Element; Module 2 only handles price display.

**Data:** `usePricing()`. Guard (from Module 1) ensures `session.pricingInfo` is populated.

**Rendering map** — [CheckoutPage.tsx](typestest/src/pages/CheckoutPage.tsx):

| Element | Current string | Replace with |
|---|---|---|
| Total today | `$4.99` ([line 330](typestest/src/pages/CheckoutPage.tsx#L330)) | `${current.first_sale_price_label}` |
| Strikethrough anchor | `($38.38)` ([line 329](typestest/src/pages/CheckoutPage.tsx#L329)) | `(${strikethrough.first_sale_price_label})` **only when `strikethrough` is defined**; hide the `<span>` otherwise |
| Savings badge body | `You're saving 87%` ([line 321](typestest/src/pages/CheckoutPage.tsx#L321)) | `You're saving ${savings}%` (see §4.4); hide the whole gift-badge card when `!hasPromo || !strikethrough` |
| Disclaimer subscription amount | `$29.99 every 4 weeks` ([line 357](typestest/src/pages/CheckoutPage.tsx#L357)) | `${current.subscription_price_label} every ${current.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS} days` |
| Disclaimer pay amount | `$4.99 for your results` ([line 353](typestest/src/pages/CheckoutPage.tsx#L353)) | `${current.first_sale_price_label} for your results` |

**Payment buttons:** Unchanged in Module 2 (still the three Google Pay / PayPal / Credit-card buttons that `navigate('/cross-sell')`). Module 3 replaces these.

**"Skip and see basic results" links** ([line 362–367](typestest/src/pages/CheckoutPage.tsx#L362), [line 479–483](typestest/src/pages/CheckoutPage.tsx#L479)): Unchanged in Module 2. Module 3 removes them.

**Loading state:** Show placeholders for the price numbers in the payment card. Leave the rest of the page visible.

**Error state:** Full-page error card. Pricing failure means we can't process checkout safely, so treat it as blocking.

### 6.3 CrossSellPage · `/cross-sell`

**Intent:** Offer the IQ Pro add-on post first-sale.

**Data:** `usePricing()`. Guard refreshes pricing before render.

**Rendering map** — [CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx):

| Element | Current string | Replace with |
|---|---|---|
| Price in description | `just $9.99` ([line 39](typestest/src/pages/CrossSellPage.tsx#L39)) | `just ${current.cross_sale_price_label}` |

**Note:** The descriptive paragraph also mentions "30 questions" and "IQ Test" — these are product-description copy, not pricing, and stay as-is in Module 2. Module 4 handles visibility logic (`show_cross_sale_page`, `cross_sale_compulsory`).

**Loading / error:** Placeholders for the price string; full-page error fallback on hard failure.

## 7. Changes to existing code

| File | Change |
|---|---|
| [typestest/src/pages/PricingPage.tsx](typestest/src/pages/PricingPage.tsx) | Bind prices via `usePricing()`; add loading placeholders, error card. |
| [typestest/src/pages/CheckoutPage.tsx](typestest/src/pages/CheckoutPage.tsx) | Replace hardcoded `$4.99`, `$38.38`, `87%`, `$29.99`, `4 weeks` with dynamic values. Conditionally hide the strikethrough `<span>` and the "Discount Applied!" card when no promo. |
| [typestest/src/pages/CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) | Replace `$9.99` with `cross_sale_price_label`. |

**Files added:**
- `src/hooks/usePricing.ts`
- `src/lib/pricingConstants.ts` (exports `DEFAULT_SUBSCRIPTION_DAYS`, `TRIAL_DAYS`)

No changes to `src/lib/session.ts` — Module 1 already includes `pricingInfo` in the session type. Module 2 only reads it.

## 8. Acceptance criteria

1. Visiting `/pricing` triggers `POST /price`; numeric values in the UI match `first_sale_price_label`, `subscription_price_label`, `cross_sale_price_label`.
2. Visiting `/pricing` with `?prc_id=ABC` or `?mdid=50` triggers two `POST /price` calls (base and promo); the discounted value is rendered as the primary price.
3. Price data is cached: navigating back and forth between `/pricing` → `/` → `/pricing` does not re-trigger `POST /price` within the session.
4. After `/email` submits successfully, `/checkout` renders `first_sale_price_label` from `session.pricingInfo` with no additional `POST /price` call.
5. On `/checkout` with an active promo, the strikethrough anchor shows `strikethrough.first_sale_price_label` and the savings badge shows the correct integer percentage.
6. On `/checkout` with no promo, no strikethrough and no "Discount Applied!" card is rendered.
7. `/cross-sell` renders `cross_sale_price_label` inside the IQ Pro description paragraph.
8. On a pricing API failure before the user reaches `/email`, `/pricing` shows a retryable error card and does not render stale or fallback prices.
9. On a pricing API failure post-submit, the resume guard's own retry (via `/questions/results`) surfaces the same error UX and the user is not presented with stale price data.
10. Refreshing any price-bearing page preserves the same displayed prices (same session → same `session.pricingInfo` / cached React Query values).
11. If `session.prcId` and `session.mdid` are **both** set (a legitimate case per scope §6 assumption #9), both values are included in the `POST /price` body and the cache key — no preference logic, no warning.
12. `DEFAULT_SUBSCRIPTION_DAYS` and `TRIAL_DAYS` constants are the only hardcoded duration values remaining in the codebase.
13. Active promo params flow through to all downstream modules: Module 3 intent creation + confirm bodies, Module 4 cross-sale confirm body, Module 5 customer update navigate URL — see each module's PRD for specifics.

## 9. Risks & assumptions

- **R1** `POST /price` response does not include `subscription_day_label` or `first_and_cross_sale_price_label`. Pre-submit surfaces (PricingPage) accept this via the `DEFAULT_SUBSCRIPTION_DAYS` constant. If a tenant ships with a non-28 billing cadence and needs PricingPage to reflect it, we'd need either a backend response change or a tenant-keyed frontend constant.
- **R2** The double-fetch approach (base + promo) on PricingPage assumes the backend returns identical data for `POST /price` with and without promo params when the discount doesn't apply. If the backend errors on an invalid `prc_id` / `mdid`, the promo query will fail — we surface the error and do not silently fall back to base pricing (stale UX vs. misleading discount).
- **R3** The savings-badge rounding uses `Math.round`, so a 12.5% discount displays as "13%". Acceptable marketing-wise; flagged in case legal wants `Math.floor` instead.
- **R4** `iq_booster_validity` is not consumed — trial length stays static at `TRIAL_DAYS = 7`.
- **R5** React Query `staleTime: Infinity` means an in-tab user won't see an admin-side price change until they reload. Acceptable given "same price for whole session" is an explicit requirement.
- **R6** If `session.pricingInfo` somehow exists without `session.qidRaw` (data integrity bug), `usePricing` treats the user as pre-submit and refetches. Defensive default.

## 10. Open items

- **O1** Confirm with backend team whether `POST /price` will ever vary for the same tenant + promo combo within a session — if yes, `staleTime: Infinity` is too aggressive and should drop to something like 10 min.
- **O2** Confirm error shape for invalid `prc_id` / `mdid` (HTTP 4xx with `meta.success: false`, or silent fall-through to default pricing?). If the backend silently ignores bad promo codes, we won't show a strikethrough for them — which is correct UX but worth knowing.
- **O3** Final marketing / legal sign-off on showing dynamic strikethrough only when a real promo is applied (option 3 in our earlier discussion was confirmed; noting for the record).

## 11. Work plan (high level)

1. Add `src/lib/pricingConstants.ts` with `DEFAULT_SUBSCRIPTION_DAYS`, `TRIAL_DAYS`.
2. Add `src/hooks/usePricing.ts` implementing the resolution logic in §4.2.
3. Refactor [PricingPage.tsx](typestest/src/pages/PricingPage.tsx) to consume `usePricing()`; add loading placeholders and error fallback.
4. Refactor [CheckoutPage.tsx](typestest/src/pages/CheckoutPage.tsx) price bindings; add conditional strikethrough and savings-badge rendering.
5. Refactor [CrossSellPage.tsx](typestest/src/pages/CrossSellPage.tsx) price binding.
6. Manual QA against all acceptance criteria on at least two scenarios: organic (no promo) and campaign (`?mdid=50`).
