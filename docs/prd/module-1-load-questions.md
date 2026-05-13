# Module 1 — Load Questions · PRD

**Parent scope:** [../scope.md](../scope.md) · **Status:** Draft · **Last updated:** 2026-04-22

## 1. Overview

Module 1 covers the first half of the funnel (before payment) and delivers the **cross-cutting foundation** the rest of the modules depend on.

**Pages:** IntroPage · InstructionsPage · QuizPage · CalculatingPage · EmailCapturePage
**Backend endpoints:**
- `GET /questions`
- `POST /questions/submit`
- `POST /questions/results` (foundation only — used by the resume guard; first consumers land in Module 2)

**Success definition:** A fresh user can land on `/`, pick a gender, answer 60 randomly selected personality questions, enter their email, and be routed to `/checkout?qid=…` with server-issued session state persisted. If they refresh or paste the URL into a new browser, they land back in the correct funnel step.

## 2. In scope

- All five pages above become functional against the backend.
- Foundation pieces (API client, env, session, ipify, marketing params, resume guard skeleton).
- Question fetching, random sampling, and shape filtering.
- Quiz submit with metadata (timing, device, landing URL, campaign params).

## 3. Out of scope (handled in later modules)

- Pricing display on Checkout / Cross-sell — Module 2.
- Stripe Payment Element — Module 3.
- Cross-sell confirm — Module 4.
- Customer update, thank-you, report rendering — Module 5.
- Any changes to the `redirect_page` enum once real values are observed.

## 4. Foundation architecture

### 4.1 Environment

`.env.example` (committed):

```
VITE_API_BASE_URL=http://localhost:3003/api/v1/
VITE_API_TOKEN=<public bearer key for this tenant>
VITE_X_HOST=16persons.com
```

Dev uses a local `.env`; prod values are injected at build time. Consumed via `import.meta.env.VITE_*`.

### 4.2 HTTP client — `src/lib/api.ts`

Thin wrapper over `fetch` (no new deps — `@tanstack/react-query` is already installed for caching where useful).

Responsibilities:
- Prefix `VITE_API_BASE_URL` on relative paths.
- Inject headers on every request:
  - `Authorization: Bearer ${VITE_API_TOKEN}`
  - `x-host: ${VITE_X_HOST}`
  - `ip_address: ${session.ipAddress}`
  - `Content-Type: application/json`
- Unwrap `{ meta, data }` → return `data`. On `meta.success === false`, throw `ApiError(meta.message, meta.status)`.
- On network failure, throw `NetworkError`.
- No retries in v1 (add later if needed).

Exported helpers: `apiGet<T>(path)`, `apiPost<T>(path, body)`, `apiPut<T>(path, body)`.

### 4.3 Session storage — `src/lib/session.ts`

Single typed accessor over `sessionStorage` under key `testiq.session`. Shape:

```ts
interface FunnelSession {
  qidRaw?: number;              // from quiz_result_id
  qidEncrypted?: string;        // from encrypted_quiz_result_id (used in URLs)
  email?: string;
  gender?: 'male' | 'female';   // mirrored from localStorage for convenience
  ipAddress?: string;           // ipify result
  pricingInfo?: PricingInfo;    // latest pricing_info from backend
  prcId?: string;               // mutually exclusive with mdid
  mdid?: string;
  landingUrl?: string;
  landingTime?: number;         // ms timestamp
}
```

Methods: `getSession()`, `patchSession(partial)`, `clearSession()`.

`localStorage['user_gender']` is untouched (keeps the existing InstructionsPage behavior) and is mirrored into the session object when read.

### 4.4 IP resolution — `src/lib/ip.ts`

Two exports:

- `resolveIp()` — Result-style one-shot that fetches ipify once, caches the result in `patchSession({ ipAddress })`. Non-throwing.
- `ensureIpResolved()` — **awaitable, single-flight wrapper** over `resolveIp`. Called from the API client before every `fetch()` so the `ip_address` header is never sent empty on a fresh session. Concurrent callers share one in-flight promise.

App boot (`App.tsx`) also kicks off `resolveIp()` eagerly as a warm-up + error toast path, but the api client's `ensureIpResolved` is the actual guarantee.

**Why the change from the original "resolve once on boot" design:** in live testing we hit a race — the first API request (pricing or questions) could fire before ipify resolved, and the backend's pricing engine silently returns list prices when it can't geo-locate from a missing IP. Lazy-per-request eliminates the race at the cost of a one-time ~100–200 ms wait on the first call.

### 4.5 Marketing params — `src/lib/campaign.ts`

`captureCampaignParams()` runs on **every navigation** (AppBoot wires it to a `useLocation().search` effect). The URL is the single source of truth:

1. Read `prc_id` and `mdid` from `window.location.search`.
2. Write both into session via `patchSession({ prcId: urlPrc ?? undefined, mdid: urlMdid ?? undefined })`. Absent-from-URL explicitly clears the session value — a user who navigates to a page without promo params stops seeing the discount immediately.
3. **Both can co-exist.** Earlier drafts treated `prc_id` and `mdid` as mutually exclusive with a `console.warn` and `mdid`-wins rule; the backend actually accepts both, so we pass both through with no warning.
4. `landingUrl` and `landingTime` are captured on the very first call only — they record the original marketing URL, not the current one.
5. **The URL is never mutated.** Users who refresh, bookmark, or share a campaign URL keep the discount; a fresh visitor without params gets fresh pricing.

### 4.5a Promo URL forwarding — `src/lib/promoUrl.ts`

Since the URL is the source of truth, every internal `navigate()` that builds a destination URL (`/checkout?qid=…`, `/cross-sell?qid=…`, etc.) must carry the current promo params forward. The helper:

```ts
export function withPromoParams(url: string): string {
  const params = new URLSearchParams(window.location.search);
  const prcId = params.get("prc_id");
  const mdid = params.get("mdid");
  const extras: string[] = [];
  if (prcId) extras.push(`prc_id=${encodeURIComponent(prcId)}`);
  if (mdid) extras.push(`mdid=${encodeURIComponent(mdid)}`);
  if (extras.length === 0) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${extras.join("&")}`;
}
```

Used by IntroPage, InstructionsPage, QuizPage, CalculatingPage, EmailCapturePage, CrossSellPage, DetailsPage, CheckoutForm (post-confirm nav + PayPal return_url), PricingPage, SiteHeader, and inside `useRedirectGuard` on guard-triggered redirects. Any new internal navigation that carries `qid` in its URL must also wrap with this helper.

### 4.6 `redirect_page` router — `src/lib/redirectRouter.ts`

```ts
// Enum confirmed against the dev backend (2026-04-22). Any new values
// the backend adds will fall through to '/checkout' with a console.warn
// via resolveRedirect.
export const REDIRECT_TO_ROUTE: Record<string, string> = {
  INITIAL_PAYMENT_PAGE:   '/checkout',
  CROSS_SELL_OFFER_PAGE:  '/cross-sell',
  CUSTOMER_DETAILS_PAGE:  '/details',
  THANK_YOU_PAGE:         '/results',
  PAYMENT_FAILED_PAGE:    '/checkout',
};

export function resolveRedirect(page: string | undefined): string {
  return REDIRECT_TO_ROUTE[page ?? ''] ?? '/checkout';
}
```

**Unknown values** log a warning and fall through to `/checkout` as a safe default. When a real value is observed that doesn't match the map, we update this one file.

### 4.6a qid shape in URLs — **raw integer, not encrypted**

Confirmed against the live backend: `POST /questions/results` rejects the `encrypted_quiz_result_id` with `{ "meta": { "message": "quiz_result_id must be a number", ... } }`. It strictly requires the numeric `quiz_result_id` (e.g. `20044606`).

Consequence for the URL-based resume pattern:

- **URL carries the raw integer `quiz_result_id`** — e.g. `/checkout?qid=20044606`.
- `session.qidEncrypted` still holds the `encrypted_quiz_result_id` returned from `/questions/submit`, because **`POST /customer/thankyou` requires the encrypted form** per its docs (Module 5).
- Both are written to session by the submit response handler. The guard and downstream page navigations use the raw integer; the thankyou call in Module 5 uses the encrypted form from session.

The guard parses the URL `qid` with `/^\d+$/.test(value)` before sending it to the backend; a non-numeric `qid` (e.g. if a prior pattern leaked through) falls back to `session.qidRaw`, and if that's also missing the guard bounces to `/`.

### 4.7 Resume guard — `src/hooks/useRedirectGuard.ts`

Mounted on every post-submit page (Checkout, CrossSell, Details, Results) **as part of Module 1**. Later modules add their own business logic on top (pricing, Stripe, customer update), but the guard always runs first and wins.

```ts
export function useRedirectGuard(currentRoute: string): boolean {
  const [qid] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // URL carries the raw integer quiz_result_id. /questions/results rejects
    // anything non-numeric. Session fallback is the cached raw qid from an
    // earlier submit in the same tab.
    const urlQid = qid.get('qid');
    const numericQid =
      urlQid && /^\d+$/.test(urlQid) ? Number(urlQid) : getSession().qidRaw;
    if (!numericQid) { navigate('/', { replace: true }); return; }

    apiPost<QuizResultResponse>('questions/results', {
      quiz_result_id: numericQid,
      prc_id: getSession().prcId ?? '',
      pricing_discount: getSession().mdid ? { mdid: getSession().mdid } : '',
    }).then((data) => {
      patchSession({
        qidRaw: data.quiz_result_id,
        qidEncrypted: data.encrypted_quiz_result_id,
        email: data.email,
        pricingInfo: data.pricing_info,
      });
      const expected = resolveRedirect(data.redirect_page);
      if (expected !== currentRoute) {
        navigate(`${expected}?qid=${data.quiz_result_id}`, { replace: true });
      } else {
        setReady(true);
      }
    }).catch(() => navigate('/', { replace: true }));
  }, []);

  return ready;
}
```

**Consumer contract:** each post-submit page calls `const ready = useRedirectGuard('/path')` at the top, renders a minimal loading placeholder while `ready === false`, and renders real content otherwise. Route paths passed to the hook must match the exact strings the router map in §4.6 resolves to.

**Forwarded URLs use the raw integer** (`qid=${data.quiz_result_id}`), not the encrypted form — see §4.6a.

### 4.8 Device info — `src/lib/deviceInfo.ts`

Lightweight UA parsing (no new dep):

```ts
{
  user_device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
  user_os:     /Windows/.test(ua) ? 'Windows'
             : /Macintosh/.test(ua) ? 'MacOS'
             : /Android/.test(ua) ? 'Android'
             : /iPhone|iPad/.test(ua) ? 'iOS'
             : 'Other',
  user_browser: /Edg\//.test(ua) ? 'Edge'
              : /Chrome\//.test(ua) ? 'Chrome'
              : /Firefox\//.test(ua) ? 'Firefox'
              : /Safari\//.test(ua) ? 'Safari'
              : 'Other',
}
```

If heuristics grow unreliable, swap for `ua-parser-js` in a later cleanup.

### 4.9 Likert scale label mapping — `src/lib/likertScale.ts`

The backend's `options[]` for a Likert question is **not guaranteed to be in a consistent position order across questions**. Observed in live data (16types.ai dev):

- Some questions return `[Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree]`.
- Others return `[Disagree, Neutral, Agree, Strongly Agree, Strongly Disagree]`.
- Others return `[Neutral, Agree, Strongly Agree, Strongly Disagree, Disagree]`.

The `weight` field on each option also varies arbitrarily — it encodes backend scoring metadata, not the user-facing position.

**The ScaleSelector UI renders in a fixed order**, top-to-bottom. Mapping the user's clicked position → `options[positionIndex]` picks the wrong option for most questions.

**Solution:** a shared const of Likert labels in the canonical render order, used by both ScaleSelector (button rendering) and `useQuiz` (text→id resolution).

```ts
// src/lib/likertScale.ts
export const LIKERT_LABELS_BY_POSITION: readonly string[] = [
  'Strongly Agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly Disagree',
] as const;
```

In `useQuiz.answer(positionIndex)`:

```ts
const label = LIKERT_LABELS_BY_POSITION[positionIndex];
const opt = q.options?.find((o) => o.text === label);
```

Exact text match against the five canonical labels. If the backend ever returns a question with labels outside this set, `opt` is undefined and the answer is a no-op — caller sees no advance.

## 5. Data flow — Module 1

```
User lands "/"
  → App.tsx boot: resolveIp(), captureCampaignParams(), cleanUrl()
  → IntroPage (no API calls)
  → InstructionsPage: localStorage.user_gender = <male|female>
  → QuizPage mounts
      → GET /questions?variant_type=&tag=
         → response.data is { questions: [...] }, NOT a flat array — unwrap
      → filter: Number(question_type_id) === 6 && options.length === 5 &&
                every option has a string `text`. (Backend returns
                question_type_id as a stringified number, and `weight` may be
                absent on legacy rows — ignore it, the frontend doesn't use it.)
      → shuffle, take 60, store in component state
      → user answers each via ScaleSelector → useQuiz maps position to
        option.id by matching LIKERT_LABELS_BY_POSITION[position] against
        option.text (see §4.9)
      → record start_time on first answer, end_time on final answer
      → navigate('/calculating', { state: { answers, startTime, endTime } })
  → CalculatingPage: 8s loading animation, passes state through
      → navigate('/email', { state })
  → EmailCapturePage: user types email, clicks Continue
      → POST /questions/submit { email, quiz_data, start_time, end_time, ...metadata }
      → response: { quiz_result_id, encrypted_quiz_result_id, pricing_info, redirect_page, ... }
      → patchSession({ qidRaw, qidEncrypted, email, pricingInfo })
      → navigate(`${resolveRedirect(redirect_page)}?qid=${quiz_result_id}`)
        — raw integer in URL per §4.6a; encrypted_quiz_result_id is
          kept in session for Module 5's /customer/thankyou call.
```

## 6. Per-page PRD

### 6.1 IntroPage · `/`

**Intent:** Marketing landing page. Sells the test and kicks off the funnel.

**Data:** Static copy + assets only. No API calls in Module 1. (Module 2 may add a pricing badge — out of scope here.)

**Side effects on mount (via App.tsx, not the page itself):**
- Resolve and cache IP.
- Capture `prc_id` / `mdid` from URL → sessionStorage → strip query.
- Capture landing URL and `landingTime = Date.now()` if not already set.

**Navigation:** "Start Test" → `/instructions`. No data passed.

**Error states:** None.

### 6.2 InstructionsPage · `/instructions`

**Intent:** Capture gender before the quiz starts.

**Data:** Client-only. Writes `localStorage['user_gender']` and mirrors into session.

**Behavior:** Existing UI unchanged. On select → 400ms delay → `/quiz`.

**Entry guard:** Allow direct entry (users arriving from marketing deep link to `/instructions` is fine).

**Exit state:** `localStorage['user_gender']` set.

### 6.3 QuizPage · `/quiz`

**Intent:** Render questions and record answers.

**Data:**
- Replace local `questions` import from `src/utils/questions.ts` with a `useQuery('questions')` fetch from `GET /questions?variant_type=&tag=`.
- **Response envelope:** the standard `{ meta, data }` wrapper's `data` is **`{ questions: [...] }`**, not a flat array. The API client unwraps one layer (`data`); the QuizPage consumer reads `data.questions` with an `Array.isArray` guard.
- Delete `dim`/`pole` metadata — scoring is server-side.
- **Filter:** keep only items where `Number(q.question_type_id) === 6` (backend returns it as a stringified number like `"6"`, not `6`), `options.length === 5`, and every option has a string `text`. Do **not** filter on `weight` — some legacy rows omit it and the frontend never reads it (it's backend scoring metadata).
- Shuffle valid items (Fisher–Yates) and take the first 60. If fewer than 60 are available after filtering, use all of them and emit `console.warn`.

**Behavior:**
- `useQuiz` hook rewritten to hold `answers: Array<{ id: string; answer: string }>` — no scoring.
- When user selects on `ScaleSelector`, map the position index 0–4 to a Likert label via `LIKERT_LABELS_BY_POSITION[position]` (see §4.9), then locate the backend option via `q.options.find(o => o.text === label)`. Push `{ id: question.id, answer: opt.id }`. **Do not index into `options[positionIndex]`** — backend option order varies per question.
- `startTime` is stamped on the **first `answer()` call** (not on paint). `endTime` is stamped on the final answer.
- Progress bar reflects `questionIndex / totalQuestions`.
- On the final answer, navigate to `/calculating` with `state = { answers, startTime, endTime }`.

**Loading state:** Spinner centered, text "Loading your questions…" while `/questions` is in flight.

**Error state:** If `/questions` fails, full-page error card with a retry button. No fallback to local questions (keeps backend as the single source of truth).

**Empty state:** If backend returns zero valid Likert items after filtering, show "This test isn't available right now" with a "Try again" button.

**`ScaleSelector` changes:**
- Today it emits a weight in `{-2,-1,0,1,2}`.
- Change its callback to emit the **position index** 0–4.
- `useQuiz` maps position → option id.

### 6.4 CalculatingPage · `/calculating`

**Intent:** Visual delay while we pretend to analyse answers. **No API calls.**

**Data:** Passes through `{ answers, startTime, endTime }` from route state.

**Behavior:** Unchanged animation timing (~8 s). On completion → `/email` with the same state.

**Entry guard:** If route state is missing `answers`, bounce to `/`.

### 6.5 EmailCapturePage · `/email`

**Intent:** Collect email and submit the quiz.

**Data:** Route state carries `{ answers, startTime, endTime }`.

**Behavior:**
1. User enters email; on submit the button goes into loading.
2. Build request body:
   ```ts
   {
     email,
     variant_type: '',
     quiz_data: answers,        // [{ id, answer }]
     start_time: startTime,
     end_time: endTime,
     prc_id: session.prcId ?? '',
     pricing_discount: session.mdid ? { mdid: session.mdid } : { mdid: '' },
     user_device_info: getDeviceInfo(),
     landing_url_detail: {
       landing_url: session.landingUrl ?? window.location.origin + '/',
       landing_time: session.landingTime ?? null,
     },
     geo_data: { city: '', region: '' },
   }
   ```
3. `POST /questions/submit`.
4. On success, `patchSession({ qidRaw, qidEncrypted, email, pricingInfo, crossSellResolved: undefined, customerUpdateSubmitted: undefined, paymentIntent: undefined })` — the per-run flags (owned by Modules 3–5) are cleared at the same time so a user who completes one funnel and starts a second in the same tab gets a clean navigation state. Then `navigate(withPromoParams(\`${resolveRedirect(redirect_page)}?qid=${quiz_result_id}\`), { replace: true })` — **raw integer qid** per §4.6a, promo params forwarded per §4.5a.

**Error states:**
- Invalid email → client-side validation (HTML5 `type="email"` + `required` already present) blocks submit.
- Backend 4xx with meta.message → toast the message, keep user on page.
- Backend 5xx / network → toast "Something went wrong. Please try again." Keep user on page.
- Duplicate submission (same answers resubmitted after a refresh that lost state) → accept whatever the backend returns; the `redirect_page` will route appropriately.

**Entry guard:** Missing `answers` in route state → bounce to `/`.

## 7. Changes to existing code

| File | Change |
|---|---|
| `src/utils/questions.ts` | Deleted. Questions come from the API. |
| `src/utils/scoring.ts` | **Preserved intact.** Product direction: Module 5 may compute the MBTI type client-side using this engine. Leaving it untouched in Module 1 costs nothing and avoids a reintroduction later. Orphaned exports are acceptable. |
| `src/hooks/useQuiz.ts` | Rewritten: no scoring, holds `answers: Array<{id, answer}>`, `startTime`, `endTime`. Resolves option id by text-matching the user's position against `LIKERT_LABELS_BY_POSITION` (see §4.9). |
| `src/hooks/useResults.ts` | Left untouched in Module 1 (Report page still uses mock scores). Will be reworked in Module 5. |
| `src/components/ScaleSelector.tsx` | `onSelect` callback changes from `(weight: number)` to `(positionIndex: number)` — 0..4. Renders button labels and style lookup keyed off `LIKERT_LABELS_BY_POSITION`. |
| `src/pages/QuizPage.tsx` | Swap local questions for API fetch, unwrap `data.questions`, handle loading / error / empty, record timing, pass new `answers` shape to next page. |
| `src/pages/CalculatingPage.tsx` | State guard uses `answers` instead of `scores`. |
| `src/pages/EmailCapturePage.tsx` | Real submit. Replace `setTimeout` with real API call + session write + server-driven redirect (URL carries raw integer `quiz_result_id`). |
| `src/pages/CheckoutPage.tsx` | Replace old `scores`-state guard with `useRedirectGuard('/checkout')`. Forward `qid` on every internal navigation. Payment / pricing wiring is still Module 2–3. |
| `src/pages/CrossSellPage.tsx` | Mount `useRedirectGuard('/cross-sell')`; forward qid. Accept/skip wiring is Module 4. |
| `src/pages/DetailsPage.tsx` | Mount `useRedirectGuard('/details')`; forward qid on submit. Real `/customer/update` is Module 5. |
| `src/pages/PremiumReportPage.tsx` | Dual path: if `location.state.scores` is present (dev preview), render the full report unchanged; otherwise mount `useRedirectGuard('/results')` and render a `ReportComingSoon` placeholder (Module 5 will replace with the real `/customer/thankyou` flow). |
| `src/App.tsx` | On boot, run IP resolution + campaign param capture before Suspense mounts. |

**Files added:**
- `src/lib/api.ts`
- `src/lib/session.ts`
- `src/lib/ip.ts`
- `src/lib/campaign.ts`
- `src/lib/redirectRouter.ts`
- `src/lib/deviceInfo.ts`
- `src/lib/likertScale.ts`
- `src/lib/apiTypes.ts`
- `src/hooks/useRedirectGuard.ts`
- `.env.example`

## 8. Acceptance criteria

1. Happy path: A user lands on `/`, picks a gender, answers 60 questions, submits an email, and arrives on `/checkout?qid=<rawInt>` with session populated.
2. Questions visibly come from the backend — taking the test twice produces different ordering.
3. `?prc_id=ABC` in the initial URL persists through the session and appears in the `/questions/submit` request body as `prc_id: "ABC"`. `prc_id` is stripped from the URL after capture.
4. `?mdid=50` behaves equivalently, arriving as `pricing_discount: { mdid: "50" }`. `mdid` is stripped from the URL after capture.
5. If `prc_id` and `mdid` both appear in the URL, only `mdid` is stored, and a `console.warn` is emitted.
6. **Other query params (e.g. `qid`) are never stripped** — landing on `/checkout?qid=20044606&prc_id=ABC` leaves the URL as `/checkout?qid=20044606` after boot, not `/checkout`.
7. `start_time` / `end_time` in the submit body accurately bracket the quiz — `start_time` on first answer click, `end_time` on final answer click.
8. Network failure on `/questions` displays a retryable error card and does **not** fall back to local questions.
9. Network failure on `/questions/submit` keeps the user on `/email` with a toast, preserving their typed email.
10. Submitting without an email is blocked client-side.
11. `redirect_page: INITIAL_PAYMENT_PAGE` from submit navigates to `/checkout?qid=<rawInt>`.
12. An unknown `redirect_page` value logs a warning and falls through to `/checkout`.
13. The `Authorization`, `x-host`, and `ip_address` headers are present on every API request (verified via DevTools Network tab).
14. **Paste-URL resume works**: opening `/checkout?qid=<rawInt>` in a fresh browser triggers `POST /questions/results` and navigates according to the response's `redirect_page`. No `scores` state required.
15. **Post-submit page refresh works**: refresh on `/checkout`, `/cross-sell`, `/details`, or `/results` re-runs the guard and renders the correct step.
16. `user_device_info` in submit reflects the current browser (verified by swapping UA in DevTools device mode).
17. Live-data edge cases: questions whose `options[]` arrive in non-canonical order still record the right `{ question_id, option_id }` pair — verified by a fixture with options intentionally shuffled in the useQuiz unit tests.

## 9. Risks & assumptions (with live-data resolutions)

- **A1 — RESOLVED** `quiz_data[].answer` is the option `id`. The backend's Likert options arrive with inconsistent `options[]` order per question, so we resolve the selected option by matching `option.text` against `LIKERT_LABELS_BY_POSITION[position]` rather than indexing `options[position]`. Single source of truth lives in `src/lib/likertScale.ts`.
- **A2** `ipify` is reachable from the user's network. A small percentage of corporate networks block it; if that becomes an issue we add a server-side echo endpoint (backend change).
- **A3** The tenant behind our `x-host` returns Likert-only items. If IQ-shaped items leak through, the filter drops them. If too many are dropped to reach 60, the quiz still proceeds with fewer — we'll log and monitor.
- **A4 — RESOLVED** `redirect_page` enum values confirmed against the dev backend: `INITIAL_PAYMENT_PAGE`, `CROSS_SELL_OFFER_PAGE`, `CUSTOMER_DETAILS_PAGE`, `THANK_YOU_PAGE`, `PAYMENT_FAILED_PAGE`. See §4.6 for the route mapping.
- **A5 — RESOLVED** `POST /questions/results` **strictly requires a numeric `quiz_result_id`**; the encrypted id is rejected with `"quiz_result_id must be a number"`. URL therefore carries the raw integer (`quiz_result_id`), and `session.qidEncrypted` is preserved separately for Module 5's `/customer/thankyou` which needs the encrypted form. See §4.6a.
- **A6 — LEARNED** `question_type_id` arrives as a **stringified number** (`"6"`) in live responses. Always coerce via `Number(...)` when comparing.
- **A7 — LEARNED** `GET /questions` response is wrapped `{ questions: [...] }` under `data`; consumers must unwrap one layer beyond the standard envelope.
- **A8 — LEARNED** URL-query-stripping on app boot must target **only** the marketing params, not the whole query string — otherwise `qid` on post-submit pages is wiped before the guard can read it.

## 10. Open items to resolve during / after Module 1

- Observed `redirect_page` values in the wild — backfill the router map (only `INITIAL_PAYMENT_PAGE` confirmed so far).
- IDOR posture: URLs carry the raw integer `quiz_result_id`. Sequential enumeration could leak other users' funnel state. Backend team needs to confirm whether `/questions/results` rate-limits or otherwise guards against scraping; if not, we revisit (either add an auth-token per result or argue for backend support of the encrypted form on this endpoint).
- Should ipify failure be blocking (error screen) or non-blocking (send empty header)? Module 1 picks **blocking** to avoid silent backend rejections; revisit if it causes pain.
- Final wording for error toasts (placeholder copy is used in v1).

## 11. Work plan (high level)

Rough ordering for implementation (matches what actually shipped) — a task-level work plan may be produced separately.

1. **Phase 1 — foundation:** `.env.example`, `src/lib/api.ts`, `src/lib/session.ts`.
2. **Phase 2 — boot effects + guard skeleton:** `src/lib/ip.ts`, `src/lib/campaign.ts` (with per-param stripping, §4.5), `src/lib/redirectRouter.ts`, `src/lib/deviceInfo.ts`, `src/hooks/useRedirectGuard.ts`, wire into `App.tsx`.
3. **Phase 3 — funnel:** `src/lib/apiTypes.ts`, `src/lib/likertScale.ts`, rework `useQuiz` (text-match resolution), update `ScaleSelector`, rewire `QuizPage` (`data.questions` unwrap, stringified `question_type_id` coercion), guard change for `CalculatingPage`, real submit in `EmailCapturePage` with raw-integer qid navigation.
4. **Phase 4 — cleanup:** delete `src/utils/questions.ts`; prune `persistResult` from `mbtiResult.ts` (keep `readResult` + `MbtiResult`). `scoring.ts` preserved intact per product direction.
5. **Phase 5 — guard consumers (part of Module 1):** mount `useRedirectGuard` on Checkout, CrossSell, Details, Results pages; replace legacy `location.state.scores` guards with qid-URL guards; forward qid on every internal navigation.
6. Manual QA against the acceptance criteria in §8.
