# Task 99 — AC walkthrough + dual-scenario QA sweep

**Phase:** 4 · Quality Assurance
**Work plan task id:** 4.1
**Size:** N/A (verification only — no code)
**Dependencies:** `01-pricing-constants-and-type.md`, `02-use-pricing-hook.md`, `03-pricing-page-bindings.md`, `04-checkout-page-bindings.md`, `05-cross-sell-page-binding.md` — all implementation tasks must be committed before this sweep runs.

> **This file is a MANUAL CHECKLIST, not a task-executor task.**
> The automated task-executor should NOT pick this up. It exists to give a human (PR author + reviewer) a single walkthrough page for closing the Module 2 acceptance contract defined in PRD §8. The output of this walkthrough is a signed-off checklist attached to the Module 2 PR description, not a commit.

## Purpose / why this task exists

PRD §8 defines 12 acceptance criteria. Each is claimed by one or more implementation tasks, but the contract is only considered closed when all 12 are observed holistically against a single running build, in both funnel scenarios (organic and campaign). This walkthrough is that observation. It doubles as the handoff artifact from Module 2 to Module 3.

## PRD anchor

- `docs/prd/module-2-pricing-display.md` §8 — 12 acceptance criteria.
- `docs/prd/module-2-pricing-display.md` §9 — Risks & assumptions (flag anything observed that invalidates an assumption).
- `docs/prd/module-2-pricing-display.md` §10 — Open items (refresh with anything new).
- `docs/plans/module-2-pricing-display.md` "Open Items" section — mirror resolutions back to the plan.

## AC coverage

All 12 PRD §8 ACs — this is the closure sweep.

## Scope

**Files touched:** none. This is a verification-only checklist.

**Artifacts produced:**
- A completed copy of the checklist below, pasted into the Module 2 PR description or into `docs/plans/module-2-pricing-display.md` under "Progress Tracking · Phase 4 · Notes".
- A refreshed "Open Items" list in the work plan, reflecting anything discovered.

## Pre-walkthrough setup

1. Confirm all implementation tasks (01–05) have landed on the branch:
   - `git log --oneline` should show five commits corresponding to tasks 01, 02, 03, 04, 05.
2. From `d:/Projects/TestIQ/typestest/`:
   - `npm install` (fresh).
   - Confirm `.env` is populated with live `VITE_API_TOKEN` and `VITE_X_HOST` (same credentials Module 1 used).
   - `npm run lint` — zero errors.
   - `npx tsc --noEmit` — zero errors.
   - `npm run test` — all unit tests pass (including the 8 new cases in `usePricing.test.tsx`).
   - `npm run build` — succeeds.
3. Open `http://localhost:8080/` in a fresh incognito window with DevTools → Network tab visible. Keep the Application tab (`sessionStorage` → `testiq.session`) open in a second panel for cross-reference.

## Scenarios

Each AC is verified under one or both of:

- **Organic** — Fresh incognito tab, no campaign params. Full funnel from `/` through `/cross-sell`.
- **Campaign** — Fresh incognito tab, landing URL `http://localhost:8080/?mdid=50`. Full funnel through `/cross-sell`.

Run the organic pass first end-to-end, then repeat for campaign. Mark each AC row in the table below as walk-through progresses.

## Acceptance checklist (PRD §8)

| # | AC | Scenario | How to verify | Closed by task | Result |
|---|---|---|---|---|---|
| 1 | `/pricing` fires `POST /price`; labels match response | Organic | Load `/pricing` in fresh tab. DevTools Network → one `POST /price` with body `{}`. Price strings in the blurb (`{first_sale_price_label} today`, `{subscription_price_label} billed every 28 days`) and the add-on card (`{cross_sale_price_label}`) match the response's fields. | 03 | ☐ |
| 2 | `?prc_id=ABC` or `?mdid=50` → two `POST /price` calls; discounted value is primary | Campaign | Load `/pricing?mdid=50`. DevTools → **two** `POST /price` requests: one with `{}`, one with `pricing_discount: { mdid: "50" }`. The discounted value renders as the primary number in the blurb. URL bar reads `/pricing` after boot (Module 1 strips `mdid`). | 03 (+ 02 for the two-query machinery) | ☐ |
| 3 | Price cached: `/pricing` → `/` → `/pricing` no re-trigger | Both | From `/pricing`, click the logo or site header to go home. Then navigate back to `/pricing` (via nav or URL). DevTools Network filter: no new `POST /price` call fires on the second visit. | 02 (React Query `staleTime: Infinity`) + 03 | ☐ |
| 4 | `/checkout` renders `first_sale_price_label` from session with no extra `POST /price` | Both | Complete the funnel to `/checkout?qid=…`. DevTools Network (filter `price`): zero `POST /price` calls after `/email` submits. The Total Today number matches `session.pricingInfo.first_sale_price_label` (inspect via Application → sessionStorage → `testiq.session`). | 02 (post-submit branch) + 04 | ☐ |
| 5 | `/checkout` with promo → strikethrough + integer savings% | Campaign | After campaign funnel reaches `/checkout`, verify: strikethrough anchor visible showing `strikethrough.first_sale_price_label`; "Discount Applied!" card visible with `You're saving N%` where N is `Math.round((1 - parseFloat(current.first_sale_price) / parseFloat(strikethrough.first_sale_price)) * 100)` computed by hand against the session values. ⚠ **See Notes below** — post-submit strikethrough source is a known open question. | 04 | ☐ |
| 6 | `/checkout` without promo → no strikethrough, no savings card | Organic | On organic `/checkout`, confirm: no strikethrough `<span>` in the DOM; no "Discount Applied!" card. Total Today renders alone. | 04 | ☐ |
| 7 | `/cross-sell` renders `cross_sale_price_label` in IQ Pro paragraph | Both | On `/cross-sell`, locate the description paragraph. The price in `"for just {X}"` matches `session.pricingInfo.cross_sale_price_label`. No `$9.99` anywhere on the page. | 05 | ☐ |
| 8 | Pre-submit `/price` failure → retryable error card, no stale/fallback prices | Organic | DevTools → Network → right-click any `POST /price` → Block request URL. Reload `/pricing`. The full-page error card renders with the copy `"Couldn't load pricing. Please try again."` and a Retry button. Click Retry with block still on — card persists. Unblock, click Retry — prices render. No hardcoded fallbacks ever visible. | 02 (`isError`) + 03 | ☐ |
| 9 | Post-submit pricing failure → guard's retry path surfaces, no stale prices | Organic | On `/checkout`, DevTools → block `POST /questions/results` → hard refresh. The Module 1 guard's `.catch(() => navigate('/'))` routes the user back to `/`. No stale price text flashes on `/checkout` before the redirect. Repeat on `/cross-sell`. | Module 1 guard + 04 + 05 (no stale rendering) | ☐ |
| 10 | Refreshing any price-bearing page preserves displayed prices | Both | On `/pricing`, F5 → same price strings render (React Query cache hit OR a second fetch returning the same values; either is acceptable). On `/checkout?qid=…`, F5 → same prices render (guard re-runs, `session.pricingInfo` refreshed with the same values). On `/cross-sell?qid=…`, F5 → same `cross_sale_price_label`. | 02 (cache) + Module 1 guard | ☐ |
| 11 | Both `prcId` and `mdid` set → prefer `mdid` and warn | Defensive (not naturally reachable) | **Unit-test verified in Task 02** (`usePricing.test.tsx` case 7). Manual reproduction is awkward because Module 1 strips both from the URL if both arrive, and writes only `mdid` to session. To force-test: open DevTools console on `/pricing`, run `JSON.parse(sessionStorage['testiq.session'])`, edit the object to add `prcId: "X"` alongside `mdid`, `sessionStorage.setItem('testiq.session', JSON.stringify(...))`, then reload. Console should log `[usePricing] both prcId and mdid set; preferring mdid` exactly once. | 02 unit test (defensive branch) | ☐ |
| 12 | `DEFAULT_SUBSCRIPTION_DAYS` + `TRIAL_DAYS` are the only hardcoded durations/prices on price-bearing pages | Both | Run from `typestest/`: `grep -rnE '(\$[0-9]+\.[0-9]+\|28 days\|7.day\|4 weeks\|87%)' src/pages/PricingPage.tsx src/pages/CheckoutPage.tsx src/pages/CrossSellPage.tsx`. Expected output: only template-literal occurrences inside `${DEFAULT_SUBSCRIPTION_DAYS}` or `${TRIAL_DAYS}` expressions. No raw `$X.XX`, no raw `"28 days"`, no raw `"4 weeks"`, no raw `"87%"`. | 03, 04, 05 | ☐ |

## Quality gates (all must be green)

- ☐ `npm run lint` — zero errors.
- ☐ `npx tsc --noEmit` — zero errors.
- ☐ `npm run test` — all tests pass (including the 8 `usePricing` tests).
- ☐ `npm run build` — succeeds.

## Post-walkthrough

1. Paste the completed checklist into the Module 2 PR description.
2. Refresh the "Open Items" list in `docs/plans/module-2-pricing-display.md` based on this walkthrough:
   - **O1** (backend pricing variance) — if observed, note; otherwise close with "confirmed stable within session".
   - **O2** (invalid `prc_id` / `mdid` error shape) — test with `?prc_id=DEFINITELY_NOT_VALID`. Record whether backend returns 4xx or silently falls through. Close or escalate accordingly.
   - **O3** (marketing/legal sign-off on option-3 strikethrough) — already confirmed; no action.
   - **Envelope shape for `POST /price`** — confirm the code comment in `usePricing.ts` matches what was observed during walkthrough. If it doesn't, fix the hook and re-verify.
   - **`iq_booster_validity` / dynamic trial length** — backend still returns `null`? Keep static.
   - **R3 — savings rounding** — observed any awkward rounding (e.g. `12.5% → 13%`)? Flag for marketing if noticed.
   - **Cross-sell visibility fields** — still unused in Module 2 as planned.
   - **Post-submit strikethrough on `/checkout`** (see AC 5 note below) — record resolution.
3. Obtain user review approval per work plan Phase 4 completion criteria.

## Done-when (for the human running this sweep)

- All 12 AC rows in the table above marked ☑.
- All 4 quality gates green.
- Open Items list refreshed.
- User review approval obtained on the PR.

## Notes / ambiguities

- **This is a manual checklist — the task-executor should not pick it up.** It is intentionally numbered `99-` to sit outside the executor's numeric sequence. If the executor does attempt to run it, the first instruction is "no code — verification only".

- **AC 5 — post-submit strikethrough source is an open question.** `session.pricingInfo` holds only the current (possibly promo-discounted) prices; it does not carry a base-price snapshot. The `usePricing` post-submit branch therefore returns `strikethrough: undefined` on `/checkout`, which means the strikethrough anchor **will not render** there even when the funnel started with a campaign param. PRD §6.2 describes the strikethrough as visible on `/checkout` with a promo, but PRD §4.3 forbids a second pricing fetch on this page. Resolution options to discuss with the user during this sweep:
  1. Accept that the strikethrough only appears on `/pricing` (the pre-submit page), not `/checkout`. AC 5 is then satisfied end-to-end on `/pricing` only.
  2. Have `session.pricingInfo` carry a `base_pricing_info` snapshot from the initial `POST /price` call on `/pricing` (adds complexity in Module 1 session shape; out of Module 2 scope).
  3. Add a single `POST /price` base call on `/checkout` when a promo is active (violates PRD §4.3).
  Do **not** silently pick option 2 or 3 during this sweep. Flag to the user and park.

- **AC 11 is not naturally reachable.** Module 1's `captureCampaignParams` explicitly drops `prcId` when both arrive, so session never carries both. The unit test in Task 02 is the primary closure artifact. Manual reproduction via DevTools session editing is possible and worth doing once as a belt-and-braces check.

- **AC 9 depends on Module 1 guard behavior.** This task does not introduce new guard logic. If the guard's error UX is unsatisfactory (e.g. silently bounces to `/` without a toast), that is a Module 1 polish item, not a Module 2 regression — note in Open Items but do not block Module 2 closure on it.

- **Envelope empirical check.** When Task 02 landed, the hook author recorded the observed `POST /price` envelope shape in a code comment. During this sweep, spot-check that comment against live DevTools Network output. If the shape has shifted (or the comment is absent), flag and fix the hook — then re-run the full sweep from AC 1.

- **Live-integration learnings from Module 1 that bear on this sweep:**
  - `apiPost` returns `data` from `{ meta, data }`. If `POST /price` wraps further, Task 02's hook should already unwrap it — but this is the place to empirically reconfirm.
  - `session.pricingInfo` is refreshed on every post-submit page mount by `useRedirectGuard`. The hook's post-submit branch reads this value synchronously without firing a new request.
  - `session.qidRaw` (the raw integer `quiz_result_id`), **not** `session.qidEncrypted`, is what the hook checks to decide post-submit vs. pre-submit. `qidEncrypted` is reserved for Module 5's `/customer/thankyou` call.
