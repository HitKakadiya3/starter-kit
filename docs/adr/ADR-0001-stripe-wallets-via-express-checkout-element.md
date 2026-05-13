# ADR-0001 Stripe Wallets via Express Checkout Element

## Status

Accepted (approved 2026-04-29)

## Context

The Stripe wallet payment path (Google Pay + Apple Pay) is currently implemented in `src/hooks/useGooglePay.ts` using the legacy `stripe.paymentRequest({...}).show()` API with a `paymentmethod` event handler. While `paymentRequest.canMakePayment()` returns both `googlePay` and `applePay` availability flags, the hook ORs them into a single `available` boolean and the UI in `src/components/checkout/CheckoutForm.tsx` always renders a single button branded as "Google Pay" regardless of which wallet the user's environment actually supports.

PRD `docs/prd/module-3-first-payment.md` §3 "Out of scope" explicitly lists native Apple Pay (iOS Safari) as deliberately not addressed in Module 3 — surfaced only opportunistically through the same paymentRequest instance, with no separate, correctly-branded button. The product requirement now is to surface Apple Pay as its own first-class button on supported devices, which entails closing this out-of-scope gap.

Stripe's published guidance (2024 onward) steers Google Pay and Apple Pay integrations away from the Payment Request Button API toward the new Express Checkout Element (`<ExpressCheckoutElement>`, "ECE"), which renders correctly-branded Google Pay and Apple Pay buttons automatically based on browser/device support, and which collapses the confirm flow into a single `stripe.confirmPayment(...)` call inside its `onConfirm` event.

The existing confirm flow on the wallet path is two-staged: `stripe.confirmCardPayment(clientSecret, { payment_method }, { handleActions: false })` followed conditionally by `stripe.handleCardAction(clientSecret)` (see `handleGooglePayMethod` in `CheckoutForm.tsx`). The current architecture deliberately avoids a top-level `<Elements>` provider for the wallet path because PaymentIntents are created on-click rather than at mount; this prevents unused intents but is incompatible with ECE, which requires `<Elements>` to be mounted with either a `clientSecret` or `options.mode='payment' + amount + currency` at mount time.

The backend contract (the `/payment/stripe/create-payment-intent` and `/payment/stripe/first-sale/payments/confirm` endpoints) is unaffected. The only contract-level question is the value of the `payment_method_type` field sent at intent creation: the `PaymentIntentMethodType` union in `usePaymentIntent.ts` is currently `'card' | 'google_pay'` (PayPal is intentionally excluded from this union — it uses its own native SDK lifecycle and never creates a Stripe intent), and ECE does not expose the chosen wallet at create-intent time (the wallet identity is known only inside `onConfirm`).

This ADR records the decision to migrate the Stripe wallets slot to ECE. The card path and the PayPal path (`usePayPalCheckout` + `@paypal/paypal-js`) are unaffected.

## Decision

Migrate the Stripe wallet payments path (Google Pay + Apple Pay) from `stripe.paymentRequest()` to Stripe's Express Checkout Element (`<ExpressCheckoutElement>`). Replace the existing `useGooglePay` hook with a new `useExpressCheckout` hook. Hoist a single `<Elements>` provider in `CheckoutForm` configured with `options.mode='payment'`, `amount`, and `currency` derived from pricing at mount, and defer PaymentIntent creation to inside ECE's `onConfirm` handler so that intents continue to be created only when the user actually initiates payment.

### Decision Details

| Item | Content |
|------|---------|
| **Decision** | Replace `stripe.paymentRequest()` with `<ExpressCheckoutElement>` for the Stripe wallets slot, using a hoisted `<Elements>` provider in deferred-intent (`mode='payment'`) configuration. |
| **Why now** | The "no separate Apple Pay button" out-of-scope item in PRD §3 cannot be solved cleanly on the legacy paymentRequest API; Stripe is steering new integrations to ECE; doing both migrations in one pass avoids paying the integration cost twice. |
| **Why this** | ECE renders correctly-branded GPay and Apple Pay buttons automatically, collapses the two-stage confirm into a single `confirmPayment` call, and is future-extensible to Link/Amazon Pay/PayPal-via-ECE without further migration. |
| **Known unknowns** | The exact `payment_method_type` value the backend expects for the ECE wallet path (default candidate `'card'`); whether to merge or keep separate the card path's scoped `<Elements>` provider; cache invalidation strategy for sessions still keyed on `methodType === 'google_pay'`. |
| **Kill criteria** | Stripe deprecates ECE or fails to surface Apple Pay reliably in test mode on Safari; or the backend cannot accept a wallet-family-generic `payment_method_type` value without unacceptable contract churn. |

## Rationale

### Options Considered

1. **Option A: Keep `stripe.paymentRequest()`, split UI by wallet**
   - Use the existing `googlePay` and `applePay` flags returned by `canMakePayment()` to render two separately-branded buttons against the same paymentRequest instance.
   - Pros:
     - Smallest diff; no `<Elements>` hoisting required; existing tests largely intact.
     - Backend contract unchanged.
   - Cons:
     - Stays on the legacy API that Stripe is actively steering integrations away from; accumulates technical debt.
     - Manual button branding/visuals must be maintained by us instead of by Stripe.
     - No path forward to Link / Amazon Pay / additional wallets without a future migration.
     - Two-stage confirm flow (`confirmCardPayment` + `handleCardAction`) remains, with its associated race-window surface area.

2. **Option B: Add a parallel `useApplePay` hook with its own `stripe.paymentRequest()` instance**
   - Duplicate the existing hook, swap the branding, gate by the `applePay` flag.
   - Pros:
     - Resolves the PRD §3 out-of-scope Apple Pay gap with minimal architectural change.
     - Each wallet has an isolated code path.
   - Cons:
     - Duplicates legacy code (Rule of Three violation in waiting); doesn't address the underlying API obsolescence.
     - Doubles the maintenance surface for the paymentRequest path.
     - Same "no path to Link/Amazon Pay" limitation as Option A.
     - Two parallel paymentRequest instances increase the chance of subtle availability/state inconsistencies.

3. **Option C (Selected): Adopt Express Checkout Element (ECE)**
   - Replace `useGooglePay` with `useExpressCheckout`; hoist `<Elements>` with `mode='payment'`; defer intent creation into `onConfirm`.
   - Pros:
     - Resolves the PRD §3 out-of-scope Apple Pay gap cleanly: Stripe renders correctly-branded GPay and Apple Pay buttons based on actual environment support.
     - Aligns with Stripe's current best-practice integration path.
     - Collapses two-stage confirm into single `confirmPayment` call → less code, fewer race windows.
     - Future support for Link, Amazon Pay, and additional wallets requires only ECE option toggles, not another migration.
     - Stripe-controlled button visuals stay in sync with their UX guidelines automatically.
   - Cons:
     - Requires hoisting `<Elements>` with deferred `mode='payment' + amount + currency` — adds a render dependency on pricing being available at mount.
     - Apple Pay live-mode requires Stripe Dashboard domain registration AND serving `apple-developer-merchantid-domain-association` from `/.well-known/` — net-new deployment prerequisites.
     - Existing wallet-path tests (which mock `stripe.paymentRequest` and the `paymentmethod` event) must be rewritten against ECE's `onConfirm` contract.
     - `usePaymentIntent.PaymentIntentMethodType` union must widen and the cache key (`keyedBy.methodType`) needs a one-time invalidation strategy for users with cached `'google_pay'` entries.
     - Apple Pay button does not render on Chrome/Firefox even in test mode; manual acceptance must include Safari.

### Selection Reasoning

Option C is selected because it is the only option that simultaneously (a) resolves the immediate product requirement (closing the PRD §3 out-of-scope Apple Pay gap) and (b) eliminates the underlying API obsolescence that drives Options A and B toward eventual rework. The added cost — `<Elements>` hoisting, test rewrites, deployment prerequisites for Apple Pay live mode — is one-time and well-bounded, while the cost of staying on `paymentRequest()` compounds (manual branding maintenance, two-stage confirm complexity, no extension path). The deferred-intent strategy (`mode='payment'` at mount, `createIntent` inside `onConfirm`) preserves the existing on-demand-intent property that prevented unused PaymentIntents.

## Consequences

### Positive Consequences

- Apple Pay is rendered as its own correctly-branded button on supported devices/browsers, closing the PRD §3 out-of-scope Apple Pay gap.
- The wallet confirm flow collapses from two-stage (`confirmCardPayment` + `handleCardAction`) to a single `stripe.confirmPayment(...)` call, reducing code surface and race-window exposure.
- Future support for Link, Amazon Pay, and additional Stripe-routed wallets requires only ECE option toggles rather than further migration work.
- Stripe-controlled button visuals stay aligned with Stripe's UX guidelines automatically; no manual branding maintenance.
- Aligns the codebase with Stripe's currently recommended integration path, reducing future technical-debt risk.

### Negative Consequences

- The `<Elements>` provider must be hoisted in `CheckoutForm` with deferred `mode='payment' + amount + currency`, adding a render dependency on pricing being available at mount time.
- Apple Pay live-mode introduces net-new deployment prerequisites: Stripe Dashboard domain registration AND serving `apple-developer-merchantid-domain-association` from `/.well-known/` on `public/`. These are out of implementation scope for this change but become a release-blocking deploy task.
- `usePaymentIntent.PaymentIntentMethodType` union must widen, and the cache key (`keyedBy.methodType`) requires a one-time invalidation strategy for users whose cached entries are keyed by the previous `'google_pay'` value (likely treated as a natural cache miss when the new value does not match).
- Existing tests that mock `stripe.paymentRequest` and the `paymentmethod` event must be rewritten against ECE's `onConfirm` callback contract.
- Apple Pay does not render on Chrome or Firefox even in Stripe test mode; manual acceptance testing must explicitly include Safari (macOS or iOS Simulator) to validate the Apple Pay path.

### Neutral Consequences

- The card path's scoped `<Elements>` provider (mounted with `clientSecret` after `createIntent('card')` resolves) can either remain nested as a sibling/child of the hoisted ECE Elements or be merged into a single provider — both are valid and the choice is deferred to the Design Doc.
- The `assertKeyMatchesMode` guard in `src/lib/stripe.ts` continues to function unchanged.
- The PayPal path (`usePayPalCheckout` + `@paypal/paypal-js` native SDK Buttons) is untouched; ECE replaces only the Stripe-wallets slot.
- The backend endpoints (`/payment/stripe/create-payment-intent` and `/payment/stripe/first-sale/payments/confirm`) and the PaymentIntent contract are unchanged; only the `payment_method_type` field value is in scope for adjustment.

## Implementation Guidance

Principled direction only. Implementation procedures and specific code structure are deferred to the Design Doc.

- **Wallet abstraction**: Introduce a new `useExpressCheckout` hook with responsibilities scoped to ECE's lifecycle (mount, ready, confirm). Delete `useGooglePay` and its test file rather than retaining them as dead code; grep confirms three importers — `CheckoutForm.tsx`, `CheckoutForm.test.tsx`, and `useGooglePay.test.tsx`. The `CheckoutForm` test will be rewritten alongside the production code change; the standalone `useGooglePay.test.tsx` is deleted with the hook.
- **Elements provider strategy**: Mount `<Elements>` once near the top of `CheckoutForm` in deferred-intent mode (`options.mode='payment'`, `amount`, `currency` derived from pricing). Do not pre-create the PaymentIntent at mount.
- **Intent creation timing**: Call `usePaymentIntent.createIntent(...)` inside ECE's `onConfirm` handler, then call `stripe.confirmPayment({ elements, clientSecret, confirmParams: { return_url }, redirect: 'if_required' })`. This preserves the on-demand-intent property of the current architecture.
- **Backend contract**: Treat the `payment_method_type` value sent on the wallet path as a wallet-family-generic value (default candidate `'card'`, since ECE wraps card-family wallets). The exact value is an open question (see below) and must be probed and locked before Design Doc finalisation.
- **Scope discipline**: This change replaces only the Stripe-wallets slot. Do not modify the PayPal path or the card path's payment logic. The card path's `<Elements>` provider arrangement is a Design Doc decision, not an ADR decision.
- **Apple Pay live-mode prerequisites**: Treat Stripe Dashboard domain registration and `apple-developer-merchantid-domain-association` provisioning as deployment-task open items; implementation and acceptance occur in Stripe test mode where Apple Pay availability detection works on Safari without these prerequisites.
- **Testing principle**: Rewrite wallet-path tests against ECE's `onConfirm` contract using literal expected values and result-based verification; do not retain mocks of `stripe.paymentRequest` or the `paymentmethod` event.
- **Manual acceptance**: Apple Pay verification requires Safari (macOS or iOS Simulator); Chrome/Firefox cannot validate the Apple Pay button rendering.

## Open Questions

1. **Backend `payment_method_type` value for the wallet path.** ECE does not expose the chosen wallet at create-intent time, so the value must represent the wallet family generically. Default candidate is `'card'` (since ECE wraps card-family wallets). The exact value must be probed against the backend and locked in the Design Doc before Design Doc finalisation.
2. **Card-path `<Elements>` provider disposition.** Whether to merge the card path's scoped `<Elements>` (currently mounted with `clientSecret` after `createIntent('card')` resolves) with the hoisted ECE `<Elements>`, or keep them as sibling/nested providers. Both are valid; this is a Design Doc decision.
3. **Cache invalidation for `keyedBy.methodType === 'google_pay'`.** With the union widening, sessions still holding cached intents keyed by the previous `'google_pay'` value need a defined invalidation strategy. The likely resolution is to treat the union widening as a natural cache miss (any non-matching `methodType` ⇒ fresh intent), but this is to be confirmed in the Design Doc.

## Related Information

- PRD: `docs/prd/module-3-first-payment.md` §3 "Out of scope" — the Native Apple Pay (iOS Safari) bullet (this ADR closes that gap)
- Existing implementation: `src/hooks/useGooglePay.ts` (the hook to be replaced)
- Integration site: `src/components/checkout/CheckoutForm.tsx` (the only non-test consumer of `useGooglePay`)
- Intent-creation API and method-type union: `src/hooks/usePaymentIntent.ts` (`PaymentIntentMethodType`, `keyedBy.methodType`)
- Stripe key/mode guard: `src/lib/stripe.ts` (`assertKeyMatchesMode`) — unaffected
- PayPal path (out of scope for this ADR): `usePayPalCheckout` + `@paypal/paypal-js`
