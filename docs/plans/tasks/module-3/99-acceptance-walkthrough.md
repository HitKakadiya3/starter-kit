# Task 99 — Manual acceptance walkthrough (cross-cutting + card + GPay + PayPal)

**Phase:** 7 · Manual acceptance
**Work plan task id:** 7.1 (labelled T99 in the work plan's dependency graph)
**Size:** N/A (verification only — no code commits)
**Dependencies:** `01-stripe-sdk-and-env.md`, `02-session-and-use-payment-intent-hook.md`, `03-use-google-pay-hook.md`, `04-card-form-component.md`, `05-checkout-form-wrapper.md`, `06-checkout-page-integration.md` — **every** automated task must be committed before this walkthrough runs.

> **This file is a MANUAL CHECKLIST, not a task-executor task.**
> The automated task-executor should NOT pick this up. It exists for a human (PR author + reviewer) to close Module 3's acceptance contract defined in PRD §8. The output is a signed-off checklist attached to the Module 3 PR description, not a commit.

## Purpose / why this task exists

PRD §8 defines **26 acceptance criteria** in four groups (10 cross-cutting + 7 card + 5 GPay + 4 PayPal). The automated test suites from Tasks 01–06 cover every AC that can be verified with mocked SDKs. The remaining coverage — live Stripe iframe behaviour, real GPay sheet, real PayPal redirect round-trip, real 3DS challenge, real key/mode mismatch, real recovered-intent scenario — requires a running build against a real backend with a real `pk_test_` Stripe key. This walkthrough is that verification.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §8 — 26 acceptance criteria.
- `docs/prd/module-3-first-payment.md` §9 — Risks & assumptions (flag anything observed that invalidates an assumption).
- `docs/prd/module-3-first-payment.md` §10 — Open items (refresh with resolutions or new flags).
- `docs/plans/module-3-first-payment.md` "Open Items" section — mirror resolutions back to the plan.

## AC coverage

All 26 PRD §8 ACs — this is the closure sweep.

## Scope

**Files touched:** none. This is a verification-only checklist.

**Artifacts produced:**
- A signed-off checklist attached to the Module 3 PR (or committed as a separate verification note if the team prefers).
- Updates to Open items O1–O10 based on what was observed.

## Prerequisites

1. **Real `pk_test_` publishable key** paired with the backend's sandbox Stripe account. The user provides this out-of-band; place it in `typestest/.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…` (file is untracked).
2. **Backend dev URL reachable**: `https://api-cellonnexus-dev.project-demo.info/api/v1/` with `x-host: 16types.ai`. Confirm the bearer token in `.env` is current.
3. **Chrome with a configured Google Pay wallet** for the GPay-enabled scenarios (step through `chrome://settings/payments` to confirm).
4. **A sandbox PayPal buyer account** (Stripe test PayPal credentials) for the PayPal redirect scenarios. Stripe's docs provide test PayPal credentials that work when the Stripe account has PayPal enabled.
5. **A non-Chromium browser** (Firefox or Safari without Apple Pay) for the GPay-unavailable scenario.
6. **Stripe test cards** (from Stripe's docs):
   - Success (non-3DS): `4242 4242 4242 4242`
   - 3DS-required: `4000 0027 6000 3184`
   - Declined: `4000 0000 0000 0002`
   - Any future expiry, any CVC, any ZIP.

## Pre-flight quality gate

Before running scenarios, the full automated suite must be green:

```sh
cd d:/Projects/TestIQ/typestest
npm run lint                  # Zero errors.
npx tsc --noEmit              # Zero errors.
npm run test                  # Full suite passes (Module 1 + 2 + 3).
npm run build                 # Succeeds.
```

If any of these fail, return to the relevant Module 3 task and fix before proceeding.

## Scenarios

Each scenario is a one-paragraph procedure followed by the PRD §8 ACs it closes.

### S1 — Organic card success (non-3DS)

Fresh incognito → walk funnel from `/` through email → questions → submit → `/checkout?qid=…`. Tick consent. Click "Credit or debit card" → inline `<CardElement>` appears. Enter `4242 4242 4242 4242`, valid expiry, any CVC, any ZIP. Click Pay. Expect: spinner on Pay button, `/checkout/…` replaced by the `redirect_page` route (e.g. `/cross-sell?qid=…`), DevTools Network shows exactly one `POST /payment/stripe/first-sale/payments/confirm` with `{ payment_intent_id: 'pi_…', quiz_result_id: <raw>, prc_id: '', pricing_discount: '' }` (since no promo) and a 200 response containing `cross_sale`, `redirect_page`, `first_sale_usd_price`. `sessionStorage.funnel.paymentIntent` is cleared; `sessionStorage.funnel.pricingInfo.transactions.cross_sale` is populated.

**Closes:** AC 1, 2, 5 (reverse-verified: consent-gated), 7 (if you refresh between create and Pay, DevTools still shows only one create call), 9, 11, 12, 13, 14, 17 (toggle the card button twice before Pay to verify), AC 3 + 4 in passing.

### S2 — 3DS-required card

Fresh incognito → funnel → `/checkout` → consent → card → `4000 0027 6000 3184`, submit. Stripe's 3DS challenge overlay appears inline inside the `<CardElement>` iframe. Complete the challenge. After challenge, the same Pay-success path as S1 fires. DevTools shows one `confirmCardPayment` resolution (post-3DS), one backend confirm call, then navigate.

**Closes:** AC 15.

### S3 — Declined card

Fresh incognito → funnel → `/checkout` → consent → card → `4000 0000 0000 0002`, submit. Expect: inline error inside the CardForm shows Stripe's decline message (`Your card was declined.` or similar). Pay button re-enables. DevTools shows NO `POST /payment/stripe/first-sale/payments/confirm` call. User can retype the card and resubmit; the existing intent is reused (same `pi_…` id across submissions per Stripe's idempotency).

**Closes:** AC 16.

### S4 — Google Pay success (Chrome with wallet)

Chrome (not incognito, since wallet requires a Google account in the browser profile) → funnel → `/checkout` → consent → the GPay pill button is **enabled** (no tooltip). Click it → native Google Pay sheet appears. Select a payment method → Stripe's `confirmCardPayment` fires with `handleActions: false`. On success, `event.complete('success')` fires (sheet dismisses), then backend confirm fires, then navigate. DevTools shows the right call sequence: `confirmCardPayment` payload contains `payment_method: 'pm_…'`; backend confirm payload contains the same `payment_intent_id`; response same shape as S1.

**Closes:** AC 18 (available: true branch), 19, 20, 21.

### S5 — Google Pay unavailable

Firefox or Safari-without-Apple-Pay → funnel → `/checkout` → consent → the GPay button is rendered but **visibly disabled** with a `title` tooltip reading exactly `Google Pay isn't available in this browser`. Clicking does nothing. PayPal and Credit-or-debit-card buttons are enabled (since consent is ticked).

**Closes:** AC 18 (available: false branch).

### S6 — Google Pay cancellation

Chrome-with-wallet → funnel → `/checkout` → consent → click GPay → sheet appears → close the sheet (user cancel). Expect: `event.complete('fail')` fires implicitly via Stripe's error path (or the sheet simply dismisses without a `paymentmethod` event — in which case no `confirmCardPayment` call fires). The three buttons remain interactable. No backend confirm call.

**Closes:** AC 22.

### S7 — PayPal redirect round-trip success

Any browser → funnel → `/checkout` → consent → click PayPal blue button. Expect: `stripe.confirmPayment` fires with `confirmParams: { return_url: '…/checkout?qid=<encrypted>', payment_method_data: { type: 'paypal' } }` (verify in DevTools Network), browser redirects to Stripe → PayPal's hosted UI. Complete the payment with a sandbox PayPal buyer account. Browser returns to `/checkout?qid=…&payment_intent=pi_…&redirect_status=succeeded&payment_intent_client_secret=cs_…`. CheckoutForm mounts; `usePaymentIntent` detects the URL params, `history.replaceState` strips them (inspect `window.location.href` in console right after mount — only `qid` should remain), `retrievePaymentIntent` returns `succeeded`, `recoveredSucceeded: true` is exposed, CheckoutForm's `useEffect` auto-finalises via backend confirm, navigate fires.

**Closes:** AC 23, 24, 25.

### S8 — PayPal cancellation

Any browser → funnel → `/checkout` → consent → click PayPal → redirect to PayPal → click "Cancel and return to merchant" (or close the popup if Stripe opens PayPal in a popup). Browser returns to `/checkout?qid=…&payment_intent=…&redirect_status=failed` (or similar). `usePaymentIntent` detects `redirect_status=failed`, drops the cache, sets `state: 'error'` with the `last_payment_error.message`. CheckoutForm renders the inline error. No backend confirm call fires.

**Closes:** AC 26.

### S9 — Refresh mid-payment (intent reuse)

Funnel → `/checkout` → let the initial `POST /payment/stripe/create-payment-intent` complete (watch DevTools). Refresh the page. Observe: DevTools Network shows no second `create-payment-intent` call. `sessionStorage.funnel.paymentIntent` is still populated with the same `id` and `clientSecret`. The three buttons render ready.

**Closes:** AC 7.

### S10 — Recovered-succeeded intent (tab close after Stripe success before backend confirm)

Simulation (since reproducing the real race is impractical):
1. In DevTools, after an S1 success but **before** the backend confirm resolves, open the Application tab → Session storage → find the `funnel` key → note the `paymentIntent.id` and `clientSecret`.
2. Temporarily patch `finalizeAfterStripeSuccess` in `usePaymentIntent.ts` to `throw new Error('fake tab close')` right before the `apiPost` call. This simulates "browser died after Stripe success, before backend confirm".
3. Trigger S1 again. The backend confirm fails; `methodError` surfaces.
4. Revert the patch. Close the tab. Reopen `/checkout?qid=…`.
5. Observe: `usePaymentIntent` finds the cached `paymentIntent`, calls `retrievePaymentIntent`, sees `status: 'succeeded'`, exposes `recoveredSucceeded: true`. CheckoutForm auto-finalises, backend confirm fires, navigate fires.
6. Undo the patch (and any commit of it — this is a local hack only, never committed).

**Closes:** AC 8.

### S11 — Promo run (prc_id / mdid propagation)

Funnel with `?mdid=50` appended to the starting URL → complete funnel → `/checkout` with pricing reflecting the promo. Tick consent → click card → enter a test card → Pay. Observe DevTools Network:

- `POST /payment/stripe/create-payment-intent` request body includes `prc_id: '…'` (whatever Module 2 populated) and/or `pricing_discount: { mdid: '50' }`.
- `POST /payment/stripe/first-sale/payments/confirm` request body includes the same `prc_id` + `pricing_discount`.

Repeat with a `?prc_id=…` URL instead — same assertion against both request bodies.

**Closes:** AC 6.

### S12 — Key/mode mismatch (dev-only setup error)

Edit `typestest/.env.local` → swap to a `pk_live_…` key while the backend is still returning `payment_mode: 'sandbox'`. Restart `npm run dev`. Walk funnel to `/checkout`. Observe: on CheckoutForm mount, `console.error` logs the mismatch message and the dev build throws `Error('Stripe key / backend payment_mode mismatch')`. The page crashes to an error boundary (or React's default dev overlay). Restore the `pk_test_` key; dev server runs cleanly.

**Closes:** AC 10.

### S13 — Visual preservation (site-level)

Open a pre-Module-3 screenshot of `/checkout` (capture before starting Task 06 if not already done) and the current build side-by-side. Diff:
- Three buttons: same colours, same heights, same order (GPay pill → PayPal blue → green Credit-or-debit). GPay icon sits inside the pill with the same dimensions.
- Payment card container, benefits list, discount card, "Total Today:" block, ShieldCheck line, fine-print paragraph — byte-identical layout.
- Left column (features / trust icons) untouched.
- **Added**: consent checkbox + legal copy above the three buttons.
- **Removed**: both "Skip and see basic results" links.

**Closes:** AC 3, AC 4.

### S14 — No-pricing-info edge case

Contrived: open DevTools console on `/checkout`, manually delete `session.pricingInfo` via `sessionStorage.setItem('funnel', JSON.stringify({ ...JSON.parse(sessionStorage.getItem('funnel')!), pricingInfo: undefined }))`, remount the page (e.g. hard refresh while the resume guard's `POST /questions/results` is mocked to not return pricingInfo — or just inspect the hook's behaviour via manual state editing in React DevTools). Observe: DevTools Network shows zero `POST /payment/stripe/create-payment-intent` calls. `intent.state` stays `idle`.

**Closes:** AC 5.

## AC-to-scenario matrix

| AC | Scenarios | Closed by (task) |
|---|---|---|
| 1 `/checkout` fires `create-payment-intent` exactly once | S1 (primary), S9, S11 | 02 + 06 |
| 2 Consent required before any button enabled | S1, S4, S7 (consent ticked first) | 05 |
| 3 Three buttons keep existing visuals | S13 | 05 + 06 |
| 4 Both skip links removed | S13 | 06 |
| 5 No intent when `pricingInfo` missing | S14 | 02 |
| 6 Promo code passed through to create + confirm | S11 | 02 + 05 |
| 7 Refresh mid-payment reuses cached intent | S9 | 02 |
| 8 Recovered-succeeded intent auto-finalises | S10 | 02 + 05 |
| 9 `cross_sale` merged into `pricingInfo`; `paymentIntent` cleared | S1 (post-success sessionStorage inspection) | 02 |
| 10 Dev throws on key/mode mismatch | S12 | 01 + 05 |
| 11 Card button reveals inline `<CardForm>` | S1 | 04 + 05 |
| 12 Card Pay disabled until `CardElement.complete` | S1 (partial-card-entry state) | 04 |
| 13 Pay label reads `Pay {first_sale_price_label}` | S1, S11 (promo price) | 04 |
| 14 Non-3DS card → confirm + navigate | S1 | 02 + 04 + 05 |
| 15 3DS card → confirm + navigate | S2 | 04 + 05 |
| 16 Decline → inline message, no confirm | S3 | 04 |
| 17 Second card-button click collapses form | S1 (toggle twice before Pay) | 05 |
| 18 `canMakePayment` gates GPay button | S4 (true branch), S5 (false branch) | 03 + 05 |
| 19 GPay click opens native sheet | S4 | 03 + 05 |
| 20 `paymentmethod` → `confirmCardPayment` | S4 | 03 + 05 |
| 21 Success → `event.complete('success')` + confirm + navigate | S4 | 05 |
| 22 Failure → `event.complete('fail')`, buttons interactable | S6 | 05 |
| 23 PayPal → `stripe.confirmPayment({ payment_method_data: { type: 'paypal' } })` | S7 (initial request) | 05 |
| 24 PayPal redirect + return | S7 | Stripe-side + 05 |
| 25 On return, retrieve + strip + confirm + navigate | S7 | 02 + 05 |
| 26 PayPal cancellation → idle + inline error | S8 | 02 + 05 |

## Open items to refresh

Walk PRD §10 + plan "Open Items" and update based on what was observed:

1. **O1 — Backend confirm idempotency** (PRD §9 R4). If a Retry after backend-confirm-failure (S10-like scenario or S1-then-intentionally-retry) returns 409, add a "treat-409-as-success" branch to `usePaymentIntent.finalizeAfterStripeSuccess`. If it returns 200 with the same response both times, note that confirmation in the PR description and close O1.
2. **O2 — Stripe-side PayPal enabled**. If S7 succeeded, close O2. If `stripe.confirmPayment` errored with "payment method not available", backend/ops needs to enable PayPal on the Stripe account before PayPal scenarios can pass.
3. **O3 — Auto-finalise on return design decision**. If Task 05 found the "hook exposes `recoveredSucceeded` and caller finalises" API awkward in practice, document the observation. If it worked fine, close O3 with a note.
4. **O4 — GPay disabled vs hidden**. Record whether marketing has opinions after observing S5.
5. **O5 — Apple Pay on GPay button**. If the GPay button surfaced Apple Pay on Safari during testing, note it. Intentional per PRD §3; no action.
6. **O6, O7, O8, O9, O10** — observed or unobserved; note in the PR.

## Done-when

- [ ] All 14 scenarios executed; every PRD §8 AC verified against at least one scenario (use the matrix above as the checklist).
- [ ] Any AC that failed: logged as a bug, linked to the failing Module 3 task, blocking merge.
- [ ] Pre-flight quality gate (lint + tsc + test + build) green.
- [ ] Open items O1–O10 refreshed in the PRD and/or the work plan.
- [ ] PR description contains the signed-off checklist + pasted AC-to-scenario matrix with PASS/FAIL annotations.
- [ ] User review approval obtained.

## Notes

- **S10 requires a temporary code patch**; never commit it. Revert and double-check `git status` before the PR goes up.
- **S11 requires a promo-capable test account or URL**. If the backend sandbox doesn't accept the `mdid=50` Module 2 used, pick whatever promo code the backend's sandbox has wired.
- **S12 requires editing `.env.local`**; do not commit it (it's untracked).
- **S13 requires a baseline screenshot** captured before Task 06 was merged. If missing, pull a pre-Task-06 commit locally, screenshot, then re-pull latest.
- **Timebox**: a full pass of S1–S14 against a live backend typically takes 60–90 minutes. Allocate accordingly.
- **No commits should land from this task** — only a signed-off PR body. The commit trail for Module 3 stops at Task 06.
