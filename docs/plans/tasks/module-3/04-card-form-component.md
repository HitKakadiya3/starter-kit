# Task 04 — `src/components/checkout/CardForm.tsx` + RTL unit test

**Phase:** 4 · CardForm leaf component
**Work plan task id:** 4.1
**Size:** Small (2 files, both new; 1 new directory `src/components/checkout/`)
**Dependencies:** `02-session-and-use-payment-intent-hook.md` (ordering — CardForm is eventually consumed by CheckoutForm which consumes `usePaymentIntent`; CardForm itself does NOT import the hook). Independent of `03-use-google-pay-hook.md` — Tasks 03 and 04 can be implemented in parallel by two developers if needed.

## Purpose / why this task exists

The inline `<CardElement>` form is a self-contained leaf component. Extracting it from CheckoutForm:

- Keeps CheckoutForm focused on orchestration (three buttons, consent, error slot, Elements wrapper).
- Makes the `CardElement.onChange` → Pay-button gating (PRD §6.3 gating table row 4) testable in RTL without a real Stripe iframe.
- Isolates the `confirmCardPayment` call site for the card method (PRD §4.4.1), separating it from the GPay and PayPal handlers which live in CheckoutForm.

The component is pure UI over `useStripe` + `useElements`. It does NOT call the backend — it reports success via `onSuccess(intentId)` and the parent (CheckoutForm) owns the `finalizeAfterStripeSuccess` call.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §4.4.1 — card method flow (6 numbered steps).
- `docs/prd/module-3-first-payment.md` §4.9 — `<CardElement>` inside `<Elements>` provider; `useStripe()` + `useElements()`; `onChange` gates Pay button via `event.complete`.
- `docs/prd/module-3-first-payment.md` §6.3 — gating table (Pay enabled when `consented && intentReady && cardElement.complete && !submitting`).
- `docs/prd/module-3-first-payment.md` §7 — "Files added" (`CardForm.tsx`).

## AC coverage

Foundation for:

- **AC 11** — clicking the card button reveals `<CardForm>`. (Rendering wiring verified here; the button-click → reveal wiring belongs to Task 05.)
- **AC 12** — Pay button disabled until `CardElement.onChange` reports `complete: true`.
- **AC 13** — Pay label reads `Pay {current.first_sale_price_label}`.
- **AC 14** — non-3DS card success → `onSuccess(paymentIntent.id)` fires.
- **AC 15** — 3DS success → same `onSuccess(paymentIntent.id)` fires (Stripe handles the challenge inside `confirmCardPayment` with default `handleActions: true`).
- **AC 16** — on Stripe error, `error.message` rendered inline; Pay re-enables.

AC 12, 13, 14, 16 are fully closed by this task's RTL suite. AC 11, 15 are fully verified end-to-end in Task 99.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/components/checkout/CardForm.tsx`
- `d:/Projects/TestIQ/typestest/src/components/checkout/CardForm.test.tsx`
- (implicit) the `src/components/checkout/` directory — create it as part of this task if it doesn't already exist.

**Do NOT touch** (in this task):
- `src/components/checkout/CheckoutForm.tsx` — Task 05.
- `src/pages/CheckoutPage.tsx` — Task 06.
- `src/hooks/*` — read-only dependencies (CardForm does not import any Module 3 hook).

## Backend contract reference

None. CardForm only calls `stripe.confirmCardPayment`. The backend confirm lives in CheckoutForm's `handleFinalize` via `usePaymentIntent.finalizeAfterStripeSuccess`.

## Step-by-step implementation

### Step 1 — Create the `src/components/checkout/` directory

If it doesn't exist yet, create it. The directory holds exactly two files across Tasks 04 and 05: `CardForm.tsx` and `CheckoutForm.tsx` (plus their `.test.tsx` counterparts).

### Step 2 — Red phase (write failing RTL tests first)

Create `typestest/src/components/checkout/CardForm.test.tsx`. Setup:

- Mock `@stripe/react-stripe-js`:
  ```ts
  vi.mock('@stripe/react-stripe-js', () => ({
    useStripe: vi.fn(),
    useElements: vi.fn(),
    CardElement: vi.fn((props: { onChange?: (e: unknown) => void }) => {
      // Render a stub that exposes onChange via a data-testid hook.
      return <div data-testid="card-element" onClick={() => props.onChange?.({ complete: true })} />;
    }),
  }));
  ```
  Expose the stub `CardElement`'s `onChange` so tests can fire it imperatively. One common pattern: export the stub's mock module with a helper `fireCardElementChange(event)` that tests call.
- Provide a fake `stripe` via `useStripe` whose `confirmCardPayment` is a `vi.fn()` controllable per test.
- Provide a fake `elements` via `useElements` whose `getElement(CardElement)` returns a sentinel object (e.g. `{ __cardElement: true }`) — the tests assert this sentinel is passed to `confirmCardPayment`.

Write the 9 failing cases:

1. **Initial render** → Pay button has `disabled=true`, no inline error visible, label reads `Pay $4.99` (prop `priceLabel="$4.99"`).
2. **`CardElement.onChange` fired with `{ complete: true }`** → Pay button becomes enabled (still requires `consented: true` and `submitting: false` — both true by default in this case).
3. **`CardElement.onChange` fired with `{ complete: false, error: { message: 'Invalid card number' } }`** → Pay disabled; inline error `'Invalid card number'` visible with `role="alert"`.
4. **Click Pay with `complete: true`** → `stripe.confirmCardPayment` called once with arguments `(clientSecret, { payment_method: { card: <sentinel>, billing_details: { email: 'x@y' } } })` — `email` from the `email` prop. Assert the sentinel is the object returned by `elements.getElement(CardElement)`.
5. **`confirmCardPayment` resolves `{ paymentIntent: { id: 'pi_123', status: 'succeeded' } }`** → `onSuccess('pi_123')` called; `onError` NOT called; inline error NOT rendered.
6. **`confirmCardPayment` resolves `{ error: { message: 'Your card was declined.' } }`** → inline error shows `'Your card was declined.'`; `onError('Your card was declined.')` called; `onSuccess` NOT called; Pay button re-enabled (assert not `disabled`).
7. **`submitting: true` prop** → Pay button shows `Processing…` label and is `disabled` regardless of `complete` state.
8. **`consented: false` prop** → Pay button disabled even when `complete: true` (defence-in-depth; parent won't normally mount the form without consent).
9. **`email: undefined`** → `billing_details.email` sent as `undefined` inside `confirmCardPayment` args (do not fabricate a placeholder like `'unknown@example.com'`).

Run — all 9 fail. Red phase.

### Step 3 — Green phase (implement `src/components/checkout/CardForm.tsx`)

Component contract:

```tsx
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type CardFormProps = {
  clientSecret: string;
  email: string | undefined;
  priceLabel: string;                           // e.g. "$4.99" — from usePricing().current.first_sale_price_label
  submitting: boolean;                          // parent-controlled
  consented: boolean;                           // parent-controlled; belt-and-suspenders
  onSuccess: (intentId: string) => void;
  onError: (message: string) => void;
};

export function CardForm(props: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [complete, setComplete] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const onChange = (event: StripeCardElementChangeEvent) => {
    setComplete(event.complete);
    setInlineError(event.error?.message ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card,
        billing_details: { email: props.email },
      },
    });

    if (error) {
      const msg = error.message ?? 'Payment failed';
      setInlineError(msg);
      props.onError(msg);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      props.onSuccess(paymentIntent.id);
      return;
    }
    // `requires_action` is resolved inside confirmCardPayment by default (handleActions: true).
    // Reaching here with that status means a redirect-based authenticator was used; the
    // component unmounts on redirect and CheckoutForm's usePaymentIntent handles return in Task 02.
  };

  const disabled = !complete || !props.consented || props.submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="border border-border rounded-md p-3 bg-card">
        <CardElement onChange={onChange} />
      </div>
      {inlineError && (
        <div role="alert" className="text-sm text-destructive">{inlineError}</div>
      )}
      <Button
        type="submit"
        disabled={disabled}
        className="w-full py-6 text-lg font-semibold"
        size="lg"
      >
        {props.submitting ? 'Processing…' : `Pay ${props.priceLabel}`}
      </Button>
    </form>
  );
}
```

Guardrails:
- Import `Button` from the existing `@/components/ui/button` (Module 1/2 uses this path).
- The Pay button's `className` must match the rest of CheckoutPage's payment buttons (`w-full py-6 text-lg font-semibold`, `size="lg"`) so the inline form visually continues the button stack.
- Do NOT call `finalizeAfterStripeSuccess` here — that's CheckoutForm's responsibility.
- Do NOT import `stripePromise` — `useStripe()` provides the Stripe instance because CardForm renders inside `<Elements>`.

### Step 4 — Refactor phase

- If test case 3 reveals readability issues with the two separate state setters in `onChange`, consider a single `setState` over a reducer. Not required.
- Run the 9 tests; all green.

### Step 5 — Isolation check

```sh
grep -rn "from.*components/checkout/CardForm" typestest/src
```

Expected: only `src/components/checkout/CardForm.test.tsx`. CheckoutForm consumes it in Task 05; CheckoutPage never imports it directly.

## Completion criteria (done-when)

- [x] `src/components/checkout/CardForm.tsx` implements the contract above.
- [x] `src/components/checkout/CardForm.test.tsx` has 9 passing RTL cases (step 2).
- [x] Component imports only `useStripe`, `useElements`, `CardElement` from `@stripe/react-stripe-js` (no direct `@stripe/stripe-js` import).
- [x] Component does NOT call the backend (`apiPost` not imported).
- [x] Pay button visual classes match the rest of CheckoutPage's buttons (`w-full py-6 text-lg font-semibold`, `size="lg"`).
- [x] No file elsewhere imports `CardForm` yet (grep check in step 5).
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/components/checkout/CardForm.test.tsx   # → 9 passing.
npx tsc --noEmit                                           # Zero errors.
npm run lint                                               # Zero errors.
npm run build                                              # Succeeds.
npm run test                                               # Full suite green.
```

No dev-server smoke — `<CardElement>` needs the real Stripe iframe to render meaningfully; that's Task 99.

## Notes / ambiguities

- **3DS (AC 15)**: `confirmCardPayment` with the default `handleActions: true` resolves only after Stripe has handled the 3DS challenge in-flight (an iframe overlay). The `{ paymentIntent: { status: 'succeeded' } }` branch covers both non-3DS and post-3DS success identically — no special handling needed in CardForm. The rare redirect-based authenticator case resolves via CheckoutForm's URL-return handler in Task 02.
- **Empty `email`**: the user prop can be `undefined` if the session.email is missing (shouldn't happen in a valid funnel, but defensive). Stripe accepts `email: undefined` in `billing_details`; do not fabricate a placeholder.
- **`priceLabel` formatting**: the parent passes `current.first_sale_price_label` from `usePricing()`, which already includes the currency symbol and decimal formatting (Module 2 decision). CardForm does not re-format — it interpolates verbatim.
- **`cardElementOptions`** (PRD §4.9): the inline `<CardElement>` can use the default styling; Elements' `appearance: { theme: 'stripe', variables: { colorPrimary: 'hsl(270 50% 45%)' } }` option (set on the `<Elements>` provider in Task 05) themes the iframe globally. No per-element theming needed here.
- **Second-click-collapses behaviour (AC 17)**: not in CardForm's scope. The parent toggles `activeMethod` and conditionally renders CardForm — Task 05.
