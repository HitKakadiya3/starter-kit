# Task 05 — `CrossSellPage.tsx` add-on price binding

**Phase:** 3 · Page bindings
**Work plan task id:** 3.3
**Size:** Small (1 file)
**Dependencies:** `02-use-pricing-hook.md` (imports `usePricing`); `01-pricing-constants-and-type.md` (the type tightening is transitively required; no constants imported directly here)

## Purpose / why this task exists

`/cross-sell` renders a single hardcoded price (`$9.99`) inside the IQ Pro description paragraph. The rest of Module 2's work on this page is replacing that one string with `current.cross_sale_price_label` from `usePricing()` and adding loading / error states that match the other price-bearing pages. Accept / skip wiring and the cross-sell visibility logic (`show_cross_sale_page`, `cross_sale_compulsory`) are explicitly Module 4's scope and **not** in play here.

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §6.3 (rendering map, loading / error states — verbatim)
- `docs/prd/module-2-pricing-display.md` §4.2 (`cross_sale_price_label` is a standard field on `PricingInfo`)

## AC coverage

- **AC 7** — `/cross-sell` renders `cross_sale_price_label` inside the IQ Pro description paragraph.
- **AC 9** (partial) — Post-submit pricing failure surfaces via the full-page error card; the user is not shown stale pricing.
- **AC 12** (partial) — No hardcoded `$9.99` remains on this page.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/CrossSellPage.tsx`

**Do NOT touch** (explicit Module 2 non-goals):
- `"30 questions"` and `"IQ Test"` in the description paragraph — product-description copy, not pricing (PRD §6.3).
- The accept button (`Yes, add the IQ test to my order`) and skip button (`Skip and get my personality report only`) — both still call `navigate(next)`. Module 4 wires real accept/skip.
- The `useRedirectGuard('/cross-sell')` mount — already wired in Module 1, do not modify.
- Cross-sell visibility gating (`show_cross_sale_page`, `cross_sale_compulsory`) — Module 4 scope, even though the fields are typed on `PricingInfo` now.

## Step-by-step implementation

### 1. Wire up the import

Add near the top of `CrossSellPage.tsx` (alongside the existing `useRedirectGuard` import):

```ts
import { usePricing } from '@/hooks/usePricing';
```

No `pricingConstants` import is needed on this page — there is no trial or subscription copy here.

### 2. Consume the hook alongside the existing guard

After the existing `const ready = useRedirectGuard('/cross-sell')` line, add:

```ts
const { current, isLoading, isError, refetch } = usePricing();
```

Keep the existing `if (!ready) { return <Loading /> }` early return exactly as-is.

### 3. Handle the error state (full-page blocking)

After the `!ready` early return, add:

```tsx
if (isError) {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Couldn&apos;t load pricing. Please try again.
        </h2>
        <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    </div>
  );
}
```

Same copy as PricingPage and CheckoutPage. Wrapping uses the page's existing `bg-muted/30` background to keep visual continuity.

### 4. Define the price placeholder

Above the return:

```tsx
const pricePlaceholder = (
  <span
    className="inline-block h-4 w-12 bg-muted rounded animate-pulse align-baseline"
    aria-hidden="true"
  />
);
```

The slightly smaller dimensions match the inline price inside the description paragraph (the surrounding text is 13–14.5px body copy, not a headline).

### 5. Apply the rendering map (PRD §6.3)

The current file contains one literal `$9.99` at approximately line 39 inside the description `<p>`:

```tsx
After reviewing your personality profile, we'd like to offer you the chance to take our IQ Test for just $9.99. …
```

Replace `just $9.99` with `just {isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}`:

```tsx
After reviewing your personality profile, we'd like to offer you the chance to take our IQ Test for just {isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}. The test includes 30 questions and takes only a few minutes to complete. …
```

The rest of the paragraph (`"The test includes 30 questions …"` through end) stays byte-for-byte identical.

### 6. Leave everything else alone

- `IQ Pro` heading, product card, image, CTA buttons, disclaimer — all untouched.
- `handleAddIQTest` and `handleSkip` still point at `next` (the `/details?qid=…` URL built from the URL `qid` param).
- Visibility logic remains unimplemented — PRD explicitly defers to Module 4.

### 7. Self-audit via grep

From `typestest/`:

```
grep -n '\$9\.99' src/pages/CrossSellPage.tsx
```

Expected matches: **zero**. If `$9.99` remains, step 5 was incomplete.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — zero errors.
- `npm run lint` — no new errors.
- `npm run build` — succeeds.
- `npm run test` — existing suite green.
- `npm run dev` — manual smoke.

### Manual smoke (required)

1. Complete the full funnel (either organic or with `?mdid=50` — outcomes are identical for cross-sell because cross-sale pricing is a separate field from `first_sale_price`).
2. On `/cross-sell`:
   - DevTools Network: **zero** `POST /price` calls after `/email` submitted (post-submit branch reads from `session.pricingInfo`).
   - The description paragraph reads `"… for just {cross_sale_price_label}."` — substituting whatever label the backend ships. No `$9.99` anywhere on the page.
3. Error path: DevTools → block `/questions/results` → refresh `/cross-sell`. The Module 1 guard handles this (navigates to `/`). Module 2 does not add a new behavior for this path; confirm no stale price renders.

## Done-when

- One price token bound: `{current.cross_sale_price_label}` replaces `$9.99` in the description paragraph.
- `grep -n '\$9\.99' src/pages/CrossSellPage.tsx` returns zero matches.
- Loading placeholder visible while `usePricing` resolves (briefly, since post-submit branch resolves synchronously).
- Full-page error card with working Retry when `usePricing` reports `isError`.
- Accept/skip buttons, IQ Pro product card, heading banner, disclaimer all untouched.
- `useRedirectGuard('/cross-sell')` mount untouched.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` shows `src/pages/CrossSellPage.tsx` as the only changed file.

## Notes / ambiguities

- **Strikethrough does not apply to cross-sale.** The hook's `strikethrough` field compares `first_sale_price`, not `cross_sale_price`. Even with a promo, the cross-sale price is a flat backend value. PRD §6.3 confirms: cross-sell only binds `cross_sale_price_label`; no discount UI here.
- **Cross-sell visibility gating (`show_cross_sale_page`, `cross_sale_compulsory`) is Module 4 scope.** These fields are now typed on `PricingInfo` but this task must not implement any conditional routing based on them.
- **Loading placeholder is small and inline.** The surrounding text is 13–14.5px muted-foreground copy; a large pulse block would draw the eye more than the real value does.
- **Live-integration learning from Module 1:** `useRedirectGuard` refreshes `session.pricingInfo` on every mount of this page (from `POST /questions/results`), so the hook's post-submit branch has fresh data without any extra fetch. Do not add a `POST /price` call here.
