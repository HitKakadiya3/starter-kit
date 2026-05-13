# Task 05 — `src/components/checkout/CheckoutForm.tsx` + integration test

**Phase:** 5 · CheckoutForm wrapper
**Work plan task id:** 5.1
**Size:** Medium (2 files, both new)
**Dependencies:**
- `02-session-and-use-payment-intent-hook.md` — `usePaymentIntent` is the orchestration backbone.
- `03-use-google-pay-hook.md` — `useGooglePay` wires the GPay button.
- `04-card-form-component.md` — `CardForm` is rendered inside this wrapper when `activeMethod === 'card'`.

## Purpose / why this task exists

CheckoutForm is the single React surface that replaces the current three-button trio on CheckoutPage. It composes:

- The `<Elements>` provider (with `clientSecret` and `appearance` options).
- The consent checkbox that gates all three buttons.
- The three existing-visual buttons (Google Pay pill, PayPal blue, green "Credit or debit card") — byte-for-byte-preserved class strings and inline styles.
- The error alert slot.
- The inline `<CardForm />` rendered when `activeMethod === 'card'`.
- The three onClick handlers + the `onPaymentMethod` callback for `useGooglePay`.
- The `assertKeyMatchesMode(pricing.payment_mode)` call at mount (AC 10 closure point).
- The auto-finalise observer for `usePaymentIntent.recoveredSucceeded` (PayPal return + cached-succeeded paths).

This task is the integration layer. It depends on every Module 3 artifact landed so far and is the last task before CheckoutPage itself is modified.

## PRD anchor

- `docs/prd/module-3-first-payment.md` §4.1 — `assertKeyMatchesMode` call site at mount.
- `docs/prd/module-3-first-payment.md` §4.4.1 — card handler via CardForm.
- `docs/prd/module-3-first-payment.md` §4.4.2 — GPay handler (two-stage `confirmCardPayment` + `handleCardAction`).
- `docs/prd/module-3-first-payment.md` §4.4.3 — PayPal handler (`stripe.confirmPayment` with `payment_method_data: { type: 'paypal' }`).
- `docs/prd/module-3-first-payment.md` §4.4.4 — return-from-redirect (hook exposes state; component observes and finalises).
- `docs/prd/module-3-first-payment.md` §4.5 — backend confirm body + response navigation (via hook's `finalizeAfterStripeSuccess`).
- `docs/prd/module-3-first-payment.md` §4.6 — `return_url` shape.
- `docs/prd/module-3-first-payment.md` §4.7 — consent checkbox copy + gating.
- `docs/prd/module-3-first-payment.md` §4.9 — Elements options + ref-stable PaymentRequest.
- `docs/prd/module-3-first-payment.md` §4.10 — error surfaces (intent-creation failure + Stripe confirmation error + backend-confirm failure).
- `docs/prd/module-3-first-payment.md` §6.1, §6.3 — preserved visuals + gating table.
- `docs/prd/module-3-first-payment.md` §7 — "Files added" (`CheckoutForm.tsx`).

## AC coverage

Fully closed by this task (given Tasks 02–04 already shipped):

- **AC 2** — consent checkbox required before any of the three buttons is enabled.
- **AC 3** — three buttons keep existing visuals (byte-for-byte copy of class strings + inline styles + `gpayIcon` usage). Site-level visual verification happens in Task 06.
- **AC 10** — dev throws on key/mode mismatch (wires `assertKeyMatchesMode(pricing.payment_mode)`).
- **AC 17** — second click on the card button collapses the inline form.
- **AC 18** — GPay button disabled with tooltip when `useGooglePay.available !== true`.
- **AC 19** — clicking enabled GPay button calls `useGooglePay.show()`.
- **AC 20** — `onPaymentMethod` callback drives `stripe.confirmCardPayment(..., { handleActions: false })`.
- **AC 21** — on GPay success, `event.complete('success')` + `finalizeAfterStripeSuccess` + navigate.
- **AC 22** — on GPay failure, `event.complete('fail')` + buttons remain interactable.
- **AC 23** — PayPal click calls `stripe.confirmPayment` with `payment_method_data: { type: 'paypal' }`.
- **AC 25** — on PayPal return, observe `intent.recoveredSucceeded` → call `finalizeAfterStripeSuccess` → navigate.
- **AC 26** — PayPal cancellation → hook surfaces error state → inline error rendered; no backend confirm.

Also contributes to AC 1, 5, 6, 7, 8, 9, 14, 15 (all partially closed via `usePaymentIntent` / CardForm — final closure in Task 99).

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.tsx`
- `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.test.tsx`

**Do NOT touch** (in this task):
- `src/pages/CheckoutPage.tsx` — Task 06 is the page integration.
- `src/hooks/*` — read-only dependencies.
- `src/components/checkout/CardForm.tsx` — read-only dependency.
- `src/lib/stripe.ts`, `src/lib/session.ts`, `src/lib/api.ts` — all read-only.

## Backend contract reference

Backend calls happen via `usePaymentIntent.finalizeAfterStripeSuccess` — see Task 02 for the body/response shape. CheckoutForm only wires the hook outputs.

## Step-by-step implementation

### Step 1 — Identify the exact visual-preservation byte-source

Open `typestest/src/pages/CheckoutPage.tsx` and locate the three `<Button>` elements currently used as payment buttons. Per PRD §6.1 and the plan's lineage note, these are approximately lines 336–344 (GPay / PayPal / Credit-or-debit-card). Copy the `className` strings and inline `style` objects **verbatim** into this task's implementation — changes (even trivial whitespace) break AC 3.

Also identify:
- The `gpayIcon` import at the top of CheckoutPage — CheckoutForm receives it as a prop (`gpayIcon: string`), NOT by re-importing, to avoid duplicate imports.
- The `<img>` attributes used inside the GPay button: `alt="Google Pay"`, `className="h-7 w-[130px] max-w-full object-contain"` (or whatever is currently there). Preserve verbatim.

Document what you copied in a code comment at the top of each of the three `<Button>` blocks inside CheckoutForm: `// VISUAL LOCK — copied verbatim from CheckoutPage.tsx (pre-Module-3). Do not change without updating AC 3.`

### Step 2 — Red phase (write failing integration tests first)

Create `typestest/src/components/checkout/CheckoutForm.test.tsx`. Setup:

- Mock every Stripe module:
  ```ts
  vi.mock('@/lib/stripe', () => ({ stripePromise: Promise.resolve(/* fake Stripe */), assertKeyMatchesMode: vi.fn() }));
  vi.mock('@stripe/react-stripe-js', () => ({
    Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,  // pass-through
    useStripe: vi.fn(),
    useElements: vi.fn(),
    CardElement: (props: { onChange?: (e: unknown) => void }) => (
      <div data-testid="card-element" onClick={() => props.onChange?.({ complete: true })} />
    ),
  }));
  ```
- Mock the hooks:
  ```ts
  vi.mock('@/hooks/usePaymentIntent', () => ({ usePaymentIntent: vi.fn() }));
  vi.mock('@/hooks/useGooglePay', () => ({ useGooglePay: vi.fn() }));
  ```
- Mock `apiPost` (though CheckoutForm shouldn't call it directly; the hooks do).
- Mock `react-router-dom`'s `useNavigate` to a spy.
- Mock `resolveRedirect` from `@/lib/redirectRouter` (Module 1 helper) to an identity function.

Write the 16 failing integration cases:

1. **Initial render, `intent.state: 'ready'`, `gpay.available: true`, `consented: false`** → all three buttons rendered as `disabled`. Consent checkbox visible, unchecked. `<CardForm>` NOT rendered.
2. **Tick consent** → card button enables, PayPal button enables, GPay button enables (because `available: true`).
3. **`gpay.available: false`** with consent ticked → GPay button `disabled`; its `title` attribute reads exactly `Google Pay isn't available in this browser`.
4. **Click card button** → `<CardForm>` renders below the three buttons (assert by testid).
5. **Click card button a second time** → `<CardForm>` unmounts (AC 17).
6. **`intent.state: 'creating'`** → all three buttons disabled; consent still interactable.
7. **`intent.state: 'error'` with `error: 'Intent failed'`** → inline error alert visible with the message and a `Try again` button; clicking it calls `intent.retry`.
8. **Click PayPal with consent ticked** → `stripe.confirmPayment` called once with arguments matching `{ clientSecret, confirmParams: { return_url: expect.stringMatching(/\/checkout\?qid=/), payment_method_data: { type: 'paypal' } } }`.
9. **PayPal `confirmPayment` returns `{ error: { message: 'User cancelled' } }`** → `methodError` state surfaces `'User cancelled'` as an inline alert; no navigation.
10. **Click GPay button (enabled)** → `gpay.show()` called once.
11. **GPay `onPaymentMethod` fires with a fake `paymentmethod` event (`paymentMethod.id === 'pm_x'`, `complete: spy`)** → `stripe.confirmCardPayment(clientSecret, { payment_method: 'pm_x' }, { handleActions: false })` called; on resolution with `status: 'succeeded'`, `event.complete('success')` called, `intent.finalizeAfterStripeSuccess('pi_gpay')` called, `navigate(resolveRedirect(response.redirect_page) + '?qid=<encrypted>')` called.
12. **GPay `paymentmethod` returns `status: 'requires_action'`** → `stripe.handleCardAction(clientSecret)` called; on success, `finalizeAfterStripeSuccess` fires as in case 11.
13. **CardForm reports `onSuccess('pi_abc')`** (simulate by triggering the `CardElement` stub's onChange then `handleSubmit` via the exposed Pay button) → `intent.finalizeAfterStripeSuccess('pi_abc')` called; navigate fires.
14. **`finalizeAfterStripeSuccess` throws** → `methodError` set to the PRD §4.10 backend-confirm-failure message (`Your payment went through, but we had trouble finalising your order. Please contact support.`); NO navigate; clicking the retry button (assert a Retry control renders alongside the message) re-calls `finalizeAfterStripeSuccess` with the same intent id.
15. **Mount with `pricing.payment_mode: 'sandbox'` but `assertKeyMatchesMode` spy throws** (simulate dev-mode mismatch) → the test asserts the throw propagates (wrap in React error boundary or `expect(render).toThrow`).
16. **`intent.recoveredSucceeded: true` with `intent.intentId: 'pi_x'` on mount** (PayPal return scenario) → `finalizeAfterStripeSuccess('pi_x')` called automatically inside a `useEffect`; navigate fires; no button clicks required (AC 25 integration).

Run — all 16 fail. Red phase.

### Step 3 — Green phase (implement `src/components/checkout/CheckoutForm.tsx`)

Component contract:

```tsx
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stripePromise, assertKeyMatchesMode } from '@/lib/stripe';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';
import { useGooglePay } from '@/hooks/useGooglePay';
import { CardForm } from './CardForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getSession } from '@/lib/session';
import { resolveRedirect } from '@/lib/redirectRouter';
// Import PricingInfo type and constants (DEFAULT_SUBSCRIPTION_DAYS, TRIAL_DAYS) per Module 2 conventions.

export type CheckoutFormProps = {
  priceLabel: string;                    // from usePricing().current.first_sale_price_label
  pricing: PricingInfo | undefined;      // from usePricing().current
  email: string | undefined;             // from session.email
  gpayIcon: string;                      // image URL from CheckoutPage's existing import
};

export function CheckoutForm(props: CheckoutFormProps) {
  const navigate = useNavigate();
  const intent = usePaymentIntent();
  const [consented, setConsented] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'card' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [methodError, setMethodError] = useState<string | null>(null);
  const lastIntentIdRef = useRef<string | null>(null);  // for Retry after backend-confirm failure.

  // AC 10 — assert key/mode at mount (dev-only throw).
  useEffect(() => {
    if (props.pricing?.payment_mode) {
      assertKeyMatchesMode(props.pricing.payment_mode);
    }
  }, [props.pricing?.payment_mode]);

  // AC 25 — auto-finalise when hook reports recovered-succeeded (PayPal return, cached-succeeded).
  useEffect(() => {
    if (intent.recoveredSucceeded && intent.intentId && !submitting) {
      void handleFinalize(intent.intentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent.recoveredSucceeded, intent.intentId]);

  const handleFinalize = async (intentId: string) => {
    setSubmitting(true);
    lastIntentIdRef.current = intentId;
    try {
      const response = await intent.finalizeAfterStripeSuccess(intentId);
      const route = resolveRedirect(response.redirect_page);
      const session = getSession();
      navigate(`${route}?qid=${session.qidEncrypted}`);
    } catch {
      setMethodError('Your payment went through, but we had trouble finalising your order. Please contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryFinalize = () => {
    if (lastIntentIdRef.current) void handleFinalize(lastIntentIdRef.current);
  };

  const handleCardSuccess = (intentId: string) => {
    void handleFinalize(intentId);
  };

  const handlePayPalClick = async () => {
    if (!intent.clientSecret) return;
    setSubmitting(true);
    setMethodError(null);
    const stripe = await stripePromise;
    if (!stripe) { setSubmitting(false); setMethodError('Stripe failed to load'); return; }
    const session = getSession();
    const { error } = await stripe.confirmPayment({
      clientSecret: intent.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?qid=${session.qidEncrypted}`,
        payment_method_data: { type: 'paypal' },
      },
    });
    if (error) {
      setMethodError(error.message ?? 'PayPal payment failed');
      setSubmitting(false);
      return;
    }
    // Success: Stripe redirects the browser; no JS continuation here.
  };

  const gpay = useGooglePay({
    clientSecret: intent.clientSecret,
    pricing: props.pricing,
    onPaymentMethod: async (event) => {
      setSubmitting(true);
      setMethodError(null);
      const stripe = await stripePromise;
      if (!stripe || !intent.clientSecret) {
        event.complete('fail');
        setMethodError('Stripe not ready');
        setSubmitting(false);
        return;
      }
      const { paymentIntent: pi, error } = await stripe.confirmCardPayment(
        intent.clientSecret,
        { payment_method: event.paymentMethod.id },
        { handleActions: false },
      );
      if (error || !pi) {
        event.complete('fail');
        setMethodError(error?.message ?? 'Payment failed');
        setSubmitting(false);
        return;
      }
      event.complete('success');
      if (pi.status === 'requires_action') {
        const { error: actionError, paymentIntent: pi2 } = await stripe.handleCardAction(intent.clientSecret);
        if (actionError || pi2?.status !== 'succeeded') {
          setMethodError(actionError?.message ?? '3DS failed');
          setSubmitting(false);
          return;
        }
        await handleFinalize(pi2.id);
      } else if (pi.status === 'succeeded') {
        await handleFinalize(pi.id);
      }
      setSubmitting(false);
    },
  });

  return (
    <Elements
      stripe={stripePromise}
      options={intent.clientSecret
        ? {
            clientSecret: intent.clientSecret,
            appearance: { theme: 'stripe', variables: { colorPrimary: 'hsl(270 50% 45%)' } },
            loader: 'auto',
          }
        : undefined
      }
    >
      <div className="space-y-3">
        {/* Consent checkbox — PRD §4.7 */}
        <label className="flex items-start gap-2 text-xs">
          <Checkbox id="subscription-consent" checked={consented} onCheckedChange={(v) => setConsented(v === true)} />
          <span>
            I understand that after the {/* TRIAL_DAYS */}-day trial my subscription will begin automatically at{' '}
            {props.pricing?.subscription_price_label} every{' '}
            {props.pricing?.subscription_day_label ?? /* DEFAULT_SUBSCRIPTION_DAYS */}{' '}
            days until I cancel. I agree to the{' '}
            <a href="/subscription-policy">Subscription Policy</a>,{' '}
            <a href="/terms-conditions">Terms of Use</a>, and{' '}
            <a href="/privacy-policy">Privacy Policy</a>.
          </span>
        </label>

        {/* Error slots */}
        {intent.state === 'error' && intent.error && (
          <div role="alert" className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
            {intent.error}
            <Button onClick={intent.retry} variant="outline" size="sm" className="mt-2">Try again</Button>
          </div>
        )}
        {methodError && (
          <div role="alert" className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
            {methodError}
            {lastIntentIdRef.current && (
              <Button onClick={handleRetryFinalize} variant="outline" size="sm" className="mt-2">Retry</Button>
            )}
          </div>
        )}

        {/* VISUAL LOCK — Google Pay button class/style copied verbatim from pre-Module-3 CheckoutPage.tsx. */}
        <Button
          className="w-full py-6 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background"
          size="lg"
          disabled={!consented || intent.state !== 'ready' || gpay.available !== true || submitting}
          title={gpay.available === false ? "Google Pay isn't available in this browser" : undefined}
          onClick={() => gpay.show()}
        >
          <img src={props.gpayIcon} alt="Google Pay" className="h-7 w-[130px] max-w-full object-contain" />
        </Button>

        {/* VISUAL LOCK — PayPal button class/style copied verbatim. */}
        <Button
          className="w-full py-6 text-lg font-bold"
          size="lg"
          style={{ backgroundColor: 'hsl(213 100% 44%)', color: 'white' }}
          disabled={!consented || intent.state !== 'ready' || submitting}
          onClick={handlePayPalClick}
        >
          PayPal
        </Button>

        {/* VISUAL LOCK — Credit or debit card button class/style copied verbatim. */}
        <Button
          className="w-full py-6 text-lg font-semibold"
          size="lg"
          style={{ backgroundColor: 'hsl(var(--success))', color: 'white' }}
          disabled={!consented || intent.state !== 'ready' || submitting}
          onClick={() => setActiveMethod(activeMethod === 'card' ? null : 'card')}
        >
          Credit or debit card
        </Button>

        {activeMethod === 'card' && intent.clientSecret && (
          <CardForm
            clientSecret={intent.clientSecret}
            email={props.email}
            priceLabel={props.priceLabel}
            submitting={submitting}
            consented={consented}
            onSuccess={handleCardSuccess}
            onError={setMethodError}
          />
        )}
      </div>
    </Elements>
  );
}
```

Guardrails:
- The three `<Button>` elements' `className` strings and `style` objects must match the current CheckoutPage byte-for-byte. Mark each with a `VISUAL LOCK` comment (R10).
- `setConsented` handler coerces the checkbox's `CheckedState` (`true | false | 'indeterminate'`) to boolean via `v === true`.
- The `<Elements>` `options` is `undefined` until `clientSecret` is ready; once set, Stripe's `<Elements>` locks the clientSecret (per Stripe docs). Don't change the shape after mount.
- `TRIAL_DAYS` and `DEFAULT_SUBSCRIPTION_DAYS` constants live where Module 2 placed them (`src/lib/pricingConstants.ts` or similar) — import from there; do NOT re-declare.
- `PricingInfo.payment_mode` may not be typed in Module 2's interface yet. If so, add `payment_mode?: 'sandbox' | 'live'` as a one-line addition in Task 02 (session extension commit) or here as an inline widen — document which in a comment.

### Step 4 — Refactor phase

- Extract the GPay `onPaymentMethod` callback into a named helper (`handleGooglePayMethod`) if the inline form gets too deep. Keep it in the same file.
- Ensure the retry affordance for backend-confirm failure (case 14) is exactly one `Retry` button inside the `methodError` alert.
- Run the 16 tests; all green.

### Step 5 — Preservation diff check

Side-by-side diff the three `<Button>` blocks in `CheckoutForm.tsx` against the current CheckoutPage.tsx (pre-Task 06). Byte-identical on `className` strings, inline `style` objects, and the GPay `<img>` attributes. If any drift, fix and re-test.

### Step 6 — Isolation check

```sh
grep -rn "from.*components/checkout/CheckoutForm" typestest/src
```

Expected: only `src/components/checkout/CheckoutForm.test.tsx`. CheckoutPage consumes CheckoutForm in Task 06.

## Completion criteria (done-when)

- [x] `src/components/checkout/CheckoutForm.tsx` implements the contract above.
- [x] `src/components/checkout/CheckoutForm.test.tsx` has 16 passing integration cases (step 2).
- [x] The three `<Button>` elements' `className` + `style` + GPay `<img>` attributes are byte-identical to current CheckoutPage.tsx pre-Task-06 (each marked with `// VISUAL LOCK` comment per R10).
- [x] `<Elements>` wraps the full payment surface (consent + buttons + card form).
- [x] Consent checkbox gating matches PRD §6.3 exactly (GPay additionally requires `available === true`).
- [x] `assertKeyMatchesMode` called against `pricing.payment_mode` (sync in render body so the dev-mode throw propagates on first mount; idempotent).
- [x] Recovered-succeeded auto-finalise wired via a `useEffect` observing `intent.recoveredSucceeded`.
- [x] Backend-confirm-failure retry renders a `Retry` button calling `handleFinalize` with the same `intentId` (stored in `lastIntentIdRef`).
- [x] `useGooglePay`'s `onPaymentMethod` callback is defined inline in CheckoutForm — the two-stage `confirmCardPayment(handleActions: false) → handleCardAction` lives here, NOT in the hook.
- [x] Only one import from `@/lib/stripe` (`stripePromise` + `assertKeyMatchesMode`); no direct `loadStripe` call.
- [x] No file under `src/pages/` imports `CheckoutForm` yet (grep check in step 6). (Satisfied pre-Task-06; CheckoutPage now mounts it per Task 06.)
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/components/checkout/CheckoutForm.test.tsx   # → 16 passing.
npx tsc --noEmit                                               # Zero errors.
npm run lint                                                   # Zero errors.
npm run build                                                  # Succeeds.
npm run test                                                   # Full suite green (Module 1 + 2 + all Module 3 tasks so far).
```

No dev-server smoke — CheckoutPage isn't modified yet. The live `/checkout` path still renders the pre-Module-3 button placeholders. Task 06 does the integration; Task 99 runs the live smoke.

## Notes / ambiguities

- **`PricingInfo.payment_mode` typing**: if Module 2's `PricingInfo` doesn't yet include `payment_mode?: 'sandbox' | 'live'`, add the field either in Task 02's session commit or inline here. Document the decision in a code comment. Either is a one-line change.
- **`gpayIcon` as prop**: CheckoutPage already imports the `gpayIcon` asset for rendering the current GPay button. CheckoutForm receives it as a prop rather than re-importing — avoids duplicate imports and keeps the asset's origin obvious.
- **`TRIAL_DAYS` / `DEFAULT_SUBSCRIPTION_DAYS`**: Module 2 shipped these as constants. Reuse — do not re-declare. If Module 2 did not yet define `TRIAL_DAYS`, add it to the existing constants file as a one-line change with a comment referencing PRD §4.7.
- **Retry semantics (Open item O1)**: `handleRetryFinalize` re-calls `finalizeAfterStripeSuccess(lastIntentIdRef.current)`. If the backend 409s on duplicate intent ids (PRD R4, O1), Task 99 will surface it and the fix is a "treat-409-as-success" branch inside `usePaymentIntent.finalizeAfterStripeSuccess`, not here. Flag if observed.
- **Two consent ambiguities**: (1) `Checkbox`'s `onCheckedChange` may emit `'indeterminate'` — coerce to boolean. (2) the legal copy references `/subscription-policy`, `/terms-conditions`, `/privacy-policy` — Open item O8 — if those routes 404 in dev, not this task's problem but flag it.
- **PayPal success has no JS continuation**: after `confirmPayment` succeeds, Stripe redirects the browser; any JS after `await stripe.confirmPayment(...)` on success is effectively unreachable. The `if (error)` branch is the only runnable tail.
- **`<Elements>` keyed on `clientSecret`**: do NOT swap the `clientSecret` inside the same `<Elements>` mount — Stripe's `<Elements>` locks it at mount. If the hook's `retry()` eventually produces a fresh `clientSecret`, React will re-render with the new `options` but Stripe may warn. If Task 99 surfaces this, wrap `<Elements>` in a `key={intent.clientSecret ?? ''}` to force remount on change.
