# Module 5 — Customer Details & Report · PRD

**Parent scope:** [../scope.md](../scope.md) · **Depends on:** [module-1-load-questions.md](./module-1-load-questions.md), [module-2-pricing-display.md](./module-2-pricing-display.md), [module-3-first-payment.md](./module-3-first-payment.md), [module-4-cross-sell.md](./module-4-cross-sell.md) · **Status:** Partially live (DetailsPage wired; Report placeholder) · **Last updated:** 2026-04-23

## 1. Overview

Module 5 covers the last two funnel steps:

1. **DetailsPage** — collects first name, last name, age, and (fallback) gender, PUTs them to `/customer/update`, and advances to the report.
2. **PremiumReportPage** — `/results` (aliased to `/premium-report`). Currently renders a `ReportComingSoon` placeholder when the user lands with a `qid`-only URL. The full report UI continues to work via the legacy `location.state.scores` dev path so local previews still render.

The DetailsPage integration is **live**. The report integration is **deferred** pending a scoring-ownership decision (see §9) — once we decide whether the backend returns `personality_type` / `report_file_url` via `POST /customer/thankyou` or we keep client-side scoring, the placeholder becomes the real report.

**Pages:** DetailsPage, PremiumReportPage
**Backend endpoints:**
- `PUT /customer/update` — live.
- `POST /customer/thankyou` — **deferred** (docs say it requires the encrypted `qid`; we cache `session.qidEncrypted` for this).
- `POST /questions/results` — consumed via `useRedirectGuard` (Module 1).

**Success definition (DetailsPage, live):** A user on `/details?qid=…` submits first/last name + age (+ gender if not already captured) and is navigated to the next step — normally `/results`. Refresh mid-flow never bounces them backwards.
**Success definition (Report, deferred):** A user lands on `/results?qid=…`, sees their personality report (or a clearly-labelled placeholder until full integration lands).

## 2. In scope (this module, as shipped)

- `PUT /customer/update` integration on DetailsPage, including `first_name`, `last_name`, `age`, `gender`, `email`, and `quiz_result_id`.
- Gender fallback: InstructionsPage writes `user_gender` to `localStorage`. DetailsPage hides the gender select when that value is present and shows it (required) when the user cleared storage mid-funnel.
- `customerUpdateSubmitted` session flag + guard override — prevents the resume guard from looping `CUSTOMER_DETAILS_PAGE` back to `/details` after submission (§4.3).
- URL carries the **raw integer** `qid`; navigation uses `withPromoParams()` so promo params survive the round-trip.
- Inline error surface on submit failure (API + network).
- Loading overlay: "Generating your personality report…" full-screen spinner while the PUT is in flight.
- Results page placeholder (`ReportComingSoon`) while the full integration is deferred.

## 3. Out of scope (deferred to a later ticket)

> **Update (2026-04-29):** `POST /customer/thankyou` integration is now wired — see [`docs/plans/module-5-thankyou-report.md`](../plans/module-5-thankyou-report.md). Acceptance criteria 15–22 below cover the live report path.

- `POST /questions/results` as the data source for the report body (backend currently returns per-type metadata via an unrelated shape; client-side scoring in `src/utils/scoring.ts` is preserved intact so we can still render locally when needed).
- Server-rendered PDF at `report_file_url` (if the backend adopts this pattern).
- Report-level tracking / share / email-the-report actions.

## 4. Architecture

### 4.1 `PUT /customer/update`

Request body:

```ts
PUT /customer/update
{
  email: session.email,
  quiz_result_id: session.qidRaw,    // raw integer, per Module 1 convention
  first_name: string,                // trimmed, required
  last_name: string,                 // trimmed, required
  age: string,                       // "18".."100" from the native select
  gender: "male" | "female",         // from localStorage['user_gender'] OR the fallback select
}
```

Response body:

```ts
{
  redirect_page: string,             // next route enum, typically THANK_YOU_PAGE
  quiz_result_id: number,            // backend may rotate — we re-persist
  encrypted_quiz_result_id: string,  // re-persist for future /customer/thankyou
}
```

On success, DetailsPage:

1. `patchSession({ qidRaw, qidEncrypted, customerUpdateSubmitted: true })` — the new qids cover edge cases where the backend rotates the identifier after the update, and the `customerUpdateSubmitted` flag is what stops the guard from looping (§4.3).
2. `navigate(withPromoParams(\`${resolveRedirect(response.redirect_page)}?qid=${response.quiz_result_id}\`), { replace: true })`.

### 4.2 Gender fallback

`InstructionsPage` collects the user's gender and stores it in `localStorage['user_gender']` before navigating into the quiz. DetailsPage:

- Reads that value into local state on mount.
- Hides the gender select when `localStorage['user_gender']` is present.
- Renders a required `<select>` with Male / Female when the storage value is missing (user cleared storage, used a different browser tab, opened a link in an incognito window, etc.) — this keeps the flow unblocked instead of bouncing back to InstructionsPage.
- Submit is blocked with the inline error "Please select a gender to continue." if the fallback select is visible and empty.

This is a defensive, local-only behaviour; the backend sees `gender` the same way regardless of whether it came from localStorage or the fallback select.

### 4.3 `customerUpdateSubmitted` session flag + guard override

**The problem:** after `PUT /customer/update` succeeds, `POST /questions/results` continues to return `redirect_page: CUSTOMER_DETAILS_PAGE` until the next state-advancing action (ostensibly `POST /customer/thankyou`, not yet integrated). A refresh on `/results` would see `CUSTOMER_DETAILS_PAGE` and bounce back to `/details` — same shape as the Module 4 problem.

**The fix:** a session flag `customerUpdateSubmitted` set to `true` on successful update. `useRedirectGuard`'s `resolveEffectiveRedirect` helper (introduced in Module 4, extended here) overrides the stale value:

```ts
// src/hooks/useRedirectGuard.ts
function resolveEffectiveRedirect(serverRedirect, session): string | undefined {
  if (serverRedirect === "CROSS_SELL_OFFER_PAGE" && session.crossSellResolved) {
    return "CUSTOMER_DETAILS_PAGE";    // Module 4
  }
  if (serverRedirect === "CUSTOMER_DETAILS_PAGE" && session.customerUpdateSubmitted) {
    return "THANK_YOU_PAGE";           // Module 5
  }
  return serverRedirect;
}
```

**Lifecycle:**
- Written to `true` on successful `PUT /customer/update`.
- Reset to `undefined` by `EmailCapturePage` when a new `qidRaw` is persisted (see Module 1 §6.5) so a fresh quiz in the same tab doesn't inherit the previous run's override.
- Cleared by `clearSession()`.

When `POST /customer/thankyou` is wired later and the backend genuinely advances state, the flag remains harmless — the override only fires when the server redirect is the stale value.

### 4.4 PremiumReportPage current behaviour (placeholder)

```
/results?qid=… (no location.state.scores)
  ↓
useRedirectGuard('/results') runs
  → POST /questions/results → redirect_page
  → if redirect_page === 'THANK_YOU_PAGE' (direct or via customerUpdateSubmitted override) → render
  → otherwise → navigate to the resolved route
  ↓
ready === true → render <ReportComingSoon qid={qid} />
```

The placeholder is intentional: the guard proves the user is authorised to be there (quiz submitted, payment made, customer updated), shows their `qid` so support can look up state, and communicates "report is on the way" without failing.

**Dev-only bypass:** if `/results` is entered with `location.state.scores` (as the `/quiz → /calculating → /email → /results` old path used to), the guard is skipped and the full `<ReportContent>` renders from client-side scoring. This path is preserved so local MBTI previews work without a live backend qid.

### 4.5 Session model

Session additions (already in place as of Modules 1–4):

```ts
interface FunnelSession {
  // …
  customerUpdateSubmitted?: boolean;  // NEW in Module 5 (shape already reserved by scope)
  qidEncrypted?: string;              // used by /customer/thankyou (deferred)
}
```

No new session fields introduced by Module 5 beyond what was reserved in scope.

## 5. Data flow

```
/details mount
  ↓
useRedirectGuard('/details') → POST /questions/results
  if redirect_page === 'CUSTOMER_DETAILS_PAGE' (or CROSS_SELL via crossSellResolved override) → render form
  otherwise → navigate to resolved route
  ↓
User fills form → submit
  ↓
PUT /customer/update
  ├─ success:
  │    patchSession({ qidRaw, qidEncrypted, customerUpdateSubmitted: true })
  │    navigate(withPromoParams(`${resolveRedirect(redirect_page)}?qid=${qidRaw}`), { replace: true })
  └─ error: inline alert, form stays editable.

/results mount (qid-only, no state.scores)
  ↓
useRedirectGuard('/results') → POST /questions/results
  if redirect_page === 'CUSTOMER_DETAILS_PAGE' && customerUpdateSubmitted → override to THANK_YOU_PAGE → render
  if redirect_page === 'THANK_YOU_PAGE' → render
  otherwise → navigate to resolved route
  ↓
ready === true → <ReportComingSoon qid={qid} /> (deferred full report)
```

## 6. Per-page PRD

### 6.1 DetailsPage

Existing layout preserved. Specific changes:

| Element | Current | Behaviour |
|---|---|---|
| First / Last name inputs | `<Input required>` | Preserved; trimmed on submit. |
| Age select | 18–100 | Preserved; required. |
| Gender select | Conditional | Rendered only when `localStorage['user_gender']` is absent. Required in that case. |
| Submit button | "Generate report" | Triggers PUT. Loading spinner replaces the whole viewport during the call (not just the button — the page is mid-navigation and swapping to a spinner reassures the user). |
| Error alert | New | Inline below the form fields, rendered only on submit failure. |

Loading UI during submission is a full-screen overlay with "Generating your personality report…" — same pattern as CalculatingPage, reused for consistency.

### 6.2 PremiumReportPage (current)

- `/results` and `/premium-report` both render this page (route alias preserved from pre-module baseline).
- `qid` + no `state.scores` → guard + placeholder.
- `state.scores` → bypass guard + full `<ReportContent>` render from client-side scoring (preserved from earlier modules).

No changes to the 12-section premium report layout itself — that UI is fully built and waiting for real data.

## 7. Changes to existing code (as shipped)

| File | Change |
|---|---|
| [typestest/src/pages/DetailsPage.tsx](typestest/src/pages/DetailsPage.tsx) | Wire `PUT /customer/update`; mount resume guard; gender fallback; inline error + loading overlay; set `customerUpdateSubmitted` and `replace`-navigate via `withPromoParams`. |
| [typestest/src/pages/PremiumReportPage.tsx](typestest/src/pages/PremiumReportPage.tsx) | Split into `ReportContent` (dev path with `state.scores`) and `ReportGuardedPlaceholder` (production path with `?qid=…`). `ReportComingSoon` placeholder rendered until full integration. |
| [typestest/src/hooks/useRedirectGuard.ts](typestest/src/hooks/useRedirectGuard.ts) | Extend `resolveEffectiveRedirect` with `CUSTOMER_DETAILS_PAGE → THANK_YOU_PAGE` override when `session.customerUpdateSubmitted` is true. |
| [typestest/src/lib/session.ts](typestest/src/lib/session.ts) | Add `customerUpdateSubmitted?: boolean` to `FunnelSession`. Reset by `EmailCapturePage` on new `qidRaw`. |
| [typestest/src/pages/EmailCapturePage.tsx](typestest/src/pages/EmailCapturePage.tsx) | When setting the new `qidRaw` after `/questions/submit`, also reset `customerUpdateSubmitted` (alongside `crossSellResolved`, `paymentIntent`) so fresh quizzes don't inherit stale overrides. |

**Files added:** none — Module 5 extends existing files rather than introducing new hooks/components.

## 8. Acceptance criteria

### DetailsPage (live)

1. `/details?qid=…` on fresh session runs the resume guard first; mis-matching state navigates away before the form renders.
2. Submit triggers exactly one `PUT /customer/update` with `email`, `quiz_result_id: qidRaw`, `first_name`, `last_name`, `age`, `gender`.
3. On success, session is patched with the returned `quiz_result_id` / `encrypted_quiz_result_id` and `customerUpdateSubmitted: true`.
4. Navigation on success goes to `withPromoParams(\`${resolveRedirect(redirect_page)}?qid=${quiz_result_id}\`)` with `replace: true`.
5. After submit → refresh `/results?qid=…` → the resume guard does **not** bounce back to `/details` thanks to the `customerUpdateSubmitted` override.
6. On API error, an inline alert is rendered; form stays editable; no navigation happens.
7. On network error, a clear "Network error. Check your connection and try again." alert is shown.
8. Gender select is hidden when `localStorage['user_gender']` is present; shown (required) when it is absent.
9. While the PUT is in flight, a full-screen "Generating your personality report…" overlay replaces the form.
10. Active promo params (`prc_id` / `mdid`, both supported) are forwarded onto the post-submit navigate URL via `withPromoParams`.
11. Starting a new quiz in the same tab clears `session.customerUpdateSubmitted` so the previous run's override doesn't apply to the new funnel.

### PremiumReportPage (placeholder)

12. `/results?qid=…` with no `location.state.scores` runs the resume guard and renders `<ReportComingSoon qid={qid} />` when the guard settles.
13. `/results` entered from the dev path (with `location.state.scores`) skips the guard and renders the full 12-section `<ReportContent>`.
14. `/premium-report` route alias still resolves to the same component (preserved).

### PremiumReportPage (live)

Per [`docs/plans/module-5-thankyou-report.md`](../plans/module-5-thankyou-report.md):

15. `/results?qid=…` (no `state.scores`) lands → resume guard runs → exactly one `POST /customer/thankyou` is made with body `{ quiz_result_id: session.qidEncrypted, old_quiz_id: "" }`.
16. While the call is in flight, the full-screen "Generating your personality report…" spinner replaces the placeholder (reuses `details.generating` copy and the DetailsPage spinner SVG verbatim).
17. On success, `<ReportContent>` renders with API-driven values: `personalityType` drives `getPremiumTypeData(type)` and avatar resolution; the stress marker dot's inline `style.left` equals `${stressMarker}%` (clamped 2–98); the social battery shows `${socialBattery}%` and bar width.
18. On `ApiError` or `NetworkError`, the page renders an error variant titled "We couldn't load your report" with a "Try again" action (reloads the page), a secondary "Back to home" action, and the qid visible inline for support; the page does not navigate away on its own.
19. Refresh on `/results?qid=…` repeats the same flow (re-calls `customer/thankyou`); the page does not cache the prior response across refreshes.
20. The dev `state.scores` path is unaffected: zero `customer/thankyou` calls; full client-side report renders immediately, no guard, no spinner.
21. The `/premium-report` route alias still resolves to the same component and follows the same code path as `/results`.
22. PRD §3 (out-of-scope), §10 (O1, O2), and §11 (work plan) reflect the wired status with a pointer to this plan.

## 9. Risks & assumptions

- **R1 — `POST /customer/thankyou` not yet wired.** The full report data shape is unknown (client-side scoring? server `personality_type`? server `report_file_url`?). Placeholder ships in the meantime to keep the funnel complete. See O1.
- **R2 — Gender fallback only supports Male/Female.** Matches the InstructionsPage capture. If the product adds a third option upstream, both screens need the same enum.
- **R3 — Backend may rotate qids on update.** `PUT /customer/update` returns a fresh `quiz_result_id` and `encrypted_quiz_result_id`. We re-persist both; the navigate URL uses the returned `quiz_result_id`. If the backend stops rotating, the re-persist is a no-op — safe either way.
- **R4 — Stale override duration.** `customerUpdateSubmitted` is reset only on a new quiz submission or `clearSession()`. If a user comes back a day later with the same `qid` and the backend *still* says `CUSTOMER_DETAILS_PAGE`, the override still fires and forwards them to `/results` (placeholder or full report). This is the desired behaviour — once they've filled in details, they've filled them in.
- **R5 — `ReportComingSoon` messaging might confuse paid users.** Copy says "Thanks for completing the test" — for users who paid through Module 3, it might underwhelm. Accept for v1 until Module 5 full integration ships.

## 10. Open items

- **O1 — Scoring ownership.** ✅ **Resolved (2026-04-29):** Hybrid model. Backend supplies `personalityType`, `identity`, `turbulentPercent`, `socialBattery`, `stressMarker` via `customer/thankyou.sixteentypes_report_detail`. Per-axis `traitPercentages` continue to be derived client-side from the persisted `MbtiResult` (`localStorage[mbti.result]`); when missing (e.g. resume on a fresh device), the hero degrades to a no-axis-bars header. Client-side `src/utils/scoring.ts` remains for the dev preview path (`/results` with `location.state.scores`).
- **O2 — `POST /customer/thankyou` contract.** ✅ **Resolved (2026-04-29):** Response shape confirmed in [`docs/plans/module-5-thankyou-report.md`](../plans/module-5-thankyou-report.md) prompt body. The frontend consumes `sixteentypes_report_detail.{personalityType, identity, turbulentPercent, socialBattery, stressMarker}` and re-persists the rotated `quiz_result_id` / `encrypted_quiz_result_id` into the session. `report_file_url` / `certificate_file_url` / `promocode_url` are returned but ignored in this iteration — see plan O3.
- **O3 — `POST /questions/results` shape on the final step.** Scope §8 cites `POST /questions/results` as Module 5's endpoint, but in practice it's consumed via the resume guard. If the full report ends up reading additional fields from that response, we'll need a dedicated hook — not yet needed for the placeholder.
- **O4 — `free_access_enabled: true` branch.** If the backend signals this, Module 3 is bypassed and the user lands here directly. We haven't seen a live response shape yet — revisit when one appears.

## 11. Work plan (live portion)

DetailsPage integration shipped in the first half of this module. Live-report integration shipped per [`docs/plans/module-5-thankyou-report.md`](../plans/module-5-thankyou-report.md):

1. New hook `useCustomerThankyou` — single-shot mount-time POST `customer/thankyou` with `session.qidEncrypted`. Persists rotated qids; surfaces `{ data, loading, error }`.
2. `PremiumReportPage` refactored to a tagged-union `ReportSource` so the dev `state.scores` path stays byte-identical while the production qid-only path renders loading → live `<ReportContent>` (or error variant). `StressSection` and `FriendshipsSection` accept optional override props (`markerPositionOverride`, `socialBatteryOverride`) that bypass the existing baseline blends when API-driven values are available.
3. i18n: `report.error.*` keys for the error variant; `details.generating` reused for the loading spinner.

Acceptance criteria 15–22 above. Manual walkthrough scenarios (T99 in the plan) cover live-backend verification.
