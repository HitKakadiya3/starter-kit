# Task 06 — Replace button trio + skip links in `CheckoutPage.tsx` with `<CheckoutForm />`

**Phase:** 6 · CheckoutPage integration
**Work plan task id:** 6.1
**Size:** Small (1 file modified)
**Dependencies:** `05-checkout-form-wrapper.md` (CheckoutForm is the mount target).

## Purpose / why this task exists

CheckoutForm has been built and tested in isolation. This task wires it into the live page with the smallest possible diff:

- Drop the three `<Button>` placeholders that currently call `navigate(next)`.
- Drop **both** "Skip and see basic results" links (AC 4).
- Mount `<CheckoutForm />` in their place, passing `priceLabel`, `pricing`, `email`, and the existing `gpayIcon` import as props.
- Keep everything else (left column, benefits list, pricing header, discount card, "Total Today:" block, ShieldCheck line, fine-print paragraph, testimonials, trust features, final CTA) unchanged.

The diff should be reviewer-friendly: two focused removals + one addition. The `<div id="payment-card">` wrapper and its children outside the payment-button area remain byte-identical so the regression surface is small.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §6.1 — preserved elements (three-button visual, layout).
- `docs/prd/module-3-first-payment.md` §6.2 — removed elements (both skip links).
- `docs/prd/module-3-first-payment.md` §6.3 — added elements (consent + inline CardForm).
- `docs/prd/module-3-first-payment.md` §7 — Changes to existing code (CheckoutPage row).

## AC coverage

Fully closes:

- **AC 3** — preserved visuals, verified site-level (Task 05 guaranteed byte-for-byte inside CheckoutForm; this task verifies the page-level visual diff).
- **AC 4** — both "Skip and see basic results" links removed.

Contributes to AC 1, 2, 5, 6, 7, 10 (all via mounting CheckoutForm, which owns those behaviours). Full closure in Task 99.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/CheckoutPage.tsx`

**Do NOT touch** (in this task):
- Any file under `src/components/checkout/` — read-only dependency.
- Any hook or library module — all read-only.
- The left column (features + trust icons) — per PRD §6.3 "Preserved".
- The pricing header, benefits list, discount-applied card, "Total Today:" block, ShieldCheck line, fine-print paragraph — all preserved.
- Testimonials, trust features, final CTA section.
- `useRedirectGuard('/checkout')` or `usePricing()` invocations at the top of the component.

## Backend contract reference

None — this is a page-integration refactor. All backend calls flow through `CheckoutForm` → hooks → `apiPost`.

## Step-by-step implementation

### Step 1 — Read the current CheckoutPage.tsx and identify exact line ranges

Before editing, capture the current state:

```sh
grep -n 'Skip and see basic results' typestest/src/pages/CheckoutPage.tsx
grep -n 'Credit or debit card' typestest/src/pages/CheckoutPage.tsx
grep -n 'gpayIcon' typestest/src/pages/CheckoutPage.tsx
```

Expected findings (per the PRD citations, line numbers approximate; verify against live file):

- A `<div>` (likely `className="space-y-3"`) containing three `<Button>` elements: Google Pay (with `<img src={gpayIcon} …>`), PayPal, and green "Credit or debit card". PRD §6.1 cites lines 336–344; the plan cites 384–392 — the file may have shifted. Trust the `grep`.
- A "Skip and see basic results" button / link appearing **twice**: once below the payment card (PRD §6.2 cites 360–368 / plan cites 408–416), once in the bottom CTA area (PRD §6.2 cites 478–483).
- A `gpayIcon` import near the top of the file.

Record the exact line numbers in the commit message or PR description so the reviewer can follow along.

### Step 2 — Add the CheckoutForm import

Near the other component/UI imports at the top of CheckoutPage.tsx, add:

```ts
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
```

Do NOT add a duplicate `gpayIcon` import — reuse the existing one. Do NOT remove the `gpayIcon` import (CheckoutForm receives it as a prop from CheckoutPage, so CheckoutPage still owns the import).

### Step 3 — Replace the three-button block

Locate the `<div>` wrapping the three `<Button>` elements (GPay + PayPal + Credit-or-debit-card). Replace the entire wrapper with:

```tsx
<CheckoutForm
  priceLabel={current?.first_sale_price_label ?? pricePlaceholder}
  pricing={current}
  email={session.email}
  gpayIcon={gpayIcon}
/>
```

Where:
- `current` is from `usePricing()` (Module 2 already destructures this in CheckoutPage).
- `pricePlaceholder` is Module 2's existing loading placeholder string (likely `'Pay $---'` or similar — use whatever CheckoutPage currently uses for loading).
- `session` is from `getSession()` or equivalent (Module 1's convention; CheckoutPage already reads `session.email` for other bindings).
- `gpayIcon` is the already-imported asset.

### Step 4 — Remove both "Skip and see basic results" links

1. **First occurrence** (under the payment card, per PRD §6.2): remove the `<div className="text-center pt-2">` wrapper and the `<button>` / `<Link>` / `<Button>` inside that displays "Skip and see basic results". The `pt-2` spacing disappearing is acceptable — the payment card now ends at the ShieldCheck line.

2. **Second occurrence** (in the bottom CTA area, per PRD §6.2 ~lines 478–483): find the second "Skip and see basic results" element and remove it along with any wrapping container that exists solely for it.

Verify:

```sh
grep -n 'Skip and see basic results' typestest/src/pages/CheckoutPage.tsx
```

Expected: zero hits.

### Step 5 — Preserve everything else

Do NOT modify:
- The `<div id="payment-card">` container itself.
- The benefits list (bullet points in the payment card).
- The "Discount Applied!" block.
- The "Total Today:" price block.
- The `<ShieldCheck>` reassurance line (stays below the buttons / CardForm).
- The existing fine-print paragraph below the ShieldCheck line — PRD §4.7 explicitly keeps it as supplementary legal copy.
- The entire left column (features / trust icons).
- `useRedirectGuard('/checkout')`, `usePricing()`, session reads at the top of the component.
- The "Reveal My Type" final CTA at the bottom of the page — PRD §6.3 says it now scrolls to the payment card rather than offering an alternative skip. If its current implementation calls `navigate(next)` to skip elsewhere, change it to a scroll into the payment card (e.g. `document.getElementById('payment-card')?.scrollIntoView({ behavior: 'smooth' })`). If it already scrolls, leave as-is.

### Step 6 — Verify diff shape

Run:

```sh
git diff typestest/src/pages/CheckoutPage.tsx
```

Expected diff:
- `+` one import line (`import { CheckoutForm } …`).
- `-` the three-button `<div>` wrapper (~10 lines).
- `+` the `<CheckoutForm />` mount (~6 lines).
- `-` the first "Skip and see basic results" wrapper (~8 lines).
- `-` the second "Skip and see basic results" element (~3–6 lines depending on wrapper).
- Possibly `~` the final CTA's `onClick` to be a scroll handler (if it was navigating before).

No other changes. If the diff touches any line outside these areas, revert and redo.

### Step 7 — Live dev smoke

Start the dev server with a real `pk_test_…` value in `.env.local`:

```sh
npm run dev
```

Walk the funnel from `/` through email capture and question submission to `/checkout?qid=…`. Observe:

1. The page renders without console errors.
2. The payment card shows:
   - Pricing header (unchanged).
   - Benefits list (unchanged).
   - Total Today: price (unchanged).
   - **New**: consent checkbox above the three buttons.
   - Three buttons: Google Pay pill, PayPal, Credit-or-debit-card — same colours, same order, same sizes as before.
   - Consent unchecked → all three buttons appear disabled.
   - ShieldCheck line below the buttons (unchanged).
   - Fine-print paragraph below (unchanged).
3. Tick consent → PayPal and Credit-or-debit buttons enable; GPay enables only if Chrome has a wallet (else disabled with tooltip).
4. Click the Credit-or-debit button → `<CardElement>` appears between the buttons and the ShieldCheck line.
5. Click the Credit-or-debit button again → `<CardElement>` disappears.
6. No "Skip and see basic results" text anywhere on the page (check below payment card + at the bottom CTA).
7. The Reveal-My-Type / final CTA at the bottom scrolls to the payment card when clicked (not navigating to a skip route).

DevTools Network observations:
- Exactly one `POST /payment/stripe/create-payment-intent` call on mount (Tasks 2 + 5 guarantee this).
- Response returns a `client_secret`.
- No 4xx or 5xx errors.

## Completion criteria (done-when)

- [x] `grep -n 'Skip and see basic results' typestest/src/pages/CheckoutPage.tsx` → zero hits.
- [x] `grep -n 'onClick={() => navigate(next)}' typestest/src/pages/CheckoutPage.tsx` → zero hits in the payment-card area (final CTA scrolls or navigates to the page top; the three payment buttons no longer exist in this file).
- [x] `git diff typestest/src/pages/CheckoutPage.tsx` shows only the changes listed in step 6.
- [x] Visual parity (side-by-side with a pre-Task-06 screenshot): the payment card looks identical to before **except** for the new consent checkbox above the three buttons. Everything outside the three-button area is byte-identical.
- [x] Left column (features / trust icons) untouched.
- [x] All verification commands below pass.
- [ ] Dev-server smoke in step 7 passes all observations. (Deferred to quality assurance / Task 99 live smoke — out of this agent's scope per execution rules.)

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx tsc --noEmit                                   # Zero errors.
npm run lint                                       # Zero errors.
npm run test                                       # Full suite green (Module 1 + 2 + all Module 3 automated tests).
npm run build                                      # Succeeds.
npm run dev                                        # Dev smoke per step 7.
```

## Notes / ambiguities

- **Line-number drift**: the PRD cites specific line numbers (e.g. 336–344) and the plan cites 384–392. Both are snapshots; the file may have shifted by the time this task runs. Trust the `grep` outputs in step 1, not the line numbers.
- **Reveal-My-Type CTA**: if its current `onClick` is `() => navigate(next)`, change it to a scroll handler that targets `#payment-card`. If it already scrolls or does something else benign, leave it.
- **`pricePlaceholder`**: whatever Module 2 uses for the loading state on `first_sale_price_label`. If CheckoutPage currently has an inline string like `'Pay $---'` or `'Pay ...'`, reuse it. If the plan's example `pricePlaceholder` variable doesn't exist, use `current?.first_sale_price_label ?? '---'`.
- **Session reads**: CheckoutPage already reads `session.email` for the "Logged in as…" display (if any) or the billing details passed through to PayPal. Reuse that read; do not introduce a second `getSession()` call just for this prop.
- **Phase 6 is the narrowest commit in Module 3**. Resist scope creep — no consent-copy polish, no final-CTA redesign, no trust-icon tweaks. Those are out-of-module concerns.
- **The `/subscription-policy`, `/terms-conditions`, `/privacy-policy` routes**: if they 404 in dev, that's Open item O8 — flag but do not fix here.
