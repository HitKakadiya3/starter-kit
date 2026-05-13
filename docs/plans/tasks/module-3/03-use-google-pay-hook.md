# Task 03 — `src/hooks/useGooglePay.ts` + unit tests

**Phase:** 3 · Google Pay hook
**Work plan task id:** 3.1
**Size:** Small (2 files, both new)
**Dependencies:** `02-session-and-use-payment-intent-hook.md` (the hook is composed inside CheckoutForm alongside `usePaymentIntent`; this task depends on it only for ordering, not for imports — `useGooglePay` does not import `usePaymentIntent`)

## Purpose / why this task exists

The Google Pay flow has a distinct Stripe SDK surface (`stripe.paymentRequest` + the `paymentmethod` event) that would clutter CheckoutForm if wired inline. Encapsulating it in its own hook:

- Isolates the ref-stable `PaymentRequest` instance (must survive re-renders, PRD §4.9).
- Exposes a small imperative handle (`show()`) that CheckoutForm can wire to the existing GPay button's `onClick`.
- Makes `canMakePayment()` tri-state (`null` while checking, `true`/`false` after) so CheckoutForm's disabled-with-tooltip gating (PRD §6.3) is a simple prop check.
- Keeps all GPay branching (construction, availability polling, event subscription, cleanup) in one mockable unit.

The hook does NOT call `stripe.confirmCardPayment` itself — the component implements the two-stage `confirmCardPayment(handleActions: false) → handleCardAction` flow on the `paymentmethod` event so the 3DS behaviour (PRD §4.4.2 step 5) is visible in CheckoutForm, not buried in a hook.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §4.4.2 — GPay method flow (6 numbered steps, verbatim).
- `docs/prd/module-3-first-payment.md` §4.9 — `paymentRequest` instance lives in the outer CheckoutForm, ref-stable across re-renders.
- `docs/prd/module-3-first-payment.md` §6.3 — gating table (GPay button enabled when `consented && intentReady && canMakePayment === true`).
- `docs/prd/module-3-first-payment.md` §7 — "Files added" (`useGooglePay.ts`).

## AC coverage

Foundation for:

- **AC 18** — `canMakePayment()` called on mount; truthy-for-googlePay result gates the button. Hook exposes this as `available: boolean | null`.
- **AC 19** — clicking enabled GPay button opens the native sheet. Hook exposes `show()`.
- **AC 20** — on `paymentmethod` event, caller receives `event.paymentMethod.id` + `event.complete`. Hook passes the event through to `onPaymentMethod`.
- **AC 21, 22** — `event.complete('success' | 'fail')` wiring. Hook passes `event.complete` through; caller decides success/fail.

All four ACs are fully closed only once Task 05 wires the hook into CheckoutForm; Task 99 is the end-to-end verification against a real Chrome wallet.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.ts`
- `d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.test.tsx`

**Do NOT touch** (in this task):
- `src/components/checkout/*` — Task 04 and Task 05.
- `src/hooks/usePaymentIntent.ts` — read-only dependency.
- `src/lib/stripe.ts` — the hook gets its `Stripe` via `useStripe()` from `@stripe/react-stripe-js`, not via `stripePromise` directly (it runs inside `<Elements>`).

## Backend contract reference

None. This hook only touches Stripe's client SDK. Backend confirm lives in `usePaymentIntent.finalizeAfterStripeSuccess`.

## Step-by-step implementation

### Step 1 — Red phase (write failing tests first)

Create `typestest/src/hooks/useGooglePay.test.tsx`. Setup:

- Mock `@stripe/react-stripe-js`:
  ```ts
  vi.mock('@stripe/react-stripe-js', () => ({
    useStripe: vi.fn(),
  }));
  ```
- In each test, configure `useStripe` to return either `null` (SDK not yet loaded) or a fake `Stripe` whose `paymentRequest` method returns a controllable fake `PaymentRequest`. The fake `PaymentRequest` should expose:
  - `canMakePayment: vi.fn()` resolving to whatever the test wants.
  - `on: vi.fn()`, `off: vi.fn()`, `show: vi.fn()`.
- Use `@testing-library/react`'s `renderHook` and `act`.

Write the 11 failing cases below:

1. **Stripe not yet loaded** (`useStripe()` returns `null`) → `available: null`, `paymentRequest: undefined`, `show()` is a no-op (asserting nothing throws).
2. **Mount with valid inputs** (`clientSecret: 'cs_x'`, `pricing: { currency_code: 'USD', first_sale_price: '4.99' }`) → `stripe.paymentRequest` called exactly once with `{ country: 'US', currency: 'usd', total: { label: 'Total', amount: 499 } }` (verify lowercase currency if Stripe expects that; most Stripe examples use lowercase).
3. **`canMakePayment()` resolves `{ googlePay: true }`** → `available: true` (assert via `waitFor`).
4. **`canMakePayment()` resolves `null`** → `available: false`.
5. **`canMakePayment()` resolves `{ applePay: true }`** → `available: true` (documented expansion: the same button surfaces Apple Pay too per PRD §3 out-of-scope note; intentional per Open item O5).
6. **`paymentmethod` event fires** → injected `onPaymentMethod` callback is invoked with the event object (verify via spy).
7. **`show()` called while `available: true`** → underlying `pr.show()` invoked exactly once.
8. **`show()` called while `available: false`** → `pr.show()` NOT called (no-op branch).
9. **`clientSecret` changes to a new value** → a new `PaymentRequest` is constructed (the old one's `off('paymentmethod', …)` is called — leak check).
10. **Unmount** → `pr.off('paymentmethod', …)` called so the listener is released.
11. **`first_sale_cents_price: '499'` explicit** (instead of dollars) → `amount: 499` without multiplying.

Run — all 11 fail. Red phase.

### Step 2 — Green phase (implement `src/hooks/useGooglePay.ts`)

Hook contract:

```ts
import type { PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';

export type UseGooglePayOptions = {
  clientSecret: string | undefined;
  pricing: {
    currency_code: string;
    first_sale_cents_price?: string;
    first_sale_price: string;
  } | undefined;
  country?: string;             // default 'US'
  onPaymentMethod: (event: PaymentRequestPaymentMethodEvent) => Promise<void>;
  // The component implements confirmCardPayment + backend confirm + event.complete inside this callback.
};

export type UseGooglePayResult = {
  available: boolean | null;    // null = still checking; false = not available; true = available
  show: () => void;             // imperative; no-op when not available
  paymentRequest: PaymentRequest | undefined;
};

export function useGooglePay(opts: UseGooglePayOptions): UseGooglePayResult;
```

Lifecycle (PRD §4.4.2):

1. **On mount** (or when `clientSecret`/`pricing.first_sale_price` change):
   - Gate: if `stripe` (from `useStripe()`) is null, `clientSecret` is undefined, or `pricing` is undefined → `available: null`, no construction.
   - Compute the amount in cents:
     ```ts
     const amount = parseInt(
       pricing.first_sale_cents_price
         ?? String(Math.round(Number(pricing.first_sale_price) * 100))
     );
     ```
     (The `first_sale_cents_price` check mirrors PRD §4.4.2 step 1 verbatim.)
   - Construct:
     ```ts
     const pr = stripe.paymentRequest({
       country: opts.country ?? 'US',
       currency: pricing.currency_code.toLowerCase(),
       total: { label: 'Total', amount },
       requestPayerEmail: false,
       requestPayerName: false,
     });
     ```
   - Store `pr` in a `useRef` so re-renders don't reconstruct it (PRD §4.9 ref-stable requirement).
   - Call `pr.canMakePayment()`. On resolve: `available = !!result?.googlePay || !!result?.applePay` (either surfaces on the same button — see Open item O5).
   - Subscribe: `pr.on('paymentmethod', opts.onPaymentMethod)`.

2. **Cleanup** (unmount or dependency change): `pr.off('paymentmethod', opts.onPaymentMethod)`. If dependencies changed and a new `pr` is about to be constructed, release the old listener first.

3. **`show()`**: if `available === true` and `pr` exists, call `pr.show()`. Otherwise no-op. Do NOT throw; silent no-op keeps the caller's click-handler simple.

4. **Error surface**: if `stripe.paymentRequest` throws (rare — malformed currency), set `available: false` and `console.error(...)`. Do not surface the error to the caller; Module 3's UX treats GPay unavailability as a capability signal, not a failure (PRD §4.10 GPay-unavailable branch).

Use `useEffect` for mount/cleanup; `useRef` for the `pr` instance; `useState` for `available`.

### Step 3 — JSDoc (required for Phase 3 completion)

Add a JSDoc block above the hook describing the Apple-Pay expansion behaviour:

```ts
/**
 * Wraps Stripe's `paymentRequest` API for the Google Pay button.
 *
 * Apple-Pay note: the underlying PaymentRequest instance surfaces both Google
 * Pay (Chrome + Android wallet) AND Apple Pay (Safari) when available.
 * `available: true` is returned when either is reported by canMakePayment().
 * Our CheckoutForm renders the same "Google Pay" label + icon regardless —
 * intentional per PRD §3 out-of-scope ("no separate Apple Pay button") and
 * flagged as Open item O5.
 *
 * See PRD §4.4.2 + §4.9.
 */
```

### Step 4 — Refactor phase

- Extract `computeAmountCents(pricing)` as a pure helper within the same file.
- Run the 11 tests; all green.

### Step 5 — Isolation check

```sh
grep -rn "from.*hooks/useGooglePay" typestest/src
```

Expected: only `src/hooks/useGooglePay.test.tsx`. No component or page imports it yet.

## Completion criteria (done-when)

- [x] `src/hooks/useGooglePay.ts` implements the contract above.
- [x] `src/hooks/useGooglePay.test.tsx` has 11 passing cases (step 1).
- [x] Hook does NOT import `@stripe/stripe-js` directly — the `Stripe` object comes exclusively from `useStripe()` (`@stripe/react-stripe-js`).
- [x] Hook does NOT import `usePaymentIntent` or any component.
- [x] JSDoc documents the Apple-Pay expansion (step 3).
- [x] No file under `src/components/` or `src/pages/` imports the hook yet.
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/hooks/useGooglePay.test.tsx     # → 11 passing.
npx tsc --noEmit                                   # Zero errors.
npm run lint                                       # Zero errors.
npm run build                                      # Succeeds.
npm run test                                       # Full suite green.
```

No dev-server smoke in this task; the hook has no consumers. The real GPay sheet is manually verified in Task 99 on Chrome with a configured wallet.

## Notes / ambiguities

- The hook exposes `onPaymentMethod` as an option (caller-supplied callback) rather than calling `stripe.confirmCardPayment` internally. This is deliberate: the two-stage `confirmCardPayment(handleActions: false) → handleCardAction` flow (PRD §4.4.2 step 5) is cleaner in CheckoutForm where it sits alongside the card-submit and PayPal-submit handlers. The hook stays pure — it only wires the SDK, not the business logic.
- **Currency case**: Stripe's `paymentRequest` expects lowercase currency codes (`'usd'`, `'eur'`). `pricing.currency_code` from the backend is likely uppercase. Lowercase with `.toLowerCase()` at the call site.
- **Country default**: `'US'` is the fallback. If the backend ever returns a country field on pricing, wire it through the `country` option later. Not in Module 3 scope.
- **Apple-Pay bonus behaviour**: documented in JSDoc (step 3) and Open item O5. If marketing wants a distinct Apple Pay button later, that's a future module — `useGooglePay` stays as-is.
- **Cleanup robustness**: the `off('paymentmethod', handler)` call must pass the same reference that was passed to `on(...)`. Store the handler in a ref to guarantee identity stability across renders.
