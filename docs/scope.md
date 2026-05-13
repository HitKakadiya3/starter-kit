# TestIQ Frontend — Backend Integration Scope

**Status:** Draft · **Owner:** Rajendra (ITPath) · **Last updated:** 2026-04-22

## 1. Summary

The `typestest/` frontend is a 16-types (MBTI-style) personality quiz funnel built as a Vite + React 18 SPA. All pages are designed and rendered client-side, but every user-facing action is currently stubbed (`setTimeout` + `navigate`). This scope covers wiring the existing UI to the shared multi-tenant quiz backend documented in [`Frontend API List.postman_collection.json`](./Frontend%20API%20List.postman_collection.json) so the funnel becomes functional end-to-end.

The backend is already in production behind sites like `16persons.com` and `wwpersonalitytest.com`. **No backend changes will be made**; the frontend adapts to the documented contract.

## 2. Goals

1. User can complete the full funnel: Intro → Instructions → Quiz → Calculating → Email → Checkout → Cross-sell → Details → Results.
2. Quiz questions come from `GET /questions`; 60 are rendered per session.
3. Pricing shown on every price-bearing page is fetched from backend and reflects marketing discount params (`prc_id` / `mdid`).
4. First-sale payment runs through Stripe Payment Element with intent creation + server-side confirmation.
5. Cross-sell accept/skip is wired to the dedicated confirm endpoint.
6. Every post-submit page is resumable via `?qid=...` in the URL. State and `redirect_page` are server-driven; a user who refreshes or shares a URL is routed to whichever funnel step the backend says they belong on.
7. Report page renders personality data. Report generation / scoring logic is **deferred** — we'll wire the UI to the backend's response but final scoring is TBD.

## 3. Non-goals / Out of scope

- No PayPal or Solidgate integration in this phase (backend supports them; architecture stays gateway-agnostic so they can be added later without rework).
- No admin, auth, or user-account features.
- No analytics, A/B testing, or `variant_type` experiments beyond sending an empty value.
- No backend changes — if a gap is found, we adapt the frontend or defer.
- No localization; English copy only.
- Accessibility / performance audits are not in scope for this pass (existing shadcn/ui components are assumed sufficient).
- Report scoring logic (client vs. server, how personality type is derived) — **deferred** until a later module.

## 4. Module breakdown & phasing

Work is sequenced into 5 modules. Each module ships independently and the PRD / implementation are done module-by-module.

| # | Module | Pages | Endpoints | State |
|---|---|---|---|---|
| 1 | **Load Questions** | IntroPage, InstructionsPage, QuizPage, CalculatingPage, EmailCapturePage | `GET /questions`, `POST /questions/submit` | Live |
| 2 | **Pricing display** | CheckoutPage, CrossSellPage (+ any other price-bearing surface) | `POST /price`, `POST /price/after/submit` | Live |
| 3 | **First payment** | CheckoutPage | `POST /payment/stripe/create-payment-intent`, `POST /payment/stripe/first-sale/payments/confirm` | Live |
| 4 | **Cross-sell** | CrossSellPage | `POST /payment/cross-sale/payments/confirm` | Live |
| 5 | **Details + Report** | DetailsPage, PremiumReportPage | `PUT /customer/update`, `POST /customer/thankyou` (deferred), `POST /questions/results` | Partially live — DetailsPage wired; Report placeholder ([module-5-details-and-report.md](./prd/module-5-details-and-report.md)) |

Module 1 includes the cross-cutting **foundation** (API client, env, session storage, marketing params, resume guard skeleton) because it's the first module that needs them. Later modules only extend what Module 1 puts in place.

## 5. Cross-cutting technical foundations

Delivered as part of Module 1, consumed by all later modules.

- **HTTP client** (`src/lib/api.ts`) with base URL, bearer token, `x-host`, `ip_address` headers and response unwrapping (`{ meta, data }`). **Every request `await`s `ensureIpResolved()`** so the first call on a fresh session never goes out with an empty `ip_address`.
- **Env vars:** `VITE_API_BASE_URL`, `VITE_API_TOKEN`, `VITE_X_HOST`, `VITE_STRIPE_PUBLISHABLE_KEY`. Committed `.env.example`.
- **IP resolution** (`src/lib/ip.ts`): `ensureIpResolved()` wraps ipify with a single-flight guard; the api client awaits it before building headers.
- **Session storage** for funnel state: `qidRaw`, `qidEncrypted`, `email`, `pricingInfo`, `prcId` / `mdid`, `landingUrl`, `landingTime`, `ipAddress`, `paymentIntent` (keyedBy qidRaw + prcId + mdid + methodType), `crossSellResolved`, `customerUpdateSubmitted`.
- **Marketing params** (`src/lib/campaign.ts`): `?prc_id` and `?mdid` are re-synced from the URL into session on every navigation. Both can co-exist. The URL is never mutated — `src/lib/promoUrl.ts → withPromoParams(url)` forwards the current URL's promo params onto every internal navigate target so the funnel URLs keep carrying them.
- **Likert scale labels:** single source of truth (`src/lib/likertScale.ts` → `LIKERT_LABELS_BY_POSITION`) shared by `ScaleSelector` (render order) and `useQuiz` (text-match resolution so backend's inconsistent `options[]` order doesn't matter).
- **`redirect_page` router** constant map (`src/lib/redirectRouter.ts`) with real enum values confirmed against the dev backend.
- **Resume guard** (`useRedirectGuard` hook), mounted on every post-submit page (Checkout, CrossSell, Details, Results): reads raw integer `qid` from URL → calls `POST /questions/results` → routes via `resolveEffectiveRedirect(serverRedirect, session)` which applies session-flag overrides (cross-sell-resolved, customer-update-submitted) before picking the target route.

## 6. Assumptions (flag if wrong)

1. `quiz_data[].answer` is the **option `id`** from the question's options array (not a 1–5 position).
2. `ip_address` header is safe to source from `ipify`; backend will accept it.
3. `geo_data` in submit body is left empty — backend enriches from IP.
4. `user_device_info` and `landing_url_detail` are populated client-side (UA parsing + first-landing timestamp).
5. `GET /questions` for our `x-host` returns only Likert (question_type_id 6) items with 5 text+weight options. Image-choice or slider-shape items are filtered out.
6. `VITE_API_TOKEN` is a public, client-embeddable bearer (no token-exchange flow).
7. `qid` in URLs is the **raw integer `quiz_result_id`** (not the encrypted form). `POST /questions/results` rejects the encrypted id with `"quiz_result_id must be a number"` — confirmed against the live dev backend. `session.qidEncrypted` still caches the encrypted form for `POST /customer/thankyou` (Module 5), which the docs say requires it.
8. `redirect_page` enum confirmed against the dev backend (2026-04-22): `INITIAL_PAYMENT_PAGE` → `/checkout`, `CROSS_SELL_OFFER_PAGE` → `/cross-sell`, `CUSTOMER_DETAILS_PAGE` → `/details`, `THANK_YOU_PAGE` → `/results`, `PAYMENT_FAILED_PAGE` → `/checkout`. Unknown values fall through to `/checkout` with a console warning.
9. `prc_id` and `mdid` can **co-exist**. Both pass through to every API body that accepts them (backend handles the combination). Earlier drafts assumed mutual exclusivity — that rule was dropped after backend confirmation.
10. Campaign params are **not cached in sessionStorage** — the URL is the single source of truth. Every navigation re-syncs `session.prcId` / `session.mdid` from the current URL (present → written, absent → cleared). Every internal `navigate()` call uses `withPromoParams()` to forward the current URL's promo params onto the destination.
11. **The URL is never mutated by the frontend.** `prc_id` / `mdid` stay visible in the address bar for the whole funnel. Users who refresh, bookmark, or share a URL keep the discount; users who arrive fresh without the params get fresh pricing.
12. `GET /questions` response envelope is `{ meta, data: { questions: [...] } }`. Consumers unwrap `data.questions` — it is **not** a flat array.
13. `question_type_id` is returned as a stringified number (e.g. `"6"`) by the live backend. Always compare via `Number(...)`.
14. Likert `options[]` order varies per question. Frontend matches the selected option by `text` label against the shared `LIKERT_LABELS_BY_POSITION` constant; mapping UI position → `options[index]` is wrong and must not be used.
15. Option `weight` is backend scoring metadata and may be absent on legacy rows; the frontend never reads it.
16. `ip_address` header is resolved **lazily at request time** inside the API client (`ensureIpResolved()` awaits ipify before every fetch, cached in session after first success). Every backend call is guaranteed to carry the header on fresh sessions. The earlier "resolve once on boot, send empty header if ipify fails" pattern was dropped because the backend's pricing engine silently mispriced on missing IP.
17. Backend requires `user_on_iqbooster: ''` on every payment-related body even when empty — omitting it returns 422. Confirmed against the dev backend.
18. Backend does not advance `/questions/results` state on cross-sale skip or cross-sale accept or customer-update — it keeps returning the previous step until the next state-mutating action succeeds. Frontend works around this with session flags (`crossSellResolved`, `customerUpdateSubmitted`) that a guard override consumes to route the user forward. Flags are reset on every fresh quiz submission so back-to-back funnel runs in the same tab don't carry stale state.

## 7. Deferred decisions

- Report page data source (client-rendered using `personality_type` vs. backend PDF at `report_file_url` vs. both). `POST /customer/thankyou` integration in Module 5 is pending; `/results` currently renders a `ReportComingSoon` placeholder.
- Scoring ownership (client vs. server) — `src/utils/scoring.ts` is preserved intact so Module 5 can opt for client-side rendering without a reintroduction.
- Solidgate integration. PayPal is wired via Stripe's `confirmPayPalPayment` — the separate backend `/payment/paypal/*` endpoints stay unused.
- Free-access branch behavior (`free_access_enabled: true`) — will revisit when we see a real response.

## 8. Open questions

Tracked per module in each PRD. Module 1's open items are documented in [`prd/module-1-load-questions.md`](./prd/module-1-load-questions.md).
