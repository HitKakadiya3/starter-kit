# Task 15 — `EmailCapturePage` real submit

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.6
**Size:** Medium (1 file, full replace of the submit path)
**Dependencies:**
- `02-api-client.md` (`apiPost`, `ApiError`, `NetworkError`)
- `03-session-accessor.md` (`getSession`, `patchSession`)
- `06-redirect-router.md` (`resolveRedirect`)
- `07-device-info.md` (`getDeviceInfo`)
- `10-api-types.md` (`QuizSubmitRequestBody`, `QuizSubmitResponse`)
- `13-quiz-page-rewrite.md` (source of the route state shape)
- `14-calculating-page-guard.md` (forwards state through)

## Purpose / why this task exists

EmailCapturePage today uses `setTimeout` + `navigate('/checkout')` with no backend interaction. This task replaces the stub with the real `POST /questions/submit` call, wires session persistence, and honors the server-issued `redirect_page`. It is the capstone of Phase 3 — after this commit, a fresh user can complete the pre-payment funnel end-to-end against the live backend.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.5 EmailCapturePage (Data, Behavior, Error states, Entry guard).
- `docs/prd/module-1-load-questions.md` §5 Data flow — final step.
- Backend contract: `docs/Frontend API List.postman_collection.json` — `POST /questions/submit`.

## AC coverage

- **AC 1** — Happy path: arrives on `/checkout?qid=<encrypted>` with session populated.
- **AC 3** — `prc_id` from session appears in submit body.
- **AC 4** — `mdid` from session appears as `pricing_discount: { mdid }`.
- **AC 6** — `start_time` / `end_time` present in request body (stamped in Task 11, forwarded through).
- **AC 8** — Network failure on submit keeps the user on `/email` with a toast; email preserved.
- **AC 9** — Empty email blocked client-side (existing HTML5 `required` + `type="email"`).
- **AC 10** — `redirect_page: INITIAL_PAYMENT_PAGE` → `/checkout`.
- **AC 12** — Verified in DevTools: `Authorization`, `x-host`, `ip_address` headers on the submit request (header injection owned by Task 02; this task is the verification point).
- **AC 13** — Session data (`qidRaw`, `qidEncrypted`, `email`, `pricingInfo`) survives a refresh on `/email`.
- **AC 14** — `user_device_info` in the request body reflects the current browser.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/EmailCapturePage.tsx`

**Do NOT touch:**
- Any `lib/` module.
- Any other page.
- The existing form markup / HTML5 validation (already correct per PRD §6.5 — "HTML5 `required` + `type="email"` already present").

## Step-by-step implementation

1. Read the current `typestest/src/pages/EmailCapturePage.tsx` to inventory the existing form, submit handler, and any `setTimeout` stub to remove.

2. Replace imports. Remove any scoring/MBTI imports. Add:
   ```ts
   import { useEffect, useState } from 'react';
   import { useLocation, useNavigate } from 'react-router-dom';
   import { toast } from 'sonner';
   import { apiPost, ApiError, NetworkError } from '@/lib/api';
   import { getSession, patchSession } from '@/lib/session';
   import { resolveRedirect } from '@/lib/redirectRouter';
   import { getDeviceInfo } from '@/lib/deviceInfo';
   import type { QuizAnswer, QuizSubmitRequestBody, QuizSubmitResponse } from '@/lib/apiTypes';
   ```

3. Type the route state:
   ```ts
   interface EmailRouteState {
     answers: QuizAnswer[];
     startTime: number;
     endTime: number;
   }
   ```

4. Entry guard on mount:
   ```ts
   const location = useLocation();
   const navigate = useNavigate();
   const state = location.state as EmailRouteState | null;

   useEffect(() => {
     if (!state?.answers || !state.startTime || !state.endTime) {
       navigate('/', { replace: true });
     }
   }, [state, navigate]);
   ```

5. Local state:
   ```ts
   const [email, setEmail] = useState('');
   const [submitting, setSubmitting] = useState(false);
   ```
   Keep whatever input-binding pattern the existing component uses; the important point is that on error the typed email must be preserved (AC 8).

6. Submit handler. Build the request body exactly per PRD §6.5:
   ```ts
   const onSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!state) return; // guard should have bounced already
     setSubmitting(true);
     const session = getSession();
     const body: QuizSubmitRequestBody = {
       email,
       variant_type: '',
       quiz_data: state.answers,
       start_time: state.startTime,
       end_time: state.endTime,
       prc_id: session.prcId ?? '',
       pricing_discount: session.mdid ? { mdid: session.mdid } : { mdid: '' },
       user_device_info: getDeviceInfo(),
       landing_url_detail: {
         landing_url: session.landingUrl ?? window.location.origin + '/',
         landing_time: session.landingTime ?? null,
       },
       geo_data: { city: '', region: '' },
     };

     try {
       const res = await apiPost<QuizSubmitResponse>('questions/submit', body);
       patchSession({
         qidRaw: res.quiz_result_id,
         qidEncrypted: res.encrypted_quiz_result_id,
         email,
         pricingInfo: res.pricing_info,
       });
       const route = resolveRedirect(res.redirect_page);
       navigate(`${route}?qid=${encodeURIComponent(res.encrypted_quiz_result_id)}`, { replace: true });
     } catch (err) {
       if (err instanceof ApiError) {
         toast.error(err.message || 'Something went wrong. Please try again.');
       } else if (err instanceof NetworkError) {
         toast.error('Something went wrong. Please try again.');
       } else {
         toast.error('Something went wrong. Please try again.');
       }
       setSubmitting(false);
     }
   };
   ```
   On success we do NOT clear `setSubmitting(false)` — the `navigate` unmounts the component.

7. Wire the button. Existing button text / loading indicator reused; it should reflect `submitting`. Keep HTML5 `required` and `type="email"` — do not add custom validation that duplicates browser checks (AC 9 relies on the built-in block).

8. Do NOT remove or modify the existing form layout / copy.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `npm run build` — succeeds.
- `npm run dev`, then full funnel manual smoke:
  1. **Happy path (AC 1, AC 10, AC 12):** Fresh incognito. `/` → `/instructions` → `/quiz` → answer 60 → `/calculating` → `/email`. Type a valid email. Submit. App lands on `/checkout?qid=<encrypted>`. Open DevTools → Application → sessionStorage → `testiq.session` contains `qidRaw`, `qidEncrypted`, `email`, `pricingInfo`. Network tab: the `POST questions/submit` request carries `Authorization`, `x-host`, `ip_address` headers.
  2. **Timing (AC 6):** Inspect the submit request body. `start_time` ≈ when first question was answered; `end_time` ≈ when final answer was clicked. Both are ms epoch integers.
  3. **Campaign (AC 3):** Start from `/?prc_id=ABC`, run funnel. Submit body contains `prc_id: "ABC"` and `pricing_discount: { mdid: "" }`.
  4. **Campaign (AC 4):** Start from `/?mdid=50`, run funnel. Submit body contains `prc_id: ""` and `pricing_discount: { mdid: "50" }`.
  5. **Backend error toast (AC 8):** In DevTools → Network, right-click `/questions/submit` → Block request URL. Re-run the funnel. Submit shows toast, email still in the input, button recovers from loading.
  6. **Empty email (AC 9):** Click Submit with the input empty. Browser's native validation blocks the submit; no network request fires.
  7. **Refresh survival (AC 13):** Immediately after a successful submit, the URL is `/checkout?qid=…`. Press F5 on `/email` **before** a successful submit — session has whatever was already written (e.g., `prcId`, `ipAddress`). After a successful submit, navigate back to `/email`, refresh: `sessionStorage['testiq.session']` still contains `qidRaw`, `qidEncrypted`, `email`, `pricingInfo`.
  8. **Device (AC 14):** Open DevTools device mode, swap UA to "iPhone". Refresh and run the funnel. Submit body shows `user_device_info: { user_device: "Mobile", user_os: "iOS", user_browser: "Safari" | "Chrome" }` (exact browser depends on the chosen device profile).
- `grep -n "setTimeout" typestest/src/pages/EmailCapturePage.tsx` → zero hits (the stub is gone).

## Done-when

- Real `POST /questions/submit` fires with the body shape from PRD §6.5.
- On success, session is patched with `{ qidRaw, qidEncrypted, email, pricingInfo }`, then navigates to `resolveRedirect(redirect_page)?qid=<encrypted>` with `replace: true`.
- On `ApiError` / `NetworkError`, a toast appears and the email field retains its value.
- Entry guard bounces to `/` when route state is missing.
- All 10 ACs listed under "AC coverage" are verified manually.
- No `setTimeout`-based navigation remains.

## Notes / ambiguities

- **Work plan Risk A1:** If the real submit returns a 4xx complaining about the `answer` field shape, the fix is one line in `useQuiz.answer()` (Task 11), flipping from `option.id` to `positionIndex + 1` or whatever the backend wants. Don't reshape the body here.
- **Work plan Open Items #8:** Toast copy "Something went wrong. Please try again." is placeholder per PRD §10. Final wording is deferred — do not block on it.
- **AC 13 caveat:** Module 1 does not yet route based on session on refresh — Module 2's `useRedirectGuard` (Task 08) handles that. For AC 13 here, the check is only that sessionStorage survives a refresh on `/email`. The hook is unit-tested in Task 08 but not mounted; mounting on CheckoutPage happens in Module 2.
- **AC 12 headers** are injected by `apiPost` (Task 02). This task simply verifies them in DevTools.
- **`landing_url_detail.landing_time` null fallback:** PRD §6.5 explicitly allows `null` when `session.landingTime` is unset. Do not substitute `Date.now()` or `0` — keep `null`.
- **`encodeURIComponent(encrypted_quiz_result_id)`:** the encrypted id may contain `+`, `/`, `=` in base64-ish encodings. URL-encode to avoid corrupting the `qid` query param. Module 2's guard will decode via `URLSearchParams.get`.
