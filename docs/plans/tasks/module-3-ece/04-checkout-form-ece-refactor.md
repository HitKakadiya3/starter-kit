# Task 04 — Refactor `<CheckoutForm>` + wire ECE + fill 8 ECE integration-test skeletons

**Phase:** 3 · `<CheckoutForm>` refactor + ECE wiring (the integration commit)
**Work plan task id:** T3.1
**Size:** Large (2 files modified — substantial refactor; 8 skeletons filled, 16 existing tests preserved)
**Dependencies:**
- `00-backend-probe.md` — locked wallet `payment_method_type` value (consumed via `WALLET_METHOD_TYPE` constant from Task 03).
- `01-sdk-version-verify.md` — `<ExpressCheckoutElement>` import resolves.
- `02-use-express-checkout-hook.md` — `useExpressCheckout` hook is available to consume.
- `03-widen-payment-intent-method-type.md` — `PaymentIntentMethodType` widened; `WALLET_METHOD_TYPE` constant exported.

## Purpose / why this task exists

The integration commit. Hoist `<Elements mode='payment'>` at the top of `<CheckoutForm>`, mount `<ExpressCheckoutElement>` via `useExpressCheckout`, wire `onConfirm` to `intent.createIntent → stripe.confirmPayment → finalizeAfterStripeSuccess`, remove all GPay-specific state, keep card-path nested `<Elements clientSecret>` (KDD-1), preserve PayPal and consent gate. Fill in the 8 ECE skeletons in `CheckoutForm.test.tsx`.

This is the highest-risk task in the plan. R-D1 (pricing regression silently disables wallet path), R-D5 (card form re-mount on wallet interactions), R-D6 (ECE error visual state) all converge here. Mitigated by AC-D02 / AC-D09 / AC-D05 tests landing in this same commit.

**Critical: the production refactor and the test rewrite land together** to avoid a broken-test commit. Per work plan: do not split into a "refactor first, tests later" sequence.

`useGooglePay`'s import line and all GPay-specific state are removed from `<CheckoutForm>` in this task. The hook's source files (`useGooglePay.ts` + `useGooglePay.test.tsx`) are deleted in Task 05 — only after this task confirms zero remaining references.

## PRD / Design Doc / ADR anchors

- Design Doc §Architecture (component tree) — verbatim component tree under hoisted `<Elements>`.
- Design Doc KDD-1 KEEP NESTED — card-path `<Elements clientSecret>` stays nested.
- Design Doc §`<CheckoutForm>` changes — Removed / Added / Preserved (all three lists).
- Design Doc §Integration Boundary Contracts — ECE → onConfirm; useExpressCheckout → confirmPayment; CheckoutForm → finalizeAfterStripeSuccess.
- Design Doc §Test Strategy → Mocking strategy for `<ExpressCheckoutElement>`.
- Design Doc AC-D01..AC-D10.
- ADR-0001 §Decision — single `confirmPayment` call replaces two-stage flow.
- PRD §4.4.2 — verbatim wallet method flow.
- PRD §4.7 — consent checkbox + gating rule.
- PRD §4.9 — Stripe Elements wiring (deferred mode).
- PRD §6.3 — Added: hoisted `<Elements>` + ECE + nested `<Elements clientSecret>` for card path.
- PRD §8 ACs 20–25, 25a — wallet method ACs.
- Work plan §Phase 3 / Task 3.1 — REMOVE / ADD / KEEP NESTED / PRESERVE lists; 8 test cases verbatim.
- Predecessor task style: `docs/plans/tasks/module-3/05-checkout-form-wrapper.md` — same `CheckoutForm.tsx` from a previous slice; this task refactors it.

## AC coverage

Fully closes (per work plan):

- **AC-D01** — hoisted `<Elements>` with `mode='payment' + amount + currency` from `pricing`.
- **AC-D02** — graceful skip when `pricing` is undefined (no throw).
- **AC-D03** — ECE renders inside hoisted Elements; no application-level `canMakePayment()`.
- **AC-D04** — ECE `onConfirm` calls `intent.createIntent(<wallet methodType>)` exactly once → `stripe.confirmPayment(...)`.
- **AC-D05** — error path: inline alert; backend confirm NOT called; `helpers.paymentFailed()` called.
- **AC-D06** — success path: `finalizeAfterStripeSuccess` + navigate per `redirect_page`.
- **AC-D08** — nested scoped `<Elements clientSecret>` for card branch (KDD-1).
- **AC-D09** — toggle `activeMethod` does not remount hoisted `<Elements>`; CardForm not re-mounted on wallet interactions.
- **AC-D10** — consent gating via `disabled` (no application-level `canMakePayment` check).

Also closes via integration:

- **AC-D07** — legacy-cache natural miss verified at integration level (Task 03 verifies at hook level).

Test resolution progress: 14 / 14 ECE-track tests resolved cumulative after this task.

## Scope

**Modify:**

- `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.tsx` — substantial refactor. REMOVE GPay-specific state + handlers + button block; ADD hoisted `<Elements>` + ECE wiring; KEEP NESTED card-path `<Elements clientSecret>`; PRESERVE consent + PayPal + assertKeyMatchesMode + finalize logic.
- `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.test.tsx` — fill in 8 ECE skeletons (existing 16 tests preserved → 24/24 total).

**Do NOT touch** (in this task):

- `src/hooks/useGooglePay.ts` and `src/hooks/useGooglePay.test.tsx` — Task 05 deletes them. This task removes the IMPORT line in `CheckoutForm.tsx` but does NOT delete the source files. The legacy hook must still compile (it's still importable; just no longer imported by CheckoutForm).
- `src/components/checkout/CardForm.tsx` — read-only. Repositioned (now nested under hoisted `<Elements>`) but no code change.
- `src/hooks/usePaymentIntent.ts`, `src/lib/session.ts` — Task 03 owns; read-only here.
- `src/hooks/useExpressCheckout.ts`, `src/hooks/useExpressCheckout.test.tsx` — Task 02 owns; read-only here.
- `src/lib/stripe.ts`, `src/hooks/usePayPalCheckout.ts` — unchanged.
- `src/pages/CheckoutPage.tsx` — no code change (CheckoutForm is still mounted in same place; the prop surface should remain compatible).

## Backend contract reference

Backend calls happen via `usePaymentIntent.createIntent` and `usePaymentIntent.finalizeAfterStripeSuccess` — Task 03 / predecessor first-payment task own these. CheckoutForm only wires the hook outputs through ECE's `onConfirm`.

ECE `onConfirm` flow:

1. `intent.createIntent(WALLET_METHOD_TYPE)` → `POST /payment/stripe/create-payment-intent` (or cache hit).
2. `stripe.confirmPayment({ elements, clientSecret, confirmParams: { return_url }, redirect: 'if_required' })`.
3. On success → `finalizeAfterStripeSuccess(paymentIntent.id)` → `POST /payment/stripe/first-sale/payments/confirm`.
4. On error → inline alert + `helpers.paymentFailed()`.

## Step-by-step implementation

### Step 1 — Inventory current `CheckoutForm.tsx` and identify removal/addition points

Read `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.tsx`. Identify (line numbers approximate, per work plan §Phase 3):

- `gpayClientSecretRef` declaration and any closure that reads from it.
- `handleGooglePayMethod` handler.
- `handleGooglePayClick` handler (and its binding to a wallet button's `onClick`).
- `import { useGooglePay } from '@/hooks/useGooglePay'` (and the `useGooglePay({...})` call site).
- The standalone GPay `<Button>` block (≈ lines 297–315 in current `CheckoutForm.tsx`).
- Any `gpayIcon` prop / import / `<img>` reference.
- The current scoped `<Elements stripe={stripePromise} options={{ clientSecret, appearance, loader: 'auto' }}>` block (currently the only `<Elements>` provider).

Identify what STAYS:

- Consent checkbox + label + gating logic.
- PayPal slot via `usePayPalCheckout`.
- "Credit or debit card" `<Button onClick={handleCardClick} />`.
- `assertKeyMatchesMode(pricing.payment_mode)` invocation.
- `handleFinalize` / `handleRetryFinalize` / auto-finalise on `recoveredSucceeded`.
- `cardReturnUrl` derivation via `withPromoParams`.
- The card-path scoped `<Elements stripe={stripePromise} options={{ clientSecret, appearance, loader: 'auto' }}>` block — but it now lives as a DESCENDANT of the new hoisted `<Elements>`.

### Step 2 — Inventory current `CheckoutForm.test.tsx` and confirm 8 skeletons exist

Read `d:/Projects/TestIQ/typestest/src/components/checkout/CheckoutForm.test.tsx`. Confirm:

- 16 existing tests for card / PayPal / consent / finalize behaviour are present (do NOT modify these).
- 8 ECE skeletons (test.todo / test.skip / similar) are appended.

If the file does not have 8 ECE skeletons, halt — the test-design phase should have produced them. The 8 skeletons map to AC-D01, AC-D02, AC-D03, AC-D04+AC-D06, AC-D05, AC-D08+AC-D09, AC-D10, AC-D07 (one test per group; see Step 4 for the verbatim mapping).

### Step 3 — Red phase (write the 8 ECE test bodies first)

Open `CheckoutForm.test.tsx`. Fill in the 8 skeleton bodies BEFORE refactoring `CheckoutForm.tsx`.

**Mocking strategy for `<ExpressCheckoutElement>`** (per Design Doc §Test Strategy / Mocking strategy):

```ts
const eceOnConfirmMock = vi.hoisted(() => vi.fn());

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children, options }: { children: React.ReactNode; options?: Record<string, unknown> }) => (
    <div data-testid="elements-mock" data-options={JSON.stringify(options ?? {})}>{children}</div>
  ),
  ExpressCheckoutElement: (props: { onConfirm: (event: unknown, helpers: unknown) => Promise<void>; options?: Record<string, unknown> }) => {
    eceOnConfirmMock(props.onConfirm);
    return <div data-testid="ece-stub" data-options={JSON.stringify(props.options ?? {})} />;
  },
  useStripe: vi.fn(() => mockStripe),
  useElements: vi.fn(() => mockElements),
  PaymentElement: () => <div data-testid="payment-element-mock" />,
}));
```

The `eceOnConfirmMock` captures the `onConfirm` prop. Tests retrieve the captured callback via `eceOnConfirmMock.mock.calls[0][0]` and invoke it as `await capturedOnConfirm(fakeEvent, fakeHelpers)` where `fakeHelpers = { resolve: vi.fn(), reject: vi.fn(), paymentFailed: vi.fn() }`.

Mock the existing repo conventions (per `module-3/05-checkout-form-wrapper.md`):

```ts
vi.mock('@/lib/stripe', () => ({ stripePromise: Promise.resolve(mockStripe), assertKeyMatchesMode: vi.fn() }));
vi.mock('@/hooks/usePaymentIntent', () => ({ usePaymentIntent: vi.fn() }));
vi.mock('@/hooks/useExpressCheckout', () => ({ useExpressCheckout: vi.fn() }));
// useGooglePay mock REMOVED — CheckoutForm no longer imports it.
```

The 8 test cases (matching work plan §Phase 3 / Task 3.1, paragraph "Test cases — fill the 8 ECE skeletons"):

1. **AC-D01 — hoisted Elements with `mode='payment' + amount + currency`**
   Render `CheckoutForm` with `pricing` defined. Assert: the `<Elements>` mock's captured `options` contains `mode: 'payment'`, `amount` derived from `pricing.first_sale_cents_price`, `currency` derived from `pricing.currency_code` (lowercased per PRD §4.9). `<ExpressCheckoutElement>` (the `data-testid="ece-stub"`) is mounted inside it.

2. **AC-D02 — graceful skip when `pricing` is undefined**
   Render with `pricing: undefined`. Assert: neither `<Elements>` mock nor `<ExpressCheckoutElement>` mock is rendered (queries return null). CheckoutForm renders without throwing. Consent checkbox + card button + PayPal slot still render. (The hoisted `<Elements>` cannot mount without `amount + currency`, so the wallet slot is gracefully absent.)

3. **AC-D03 — ECE renders without application-level `canMakePayment`**
   With pricing present, `<ExpressCheckoutElement>` is rendered. The test mocks ECE as a stub that captures `onConfirm` into `eceOnConfirmMock`. Verify: no application-level `canMakePayment` call exists in CheckoutForm code (assert via grep on the source file body OR via spy on `mockStripe.paymentRequest` which should NOT be called). The `paymentRequest` API path is removed — confirm no call.

4. **AC-D04 + AC-D06 happy path**
   Drive `eceOnConfirmMock.mock.calls[0][0]` (the captured `onConfirm`) with a fake event + `fakeHelpers = { resolve: vi.fn(), reject: vi.fn(), paymentFailed: vi.fn() }`.

   Assert (in order):
   - `intent.createIntent(WALLET_METHOD_TYPE)` called exactly once with the locked value.
   - `stripe.confirmPayment` called with `{ elements, clientSecret, confirmParams: { return_url: <expected cardReturnUrl> }, redirect: 'if_required' }`.
   - On `confirmPayment` resolving with `{ paymentIntent: { id: 'pi_x', status: 'succeeded' }, error: undefined }`:
     - `finalizeAfterStripeSuccess('pi_x')` called.
     - `navigate(<resolved redirect_page>)` fires with the expected redirect URL.

5. **AC-D05 error path**
   Drive `onConfirm`. Mock `stripe.confirmPayment` to return `{ paymentIntent: null, error: { message: 'Card declined' } }`.

   Assert:
   - Inline alert renders with the text `'Card declined'`.
   - Backend confirm endpoint is NOT called (assert via `apiPost` mock not called for the confirm route, OR via `intent.finalizeAfterStripeSuccess` mock not called).
   - `fakeHelpers.paymentFailed()` called.
   - `intent.createIntent` was called (the error happens after intent creation).

6. **AC-D08 + AC-D09 — nested + no remount**
   Render with consent ticked. Toggle `activeMethod` (via card-button click) `null → 'card' → null → 'card'`.

   Assert:
   - Hoisted `<Elements>` mock instance is the SAME across all toggles — capture the rendered DOM node reference via `getByTestId('elements-mock')` after each toggle and assert ref equality (or assert via render-count mock).
   - The nested `<Elements clientSecret>` mounts only when `activeMethod === 'card' && intent.clientSecret` is truthy.
   - CardForm does NOT re-mount when ECE's `onConfirm` is driven mid-test (drive `onConfirm` and assert no extra render of CardForm via render-count mock or via `paymentElement` mock's mount-count).

7. **AC-D10 consent gating**
   Render with `consented === false`. Assert: `useExpressCheckout` mock was called with `disabled: true`. Even if the test invokes the captured `onConfirm`, `intent.createIntent` is NOT called (the ECE stub respects `disabled` per the hook's contract — i.e., either ECE doesn't fire `onConfirm` when disabled, OR the consumer's `onConfirm` early-returns when disabled). When `consented` flips to true, re-render and assert `useExpressCheckout` was called again with `disabled: false`.

8. **AC-D07 legacy-cache natural miss (integration level)**
   Pre-populate `sessionStorage` with `funnel.paymentIntent.keyedBy.methodType === 'google_pay'` (use `JSON.stringify` and the actual sessionStorage key from `src/lib/session.ts`). Mount CheckoutForm. Drive `onConfirm`.

   Assert: exactly one fresh `apiPost('create-payment-intent')` (or whichever the `usePaymentIntent` mock surfaces as the create endpoint) is issued, with NO cache hit. Inspect `sessionStorage` post-call to confirm the new `methodType` overwrites the legacy entry.

   This is the integration-level confirmation; Task 03 verified the same behaviour at the hook level.

Run:

```sh
npx vitest run src/components/checkout/CheckoutForm.test.tsx
```

Expected: 16 existing tests pass + 8 new tests fail (skeletons not yet matched by production code) = 16 pass, 8 fail. That is the red phase.

### Step 4 — Green phase: Refactor `CheckoutForm.tsx`

Apply the REMOVE / ADD / KEEP NESTED / PRESERVE lists from work plan §Phase 3.

#### 4.1 — REMOVE

Delete from `CheckoutForm.tsx`:

- `gpayClientSecretRef` declaration and all reads/writes.
- `handleGooglePayMethod` handler (the entire two-stage `confirmCardPayment + handleCardAction` flow).
- `handleGooglePayClick` handler.
- `import { useGooglePay } from '@/hooks/useGooglePay'` and the `useGooglePay({...})` invocation. The hook's source files remain — Task 05 deletes them.
- The standalone GPay `<Button>` block (current ≈ lines 297–315). All children of that block (the `<img src={gpayIcon}>` etc.) are removed.
- `gpayIcon` from the `Props` type. If `<CheckoutPage>` still passes `gpayIcon` to `<CheckoutForm>`, that prop passing becomes dead — flag in commit message as a follow-up cleanup but do NOT touch `CheckoutPage.tsx` in this task. Removing the `gpayIcon` prop from `CheckoutForm`'s `Props` type is sufficient (the consumer's call site will warn at the type level if `gpayIcon` is still being passed; that's an explicit hand-off to the cleanup follow-up).

#### 4.2 — ADD

At the top of the form's render tree, hoist `<Elements>`:

```tsx
{pricing ? (
  <Elements
    stripe={stripePromise}
    options={{
      mode: 'payment',
      amount: pricing.first_sale_cents_price,
      currency: pricing.currency_code.toLowerCase(),
      appearance: { theme: 'stripe', variables: { colorPrimary: 'hsl(270 50% 45%)' } },
      loader: 'auto',
    }}
  >
    {/* … rest of CheckoutForm body, including consent + ECE + PayPal + card branch … */}
  </Elements>
) : (
  // Graceful no-pricing fallback (AC-D02): render consent + card button + PayPal slot WITHOUT <Elements>.
  // ECE does not mount; rest of form remains functional.
  <NoPricingFallback ... />
)}
```

Inside the hoisted `<Elements>`, mount ECE in the wallets slot:

```tsx
const { eceProps, ready } = useExpressCheckout({
  pricing,
  disabled: !consented || submitting,
  onConfirm: handleEceConfirm,
});

{eceProps && <ExpressCheckoutElement {...eceProps} />}
```

Implement `handleEceConfirm`:

```tsx
const handleEceConfirm = async (
  event: ExpressCheckoutConfirmEvent,
  helpers: ExpressCheckoutConfirmHelpers,
) => {
  setSubmitting(true);
  setMethodError(null);
  try {
    let clientSecret: string;
    try {
      const result = await intent.createIntent(WALLET_METHOD_TYPE);
      clientSecret = result.clientSecret;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not prepare payment';
      helpers.paymentFailed();
      setMethodError(message);
      return; // do NOT proceed to confirmPayment.
    }

    const stripe = await stripePromise;
    if (!stripe || !elements) {
      helpers.paymentFailed();
      setMethodError('Stripe not ready');
      return;
    }

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: cardReturnUrl },
      redirect: 'if_required',
    });

    if (error) {
      helpers.paymentFailed();
      setMethodError(error.message ?? 'Wallet payment failed');
      return; // do NOT call backend confirm (AC-D05).
    }

    if (paymentIntent?.status === 'succeeded') {
      await handleFinalize(paymentIntent.id); // existing helper; preserves AC-D06.
    }
  } finally {
    setSubmitting(false);
  }
};
```

Note: `WALLET_METHOD_TYPE` is imported from `@/hooks/usePaymentIntent` (Task 03 exports it). Do NOT hard-code the literal.

The exact `ExpressCheckoutConfirmEvent` / `ExpressCheckoutConfirmHelpers` types come from `@stripe/react-stripe-js`'s ECE typings. Use the SDK's typed signatures; do NOT hand-roll.

The `elements` reference inside `handleEceConfirm` is obtained via `useElements()` from `@stripe/react-stripe-js`, called inside the hoisted `<Elements>` provider (Stripe context). If the structure requires a child component to call `useElements()`, factor the wallet slot into a small inner component — this is an acceptable refactoring detail.

#### 4.3 — KEEP NESTED (KDD-1)

The card-path scoped `<Elements stripe={stripePromise} options={{ clientSecret, appearance, loader: 'auto' }}>` block stays. It now lives as a descendant of the hoisted provider, ONLY when `activeMethod === 'card' && intent.clientSecret`:

```tsx
{activeMethod === 'card' && intent.clientSecret && (
  <Elements
    stripe={stripePromise}
    options={{
      clientSecret: intent.clientSecret,
      appearance: { theme: 'stripe', variables: { colorPrimary: 'hsl(270 50% 45%)' } },
      loader: 'auto',
    }}
  >
    <CardForm
      clientSecret={intent.clientSecret}
      email={props.email}
      priceLabel={props.priceLabel}
      submitting={submitting}
      consented={consented}
      onSuccess={handleCardSuccess}
      onError={setMethodError}
    />
  </Elements>
)}
```

CardForm's props and behaviour are unchanged. Stripe explicitly supports two coexisting Elements groups (one deferred, one with `clientSecret`).

#### 4.4 — PRESERVE

Keep verbatim:

- Consent checkbox + label + `setConsented` handler (no change).
- PayPal slot via `usePayPalCheckout` (no change; not under hoisted `<Elements>` — PayPal does not consume Stripe Elements).
- "Credit or debit card" `<Button onClick={handleCardClick} />` button.
- `assertKeyMatchesMode(pricing.payment_mode)` invocation (idempotent; runs every render when `pricing.payment_mode` is present).
- `handleFinalize` / `handleRetryFinalize` / auto-finalise on `recoveredSucceeded` `useEffect`.
- `cardReturnUrl` derivation via `withPromoParams`.
- Error alert slots (intent error + method error) — error-clearing semantics may need a small adjustment to also clear on a successful ECE `onConfirm`, but the slots themselves and their copy do NOT change.
- `methodError` / `submitting` state and existing handlers for card / PayPal paths.

Re-run the test suite:

```sh
npx vitest run src/components/checkout/CheckoutForm.test.tsx
```

Expected: 24 / 24 green (16 existing preserved + 8 new ECE tests).

### Step 5 — Refactor phase

- Promote any inline JSX-in-JSX from the wallet path into a small named helper (e.g. `<EceWalletSlot pricing={...} disabled={...} onConfirm={...} />`) ONLY if the inline form gets too deep. Keep it in the same file.
- Confirm the `WALLET_METHOD_TYPE` import is from `@/hooks/usePaymentIntent` (Task 03's source of truth).
- Confirm no inline literal `'card'` (or whatever the locked value is) appears in the wallet path call site — must reference the constant.
- Add a `// VISUAL LOCK — Stripe-controlled ECE rendering replaces the prior custom GPay pill (R-D3 / DD-OQ-1: marketing tuning is post-merge).` comment near the `<ExpressCheckoutElement>` mount point.
- Run the full test suite to confirm no other test broke.

### Step 6 — Confirm GPay-specific state is fully removed

Run from `d:/Projects/TestIQ/typestest`:

```sh
grep -nE "useGooglePay|gpayClientSecretRef|handleGooglePay|gpayIcon" src/components/checkout/CheckoutForm.tsx
```

Expected: zero hits in `CheckoutForm.tsx`. (The hook's source files `src/hooks/useGooglePay.ts` + `useGooglePay.test.tsx` still exist — Task 05 deletes them. Component-side references must be zero.)

```sh
grep -rn "useGooglePay" src/components/ src/pages/
```

Expected: zero hits. (Confirms no other component or page consumes `useGooglePay`.)

If any of these greps return hits, fix in this task before committing — Task 05 cannot proceed otherwise.

### Step 7 — Verify hoisted Elements is at the top of the rendered tree

In a quick dev-server smoke (optional, not part of the automated suite):

```sh
npm run dev
```

With `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…` in `.env.local`, open `/checkout` after walking the funnel. Observe in React DevTools:

- Hoisted `<Elements>` is at the top of CheckoutForm's render tree (when pricing is present).
- `<ExpressCheckoutElement>` mounts inside it.
- Card branch: clicking "Credit or debit card" mounts the nested `<Elements clientSecret>` as a descendant; CardForm renders inside.
- PayPal button still renders and is clickable.
- Consent checkbox still gates the buttons.
- ECE button area renders a Stripe-styled wallet button if the browser has a configured wallet, else nothing (no error).

This smoke is illustrative; the automated tests are the binding gate.

## Completion criteria (done-when)

- [x] `<CheckoutForm>` refactored: hoisted `<Elements>` + `<ExpressCheckoutElement>` in wallets slot + nested `<Elements clientSecret>` for card branch + PayPal preserved + consent preserved + GPay-specific state removed.
- [x] `CheckoutForm.test.tsx` 24/24 green (existing 16 + new 8 ECE).
- [x] `useExpressCheckout` is consumed by `CheckoutForm.tsx` (the only consumer).
- [x] `WALLET_METHOD_TYPE` constant imported from `@/hooks/usePaymentIntent` and used in `handleEceConfirm`'s `intent.createIntent` call (no hard-coded literal).
- [x] No `useGooglePay` / `gpayClientSecretRef` / `handleGooglePay*` / `gpayIcon` reference remains in `CheckoutForm.tsx`.
- [x] No `useGooglePay` reference in `src/components/` or `src/pages/`.
- [x] Hoisted `<Elements>` is at the top of the rendered tree (when pricing is present); nested `<Elements clientSecret>` is a descendant only when card branch active.
- [x] Graceful no-pricing fallback (AC-D02) does not throw and renders consent + card button + PayPal slot.
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/components/checkout/CheckoutForm.test.tsx     # → 24/24 passing.
grep -nE "useGooglePay|gpayClientSecretRef|handleGooglePay|gpayIcon" src/components/checkout/CheckoutForm.tsx
# → zero hits.
grep -rn "useGooglePay" src/components/ src/pages/
# → zero hits.
grep -n "WALLET_METHOD_TYPE" src/components/checkout/CheckoutForm.tsx
# → at least one hit (the constant is used).
npx tsc --noEmit                                                  # Zero errors.
npm run lint                                                      # Zero errors.
npm run build                                                     # Succeeds.
npm run test                                                      # Full suite green (Module 1 + 2 + first-payment + ECE Tasks 02–03 + this).
```

## Notes / ambiguities

- **`gpayIcon` prop hand-off**: removed from `CheckoutForm`'s `Props` type in this task. If `CheckoutPage.tsx` still passes `gpayIcon`, a type error surfaces — that error is the trigger for an explicit follow-up cleanup commit (out of scope for this task; surface in PR description). Do NOT silently delete the prop pass site in `CheckoutPage.tsx` here — that is a separate concern.
- **Error-clearing semantics on ECE retry**: when `setMethodError(null)` should fire is an implementation detail. Suggest clearing at the start of `handleEceConfirm` (before `setSubmitting(true)`); the existing card / PayPal handlers should follow the same pattern (verify against existing code; preserve current behaviour where reasonable).
- **Mocking `useElements`**: the Stripe SDK's `useElements()` hook returns the `Elements` instance scoped to its provider. In tests, mock it to return a deterministic stub so `confirmPayment` can be asserted with `expect.objectContaining({ elements: expect.anything() })`.
- **`useStripe` mocking**: existing tests already mock it; preserve. The wallet path needs `await stripePromise` rather than `useStripe()` (the latter is for in-render access; the wallet path's `handleEceConfirm` runs outside React's render cycle). Match whichever pattern the predecessor first-payment code uses; if it uses `await stripePromise`, preserve that.
- **Single-stage confirm semantics (AC PRD §8 25)**: the prior two-stage `confirmCardPayment + handleCardAction` flow is removed. The single `stripe.confirmPayment({...})` call handles 3DS internally. No assertion is added that "two-stage flow does not happen" — its absence in the source code is the assertion (negative test would be brittle). Code review enforces.
- **Risk R-D5 (card form re-mount) verification**: Test case 6 (AC-D08 + AC-D09) is the binding integration-test guard. If a future change to the hoisted `<Elements>` options causes ref-churn that re-mounts the nested provider, this test will fail — by design.
- **Risk R-D6 (ECE error visual state)**: Test case 5 (AC-D05) asserts both `helpers.paymentFailed()` AND `setMethodError(...)` are called. If a future change drops one of them, the test fails.
- **Risk R-D1 (pricing regression)**: Test case 2 (AC-D02) is the binding guard. CheckoutForm must not throw when pricing is undefined; the hoisted `<Elements>` must not mount; consent + card button + PayPal must still render.
- **Test-skeleton fidelity**: if the 8 skeletons in the file have specific naming or structure expectations that differ from the cases above, match the skeletons' intent. The 8 cases above are the work plan's verbatim list; skeletons should mirror them.
- **Run-on-this-task quality fix**: a CheckoutForm refactor of this size will likely surface lint or type-check issues during quality-fixer pass. Standard remediation; do NOT split into a separate task — the production refactor + tests + lint/type fixes all land in this one commit.

## Execution Log

- **2026-04-30 — subscription-consent gate removed (post-Task 04 follow-up).** The subscription-consent checkbox and its associated `consented` state were dropped from `<CheckoutForm>` and the `consented` prop was dropped from `<CardForm>`. Payment surfaces (Card button, PayPal slot, ECE wallet slot) are now always enabled at idle; only `submitting` (in-flight Stripe + backend confirm) and `creating` (intent creation in flight) gate them. AC-D10 (consent gating) is therefore superseded — `<CheckoutForm>` no longer encodes a consent gate, and the related test cases (AC-D06 consent-gate forwarding, AC-D06b/c/d wrappers, original test 1 "card button disabled until consent ticked", PayPal disabled-class tests 9b/9c/9d) were deleted. The defence-in-depth coverage previously held by AC-D06b is preserved by a new test that drives a second `onConfirm` while `submitting === true` (first `confirmPayment` pending) and asserts `intent.createIntent` is NOT called and `event.paymentFailed()` IS invoked. `useExpressCheckout`'s `disabled` arg remains in its public input surface (production hook signature unchanged); tests no longer assert its value. Test count delta: -8 deleted, +1 repurposed → 19 tests in `CheckoutForm.test.tsx`, 6 in `CardForm.test.tsx`, full suite 145/145 green.
