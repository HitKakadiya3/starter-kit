# Task 04 — `CheckoutPage.tsx` bindings + conditional strikethrough + savings badge

**Phase:** 3 · Page bindings
**Work plan task id:** 3.2
**Size:** Small (1 file)
**Dependencies:** `02-use-pricing-hook.md` (imports `usePricing`); `01-pricing-constants-and-type.md` (imports `DEFAULT_SUBSCRIPTION_DAYS`)

## Purpose / why this task exists

`/checkout` is the primary conversion page. It is **post-submit** — the Module 1 `useRedirectGuard` is already mounted here and refreshes `session.pricingInfo` on every mount. Today the page renders `$4.99`, `$38.38`, `87%`, `$29.99`, `4 weeks` as hardcoded literals, so the "Discount Applied!" card shows regardless of whether a promo was actually applied. After this task every price is bound to `usePricing()` output, and the strikethrough + savings-badge UI is conditionally rendered only when a real discount exists — guarded both by `hasPromo` and by the hook's equal-price check that sets `strikethrough = undefined` when base and promo return the same `first_sale_price`.

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §6.2 (rendering map, loading state, error state — verbatim)
- `docs/prd/module-2-pricing-display.md` §4.4 (savings math — rendered here, not in the hook)
- `docs/prd/module-2-pricing-display.md` §4.5 (post-submit uses `current.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS`)
- `docs/prd/module-2-pricing-display.md` §4.6 (trial copy stays static; no change here since CheckoutPage disclaimer is pricing-copy, not trial-copy, beyond `"After 7 days"` which remains literal)

## AC coverage

- **AC 4** — After `/email` submits, `/checkout` renders `first_sale_price_label` from `session.pricingInfo` with no extra `POST /price` call (post-submit branch of the hook).
- **AC 5** — With an active promo, the strikethrough anchor shows `strikethrough.first_sale_price_label` and the savings badge shows the correct integer percentage.
- **AC 6** — Without a promo, no strikethrough and no "Discount Applied!" card is rendered.
- **AC 9** (partial) — Post-submit pricing failure is surfaced by the Module 1 guard's error path; this task adds the local error card so the user never sees stale prices.
- **AC 12** (partial) — `DEFAULT_SUBSCRIPTION_DAYS` is the only hardcoded duration value left tied to pricing on this page.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/CheckoutPage.tsx`

**Do NOT touch** (explicit Module 2 non-goals):
- Payment buttons around lines 340–348 (`Google Pay`, `PayPal`, `Credit or debit card`) — still call `navigate(next)`. Module 3 replaces these with Stripe Payment Element.
- "Skip and see basic results" links around lines 365 and 479 — Module 3 removes them.
- The `useRedirectGuard('/checkout')` mount — already wired in Module 1, do not modify.
- `scrollToPayment`, testimonials, benefits list, or any non-price copy.
- Any file other than `CheckoutPage.tsx`.

## Step-by-step implementation

### 1. Wire up imports

Add near the top of `CheckoutPage.tsx` (alongside the existing `useRedirectGuard` import):

```ts
import { useMemo } from 'react';
import { usePricing } from '@/hooks/usePricing';
import { DEFAULT_SUBSCRIPTION_DAYS } from '@/lib/pricingConstants';
```

(`useMemo` is likely already imported from `react` via the file's existing hooks — merge into the existing import line.)

### 2. Consume the hook alongside the existing guard

Just after the existing `const ready = useRedirectGuard('/checkout')` line, call:

```ts
const { current, strikethrough, hasPromo, isLoading, isError, refetch } = usePricing();
```

Keep the existing `if (!ready) { return <Loading /> }` early-return exactly as-is. The guard always wins before the pricing UI renders.

### 3. Compute `savings` as a memoised integer or `null`

Before the return, add:

```ts
const savings = useMemo(() => {
  if (!hasPromo || !strikethrough || !current) return null;
  const baseNum = parseFloat(strikethrough.first_sale_price);
  const promoNum = parseFloat(current.first_sale_price);
  if (!Number.isFinite(baseNum) || !Number.isFinite(promoNum) || baseNum <= 0) {
    return null;
  }
  return Math.round((1 - promoNum / baseNum) * 100);
}, [hasPromo, strikethrough, current]);
```

This is the PRD §4.4 formula. `null` means the badge is hidden. The guards on `baseNum` protect against a backend response with a zero or malformed `first_sale_price` — fail-safe, not silent fallback.

### 4. Handle the error state (full-page blocking)

Before the main return, and **after** the `!ready` early return (guard still wins), add:

```tsx
if (isError) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-16 flex items-center">
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Couldn&apos;t load pricing. Please try again.
          </h2>
          <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </main>
    </div>
  );
}
```

Same copy as PricingPage for consistency. PRD §6.2 mandates full-page blocking because a pricing failure means checkout is unsafe to proceed.

### 5. Define the price placeholder

Inside the component, above the return:

```tsx
const pricePlaceholder = (
  <span
    className="inline-block h-5 w-16 bg-muted rounded animate-pulse align-baseline"
    aria-hidden="true"
  />
);
```

### 6. Apply the rendering map (PRD §6.2)

The current file contains these four price bindings and one savings-badge block. Line numbers are from the current file — locate by the string content if lines have shifted.

| Element (approx. line) | Current | Replace with |
|---|---|---|
| Strikethrough anchor (line 333) | `<span className="text-muted-foreground line-through text-base md:text-lg">($38.38)</span>` | `{strikethrough && (<span className="text-muted-foreground line-through text-base md:text-lg">({strikethrough.first_sale_price_label})</span>)}` — renders nothing when `strikethrough` is undefined |
| Total today (line 334) | `<span className="text-2xl md:text-4xl font-bold text-foreground">$4.99</span>` | `<span className="text-2xl md:text-4xl font-bold text-foreground">{isLoading || !current ? pricePlaceholder : current.first_sale_price_label}</span>` |
| "Discount Applied!" card (lines 320–328) | entire `<div className="bg-primary/10 …">…</div>` block | Wrap the entire block in `{hasPromo && strikethrough && savings !== null && ( … )}`. Inside the block, replace `You're saving 87%` with `You're saving {savings}%`. |
| Disclaimer pay amount (line 357) | `By completing your purchase, you agree to pay $4.99 for your results.` | `By completing your purchase, you agree to pay {current?.first_sale_price_label ?? pricePlaceholder} for your results.` |
| Disclaimer subscription amount (line 361) | `your subscription will begin automatically and renew at $29.99 every 4 weeks until canceled.` | `your subscription will begin automatically and renew at {current?.subscription_price_label ?? pricePlaceholder} every {current?.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS} days until canceled.` |

**Important:** PRD §6.2 replaces `"4 weeks"` with `"N days"`, not `"N weeks"`. The new copy reads `every 28 days until canceled.` when the backend ships `subscription_day_label: "28"`.

#### Conditional rendering details

- The strikethrough `<span>` is only rendered when `strikethrough` is a defined `PricingInfo`. When it is `undefined` (no promo, or the equal-price guard tripped), the `<span>` is absent from the DOM — not hidden with CSS.
- The "Discount Applied!" card is gated on `hasPromo && strikethrough && savings !== null`. All three must be truthy. `savings !== null` guards against the `Math.round` returning a nonsensical value if `first_sale_price` fails to parse.
- The disclaimer fields use `current?.<field> ?? pricePlaceholder` so the rest of the disclaimer stays readable while the hook is resolving. In practice, the post-submit branch resolves synchronously, so the placeholder only flickers if `session.pricingInfo` is briefly unset (guard re-running).

### 7. Keep payment buttons and skip links untouched

Lines 340–348 (the three payment buttons) and the two "Skip and see basic results" links stay byte-for-byte as they are today. They are all `navigate(next)` and will be replaced in Module 3.

### 8. Self-audit via grep

From `typestest/`:

```
grep -nE '(\$[0-9]+\.[0-9]+|87%|4 weeks)' src/pages/CheckoutPage.tsx
```

Expected matches: **zero**. If any literal dollar amount, `87%`, or `4 weeks` remains, revisit step 6.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — zero errors.
- `npm run lint` — no new errors.
- `npm run build` — succeeds.
- `npm run test` — existing suite green.
- `npm run dev` — manual smoke (see below).

### Manual smoke (required — both scenarios)

**Scenario A — organic (no promo):**
1. Complete the full funnel from `/` (no params) → `/instructions` → `/quiz` → `/calculating` → `/email` → arrive at `/checkout?qid=…`.
2. DevTools Network: **zero** `POST /price` calls after `/email` submitted. The page reads `session.pricingInfo` via the post-submit branch.
3. Visual: Total today shows the `first_sale_price_label` from the submit response. **No** strikethrough anchor. **No** "Discount Applied!" card.
4. Disclaimer reads `… renew at {subscription_price_label} every 28 days until canceled.` (substituting whatever value the backend returned for `subscription_day_label`).

**Scenario B — campaign (`?mdid=50`):**
1. Start the funnel from `/?mdid=50`. Verify `mdid` is stripped from the URL after boot. Complete through to `/checkout?qid=…`.
2. DevTools: again **zero** `POST /price` on `/checkout` (post-submit branch; the strikethrough anchor reads from `session.pricingInfo` which was already set with the promo applied during submit).

   **However:** `session.pricingInfo` post-submit only carries `current` prices, not `strikethrough`. Without a pre-submit `POST /price` base call on `/checkout`, the hook's post-submit branch returns `strikethrough: undefined` — which means the strikethrough UI is **absent** on `/checkout` even when a promo is applied. **This is a deliberate consequence of PRD §4.3's decision to skip `/price/after/submit`**: the strikethrough UI is rendered pre-submit on `/pricing` (where both queries run), not post-submit on `/checkout`. Flag this under "Notes / ambiguities" if the observed behavior does not match expectations during QA; do not invent a second fetch to work around it.

   **If PRD §6.2 is interpreted strictly** ("On `/checkout` with an active promo, the strikethrough anchor shows `strikethrough.first_sale_price_label`"), the strikethrough source on post-submit must come from somewhere. The Module 2 PRD is silent on this. The safest read of AC 5 is that the strikethrough is primarily a `/pricing` concern and is optional on `/checkout` when no base price is available. Consult the user in the Task 99 manual sweep if ambiguous.
3. Confirm disclaimer subscription clause reads `every {subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS} days`.

**Error path:**
1. DevTools → block `/questions/results` → refresh `/checkout`. The Module 1 guard handles this and navigates to `/`. Module 2 does not add new behavior here; confirm no stale prices render.

## Done-when

- Four price tokens (total, disclaimer pay amount, disclaimer subscription amount, strikethrough anchor) bound to `usePricing()` output or `DEFAULT_SUBSCRIPTION_DAYS`.
- "Discount Applied!" card wrapped in `{hasPromo && strikethrough && savings !== null && …}`.
- Strikethrough `<span>` rendered only when `strikethrough` is defined.
- `savings` computed via `useMemo` using PRD §4.4 formula; returns `null` when inputs are missing or invalid.
- Full-page error card with working Retry when `usePricing` reports `isError`.
- `grep -nE '(\$[0-9]+\.[0-9]+|87%|4 weeks)' src/pages/CheckoutPage.tsx` returns zero matches.
- Payment buttons, skip links, `useRedirectGuard` mount, benefits list, testimonials all untouched.
- Organic scenario: no strikethrough, no savings card, Total = backend's `first_sale_price_label`.
- Campaign scenario: disclaimer substitutes `subscription_day_label` or `DEFAULT_SUBSCRIPTION_DAYS`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` shows `src/pages/CheckoutPage.tsx` as the only changed file.

## Notes / ambiguities

- **Post-submit strikethrough source.** `session.pricingInfo` holds only the current (possibly promo-discounted) prices — it does not include a base-price snapshot. The hook's post-submit branch returns `strikethrough: undefined` because it has nothing to compare against. On `/pricing` (pre-submit) both queries run and the strikethrough renders correctly. On `/checkout` (post-submit), a strikethrough will **not** render under the current PRD §4.3 decision (no `/price/after/submit` call, no second pre-submit `POST /price`). If QA interprets AC 5 strictly and expects the strikethrough to persist into `/checkout`, escalate to the user in the Task 99 sweep — do not add a compensating fetch without explicit approval (that would cross into Module 3 territory and violate "no new deps / no backend changes").
- **`iq_booster_validity` / trial copy.** The `"After 7 days"` literal in the disclaimer (line ~361 before the subscription clause) remains a static copy-level string. PRD §4.6 keeps the trial duration static; `TRIAL_DAYS` is not required in this file unless it turns out the surrounding copy also mentions `7` elsewhere. If you find a second trial mention worth templating, consult the work plan's AC 12 line and apply `${TRIAL_DAYS}` for consistency.
- **`Math.round` is the PRD-sanctioned choice.** A 12.5% discount renders as `"13%"`. PRD §9 R3 flags this explicitly; do not switch to `Math.floor` without marketing / legal sign-off.
- **`useRedirectGuard` stays the single source of truth for post-submit readiness.** Do not try to move hook calls before the `!ready` early return — calling `usePricing` before the guard resolves is fine (it synchronously returns from the post-submit branch once `session.pricingInfo` is populated, and harmlessly reports `isLoading: true` before then).
- **Live-integration learning from Module 1:** `session.qidRaw` (not `qidEncrypted`) signals post-submit state. The hook reads `qidRaw` — this page is post-submit, so the hook's post-submit branch will be taken.
