# Task 03 — `PricingPage.tsx` bindings + loading / error states

**Phase:** 3 · Page bindings
**Work plan task id:** 3.1
**Size:** Small (1 file)
**Dependencies:** `02-use-pricing-hook.md` (imports `usePricing`); `01-pricing-constants-and-type.md` (imports `DEFAULT_SUBSCRIPTION_DAYS`, `TRIAL_DAYS`)

## Purpose / why this task exists

`/pricing` is the pre-submit marketing page. Today every price string on it is hardcoded (`$6.99`, `$29.99`, `$9.99`, `28 days`, `7‑Day Trial`). After this task every price token is bound to `usePricing()` output (via `current.*_label` fields) or one of the two static constants, so a promo in the URL (`?prc_id=…` or `?mdid=…`) renders the discounted value and a backend outage produces a retryable error card instead of misleading defaults.

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §6.1 (rendering map, loading state, error state — verbatim)
- `docs/prd/module-2-pricing-display.md` §4.5 (pre-submit pages use `DEFAULT_SUBSCRIPTION_DAYS` — backend does not ship `subscription_day_label` in `POST /price`)
- `docs/prd/module-2-pricing-display.md` §4.6 (trial copy stays static at `TRIAL_DAYS`)

## AC coverage

- **AC 1** — `/pricing` fires `POST /price` and numeric UI values match `first_sale_price_label`, `subscription_price_label`, `cross_sale_price_label`.
- **AC 2** — `?prc_id=ABC` or `?mdid=50` triggers two `POST /price` calls; the discounted value is the primary price.
- **AC 3** — Price data is cached: `/pricing` → `/` → `/pricing` does not re-trigger `POST /price` (driven by React Query config from Task 02; PricingPage demonstrates it).
- **AC 8** — Pricing API failure → retryable error card, no stale/fallback prices.
- **AC 12** (partial) — only `DEFAULT_SUBSCRIPTION_DAYS` and `TRIAL_DAYS` remain as hardcoded duration values on this page.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/PricingPage.tsx`

**Do NOT touch:**
- Navigation (`Start your journey` still calls `navigate('/instructions')`).
- The features grid content (non-price copy).
- Any other file — all logic lives in the hook from Task 02.

## Step-by-step implementation

### 1. Wire up imports

Add at the top of `PricingPage.tsx`:

```ts
import { usePricing } from '@/hooks/usePricing';
import {
  DEFAULT_SUBSCRIPTION_DAYS,
  TRIAL_DAYS,
} from '@/lib/pricingConstants';
```

### 2. Consume the hook at the top of the component

Just inside the `PricingPage` function body, call the hook:

```ts
const { current, isLoading, isError, refetch } = usePricing();
```

### 3. Handle the error state first (full-page blocking card)

Before the `return (...)` that renders the page, add an early-return error card. Pattern mirrors the QuizPage error card from Module 1 for visual consistency:

```tsx
if (isError) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
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
      <SiteFooter />
    </div>
  );
}
```

The copy `"Couldn't load pricing. Please try again."` comes from PRD §6.1 verbatim.

### 4. Define a tiny placeholder for the loading branch

Inside the component (above the return), define:

```tsx
const pricePlaceholder = (
  <span
    className="inline-block h-5 w-16 bg-muted rounded animate-pulse align-baseline"
    aria-hidden="true"
  />
);
```

Do **not** gate the whole page on `isLoading` — PRD §6.1 explicitly says "do not block the rest of the page". Only the price tokens switch to placeholders while the fetch is in flight.

### 5. Replace each hardcoded price token

Apply the rendering map from PRD §6.1 line-by-line. The existing file has these literal strings — locate each and replace.

| Current string (line in current file) | Replace with |
|---|---|
| `Personality report + 7‑Day Trial to IQ Booster, …` (heading, line 36) | `Personality report + {TRIAL_DAYS}‑Day Trial to IQ Booster, …` (keep surrounding copy) |
| `$6.99 today. After the 7-day trial, $29.99 billed every 28 days.` (blurb, line 43–45) | `{isLoading || !current ? pricePlaceholder : <>{current.first_sale_price_label} today. After the {TRIAL_DAYS}-day trial, {current.subscription_price_label} billed every {DEFAULT_SUBSCRIPTION_DAYS} days.</>}` |
| `7‑day full access to IQ Booster Brain training` (bullet inside the list around line 51) | `{TRIAL_DAYS}‑day full access to IQ Booster Brain training` (template literal inside the array; see step 5a below) |
| `After a 7 days trial, membership renews automatically at $29.99 every 28 days unless cancelled.` (footer disclaimer, line 70–72) | `{isLoading || !current ? pricePlaceholder : <>After a {TRIAL_DAYS} days trial, membership renews automatically at {current.subscription_price_label} every {DEFAULT_SUBSCRIPTION_DAYS} days unless cancelled.</>}` |
| `$9.99` (add-on card price, line 84) | `{isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}` |

#### 5a. The bullet-list trial string

The current file builds bullets from a literal array:

```ts
{['Detailed personality profile & downloadable report',
  'In-depth insights into your traits and strengths',
  '7‑day full access to IQ Booster Brain training',
  'Cancel any time'].map(...)}
```

Replace the third element with a template literal: `` `${TRIAL_DAYS}‑day full access to IQ Booster Brain training` ``. The array becomes a local `const items = [...]` above the return if inline template literals would harm readability.

#### 5b. Mixed static + dynamic strings

Where a single paragraph combines dynamic price fields and static trial copy (the blurb on line 43–45 and the footer disclaimer on line 70–72), the whole paragraph switches to a placeholder when `isLoading || !current`. This keeps the layout from flickering when only part of the sentence is ready. The rest of the page (features grid, CTA button, images) keeps rendering.

### 6. Keep navigation and non-price copy untouched

- `<Button … onClick={() => navigate('/instructions')}>Start your journey</Button>` stays exactly as-is. No `qid` forwarding on this page (it is pre-submit).
- The features grid copy, heading gradient text, and page layout structure stay untouched.

### 7. Self-audit via grep

From `typestest/`:

```
grep -nE '(\$[0-9]+\.[0-9]+|28 days|7.day|7 days)' src/pages/PricingPage.tsx
```

Expected matches: only occurrences that are inside a template literal referencing `DEFAULT_SUBSCRIPTION_DAYS` or `TRIAL_DAYS` (e.g. `` `${DEFAULT_SUBSCRIPTION_DAYS} days` ``). No raw `$6.99`, `$29.99`, `$9.99`, no raw `28 days` or `7-day` / `7 days`.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — zero errors.
- `npm run lint` — no new errors.
- `npm run build` — succeeds.
- `npm run test` — existing suite green (no new tests added by this task).
- `npm run dev` — manual smoke (see below).

### Manual smoke (required)

1. `/pricing` (fresh incognito, no params): DevTools Network shows exactly **one** `POST /price` with body `{}`. Price numbers on the page match `first_sale_price_label`, `subscription_price_label`, `cross_sale_price_label` from the response.
2. `/pricing?prc_id=ABC`: DevTools shows **two** `POST /price` calls (base + promo). The discounted number renders as the primary value. After boot, the URL bar reads `/pricing` (Module 1 strips the param).
3. `/pricing?mdid=50`: same as above; request body for the promo call includes `pricing_discount: { mdid: "50" }`.
4. `/pricing` → `/` → `/pricing` (same tab): **no** additional `POST /price` call fires on the second `/pricing` visit (AC 3).
5. DevTools Network → block `POST /price` → refresh `/pricing`: the error card renders with a working Retry button. Unblock the request, click Retry, prices load (AC 8).

## Done-when

- Five price tokens (blurb, bullet, footer disclaimer, add-on price, heading trial) bound to hook output or constants.
- `grep -nE '(\$[0-9]+\.[0-9]+|28 days|7.day|7 days)' src/pages/PricingPage.tsx` returns only template-literal references to the two constants.
- Loading placeholders visible during the `POST /price` fetch on a throttled network.
- Full-page error card with working Retry button when `POST /price` fails.
- Navigating away and back within the same tab does not fire another `POST /price`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` shows `src/pages/PricingPage.tsx` as the only changed file.

## Notes / ambiguities

- **Loading-state granularity:** PRD §6.1 says "do not block the rest of the page". Only the price tokens use the placeholder — the CTA button, features grid, and images keep rendering. The whole page only goes blocking on **error**, not on loading.
- **`DEFAULT_SUBSCRIPTION_DAYS` is hardcoded, not dynamic.** Pre-submit surfaces have no `subscription_day_label` from the backend. If a tenant ships with a non-28 cadence, update the constant — this is the scoped compromise documented in PRD §4.5 and is acceptable for Module 2.
- **`TRIAL_DAYS` is also hardcoded.** Backend's `iq_booster_validity` currently returns `null`. Per PRD §4.6 the trial copy stays static until the backend starts populating the field. No dynamic branch needed here.
- **Open Item O2 (PRD §10):** during manual smoke, try `?prc_id=DEFINITELY_NOT_VALID` once. If the backend silently falls through to base pricing, the hook's equal-price guard renders `current = promoQuery.data` with `strikethrough === undefined`, so no discount UI appears — this is correct UX, but worth confirming and noting in the Task 99 sweep.
