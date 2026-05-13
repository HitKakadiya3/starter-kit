# Task T99 — Manual acceptance walkthrough (Module 4 cross-sell)

**Phase:** 3 · Manual acceptance
**Work plan task id:** T99
**Size:** N/A (verification only — no code commits)
**Dependencies:** `01-session-and-guard-override.md`, `02-cross-sell-page-integration.md` — both must be committed before this walkthrough runs.

> **This file is a MANUAL CHECKLIST, not a task-executor task.**
> The automated task-executor should NOT pick this up. It exists for a human (PR author + reviewer) to close Module 4's acceptance contract defined in PRD §8. The output is a signed-off checklist attached to the Module 4 PR description, not a commit.

## Purpose / why this task exists

PRD §8 defines **12 acceptance criteria** for Module 4. The T1 guard test closes the guard-override half of AC 4. Every other AC requires at least one live backend round-trip — real confirm endpoint behavior, real `show_cross_sale_page: false` responses, real promo-param propagation, real accept-failure surface. This walkthrough is that verification, mirrored on the pattern Module 3's T99 established.

## PRD anchor

- `docs/prd/module-4-cross-sell.md` §8 — 12 acceptance criteria.
- `docs/prd/module-4-cross-sell.md` §9 — risks & assumptions (flag anything observed that invalidates an assumption).
- `docs/prd/module-4-cross-sell.md` §10 — open items (refresh with resolutions or new flags).
- `docs/plans/module-4-cross-sell.md` "Open Items" section — mirror resolutions back to the plan.

## AC coverage

All 12 PRD §8 ACs — this is the closure sweep.

## Scope

**Files touched:** none. This is a verification-only checklist.

**Artifacts produced:**
- Signed-off checklist attached to the Module 4 PR (or committed as a separate verification note if the team prefers).
- Updates to Open items O1–O4 based on what was observed.

## Prerequisites

1. **`.env.local` configured** with the same backend URL / token / x-host Module 3 used:
   - `VITE_API_BASE_URL=https://api-cellonnexus-dev.project-demo.info/api/v1/`
   - `VITE_API_TOKEN=<dev bearer>`
   - `VITE_X_HOST=16types.ai`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…` (required for funnel completion up to /checkout; Module 4 itself doesn't hit Stripe).
2. **Stripe sandbox card with reusable payment method** — the cross-sale one-click charge uses whatever payment method Stripe stored during first-sale confirm. Use `4242 4242 4242 4242` (non-3DS) in the first-sale checkout to maximize the odds of a successful off-session charge. If the backend's Stripe account doesn't have off-session charging enabled, S1 will fail — that's an R2 / Open item O2 issue, not a frontend bug.
3. **A browser with DevTools** (Chrome recommended) for Network + sessionStorage inspection.
4. **Second profile / incognito** to reset state cleanly between scenarios.
5. **Backend override capability** for S4 (compulsory) and S5 (`show_cross_sale_page: false`) — either a test account configured to return these fields, or a brief network-layer stub (DevTools → Network → Override response) to mutate the `/questions/results` response for exploratory verification. Document which approach was used in the PR body.

## Pre-flight quality gate

Before running scenarios, the full automated suite must be green:

```sh
cd d:/Projects/TestIQ/typestest
npm run lint                  # Zero errors.
npx tsc --noEmit              # Zero errors.
npm run test                  # Full suite passes (Module 1 + 2 + 3 + Module 4's new guard test).
npm run build                 # Succeeds.
```

If any of these fail, return to T1 or T2 and fix before proceeding.

## Scenarios

Each scenario is a one-paragraph procedure followed by the PRD §8 ACs it closes.

### S1 — Accept happy path (non-compulsory, no promo)

Fresh incognito → walk funnel from `/` through email → questions → submit → `/checkout?qid=…` → pay with `4242 4242 4242 4242` → land on `/cross-sell?qid=…`.

Observe before clicking anything:
- The IQ Pro description paragraph shows `just {cross_sale_price_label}` using whatever value the backend supplied (AC 1, Module 2 binding preserved).
- URL: `/cross-sell?qid=<encrypted>` — the `qid` is the encrypted form post-first-sale confirm.
- Skip button: visible.
- Disclaimer: the standard "*You will be charged…" copy.

Click **"Yes, add the IQ test to my order"**. Expect:
- Accept button label changes to `Processing…` (or spinner) and is disabled.
- Skip button also disabled.
- DevTools Network: **exactly one** `POST /payment/cross-sale/payments/confirm` request. Inspect the payload — must match PRD §4.1:
  ```json
  {
    "quiz_result_id": <raw integer>,
    "user_on_iqbooster": "",
    "prc_id": "",
    "pricing_discount": ""
  }
  ```
  (If `prc_id` is a non-empty string and/or `pricing_discount` is an object `{ mdid: "…" }`, that's S6's turf — for S1 ensure session has no promo.)
- Response envelope: `{ meta: { success: true, … }, data: { redirect_page: "..." } }`. `apiPost` strips to `data`. Record the observed shape — if it carries extra fields beyond `redirect_page`, note in O1.
- Navigation: page replaces with `resolveRedirect(response.redirect_page) + '?qid=<raw>'`. Most likely `/details?qid=<raw>` since the backend advances to `CUSTOMER_DETAILS_PAGE` after successful cross-sale confirm. If the response is instead `PAYMENT_FAILED_PAGE` or `THANK_YOU_PAGE`, note — may indicate a different backend flow than assumed.
- sessionStorage (`testiq.session`): `crossSellResolved === true`; `pricingInfo.transactions.cross_sale` still populated (preserved from Module 3 merge); `pricingInfo.cross_sale_compulsory` still `false`.

**Closes:** AC 1, 2, 9 (Accept+Skip both disabled during request), 10 (verified-negative: no promo → empty strings), 11, 12.

### S2 — Accept failure (non-compulsory)

Same setup as S1 up to `/cross-sell?qid=…`. Before clicking Accept, force a backend error. Options:
- Briefly flip network to Offline in DevTools right after clicking Accept — produces a `NetworkError`.
- Or tamper with the request body via DevTools' "Override response" — produces an `ApiError` if the backend returns `meta.success: false`.
- Or, if the backend has a test mode for "payment method not reusable", use that.

Click Accept. Observe:
- Accept button spins briefly, then re-enables (label reverts to "Yes, add the IQ test to my order").
- Inline alert appears above the CTAs with the copy `Card on file couldn't be charged. Please continue without the add-on.`
- Skip button re-enabled and visually promoted (bolder, larger — per PRD §6.2).
- sessionStorage unchanged (`crossSellResolved` still absent / false).

Click Skip now. Observe S3's behavior (skip completes the flow normally).

**Closes:** AC 7, 9.

### S3 — Skip flow + post-skip refresh (non-compulsory)

Fresh incognito → funnel → `/cross-sell?qid=…`. Click **"Skip and get my personality report only"**. Expect:
- **Zero** network calls (DevTools Network shows nothing after the guard's `/questions/results`).
- URL replaces to `/details?qid=<encrypted-or-raw>`.
- sessionStorage: `testiq.session.crossSellResolved === true`.

On `/details`, hit refresh (F5). Expect:
- DevTools Network: the guard fires `POST /questions/results` again. The response includes `redirect_page: "CROSS_SELL_OFFER_PAGE"` (state hasn't advanced — Module 5 isn't wired yet).
- URL: **stays at `/details?qid=…`**. No bounce to `/cross-sell`. This confirms T1's `resolveEffectiveRedirect` override is active.
- Page renders as whatever `/details` renders (likely a stub pre-Module-5).

Close the tab. Reopen `/details?qid=<encrypted>` in a new tab (different tab = new `sessionStorage`). Expect:
- Guard fires `/questions/results` with `qid` from URL.
- Since `sessionStorage.crossSellResolved` is absent in the new tab, the override does NOT fire → guard navigates to `/cross-sell?qid=…`. This is correct behavior: the flag is session-scoped per PRD §4.5.

**Closes:** AC 3, 4, 11, 12.

### S4 — Compulsory cross-sell

Configure the backend (or override the `/questions/results` response) so that `pricing_info.cross_sale_compulsory === true`. Fresh funnel → `/cross-sell?qid=…`. Observe:

- Skip button: **not rendered** (AC 5). The entire `<button>` / link should be absent from the DOM — right-click → Inspect confirms.
- Disclaimer copy: `This add-on is required to continue.` (O3 placeholder).

Click Accept. Force an error (as in S2). Expect:
- Inline alert appears.
- Instead of a Skip button, a **Retry** button (outline variant) appears below the Accept button.
- Click Retry → fires another `POST /payment/cross-sale/payments/confirm` with identical body. (Same duplicate-request concern as O2 — note backend response: 200 or 409.)
- If the retry succeeds, navigation happens as in S1. If it fails again, alert + Retry reappears.

**Closes:** AC 5, 8, 9.

### S5 — `show_cross_sale_page: false` edge

Configure the backend response so that `pricing_info.show_cross_sale_page === false`. Fresh funnel → attempt to navigate to `/cross-sell?qid=…` (or land there naturally if the backend incorrectly redirects you there).

Expect:
- The page does NOT render the card. Brief flash of the `Loading…` state while the guard resolves, then an auto-navigate to `/details?qid=…` (per T2's visibility-gate effect).
- DevTools Network: no `POST /payment/cross-sale/payments/confirm` call.
- sessionStorage: `crossSellResolved` is NOT set (we didn't resolve; we just didn't render).

**Closes:** AC 6.

**Important caveat:** in practice, when `show_cross_sale_page === false`, the Module 1 guard's upstream `redirect_page` from `/questions/results` should already route the user past `/cross-sell`. This scenario exists precisely to defend the "somehow we got here anyway" case (PRD §4.2 step 1). If you can't easily force the backend into this state, a brief DevTools-override of the `/questions/results` response is the cleanest way to reproduce.

### S6 — Promo run (prc_id / mdid propagation)

Fresh incognito → start funnel with `?mdid=50` appended to `/` → complete funnel → `/checkout?qid=…` (Module 3's body should include `mdid` in both create-intent and first-sale confirm) → `/cross-sell?qid=…`.

Observe the `cross_sale_price_label` on the page — may be a discounted value or the same (PRD §9 R3 — unclear whether cross-sale honors the same discount; backend truth).

Click Accept. Observe the `POST /payment/cross-sale/payments/confirm` payload:

```json
{
  "quiz_result_id": <raw>,
  "user_on_iqbooster": "",
  "prc_id": "",
  "pricing_discount": { "mdid": "50" }
}
```

If session's `prcId` was the active param instead of `mdid`, the payload should carry `prc_id: "ABC"` and `pricing_discount: ""`. Run both legs (once with `?mdid=50`, once with `?prc_id=ABC`) to cover both branches.

**Closes:** AC 10.

## AC-to-scenario matrix

| AC | Scenarios | Closed by |
|---|---|---|
| 1 `/cross-sell` renders `cross_sale_price_label` | S1 | T2 (+ Module 2 binding) |
| 2 Accept fires one confirm POST + navigates per `redirect_page` | S1 | T2 |
| 3 Skip makes no API call + sets flag + navigates `/details` | S3 | T2 |
| 4 Post-skip refresh on `/details` doesn't bounce | S3 | T1 + T2 |
| 5 Skip not rendered when compulsory | S4 | T2 |
| 6 `show_cross_sale_page: false` → auto-navigate | S5 | T2 |
| 7 Accept failure → inline alert + Skip promoted | S2 | T2 |
| 8 Compulsory accept failure → Retry button replaces Skip | S4 | T2 |
| 9 Both buttons disabled during in-flight | S1, S2, S4 | T2 |
| 10 Promo params in confirm body | S6 | T2 |
| 11 `pricingInfo.transactions.cross_sale` preserved after accept | S1 (post-success sessionStorage inspect), S3 | T2 |
| 12 URL stays `/cross-sell?qid=…` until navigate; qid preserved onward | S1, S3 | T2 |

## Open items to refresh

Walk PRD §10 + plan "Open Items" and update based on what was observed:

1. **O1 — Cross-sale confirm response envelope.** S1 observed the actual shape. If `data` is exactly `{ redirect_page }`, close O1 with a note. If `data` carries additional fields (e.g. `cross_sale`, `first_sale_usd_price`-analog), widen the response type in T2 and close O1 with the updated shape.
2. **O2 — Backend idempotency on duplicate confirm.** S4's Retry exercise is the primary test. If the second click returns 200 with an identical response, close O2. If 409, add a "treat-409-as-success" branch to `handleAccept` (mirror Module 3 pattern), re-run S4, then close O2.
3. **O3 — Compulsory copy placeholder.** Marketing call. Leave open or close with marketing's approved copy.
4. **O4 — `cross_sale` parity between first-sale response and `/questions/results`.** Passively observed: during S1, inspect `sessionStorage.testiq.session.pricingInfo.transactions.cross_sale` before and after the accept navigation. If the values differ from what the backend returns on subsequent `/questions/results` calls, note the discrepancy. No action required for Module 4; Module 5 may need to reconcile.

## Done-when

- [ ] All 6 scenarios (S1–S6) executed; every PRD §8 AC verified against at least one scenario (use the matrix above as the checklist).
- [ ] Any AC that failed: logged as a bug, linked to the failing Module 4 task, blocking merge.
- [ ] Pre-flight quality gate (lint + tsc + test + build) green.
- [ ] Open items O1–O4 refreshed in the PRD and/or the work plan.
- [ ] PR description contains the signed-off checklist + pasted AC-to-scenario matrix with PASS/FAIL annotations.
- [ ] User review approval obtained.

## Notes

- **S2 and S4 require intentional error induction**. Choose the least invasive method (DevTools offline mode is usually enough for NetworkError; DevTools response override for ApiError). Don't commit any test-hack code.
- **S4 and S5 require backend state your dev account may not have.** If the backend team hasn't wired a compulsory / hidden-page test user, the cleanest path is DevTools' "Override response" on `/questions/results` for a single page load. Document this in the PR.
- **S6 requires either a valid `mdid` or `prc_id` for the dev backend's sandbox.** Use whatever Module 2 / Module 3 used for their promo runs; consistency matters for comparable results.
- **Timebox**: a full pass of S1–S6 against a live backend typically takes 30–45 minutes. Faster than Module 3 because there's no Stripe SDK round-trip per scenario.
- **No commits should land from this task** — only a signed-off PR body. The commit trail for Module 4 stops at T2.
- **Cross-tab / double-click (PRD R5)** is deliberately not in the scenario list — it's flagged as accepted-for-v1 in PRD §9 R5. If you observe spontaneous double-charges during any scenario, that's a new bug, not a Module-4-scope issue.
