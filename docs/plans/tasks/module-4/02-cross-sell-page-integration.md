# Task T2 — `CrossSellPage.tsx` accept + skip + visibility gates + error states

**Phase:** 2 · CrossSellPage integration
**Work plan task id:** T2
**Size:** Medium (1 file — `CrossSellPage.tsx`; ~80–130 line diff)
**Dependencies:** `01-session-and-guard-override.md` (T1 must be committed; T2 relies on `session.crossSellResolved` being typed and the guard override being live — otherwise the skip flow would loop).

## Purpose / why this task exists

Today, `CrossSellPage.tsx` has two placeholder handlers that both navigate to `/details?qid=...`. Module 4 replaces them with:

- **Accept:** `POST /payment/cross-sale/payments/confirm` (one-click upsell against the payment method Stripe stored during first-sale confirm) → on success, set `crossSellResolved` and navigate per `response.redirect_page`; on error, inline alert + Accept re-enables + Skip promoted (or Retry in compulsory mode).
- **Skip:** no API call — just `patchSession({ crossSellResolved: true })` + `navigate('/details?qid=...', { replace: true })`.

Plus three visibility gates (PRD §4.2) that defend against edge cases the guard doesn't fully cover: `show_cross_sale_page === false`, `cross_sale_compulsory === true` (no Skip button), and a missing `pricingInfo.transactions.cross_sale` (should never happen post-Module-3 but belt-and-braces).

The existing `usePricing()` binding (Module 2) for `cross_sale_price_label` stays **exactly as-is** — do not touch the description paragraph's price interpolation.

## PRD anchor

- `docs/prd/module-4-cross-sell.md` §4.1 — confirm endpoint request/response shape (verbatim body field list + envelope).
- `docs/prd/module-4-cross-sell.md` §4.2 — three visibility gates.
- `docs/prd/module-4-cross-sell.md` §4.3 — accept flow with in-flight / success / error branches.
- `docs/prd/module-4-cross-sell.md` §4.4 — skip flow (flag + navigate, no API).
- `docs/prd/module-4-cross-sell.md` §5 — end-to-end data flow (sanity-check your code against the diagram before committing).
- `docs/prd/module-4-cross-sell.md` §6.1 — rendering: header banner, description, accept button label, skip button visibility, error slot, disclaimer variants.
- `docs/prd/module-4-cross-sell.md` §6.2 — button state matrix (idle / submitting / error).
- `docs/prd/module-4-cross-sell.md` §6.3 — navigation + state side-effects.
- `docs/prd/module-4-cross-sell.md` §8 — all 12 ACs.

## AC coverage

All 12 PRD §8 ACs, closed jointly with T1's guard override:

| AC | How this task closes it |
|---|---|
| 1 | `cross_sale_price_label` binding (from Module 2) preserved; T99 S1 re-verifies. |
| 2 | Accept fires exactly one `POST /payment/cross-sale/payments/confirm`; navigation uses `resolveRedirect(response.redirect_page) + '?qid=' + qidRaw`. |
| 3 | Skip does not call any API; `patchSession({ crossSellResolved: true })`; navigates to `/details?qid=<encrypted>`. |
| 4 | Guard override (T1) + `crossSellResolved: true` (this task) jointly prevent the post-skip refresh loop. |
| 5 | Skip button is not rendered when `pricingInfo.cross_sale_compulsory === true`. |
| 6 | `show_cross_sale_page === false` triggers auto-navigation without rendering. |
| 7 | Accept failure: inline alert; Accept re-enables; Skip promoted to primary (when not compulsory). |
| 8 | Compulsory accept failure: Retry button replaces the absent Skip; re-triggers confirm. |
| 9 | Both buttons disabled while any request is in flight. |
| 10 | `prc_id` / `pricing_discount` from session included in confirm body when present. |
| 11 | `pricingInfo.transactions.cross_sale` and `.cross_sale_compulsory` not mutated by this file. |
| 12 | URL stays `/cross-sell?qid=<encrypted>` while on page; both navigations carry qid forward. |

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/CrossSellPage.tsx`

**Do NOT touch:**
- `src/hooks/useRedirectGuard.ts` (T1's scope).
- `src/lib/session.ts` (T1's scope).
- `src/hooks/usePricing.ts` (Module 2 shipped).
- `src/lib/redirectRouter.ts` (enum map already correct; we only consume `resolveRedirect`).
- `src/lib/api.ts` (`apiPost`, `ApiError`, `NetworkError` already exported).
- The IQ Pro product card, the hero image (`iqTestPreview`), the header banner copy, the description copy (except possibly the disclaimer variant in compulsory mode — see step 6).
- `src/utils/scoring.ts` (explicit non-goal across all modules).

**Do NOT add:**
- New hooks or helper files — the state machine is small enough to live inline per PRD §7.
- New npm dependencies.
- Any refetch / polling logic — accept is single-shot per PRD §4.3.

## Step-by-step implementation

### 1. Update imports

Current imports include `useNavigate`, `useSearchParams`, `Button`, `useRedirectGuard`, `usePricing`, the `iqTestPreview` asset. Add:

```ts
import { useState, useCallback } from 'react';

import { apiPost, ApiError, NetworkError } from '@/lib/api';
import { resolveRedirect } from '@/lib/redirectRouter';
import { getSession, patchSession } from '@/lib/session';
```

`useState` for the submitting + error state. `useCallback` to keep handler identities stable (small win; fine to inline if you prefer). `apiPost` for the confirm call. `ApiError` / `NetworkError` for branch-specific error messaging if needed (currently both render the same inline alert per PRD §4.3, so a `try { ... } catch (e) { setError(...) }` with a generic message is sufficient).

### 2. Consume the session + pricing + guard in the component body

Keep the existing guard + pricing hooks. Add session-derived values:

```ts
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const qid = searchParams.get('qid');
const ready = useRedirectGuard('/cross-sell');
const { current, isLoading, isError, refetch } = usePricing();

const session = getSession();
const isCompulsory = Boolean(session.pricingInfo?.cross_sale_compulsory);
const hasCrossSaleData = Boolean(session.pricingInfo?.transactions?.cross_sale);
const showCrossSalePage = session.pricingInfo?.show_cross_sale_page !== false;

const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
```

**Read `session` fresh here inside the component body** (each render) rather than once on mount — the guard populates `pricingInfo` asynchronously, so the first render may be pre-guard and the post-`ready` render is when the real pricing info is available.

### 3. Loading branch (unchanged)

Keep the existing `if (!ready) { return <Loading /> }` early return. It covers the window where `useRedirectGuard` is still resolving `/questions/results`.

### 4. Visibility gate — `show_cross_sale_page === false` (PRD §4.2 step 1)

After the `!ready` branch, add:

```tsx
// PRD §4.2 step 1: belt-and-braces. The Module 1 guard should have already
// routed away, but if we somehow reach this page with show_cross_sale_page
// false, bounce once to whatever the server thinks is next (or /details as
// a safe default when pricing_info is stale).
useEffect(() => {
  if (!ready) return;
  if (!showCrossSalePage) {
    navigate(`/details?qid=${encodeURIComponent(qid ?? '')}`, { replace: true });
  }
}, [ready, showCrossSalePage, navigate, qid]);
```

(Add `useEffect` to the `react` import.) Navigating during render is a React warning — use an effect gated on `ready`.

The destination `/details` is the safest default because §4.2 step 1 says "if somehow reach this page with that flag false, re-read `/questions/results` once and navigate per whatever `redirect_page` comes back" — but the guard already just re-read it, and the guard's `resolveEffectiveRedirect` already honored `crossSellResolved`. So `/details` is a sensible terminal for this edge case; revisit if T99 surfaces a counter-example.

### 5. Visibility gate — missing `transactions.cross_sale` (PRD §4.2 step 3)

Add to the same effect (or a second one):

```tsx
useEffect(() => {
  if (!ready) return;
  if (!hasCrossSaleData) {
    navigate(`/details?qid=${encodeURIComponent(qid ?? '')}`, { replace: true });
  }
}, [ready, hasCrossSaleData, navigate, qid]);
```

Merging steps 4 and 5 into one effect with `if (!showCrossSalePage || !hasCrossSaleData)` is equivalent and slightly cleaner.

### 6. Keep the `isError` branch (from Module 2) unchanged

The existing full-page error card (for pricing load failure) stays. It's unrelated to the accept-call error state — `isError` is the pricing hook's error; `submitError` is this task's new state.

### 7. Build the accept handler (PRD §4.3)

Declare **above** the `return`:

```ts
const handleAccept = useCallback(async () => {
  if (submitting) return;
  setSubmitting(true);
  setSubmitError(null);
  try {
    const body = {
      quiz_result_id: session.qidRaw,
      user_on_iqbooster: '', // PRD §4.1 — backend expects this key even empty (Module 3 precedent).
      prc_id: session.prcId ?? '',
      pricing_discount: session.mdid ? { mdid: session.mdid } : '',
    };
    const response = await apiPost<{ redirect_page: string }>(
      'payment/cross-sale/payments/confirm',
      body,
    );
    patchSession({ crossSellResolved: true });
    const next = resolveRedirect(response.redirect_page);
    navigate(`${next}?qid=${encodeURIComponent(session.qidRaw ? String(session.qidRaw) : qid ?? '')}`, { replace: true });
  } catch (e) {
    if (e instanceof ApiError || e instanceof NetworkError) {
      setSubmitError("Card on file couldn't be charged. Please continue without the add-on.");
    } else {
      setSubmitError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
    // Note: we do NOT set submitting=false in the success branch because we're
    // navigating away — the component unmounts.
  }
}, [submitting, session.qidRaw, session.prcId, session.mdid, qid, navigate]);
```

**Inline annotations:**

- `quiz_result_id: session.qidRaw` — the raw integer, per PRD §4.1 and the precedent in `useRedirectGuard` (backend rejects encrypted for this family of endpoints). If `qidRaw` is somehow missing (`undefined`), the backend will reject the body; that's acceptable — the guard should have fixed this earlier.
- `user_on_iqbooster: ''` — literal empty string, per PRD §4.1. Do NOT omit the key (Module 3 learning).
- `pricing_discount: session.mdid ? { mdid: session.mdid } : ''` — matches the Module 1 guard's body shape for `/questions/results`. PRD §4.1 shows the same shape.
- `apiPost<{ redirect_page: string }>` — `apiPost` strips the `{ meta, data }` envelope, so the resolved value is the `data` payload directly. PRD §4.1 documents `data: { redirect_page: string }`. If T99 S1 reveals additional fields, widen the response type; don't add a second envelope unwrap.
- `patchSession({ crossSellResolved: true })` **before** `navigate` — the order matters because `replace: true` unmounts the page immediately; a post-navigate patch might not flush in time.
- `resolveRedirect(response.redirect_page)` — reuses the shared enum map. Unknown values fall to `/checkout` with a `console.warn`, same safety net as elsewhere.
- Error branch: PRD §4.3 specifies one-line copy for the inline alert. The "Something went wrong" fallback is for unexpected throws (TypeError, etc.) that slipped past our two known error classes — not expected in practice but cheap insurance.
- We deliberately do not `setSubmitting(false)` in the success branch — the component unmounts on navigate. Setting false would race with the unmount and might warn about state updates on unmounted components.

### 8. Build the skip handler (PRD §4.4)

```ts
const handleSkip = useCallback(() => {
  if (submitting) return; // prevents double-click when retry is in flight
  patchSession({ crossSellResolved: true });
  const q = session.qidRaw ? String(session.qidRaw) : qid ?? '';
  navigate(`/details?qid=${encodeURIComponent(q)}`, { replace: true });
}, [submitting, session.qidRaw, qid, navigate]);
```

**Zero API calls.** PRD §4.4 is explicit: skip is purely client-side.

The `qid` param prefers `session.qidRaw` (raw integer from the guard's patch), falling back to the URL's `qid` (which the guard also writes raw). In practice both are identical post-guard; belt-and-braces.

### 9. Update the JSX

Above the CTA button row, render the error alert when `submitError` is set:

```tsx
{submitError && (
  <div
    role="alert"
    className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm"
  >
    {submitError}
  </div>
)}
```

(Style classes match the existing shadcn/ui token conventions in this file — `bg-destructive/10`, `border-destructive/30`, `text-destructive`. If the project has a reusable `Alert` component in `components/ui/`, prefer that; otherwise the inline div is sufficient per PRD §6.1 "inline alert above the CTA buttons".)

Update the Accept button:

```tsx
<Button
  variant="hero"
  size="xl"
  className="max-w-sm mx-auto w-full text-base md:text-lg font-bold rounded-full"
  onClick={handleAccept}
  disabled={submitting}
>
  {submitting ? 'Processing…' : 'Yes, add the IQ test to my order'}
</Button>
```

For the Skip button, apply the compulsory gate + error-promoted UX:

```tsx
{!isCompulsory && (
  <button
    onClick={handleSkip}
    disabled={submitting}
    className={`text-sm md:text-base font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors py-2 ${
      submitError ? 'text-base md:text-lg font-bold' : ''
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    Skip and get my personality report only
  </button>
)}

{isCompulsory && submitError && (
  <Button
    variant="outline"
    size="lg"
    className="max-w-sm mx-auto w-full"
    onClick={handleAccept}
    disabled={submitting}
  >
    Retry
  </Button>
)}
```

The "promoted to primary when not compulsory and in error state" visual (PRD §6.2) is approximated by bumping the Skip button's font weight/size when `submitError` is set. If the design system has a stronger primary-CTA visual for the skip text, use it — the point is to make Skip visually dominant when the accept path just failed.

### 10. Disclaimer copy variant for compulsory mode (PRD §6.1)

```tsx
<p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
  {isCompulsory
    ? 'This add-on is required to continue.'
    : '*You will be charged for the add-on services or products selected at the time of purchase.'}
</p>
```

Marketing placeholder per Open item O3 — safe to swap later.

### 11. Self-audit via grep

From `typestest/`:

```sh
grep -n "navigate('/details" src/pages/CrossSellPage.tsx
```

Expected: at most two matches (the visibility-gate effect + the skip handler). **No** match from a placeholder accept handler.

```sh
grep -n 'payment/cross-sale/payments/confirm' src/pages/CrossSellPage.tsx
```

Expected: exactly one match — inside `handleAccept`.

```sh
grep -n 'crossSellResolved' src/pages/CrossSellPage.tsx
```

Expected: exactly two matches — `patchSession({ crossSellResolved: true })` in both handlers. (If you use `patchSession({ crossSellResolved: true });` only once in a shared helper, one match is also acceptable.)

```sh
grep -nE 'user_on_iqbooster' src/pages/CrossSellPage.tsx
```

Expected: exactly one match — literal `user_on_iqbooster: ''` inside the accept body.

```sh
grep -n 'cross_sale_price_label' src/pages/CrossSellPage.tsx
```

Expected: one match — the existing Module 2 binding, unchanged.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — zero errors.
- `npm run lint` — zero new errors.
- `npm run build` — succeeds.
- `npm run test` — full suite green (no regressions).
- `npm run dev` — manual smoke (handed off to T99 for the full scenario sweep).

### Smoke sanity checks (before handing to T99)

1. Complete funnel to `/cross-sell`. Click Accept. DevTools Network: exactly one `POST /payment/cross-sale/payments/confirm` with the body shape from PRD §4.1. On 200, page unmounts and URL changes to whatever `resolveRedirect(response.redirect_page)` resolves.
2. Restart, complete funnel, click Skip. DevTools Network: **zero** requests after the guard's `/questions/results`. Session storage key `testiq.session` has `crossSellResolved: true`. URL changes to `/details?qid=...`.
3. Refresh `/details?qid=...` after step 2. URL stays at `/details`. No bounce back to `/cross-sell`. (This proves T1's guard override is working end-to-end.)

## Done-when

- Accept handler posts to `payment/cross-sale/payments/confirm` with body `{ quiz_result_id, user_on_iqbooster: '', prc_id, pricing_discount }` sourced from session; on success `patchSession({ crossSellResolved: true })` then `navigate` per `resolveRedirect(response.redirect_page)` with `qid` preserved.
- Skip handler is API-free; sets `crossSellResolved: true`; navigates to `/details?qid=<qid>` with `replace: true`.
- Three visibility gates: `show_cross_sale_page === false`, `cross_sale_compulsory === true`, missing `transactions.cross_sale` — all wired per PRD §4.2.
- Error state: inline alert above CTAs on `ApiError`/`NetworkError`; Accept re-enables; Skip promoted (when not compulsory) or Retry button replaces it (when compulsory).
- Buttons disabled while `submitting` (covers double-click, covers Skip during Retry).
- `cross_sale_price_label` binding (Module 2) untouched.
- `useRedirectGuard('/cross-sell')` mount (Module 1) untouched.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` all green.
- `git diff --stat` shows `src/pages/CrossSellPage.tsx` as the only changed file in this commit.

## Notes / ambiguities

- **Why no new test file?** The page is thin integration glue over already-tested primitives (`apiPost`, `usePricing`, `useRedirectGuard`, `getSession`/`patchSession`). Module 1/2/3 all landed their page-level changes without page-level RTL tests; Module 4 follows the same precedent. If T99 surfaces specific regressions, add a targeted test in a follow-up — don't write one speculatively.
- **Why `replace: true` on both accept and skip navigations?** PRD §6.3 and §4.4 both specify it. Replace semantics prevent the user from using the browser back button to return to `/cross-sell` after resolving it (the guard would bounce them to `/details` anyway, but the UX is cleaner without the back-stack entry).
- **`pricing_discount` body value.** Module 1's guard writes `session.mdid ? { mdid: session.mdid } : ''` — a string (empty) or an object. The backend evidently accepts this union. Mirror the shape exactly to stay consistent with Module 1 / 3 precedent. If T99 reveals the confirm endpoint rejects the empty-string form, swap to `null` or omit — but don't guess.
- **`pricingInfo.transactions.cross_sale` typing.** The current `PricingInfo` interface in `src/lib/apiTypes.ts` has an index signature; `transactions?.cross_sale` may resolve as `unknown`. Use `Boolean(session.pricingInfo?.transactions?.cross_sale)` to coerce safely; narrow only if TypeScript complains.
- **`show_cross_sale_page` default semantics.** PRD §9 R6 notes this field is only present post-submit. Our check uses `!== false` (treat absent as "show") to avoid blocking the page when the field isn't present — matches the guard's defensive posture.
- **Visual polish for the "promoted to primary" skip button** is a judgment call — PRD §6.2 describes the state but doesn't specify exact styles. The minimal change (bump font-weight + size when `submitError`) communicates the state without forcing a full button redesign; tighten in a follow-up if design pushes back.
- **Retry reuses `handleAccept`.** There's no separate "retry endpoint" — retry is just another attempt at the same confirm POST. The backend should idempotency-guard this (Open item O2); if it doesn't, T99 will surface a duplicate-call issue and we'll add a 409-as-success branch (Module 3 precedent).
- **Do NOT re-merge the response's `cross_sale` block into session.** Module 3's `finalizeAfterStripeSuccess` already populated `pricingInfo.transactions.cross_sale` + `pricingInfo.cross_sale_compulsory` before the user reached `/cross-sell`. The cross-sale confirm response's `redirect_page` is the only field we consume here. Touching `pricingInfo` would violate AC 11.
