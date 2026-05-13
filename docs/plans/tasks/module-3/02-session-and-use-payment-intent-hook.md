# Task 02 — `FunnelSession.paymentIntent` + `src/hooks/usePaymentIntent.ts` + unit tests

**Phase:** 2 · Session + payment-intent hook
**Work plan task id:** 2.1
**Size:** Medium (2 new + 1 modified)
**Dependencies:** `01-stripe-sdk-and-env.md` (imports `stripePromise` for `retrievePaymentIntent` calls via the loaded `Stripe` object)

## Purpose / why this task exists

`usePaymentIntent` is the stateful core of Module 3. It encapsulates every decision documented in PRD §4.3 (intent lifecycle + reuse rules), §4.4.4 (return-from-redirect state machine), and §4.5 (backend confirm body + response merge). Landing it **before any UI consumes it** means:

- All branch logic (create vs. reuse vs. recover vs. process-poll vs. fail) is exercised by mocked unit tests, not by clicking around a real Stripe iframe.
- The CheckoutForm integration (Task 05) reduces to "wire the hook's outputs into buttons and `<Elements>`" with no new branching to test at the component level.
- StrictMode double-mount, 23h TTL, `keyedBy` tuple mismatches, and the `retrievePaymentIntent(cached)` recovery path are covered here — not scattered across components later.

The `FunnelSession.paymentIntent` field is a type-level change that **must** precede the hook (the hook reads/writes it). Co-committing the interface extension with the hook avoids a dead type-only commit.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §4.3 — intent lifecycle + session cache shape + reuse rules (four numbered steps).
- `docs/prd/module-3-first-payment.md` §4.4.4 — return-from-redirect state machine (three cases: success / processing / failed).
- `docs/prd/module-3-first-payment.md` §4.5 — backend confirm body + response-merge rules.
- `docs/prd/module-3-first-payment.md` §4.6 — `return_url` shape.
- `docs/prd/module-3-first-payment.md` §4.8 — `payment_method_type: ''` on create.
- `docs/prd/module-3-first-payment.md` §7 — "Files added" (`usePaymentIntent.ts`) + "Changes to existing code" (`FunnelSession`).

## AC coverage

Foundation for:

- **AC 1** — intent created exactly once on fresh session.
- **AC 5** — never creates an intent when `session.pricingInfo` is missing.
- **AC 6** — promo code (`prc_id` / `mdid`) passed into both create and confirm bodies.
- **AC 7** — refresh mid-payment reuses the cached intent (no duplicate create).
- **AC 8** — recovered-succeeded intent: `retrievePaymentIntent` returns `succeeded` on mount → caller can finalise.
- **AC 9** — `finalizeAfterStripeSuccess` merges `cross_sale` into `session.pricingInfo.transactions.cross_sale`, clears `session.paymentIntent`.
- **AC 25** — on PayPal return with `redirect_status=succeeded`, hook strips URL params via `history.replaceState` then exposes the recovered intent (caller finalises).
- **AC 26** — on PayPal return without `redirect_status=succeeded` (cancellation), hook surfaces error state; no confirm call.

AC 1, 5, 7, 25, 26 are fully verifiable here with mocked SDK. AC 6, 8, 9 are fully closed only once Task 05 wires the hook into CheckoutForm (final verification in Task 99).

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/hooks/usePaymentIntent.ts`
- `d:/Projects/TestIQ/typestest/src/hooks/usePaymentIntent.test.tsx`

**Modify:**
- `d:/Projects/TestIQ/typestest/src/lib/session.ts` — extend the `FunnelSession` interface with the optional `paymentIntent` field (see §4.3 shape below). No other change to session.ts; no changes to the patch/clear helpers (they already operate over arbitrary keys).

**Do NOT touch** (in this task):
- `src/pages/CheckoutPage.tsx` — integration is Task 06.
- `src/components/checkout/*` — those live in Tasks 04 and 05.
- `src/hooks/usePricing.ts` (Module 2) — untouched.

## Backend contract reference

- `docs/Frontend API List.postman_collection.json`:
  - `POST /payment/stripe/create-payment-intent` — request includes `email`, `quiz_result_id`, promo params; response most likely has `client_secret` directly under `data` (Module 2's usePricing precedent: `apiPost` already unwraps one `{ meta, data }` envelope). Document the empirically observed shape in a JSDoc comment at the `apiPost` call site, same as Module 2 did for `/price`.
  - `POST /payment/stripe/first-sale/payments/confirm` — request body per PRD §4.5; response has `cross_sale` (object with `is_compulsory: boolean` + fields Module 4 reads), `redirect_page` (string), `first_sale_usd_price` (string).

Use `apiPost` from `src/lib/api.ts` (shipped in Module 1) — do NOT call `fetch` directly.

## Step-by-step implementation

### Step 0 — Empirically resolve the `POST /payment/stripe/create-payment-intent` envelope

Following the Module 2 `usePricing` precedent (and the scope doc's envelope-precedent rule):

1. `npm run dev` — start the dev server.
2. From DevTools console on any post-email page, run a scratch `apiPost` call with a valid `email` + `quiz_result_id` from the current session plus `payment_method_type: ''`, `prc_id: session.prcId ?? ''`, `pricing_discount: ''` (or `{ mdid: session.mdid }` if present).
3. Inspect the returned object:
   - If `client_secret` is top-level → `apiPost<{ client_secret: string; id: string }>('payment/stripe/create-payment-intent', body)` resolves the value directly. Use that.
   - If wrapped (e.g. `{ intent: { client_secret, id } }`) → adapt the call site.
4. Document the observed shape in a code comment at the top of the `createIntent` block in the hook, referencing PRD §4.3 and mirroring the Module 2 usePricing JSDoc.
5. Delete the scratch call; do not commit it.

Do the same spot-check for `POST /payment/stripe/first-sale/payments/confirm` — but this is harder to exercise without a real successful intent, so it's acceptable to defer the confirm-envelope resolution to the first end-to-end smoke in Task 99 and code the hook against the most likely shape (same envelope precedent).

### Step 1 — Extend `FunnelSession` in `src/lib/session.ts`

Add the optional `paymentIntent` field to the `FunnelSession` interface. The PRD §4.3 shape, verbatim:

```ts
paymentIntent?: {
  id: string;                 // pi_…
  clientSecret: string;
  keyedBy: {                  // inputs the intent was created for
    qidRaw: number;
    prcId: string;
    mdid: string;
  };
  createdAt: number;          // ms (Date.now())
};
```

Rules:
- Place the field in a logical spot in the interface (after `pricingInfo`, keeping related funnel-state fields contiguous).
- Do NOT add a runtime validator; Module 1 uses a plain TS interface with no zod guard.
- Do NOT modify `patchSession` or `clearSession` helpers — they already operate over `Partial<FunnelSession>` and bulk-clear.
- Confirm that all existing consumers (grep for `FunnelSession` across `src/`) still typecheck — the field is optional, so they should.

### Step 2 — Red phase (write failing tests first)

Create `typestest/src/hooks/usePaymentIntent.test.tsx`. Use:

- Vitest + `@testing-library/react` (`renderHook` pattern, same as Module 2's `usePricing.test.tsx`).
- Mock `@stripe/stripe-js`: `vi.mock('@stripe/stripe-js', () => ({ loadStripe: vi.fn() }))`. The default `loadStripe` mock resolves to a fake `Stripe` object whose `retrievePaymentIntent` method is a `vi.fn()` controllable per test.
- Mock `apiPost` from `@/lib/api` per Module 1 convention.
- Reset `sessionStorage` and `window.history.replaceState` between tests.

Write all 15 failing test cases below (names are indicative; follow the project's `.test.tsx` naming/style conventions):

1. **Fresh mount, session has `pricingInfo`, no cache** → state transitions `idle → creating → ready`; `clientSecret` exposed; exactly one `apiPost('payment/stripe/create-payment-intent', …)` call; `session.paymentIntent` populated with correct `keyedBy.qidRaw`/`prcId`/`mdid`/`createdAt`.
2. **Fresh mount, `session.pricingInfo` missing** → stays `state: 'idle'`; zero API calls. (AC 5)
3. **Cached intent, `keyedBy` matches current tuple, `createdAt < 23h`** → `retrievePaymentIntent` returns `{ status: 'requires_payment_method' }` → hook reuses → `state: 'ready'` with cached `clientSecret`; zero `create-payment-intent` calls. (AC 7)
4. **Cached intent, `keyedBy.prcId` mismatch** → cache dropped, fresh POST, new intent stored.
5. **Cached intent, `createdAt > 23h` (22h + 59m passes; 23h fails)** → cache dropped, fresh POST.
6. **Cached intent, `retrievePaymentIntent` returns `{ status: 'succeeded' }`** → `state: 'ready'` with `recoveredSucceeded: true` and `intentId` set; does NOT auto-call `finalizeAfterStripeSuccess`. (AC 8 — caller finalises per design decision)
7. **Cached intent, `retrievePaymentIntent` returns `{ status: 'canceled' }`** → cache dropped, fresh POST.
8. **URL has `?payment_intent=pi_x&payment_intent_client_secret=cs_x&redirect_status=succeeded`** → `history.replaceState` called FIRST (with Stripe params stripped), THEN `retrievePaymentIntent(cs_x)` → `state: 'ready'` with `recoveredSucceeded: true`. (AC 25)
9. **URL has `redirect_status=failed`** → `session.paymentIntent` cleared; `state: 'error'` with `last_payment_error.message`; zero confirm call. (AC 26)
10. **URL has `redirect_status=processing`** → hook enters `recovering` state and polls `retrievePaymentIntent` every 2s (use `vi.useFakeTimers()`); on 3rd poll Stripe returns `succeeded` → `state: 'ready'` with `recoveredSucceeded: true`. Test also covers the 30s timeout branch: on timeout, expose `state: 'ready'` with `processingTimedOut: true`.
11. **`finalizeAfterStripeSuccess('pi_abc')` success** → POSTs to `payment/stripe/first-sale/payments/confirm` with body `{ payment_intent_id: 'pi_abc', quiz_result_id: session.qidRaw, user_on_iqbooster: '', prc_id: session.prcId, pricing_discount: { mdid: session.mdid } }`; on response, merges `response.cross_sale` into `session.pricingInfo.transactions.cross_sale`, sets `session.pricingInfo.cross_sale_compulsory ??= response.cross_sale.is_compulsory`, clears `session.paymentIntent`, returns the full response. (AC 6 promo propagation, AC 9 merge)
12. **`finalizeAfterStripeSuccess` error (network / 5xx)** → `state: 'error'`; `session.paymentIntent` NOT cleared (so caller's Retry can re-call finalize with same `intentId`); error is `throw`n to the caller.
13. **`retry()` after a create-intent failure** → clears error state, re-fires the create POST, transitions `creating → ready`.
14. **StrictMode double-mount** → render the hook twice inside the same act cycle (simulates `<StrictMode>`); assert exactly one `create-payment-intent` POST fired (R9 guard via `inFlightRef`).
15. **PRC + MDID both empty** → create body has `prc_id: ''` and `pricing_discount: ''` (empty-string branch per PRD §4.5). (AC 6 empty-string case)

Run the suite — all 15 fail. Red phase.

### Step 3 — Green phase (implement `src/hooks/usePaymentIntent.ts`)

Hook contract (from PRD §4.3 + §4.4.4):

```ts
export type PaymentIntentState =
  | 'idle'           // waiting for session readiness (no pricingInfo, etc.)
  | 'creating'       // POST create-payment-intent in flight
  | 'recovering'     // return-URL or cache-succeeded detection in flight (incl. 30s processing poll)
  | 'confirming'     // finalizeAfterStripeSuccess in flight
  | 'ready'          // clientSecret available, Stripe confirm calls can fire
  | 'error';

export type ConfirmResponse = {
  cross_sale: { is_compulsory: boolean; [k: string]: unknown };
  redirect_page: string;
  first_sale_usd_price: string;
};

export type UsePaymentIntentResult = {
  state: PaymentIntentState;
  clientSecret: string | undefined;
  intentId: string | undefined;
  error: string | undefined;
  /** True only on the return-URL-succeeded path and the cached-succeeded path.
   *  Caller observes and calls finalizeAfterStripeSuccess(intentId). */
  recoveredSucceeded: boolean;
  /** True only when the 30s processing poll timed out. Caller can render a
   *  "continue anyway" CTA that still calls finalizeAfterStripeSuccess. */
  processingTimedOut: boolean;
  retry: () => void;
  finalizeAfterStripeSuccess: (intentId: string) => Promise<ConfirmResponse>;
};

export function usePaymentIntent(): UsePaymentIntentResult;
```

Lifecycle implementation (PRD §4.3 + §4.4.4):

**Mount step A — URL-return detection** (runs first):
1. Read `window.location.search`. If it has `payment_intent`, `payment_intent_client_secret`, and `redirect_status`:
   - Immediately strip those three params via `history.replaceState({}, '', strippedUrl)`. Do this **before** any async work (PRD §9 R8; ~50ms leak window is acceptable).
   - Resolve the Stripe object via `await stripePromise`. If null, `state: 'error'`.
   - Call `stripe.retrievePaymentIntent(payment_intent_client_secret)`.
   - Branch:
     - `redirect_status === 'succeeded'` and intent status is `succeeded` → `state: 'ready'`, `recoveredSucceeded: true`, `intentId = intent.id`, `clientSecret = payment_intent_client_secret`. Do NOT auto-finalise.
     - `redirect_status === 'processing'` → `state: 'recovering'`, start a 2s-interval poll of `retrievePaymentIntent(clientSecret)` up to 30s. On transition to `succeeded`, act as above. On timeout (30s elapsed), move to `state: 'ready'` with `processingTimedOut: true` and an `error` message; caller can render a "Continue anyway" CTA.
     - `redirect_status === 'failed'` OR intent status is `requires_payment_method` → drop `session.paymentIntent`, `state: 'error'` with message from `intent.last_payment_error?.message ?? 'Payment failed'`.

**Mount step B — cached-succeeded detection** (runs only if step A didn't match):
- If `session.paymentIntent` is present, call `stripe.retrievePaymentIntent(session.paymentIntent.clientSecret)`.
  - `status === 'succeeded'` → same as step A success: `state: 'ready'`, `recoveredSucceeded: true`.
  - `status === 'canceled'` → drop cache, continue to step C.
  - otherwise → continue to step C with the cache.

**Mount step C — reuse validation**:
- If `session.paymentIntent` is still present after step B, check:
  - `keyedBy.qidRaw === session.qidRaw && keyedBy.prcId === (session.prcId ?? '') && keyedBy.mdid === (session.mdid ?? '')`, AND
  - `Date.now() - createdAt < 23 * 60 * 60 * 1000`.
- On match → `state: 'ready'` with cached `clientSecret`. Zero network.
- On mismatch or expiry → clear cache, continue to step D.

**Mount step D — creation**:
- Guard: if `session.pricingInfo` is missing, remain `state: 'idle'` and exit (AC 5).
- Guard: use a `useRef<Promise<void> | null>` to single-flight the create call (StrictMode guard, R9).
- POST body (PRD §4.8 + §4.5 pattern):
  ```ts
  {
    email: session.email,
    quiz_result_id: session.qidRaw,
    payment_method_type: '',
    prc_id: session.prcId ?? '',
    pricing_discount: session.mdid ? { mdid: session.mdid } : '',
  }
  ```
- On success, write `{ id, clientSecret, keyedBy: { qidRaw, prcId: session.prcId ?? '', mdid: session.mdid ?? '' }, createdAt: Date.now() }` into `session.paymentIntent` via `patchSession`. Transition `state: 'ready'`.
- On error (`ApiError` from `apiPost`), `state: 'error'` with the message.

**`finalizeAfterStripeSuccess(intentId)`** (PRD §4.5):
```ts
const response = await apiPost<ConfirmResponse>('payment/stripe/first-sale/payments/confirm', {
  payment_intent_id: intentId,
  quiz_result_id: session.qidRaw,
  user_on_iqbooster: '',
  prc_id: session.prcId ?? '',
  pricing_discount: session.mdid ? { mdid: session.mdid } : '',
});
// Merge cross_sale into pricingInfo.transactions.cross_sale (create path if missing).
// Set session.pricingInfo.cross_sale_compulsory ??= response.cross_sale.is_compulsory.
// Clear session.paymentIntent via patchSession({ paymentIntent: undefined }).
return response;
```

On error: set `state: 'error'`, **do not clear** `session.paymentIntent` (retry-able), re-throw.

**`retry()`**: clear `error`, re-enter the lifecycle at the appropriate step. If the cache is empty, go to step D. Otherwise, re-validate step C.

### Step 4 — Refactor phase

- Extract pure helpers where natural: `isKeyedByMatch(cached, session)`, `isCacheFresh(createdAt, now)`, `stripStripeParamsFromUrl(search)`. Keep them in the same file; do not over-abstract.
- Add JSDoc comments at each of the four mount steps (A/B/C/D) referencing the PRD section.
- Run the 15 tests; all green.

### Step 5 — Isolation check

```sh
grep -rn "from.*hooks/usePaymentIntent" typestest/src
```

Expected: only `src/hooks/usePaymentIntent.test.tsx` matches. No component or page imports it yet — that happens in Task 05.

## Completion criteria (done-when)

- [x] `FunnelSession.paymentIntent` present in `src/lib/session.ts`; all existing `FunnelSession` consumers typecheck without casts.
- [x] `src/hooks/usePaymentIntent.ts` implements the lifecycle and contract from PRD §4.3 + §4.4.4 + §4.5.
- [x] `src/hooks/usePaymentIntent.test.tsx` has 15 passing cases (listed in step 2).
- [x] Hook's only Stripe SDK touchpoint is `stripe.retrievePaymentIntent` (and internal typing). It does NOT call `confirmCardPayment`, `confirmPayment`, or construct `paymentRequest` — those belong to Task 05 and Task 03 respectively.
- [x] No file under `src/components/` or `src/pages/` imports the hook yet (grep check in step 5).
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/hooks/usePaymentIntent.test.tsx   # → 15 passing.
npx tsc --noEmit                                     # Zero errors.
npm run lint                                         # Zero errors.
npm run build                                        # Succeeds.
npm run test                                         # Full suite green.
```

No dev-server smoke required here — the hook has zero UI consumers yet.

## Notes / ambiguities

- **Design decision (Open item O3)**: on return-URL-succeeded and cached-succeeded paths, the hook **exposes** `recoveredSucceeded: true` but does NOT auto-call `finalizeAfterStripeSuccess`. The caller observes and calls it. Rationale: keeps the hook's API symmetric across all three payment methods — the component always finalises explicitly. If this complicates Task 05 meaningfully, swap to auto-finalise and update the test suite accordingly.
- **Processing-poll timeout (§4.4.4.1.c)**: 30s is the PRD-prescribed cap. At timeout, `processingTimedOut` flips true; the caller's UX renders a "Continue anyway" CTA that calls `finalizeAfterStripeSuccess(intentId)` against the still-processing intent — the backend treats `processing` intents as pending; acceptable trade-off per PRD.
- **StrictMode** (R9): React 18 dev mounts effects twice. The `inFlightRef` guard ensures the create POST fires exactly once even on duplicate mount. Test case 14 exercises this.
- **Envelope ambiguity** for create-intent and confirm: resolve empirically (step 0). Document observed shape in a JSDoc comment. If either endpoint's shape differs from the Module 2 precedent, adapt the `apiPost<T>` generic and any downstream typing.
- **23h TTL**: Stripe intents live 24h; the 1h margin prevents races where a cached intent dies mid-confirm.
- **sessionStorage is per-tab** (R3): two tabs on the same `/checkout?qid=…` may each create an intent. Accepted for v1 — no code action here.
