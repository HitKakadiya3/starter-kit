# Module 3 — First Payment (Stripe) · PRD

**Parent scope:** [../scope.md](../scope.md) · **Depends on:** [module-1-load-questions.md](./module-1-load-questions.md), [module-2-pricing-display.md](./module-2-pricing-display.md) · **Status:** Draft · **Last updated:** 2026-04-29

**Decision record:** [../adr/ADR-0001-stripe-wallets-via-express-checkout-element.md](../adr/ADR-0001-stripe-wallets-via-express-checkout-element.md)

## 1. Overview

Module 3 makes [CheckoutPage.tsx](src/pages/CheckoutPage.tsx) charge the user. The three existing payment surfaces (Stripe wallets — Google Pay AND Apple Pay, PayPal blue, green "Credit or debit card") are **preserved as a three-slot layout**. Each surface is wired to its own Stripe flow and **creates its own `PaymentIntent` on click** — not proactively when the page loads. Intent creation takes a `payment_method_type` parameter in the backend body so the backend can provision the right method.

| Button | Stripe surface | Click flow |
|---|---|---|
| Stripe wallets (Google Pay + Apple Pay) | `<ExpressCheckoutElement>` (ECE) rendered under a hoisted `<Elements>` provider | `<Elements>` mounted at `CheckoutForm` top with deferred `mode='payment'` + `amount` + `currency` → user clicks the wallet button rendered by ECE (GPay or Apple Pay, branded by Stripe) → ECE invokes `onConfirm` → `createIntent(<wallet payment_method_type — default candidate `'card'`, see §10 O5>)` → `stripe.confirmPayment({ elements, clientSecret, confirmParams, redirect: 'if_required' })` → backend confirm |
| PayPal | `stripe.confirmPayPalPayment(clientSecret, { return_url })` | `createIntent('paypal')` → browser redirects to PayPal → return to `?payment_intent=…&redirect_status=…` → auto-finalise → backend confirm |
| Credit or debit card | Stripe `PaymentElement` rendered inline below the buttons when clicked | `createIntent('card')` → `<Elements>` mounts with clientSecret → `<PaymentElement>` renders → Pay → `stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })` → backend confirm |

All three share one backend confirm endpoint (`POST /payment/stripe/first-sale/payments/confirm`).

**On-demand vs proactive (hybrid pattern):** the original PRD created the intent on CheckoutPage mount; that was changed after live testing found it generated unused-intent records in the backend for every visitor who opened the page but never paid. Under the ECE migration the on-demand-intent property is preserved via a hybrid pattern: the `<Elements>` provider mounts at `CheckoutForm` top with deferred `mode='payment' + amount + currency` (no `clientSecret` yet), but `PaymentIntent` creation still happens on-demand — for the wallet path it fires inside ECE's `onConfirm`, and for card / PayPal it still fires on the user's button click. The session cache is keyed by `(qidRaw, prcId, mdid, methodType)`; the `methodType` cache key still applies, with its union widened to cover the wallet path. Switching surfaces creates a fresh intent for the right type, and refreshing mid-payment reuses the right cache entry.

**Pages:** CheckoutPage
**Backend endpoints:**
- `POST /payment/stripe/create-payment-intent` — request body includes `payment_method_type` (`'card'` | `'paypal'` | …) and the usual `email`, `quiz_result_id`, `user_on_iqbooster: ''`, `prc_id`, `pricing_discount`. Response: `{ client_secret, id }`.
- `POST /payment/stripe/first-sale/payments/confirm` — body: `payment_intent_id`, `quiz_result_id`, `user_on_iqbooster: ''`, `prc_id`, `pricing_discount`. Response: `{ cross_sale, redirect_page, first_sale_usd_price }`. Called on successful Stripe confirmation regardless of which method was used.

**Stripe SDK dependencies:**
- `@stripe/stripe-js`
- `@stripe/react-stripe-js`

**Success definition:** A user on `/checkout` can pay with card, Google Pay, or PayPal (whichever button they click), the backend is notified on success, and the user lands on the route the backend's `redirect_page` specifies. On failure, they stay on `/checkout` with a useful error and can retry without a duplicate charge.

## 2. In scope

- Existing three-slot payment UI **preserved** — wallets slot / PayPal / Credit or debit card render in the same layout positions. The wallets slot's exact visuals are now Stripe-controlled (see §6.1).
- **Card method:** click creates a card-type intent and reveals an inline Stripe `<PaymentElement>` below the buttons. Pay button beneath the element submits via `stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })`.
- **Stripe wallets (Google Pay + Apple Pay) via Express Checkout Element:** `<Elements>` is hoisted at the top of `CheckoutForm` with deferred `options.mode='payment'` + `amount` + `currency` from `PricingInfo`; under that provider, `<ExpressCheckoutElement>` renders the correctly-branded Google Pay AND Apple Pay buttons automatically based on browser/device support. The chosen wallet's identity is known only inside ECE's `onConfirm` callback — there is no per-wallet click handler in the React tree.
  - Apple Pay is in scope as a separately-rendered branded button on Safari (macOS) and iOS where supported.
- **PayPal method:** `stripe.confirmPayPalPayment(clientSecret, { return_url })` — Stripe's per-method confirm function. Full-page redirect, same return-URL handling as 3DS. (The generic `confirmPayment` with `payment_method_data: { type: 'paypal' }` is also valid but is rejected by the current Stripe TypeScript definitions.)
- **On-demand** `createIntent(methodType)` per button click; session-level intent cache keyed by `(qidRaw, prcId, mdid, methodType)` with 23 h TTL.
- Return-URL handling on `/checkout` mount for `?payment_intent=…&redirect_status=…`.
- Backend confirm call on successful Stripe confirmation.
- Subscription consent checkbox above the three buttons — required before any method is usable.
- Removal of both "Skip and see basic results" links.
- Inline error rendering per-method.

## 3. Out of scope

- Direct PayPal SDK (`/payment/paypal/first-sale/payments/confirm`). We use Stripe's PayPal integration; the separate backend PayPal endpoint stays unused.
- Solidgate.
- Split payments (`has_split_payment`) — backend flag is ignored; if it ever trends `true` we revisit.
- Subscription cancellation, billing portal, etc.
- Retry / dunning on declined cards beyond a simple "try again" UX.
- Apple Pay live-mode prerequisites — Stripe Dashboard domain registration and serving `/.well-known/apple-developer-merchantid-domain-association` at the production domain are deployment-task work items, not in the implementation scope of this PRD. Implementation and acceptance happen in Stripe test mode where these prerequisites are not required for browser support detection. Cross-reference §10 Open items O6 / O7.

## 4. Architecture

### 4.1 Environment

One new env var:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…   # or pk_live_… at prod build
```

Single key per build. Dev `.env` points at the Stripe test account that backs the sandbox; prod build uses the live key. The backend already signals `payment_mode: "sandbox" | "live"` in responses — on mount we assert the key prefix matches and throw a setup error in dev if they disagree (prevents the classic "prod key with sandbox backend" footgun).

```ts
// src/lib/stripe.ts
const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
export const stripePromise = loadStripe(pk);

export function assertKeyMatchesMode(mode: 'sandbox' | 'live') {
  const isTest = pk.startsWith('pk_test_');
  const expectedTest = mode === 'sandbox';
  if (isTest !== expectedTest) {
    console.error(`[stripe] key mode mismatch: key is ${isTest ? 'test' : 'live'}, backend is ${mode}`);
    if (import.meta.env.DEV) throw new Error('Stripe key / backend payment_mode mismatch');
  }
}
```

### 4.2 SDK loading

`loadStripe()` is called once at module scope and memoised (per Stripe's guidance). Under the ECE migration the `<Elements>` provider is **hoisted at the top of `CheckoutForm`** in deferred-intent mode — instantiated with `options.mode='payment'` plus `amount` + `currency` derived from `PricingInfo`, NOT with a `clientSecret` at creation time. ECE renders inside this hoisted provider. The card path retains its own separate scoped `<Elements options={{ clientSecret }}>` nested under the hoisted provider (Design Doc KDD-1: KEEP NESTED — see §4.9 / §10 O8); CardForm's PaymentElement still requires `clientSecret` at provider mount time, which the deferred hoisted provider cannot supply. PayPal does not go through `<Elements>` at all (full-page redirect).

### 4.3 On-demand payment intent lifecycle

`usePaymentIntent` exposes `createIntent(methodType)` — the caller (CheckoutForm) invokes it when the user clicks a method button. The mount effect is read-only: it only recovers succeeded intents from URL return params or the session cache. It never POSTs on mount.

**Session cache shape** (`FunnelSession.paymentIntent` in `src/lib/session.ts`):

```ts
paymentIntent?: {
  id: string;                   // pi_…
  clientSecret: string;
  keyedBy: {                    // inputs the intent was created for
    qidRaw: number;
    prcId: string;
    mdid: string;
    methodType: string;         // current source union per usePaymentIntent.ts:33 is 'card' | 'google_pay'; the union widens during this change to cover the wallet path under ECE. PayPal is intentionally excluded — it uses the native @paypal/paypal-js SDK and never creates a Stripe intent.
  };
  createdAt: number;            // ms
};
```

**`createIntent(methodType)` rules:**

1. If `session.paymentIntent` exists **and** its `keyedBy` tuple — including `methodType` — matches the current call **and** `createdAt` is within 23 h → reuse the cached `{ clientSecret, id }` without a network call.
2. Otherwise POST `/payment/stripe/create-payment-intent` with body:
   ```ts
   {
     email: session.email,
     quiz_result_id: session.qidRaw,
     user_on_iqbooster: '',          // required by backend even when empty
     payment_method_type: methodType, // 'card' | 'paypal' | …
     prc_id: session.prcId ?? '',
     pricing_discount: session.mdid ? { mdid: session.mdid } : '',
   }
   ```
3. Overwrite `session.paymentIntent` with the new `{ id, clientSecret, keyedBy, createdAt }`.

**Mount effect (read-only recovery only):**

- **URL return params** (`?payment_intent=…&payment_intent_client_secret=…&redirect_status=…`): retrieve the intent, strip the Stripe params, and if `succeeded` set `recoveredSucceeded: true` (the caller's auto-finalise observer runs backend confirm). `processing` triggers the 2 s / 30 s poll. `failed` surfaces the error.
- **Cached-succeeded recovery**: if a cached intent reports `status === 'succeeded'` on `stripe.retrievePaymentIntent`, likewise flag `recoveredSucceeded`. Covers the "user closed tab between Stripe success and backend confirm" case without any user action.
- No other work — the hook stays in `idle` until a button is clicked.

**Why on-demand:** the earlier proactive design created one intent per CheckoutPage visitor. The backend accumulated unused intent records for every user who bounced. On-demand creates intents only when the user commits to a method, and the cache-by-methodType rule means switching buttons (card → paypal) creates a fresh intent for the new method rather than recycling a mismatched one.

### 4.4 Confirmation flow — per method

Each button's click handler awaits `intent.createIntent(methodType)` first, then runs the method-specific Stripe invocation. All three share the backend confirm call (§4.5).

#### 4.4.1 Card method (Stripe PaymentElement)

1. User clicks the green "Credit or debit card" button.
2. Handler: `setActiveMethod('card')` + `await intent.createIntent('card')`. The second click on the same button collapses the form without re-fetching.
3. Once `intent.clientSecret` is populated, React mounts `<Elements stripe={stripePromise} options={{ clientSecret, appearance, loader: 'auto' }}>` wrapping `<CardForm>`. Elements is configured with `clientSecret` at creation time — Stripe's group is immutable after mount, so this wrapper is instantiated fresh when the user opens the card form.
4. `<CardForm>` renders a Stripe `<PaymentElement options={{ layout: 'tabs' }} />`. PaymentElement's `onChange` feeds a `complete` state that gates the Pay button.
5. On Pay click, call:
   ```ts
   const { error, paymentIntent } = await stripe.confirmPayment({
     elements,
     confirmParams: {
       return_url: cardReturnUrl,
       payment_method_data: { billing_details: { email: session.email } },
     },
     redirect: 'if_required',
   });
   ```
   The `redirect: 'if_required'` flag keeps non-3DS / inline-success flows on the page and only redirects when the bank forces it. PaymentElement handles 3DS challenges internally.
6. If `error`: show `error.message` inline, re-enable the Pay button.
7. If `paymentIntent?.status === 'succeeded'`: invoke `onSuccess(paymentIntent.id)`, which triggers backend confirm (§4.5) and navigates per the response.
8. If a bank-redirect happens, Stripe bounces to `cardReturnUrl`; mount recovery (§4.4.4) picks it up.

#### 4.4.2 Stripe wallets method (Express Checkout Element)

1. `useExpressCheckout({ pricing, onConfirm })` returns the ECE configuration (button options, `onConfirm` handler shape). ECE renders inside the `<Elements>` provider hoisted at the top of `CheckoutForm` (deferred mode — `options.mode='payment'`, `amount`, `currency` from `PricingInfo`).
2. ECE handles wallet-availability detection internally and renders only the wallets supported by the user's browser/device. On Chrome with a saved Google Pay card the GPay button renders; on Safari (macOS or iOS) with Apple Pay configured the Apple Pay button renders; on unsupported browsers ECE renders nothing or a Stripe-controlled placeholder. There is no application-level `canMakePayment()` gate.
3. On user click of the GPay or Apple Pay button rendered by ECE, ECE invokes the `onConfirm({ resolve, reject, paymentFailed, … })` callback. The chosen wallet's identity is known only inside this callback.
4. Inside `onConfirm` the flow is:
   ```ts
   const { clientSecret } = await intent.createIntent(<wallet payment_method_type>);
   // exact value pending backend probe (default candidate 'card'); see §10 O5.
   const { error, paymentIntent } = await stripe.confirmPayment({
     elements,
     clientSecret,
     confirmParams: { return_url: cardReturnUrl },
     redirect: 'if_required',
   });
   ```
5. On success → invoke backend confirm (§4.5) and navigate per `redirect_page`.
6. On failure → surface `error.message` inline; ECE manages its own button state (Stripe-controlled). No backend confirm fires.

The two-stage `confirmCardPayment + handleCardAction` flow used by the prior `paymentRequest`-based GPay path is no longer used. The single `stripe.confirmPayment(...)` call handles 3DS internally.

#### 4.4.3 PayPal method (confirmPayPalPayment redirect)

1. User clicks the blue PayPal button.
2. Handler: `await intent.createIntent('paypal')` (note: `payment_method_type: 'paypal'` in the body).
3. Call `stripe.confirmPayPalPayment(clientSecret, { return_url })`. This is Stripe's per-method confirm function — cleaner than the generic `confirmPayment({ payment_method_data: { type: 'paypal' } })` which Stripe's TypeScript definitions currently reject.
4. On success, Stripe redirects the browser to PayPal's hosted UI. The user completes or cancels there and lands back on `cardReturnUrl` with `?payment_intent=…&redirect_status=…` appended.
5. Re-mount handling is covered in §4.4.4.

#### 4.4.4 Return-from-redirect handling (PayPal, 3DS, Link)

On every CheckoutPage mount, before any method is selected, inspect the URL:

1. If the URL has `?payment_intent=…&payment_intent_client_secret=…&redirect_status=…`:
   a. Retrieve the intent via `stripe.retrievePaymentIntent(payment_intent_client_secret)`.
   b. **`redirect_status === 'succeeded'`** → strip the Stripe params from the URL via `replaceState`, then call backend confirm (§4.5) and navigate.
   c. **`redirect_status === 'processing'`** → show a "Payment processing…" overlay, poll `retrievePaymentIntent` every 2 s for up to 30 s. If it transitions to `succeeded`, proceed; if it remains `processing` past the timeout, show a "We'll email you once the payment confirms" card with a Continue-anyway action that calls backend confirm with the current intent id (the backend treats processing intents as pending; acceptable trade-off).
   d. **`redirect_status === 'failed'`** or intent state `requires_payment_method` → drop the cached intent, show Stripe's `last_payment_error.message` inline, re-enable the three buttons so the user can try again.

2. Otherwise, if `session.paymentIntent` is cached and Stripe reports `status === 'succeeded'` (tab was closed between Stripe success and backend confirm), jump straight to §4.5. This is the rare "recovered intent" case — prevents duplicate charges.

3. Otherwise, render the three buttons idle (with consent gate).

### 4.5 Backend confirm

```ts
POST /payment/stripe/first-sale/payments/confirm
{
  payment_intent_id: session.paymentIntent.id,
  quiz_result_id: session.qidRaw,
  user_on_iqbooster: '',
  prc_id: session.prcId ?? '',
  pricing_discount: session.mdid ? { mdid: session.mdid } : '',
}
```

Response handling:

1. Merge `response.cross_sale` into `session.pricingInfo.transactions.cross_sale` and set `session.pricingInfo.cross_sale_compulsory ??= response.cross_sale.is_compulsory`. Module 4 reads from `pricingInfo`, so this keeps one source of truth.
2. Clear `session.paymentIntent` (prevents accidental reuse on browser back).
3. Navigate to `resolveRedirect(response.redirect_page) + '?qid=' + session.qidEncrypted`.

### 4.6 Return URL

```ts
const session = getSession();
cardReturnUrl = `${window.location.origin}${withPromoParams(
  `/checkout?qid=${session.qidRaw ?? ""}`,
)}`;
```

- **Raw integer qid**, not encrypted — `/questions/results` rejects the encrypted form ("must be a number"). The earlier Module 1 fix applies here too.
- **`withPromoParams`** forwards `?prc_id` / `?mdid` onto the return URL so that when Stripe bounces the user back to `/checkout`, the promo params are still in the address bar and the resume guard / pricing hook see them.
- Same origin, same page — the mount recovery in §4.4.4 handles reentry. No dedicated `/payment-return` route.

### 4.7 Consent checkbox

Because `subscription_after: "FIRST_SELL"` means signing up for a subscription is implicit, we add an explicit consent checkbox **above the three payment buttons**:

```tsx
<Checkbox
  id="subscription-consent"
  checked={consented}
  onCheckedChange={setConsented}
/>
<label htmlFor="subscription-consent" className="text-xs">
  I understand that after the {TRIAL_DAYS}-day trial my subscription will begin
  automatically at {pricing.subscription_price_label} every
  {pricing.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS} days
  until I cancel. I agree to the <a …>Subscription Policy</a>,
  <a …>Terms of Use</a>, and <a …>Privacy Policy</a>.
</label>
```

Gating rule: **all three surfaces are disabled unless `consented === true` AND no other method is in flight (`submitting === false`)**. Additionally:
- The wallets slot relies on ECE for wallet-availability detection internally; CheckoutForm gates submission based on `consented && !submitting` only — there is no application-level `canMakePayment()` check, and ECE manages its own button state (rendering nothing or a Stripe-controlled placeholder where wallets are unsupported).
- Card's Pay button inside the inline form further requires `paymentElement.complete === true`.

The existing fine-print paragraph below stays as supplementary legal copy.

### 4.8 `payment_method_type` on intent creation

`POST /payment/stripe/create-payment-intent` is called with a `payment_method_type` derived from the surface the user is paying with:

- Card button → `payment_method_type: 'card'`
- PayPal button → `payment_method_type: 'paypal'`
- Stripe wallets via ECE (Google Pay + Apple Pay) → a single `payment_method_type` value, because ECE does not expose the chosen wallet at create-intent time (the identity is only known inside `onConfirm`, which runs after the intent has been requested in the same call). Default candidate is `'card'`. The exact value is open and pending a backend probe — see §10 O5.

This lets the backend provision the intent for the specific rail the frontend is about to use. The earlier "send empty string and let Stripe decide" pattern changed when the flow moved to on-demand creation.

### 4.9 Stripe Elements wiring

`<Elements>` is **hoisted at the top of `CheckoutForm`** with deferred-intent options — instantiated with `options.mode='payment'` plus `amount` + `currency` derived from `PricingInfo`. Both `<ExpressCheckoutElement>` and the card path's `<PaymentElement>` live under this provider.

**Deferred-mode contract.** Stripe accepts `mode + amount + currency` at provider-creation time in lieu of a `clientSecret`. The `clientSecret` is no longer required when the Elements group mounts; instead it is supplied later inside the per-method confirm call: `stripe.confirmPayment({ elements, clientSecret, confirmParams, redirect: 'if_required' })`. This is what unblocks the wallet path — ECE can render before any intent has been created, and intent creation slides into ECE's `onConfirm` callback.

Shape (illustrative — exact JSX is a Design Doc concern):

```tsx
<Elements
  stripe={stripePromise}
  options={{
    mode: 'payment',
    amount: pricingAmountMinorUnits,
    currency: pricing.currency_code.toLowerCase(),
    appearance: { theme: 'stripe', variables: { colorPrimary: 'hsl(270 50% 45%)' } },
    loader: 'auto',
  }}
>
  <ExpressCheckoutElement onConfirm={…} />
  {/* Card path's PaymentElement under same provider, OR a separate nested <Elements> — see open item below. */}
</Elements>
```

**Resolved by Design Doc KDD-1: KEEP NESTED.** The card path today mounts a separate scoped `<Elements>` provider with `clientSecret` after `createIntent('card')` resolves (§4.4.1, §6.3). Two outcomes were valid:

- **Merge:** the card path's `<PaymentElement>` is moved under the hoisted deferred-mode `<Elements>`. A single Elements tree hosts both ECE and PaymentElement; `clientSecret` is supplied at confirm time only.
- **Keep nested / sibling:** the card path retains a separately scoped `<Elements>` (mounted with `clientSecret` after `createIntent('card')` resolves) alongside the hoisted deferred-mode provider; ECE lives under the hoisted one, PaymentElement under the nested one.

Both are technically valid in Stripe's current API surface. **The Design Doc locks Outcome 2 (KEEP NESTED) as KDD-1** because the card path's PaymentElement requires `clientSecret` at provider mount time (Stripe Elements groups are immutable after mount; the deferred hoisted provider cannot supply a `clientSecret` retroactively). Outcome 1 (merge) was rejected — it would force CardForm/ECE re-mounts on every wallet/card toggle. See §10 O8 (resolved).

`<CardForm>` uses `useStripe()` and `useElements()` from `@stripe/react-stripe-js`, renders `<PaymentElement options={{ layout: 'tabs' }} />`, binds its `onChange` to gate the Pay button on `event.complete`, and calls `stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })` on submit.

### 4.10 Error surfaces

All errors render as inline alerts inside the payment card:

- **Intent creation failure** (`POST /payment/stripe/create-payment-intent` errors). Card message: "We couldn't prepare your payment. Please try again." Retry button triggers a fresh intent. Three buttons disabled while this error is active.
- **Stripe confirmation error** (card declined, 3DS failed, PayPal cancelled-and-returned, etc.). Display `error.message` from Stripe. Buttons re-enable; card form (if open) stays editable.
- **Wallet unavailable** (no supported wallet detected by ECE — e.g. Firefox without Google Pay, Chrome without saved cards, Safari without Apple Pay configured). No inline error and no application-level `canMakePayment` check — ECE handles availability internally and renders nothing or a Stripe-controlled placeholder in its slot. The rest of the form (PayPal, Card, consent gate) remains usable. See §4.4.2 step 2 and AC 23.
- **Backend confirm failure** (`POST /payment/stripe/first-sale/payments/confirm` errors after Stripe succeeded). Card message: "Your payment went through, but we had trouble finalising your order. Please contact support." Include a "Retry" button that calls confirm again with the same `paymentIntent.id`. Backend behaviour on duplicate confirm calls (idempotent vs. 409 / other rejection) is open — see §9 R4 / §10 O1; the retry UX assumes idempotency and may need adjustment if the backend rejects duplicates.

No additional logging endpoints are called from the frontend.

## 5. Data flow

```
CheckoutPage mount
  ↓
Module 1 resume guard
  → POST /questions/results → session.pricingInfo refreshed
  → if redirect_page != /checkout → navigate(mapped) & stop
  ↓
usePaymentIntent mount effect (read-only)
  ├─ URL has Stripe return params → §4.4.4 → auto-finalise → navigate
  ├─ session.paymentIntent exists & Stripe says succeeded → auto-finalise → navigate
  └─ otherwise → stays idle, no POST
  ↓
Render <CheckoutForm> with hoisted <Elements options={{ mode: 'payment', amount, currency, ... }}>
  wrapping consent checkbox + ECE wallets slot + PayPal slot + Card button + (empty) error slot.
  ECE renders any supported wallet buttons (GPay / Apple Pay) immediately, no clientSecret required.
  Pricing dependency: <Elements> requires `amount + currency` at mount; ECE does not render until
  `pricing` is present (see §9 R11′).
  ↓
User clicks a payment surface:
  ├─ Card: setActiveMethod('card') → await createIntent('card') →
  │   <CardForm> renders <PaymentElement> under a NESTED scoped <Elements options={{ clientSecret }}>
  │   (Design Doc KDD-1: KEEP NESTED — see §10 O8 resolved)
  ├─ PayPal: await createIntent('paypal') → stripe.confirmPayPalPayment(clientSecret, { return_url })
  │   → browser redirects to PayPal
  └─ Wallets (ECE): user clicks the GPay or Apple Pay button rendered by ECE → ECE invokes
      onConfirm({ resolve, reject, paymentFailed, ... }) →
      await createIntent(<wallet payment_method_type — default candidate 'card', see §10 O5>) →
      stripe.confirmPayment({ elements, clientSecret, confirmParams: { return_url },
                              redirect: 'if_required' })
  ↓
Surface-specific Stripe flow:
  ├─ Card: <PaymentElement> + stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })
  │       → inline success OR 3DS in-flow OR bank-redirect → return_url
  ├─ Wallets (ECE): stripe.confirmPayment({ elements, clientSecret, confirmParams,
  │                                         redirect: 'if_required' })
  │                 → inline success OR Stripe-handled redirect → return_url
  └─ PayPal: stripe.confirmPayPalPayment redirects browser → returns with redirect_status param
  ↓
Inline success path → backend confirm → merge cross_sale → navigate per redirect_page
Redirect path → Stripe hosts 3DS/PayPal → returns to return_url → back to §4.4.4 step 1
Error → inline alert; ECE communicates wallet errors via its own button state; three surfaces re-enable
Cache-key migration: a session holding `keyedBy.methodType === 'google_pay'` from the prior
  paymentRequest architecture experiences a natural cache miss on the first wallet click and
  creates a fresh intent (see AC 25a; resolution of the wallet `payment_method_type` value is
  tracked in §10 O5).
```

## 6. Per-page PRD — CheckoutPage

### 6.1 Preserved (three-slot payment UI layout kept)

The three-slot payment area keeps its layout positions; the wallets slot is now Stripe-controlled (see ADR-0001):

- **Stripe wallets slot** ([CheckoutPage.tsx:336–338](src/pages/CheckoutPage.tsx#L336)) — `<ExpressCheckoutElement>` renders the correctly-branded Google Pay AND Apple Pay buttons automatically based on browser/device support. The visual differs from the prior single GPay-pill design — Stripe controls the rendering. Button type, theme, and height are configurable options on ECE; pixel-level matching to the previous custom GPay pill is not guaranteed.
- PayPal blue ([CheckoutPage.tsx:339–341](src/pages/CheckoutPage.tsx#L339)) — `hsl(213 100% 44%)` background. Unchanged.
- Green "Credit or debit card" ([CheckoutPage.tsx:342–344](src/pages/CheckoutPage.tsx#L342)) — `hsl(var(--success))` background. Unchanged.

Only the wallets slot's underlying surface changes; PayPal and Card retain their existing visuals and `onClick` handlers (with the wiring updates in §6.3).

### 6.2 Removed

- [CheckoutPage.tsx:360–368](src/pages/CheckoutPage.tsx#L360) — "Skip and see basic results" link under the payment card.
- [CheckoutPage.tsx:478–483](src/pages/CheckoutPage.tsx#L478) — "Skip and see basic results" link in the bottom CTA.

### 6.3 Added

A new consent checkbox above the three buttons, and an inline `<CardForm />` that renders **between the three buttons and the secure-payment reassurance line** when the user clicks the Credit/debit button.

```
<CheckoutForm>
  <Elements stripe={stripePromise} options={{ mode: 'payment', amount, currency, appearance, loader: 'auto' }}>
    <consent checkbox + label>                 // blocks all surfaces until ticked
    <error alert (conditionally rendered)>     // intent / confirm / backend-confirm errors
    <ExpressCheckoutElement>                   // ECE renders Google Pay AND Apple Pay buttons (browser/device dependent);
                                              // onConfirm → createIntent(...) → stripe.confirmPayment({ elements, clientSecret, ... })
    <PayPal button>                            // existing visual; onClick → createIntent('paypal') → confirmPayPalPayment(clientSecret, { return_url })
    <Credit or debit card button>              // existing visual; onClick → setActiveMethod('card') → createIntent('card')

    {activeMethod === 'card' && intent.clientSecret && (
      // Card path's <PaymentElement> render branch.
      // Wrapped in its own scoped <Elements options={{ clientSecret }}> nested under the hoisted
      // deferred-mode <Elements> (Design Doc KDD-1: KEEP NESTED — see §4.9 / §10 O8 resolved).
      <Elements options={{ clientSecret: intent.clientSecret, ... }}>
        <CardForm>
          <PaymentElement options={{ layout: 'tabs' }} />   // renders card + any Stripe-enabled wallets
          <inline error slot>
          <Pay {first_sale_price_label} button>             // enabled when paymentElement.complete
        </CardForm>
      </Elements>
    )}

    <ShieldCheck "Your payment is secure and encrypted" line> (kept)
  </Elements>
</CheckoutForm>
```

`<Elements>` is now hoisted with deferred `mode='payment' + amount + currency` and wraps `<ExpressCheckoutElement>`. The card path's `<PaymentElement>` is wrapped in its own scoped `<Elements options={{ clientSecret }}>` nested under the hoisted provider — Design Doc KDD-1 (KEEP NESTED) locks this disposition because Stripe Elements groups are immutable after mount, so the deferred hoisted provider cannot supply a `clientSecret` retroactively for PaymentElement. See §4.9 / §10 O8 (resolved). PayPal redirects the whole page so it doesn't need Elements.

Button-level gating summary:

| Button | Enabled when |
|---|---|
| Stripe wallets (ECE) | `consented && !submitting` (ECE handles its own wallet-availability gating internally and renders nothing when no wallet is supported) |
| PayPal | `consented && !submitting` |
| Credit or debit card | `consented && !submitting` |
| Pay (inside CardForm) | `consented && paymentElement.complete && !submitting` |

Intent creation still happens **on click** — the on-demand-intent property is preserved. For the card and PayPal surfaces, the user's button click triggers `createIntent(...)` directly. For the wallet path, the trigger is ECE's `onConfirm` callback (which fires after the user clicks the GPay or Apple Pay button rendered by ECE). Clicking the Credit-card button a second time collapses the inline form without submitting or invalidating the cached intent.

### 6.3b Preserved

Everything outside the payment card stays: the two-column layout, social proof ticker, personality grid, testimonials, trust features, final CTA (but the "Reveal My Type" final CTA now scrolls to payment card instead of offering an alternative skip). All price bindings from Module 2 stay untouched — Module 3 only replaces the action area.

### 6.4 Loading / error states

| State | UX |
|---|---|
| Resume guard in flight | Full-page `<Loading />` (matches App.tsx pattern). |
| Page loaded, no method clicked | Three buttons + consent checkbox rendered. No Elements, no PaymentElement, no network calls. |
| Method button clicked (intent creating) | That button shows an inline spinner; other buttons disabled; no Elements mounted yet for card. |
| Intent creation failed | Inline error alert with Retry button. Other buttons re-enabled. |
| Card form opening | Elements + PaymentElement mount; Stripe's built-in `loader: 'auto'` shows while the iframe initialises. |
| Submitting (after Pay click, before redirect/response) | Pay button enters loading spinner; PaymentElement disabled. |
| Redirect return processing | Full-card overlay: "Verifying your payment…" + spinner; 2s poll for up to 30s. |
| Redirect return succeeded | Brief "Payment successful, redirecting…" frame (≤ 500ms before navigate). |
| Redirect return failed | Inline error; cached intent cleared; three buttons re-enabled so user can retry. |
| Backend confirm failed after Stripe success | Inline error with support contact + Retry button (same `payment_intent_id`). |

## 7. Changes to existing code

| File | Change |
|---|---|
| [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx) | Mount `<CheckoutForm />` in place of the standalone payment surfaces. Remove both "Skip and see basic results" links. Everything else (pricing, testimonials, social proof, etc.) unchanged. |
| [src/lib/session.ts](src/lib/session.ts) (from Module 1) | Extend `FunnelSession` with `paymentIntent` shape (includes `methodType` in `keyedBy`); widen the `methodType` union to cover the wallet path under ECE. |
| `src/components/checkout/CheckoutForm.tsx` | Updated — hoist `<Elements>` with deferred `mode='payment'`; mount ECE in the wallets slot; remove `useGooglePay` integration. |
| `src/components/checkout/CheckoutForm.test.tsx` | Rewritten — covers the ECE flow (onConfirm-based intent creation + confirm) instead of the prior `paymentRequest.show()` flow. |
| `src/hooks/useGooglePay.ts` | **Deleted.** |
| `src/hooks/useGooglePay.test.tsx` | **Deleted.** |

**Files added:**
- `src/lib/stripe.ts` — memoised `stripePromise` + `assertKeyMatchesMode(mode)` dev-time assertion.
- `src/hooks/usePaymentIntent.ts` — on-demand intent lifecycle (§4.3). Returns `{ state, clientSecret, intentId, error, recoveredSucceeded, processingTimedOut, retry, createIntent, finalizeAfterStripeSuccess }`. Mount effect is read-only recovery; no POST until `createIntent(methodType)` is called.
- `src/hooks/useExpressCheckout.ts` — replaces `useGooglePay`. Wraps the ECE configuration (button options, `onConfirm` handler shape) and is consumed inside the hoisted `<Elements>` provider in `CheckoutForm`.
- `src/components/checkout/CheckoutForm.tsx` — owns consent + the wallets slot (ECE) + PayPal + Card surfaces + error slot + method-specific handlers + the hoisted deferred-mode `<Elements>` provider. Card-path PaymentElement disposition (under the hoisted provider vs in a separately scoped `<Elements clientSecret={...}>`) per the Design Doc.
- `src/components/checkout/CardForm.tsx` — inline `<PaymentElement>` form with its own Pay button. Uses `stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })`.
- `public/.well-known/README.md` — placeholder note documenting that the production deployment must serve the `apple-developer-merchantid-domain-association` file from `/.well-known/` (deployment task; see §10 O7). The file itself is not committed by this implementation.

**Dependencies added** to `package.json`:
- `@stripe/stripe-js` — confirm the installed version is `>= 2.1.0` to expose `ExpressCheckoutElement`.
- `@stripe/react-stripe-js` — confirm the installed version is `>= 2.1.0` to expose the `<ExpressCheckoutElement>` React component.

**Env:**
- `.env.example` gains `VITE_STRIPE_PUBLISHABLE_KEY=`.

## 8. Acceptance criteria

### Cross-cutting (applies regardless of chosen method)

1. `/checkout?qid=…` on fresh session triggers **zero** backend payment calls until the user clicks a method button. The page loads with just the three buttons. (Removed 2026-04-30: subscription-consent checkbox dropped from CheckoutForm; payment surfaces are always enabled.)
2. ~~The consent checkbox must be ticked before any of the three buttons is enabled.~~ **Removed 2026-04-30: subscription-consent checkbox dropped from CheckoutForm; payment surfaces are always enabled.**
3. All three buttons keep their existing visuals — no layout or colour change.
4. Both "Skip and see basic results" links are removed.
5. Clicking a method button (or completing the wallet sheet inside ECE) fires `POST /payment/stripe/create-payment-intent` exactly once with the right `payment_method_type` (`'card'` for the card surface, `'paypal'` for PayPal, and the resolved wallet value for the ECE wallets surface — default candidate `'card'`, exact value pending the §10 O5 backend probe), including `user_on_iqbooster: ''` in the body.
6. Active promo params (`prc_id` and/or `mdid`, both supported) are passed through to both intent creation and backend confirm request bodies.
7. Refreshing `/checkout` mid-payment reuses the cached intent (same `(qidRaw, prcId, mdid, methodType)` tuple) — no duplicate create-intent POST.
8. Recovered-succeeded intent path: if Stripe says the cached intent is `succeeded` on mount (user closed tab after Stripe before backend confirm), backend confirm is called automatically and the user is navigated per `redirect_page` — no duplicate charge.
9. After backend confirm, `session.pricingInfo.transactions.cross_sale` reflects the `cross_sale` block from the confirm response, and `session.paymentIntent` is cleared.
10. Dev build throws a clear setup error when `VITE_STRIPE_PUBLISHABLE_KEY` doesn't match the backend's `payment_mode`.
11. Switching method mid-session (e.g. click Card, change mind, click PayPal) invalidates the card intent and creates a fresh paypal intent — the `keyedBy.methodType` mismatch drops the cache entry.
11a. Cache invalidation on `methodType` mismatch (cross-cutting): if `keyedBy.methodType` does not match the value sent on `createIntent`, the cache entry is dropped and a fresh intent is created — no errors raised, no duplicate session entry persisted.

### Card method

12. Clicking the Credit-or-debit-card button triggers `createIntent('card')` and, on success, mounts `<Elements options={{ clientSecret }}>` wrapping `<CardForm>` with a Stripe `<PaymentElement options={{ layout: 'tabs' }} />` and a Pay button.
13. The Pay button inside CardForm is disabled until `PaymentElement.onChange` reports `complete: true` (AND the cross-cutting gating of AC 2 is met).
14. Pay button label reads `Pay {current.first_sale_price_label}` with the dynamic value from `session.pricingInfo`.
15. Pay click invokes `stripe.confirmPayment({ elements, confirmParams: { return_url, payment_method_data: { billing_details: { email } } }, redirect: 'if_required' })`. Non-3DS success stays on the page with `paymentIntent.status === 'succeeded'`; 3DS is handled internally by PaymentElement.
16. Successful card payment fires `POST /payment/stripe/first-sale/payments/confirm` with the correct `payment_intent_id` (plus `user_on_iqbooster: ''`, `prc_id`, `pricing_discount`) and navigates per `redirect_page`.
17. 3DS-required card payment triggers Stripe's in-flow authentication (rendered inside PaymentElement); on success, the same confirm call fires and the user navigates onward.
18. Declined card shows Stripe's `error.message` inline; Pay button re-enables; no backend confirm call is made.
19. Clicking the Credit-or-debit-card button a second time collapses the form (returns to idle state) without submitting and without invalidating the cached card intent — a re-open reuses the same `clientSecret`.

### Stripe wallets (Express Checkout Element) method

20. `<ExpressCheckoutElement>` renders inside the `<Elements>` provider hoisted at the top of `CheckoutForm` with `options.mode='payment'`, `amount`, and `currency` derived from `PricingInfo`. ECE does not get a separate `<Elements>` provider of its own.
21. Chrome with a Google account holding a saved card: the Google Pay button renders inside the ECE slot. Click → `onConfirm` invokes `intent.createIntent(<wallet payment_method_type>)` then `stripe.confirmPayment({ elements, clientSecret, confirmParams, redirect: 'if_required' })` → backend confirm (§4.5) fires on success → user navigates per `redirect_page`.
22. Safari (macOS or iOS Simulator) with Apple Pay configured: the Apple Pay button renders inside the ECE slot. Click → `onConfirm` invokes `intent.createIntent(<wallet payment_method_type>)` then `stripe.confirmPayment({ elements, clientSecret, confirmParams, redirect: 'if_required' })` → backend confirm (§4.5) fires on success → user navigates per `redirect_page`.
23. On unsupported browsers (Firefox without GPay, Chrome without saved cards, etc.), the ECE slot renders nothing or a Stripe-controlled placeholder — no console errors are thrown, the rest of the form (PayPal, Card) remains usable. (Updated 2026-04-30: subscription-consent checkbox dropped from CheckoutForm; payment surfaces are always enabled.)
24. `onConfirm` failure path (declined wallet, user cancellation): ECE communicates the error via its button state (Stripe-controlled); CheckoutForm surfaces `error.message` inline; no backend confirm fires; the other surfaces remain interactable.
25. The two-stage `confirmCardPayment + handleCardAction` flow used by the prior `paymentRequest`-based GPay path is no longer used — 3DS is handled internally by the single `stripe.confirmPayment(...)` call.
25a. Cache key migration: sessions still holding `keyedBy.methodType === 'google_pay'` from the prior architecture experience a natural cache miss on the first wallet click under the new architecture and create a fresh intent — no errors, no duplicate session entry.

### PayPal method

26. Clicking the PayPal button awaits `createIntent('paypal')` (i.e. intent is created with `payment_method_type: 'paypal'`) and then calls `stripe.confirmPayPalPayment(clientSecret, { return_url })`. (The generic `confirmPayment({ payment_method_data: { type: 'paypal' } })` is also valid but is currently rejected by the Stripe TypeScript definitions.)
27. Successful PayPal flow redirects the browser to PayPal's hosted page and returns to `/checkout?qid=…&prc_id=…&mdid=…&payment_intent=…&redirect_status=succeeded` — promo params survive the round-trip because `return_url` is built via `withPromoParams`.
28. On return, the Module 3 state machine retrieves the intent, strips the Stripe params from the URL via `replaceState`, fires backend confirm, and navigates per `redirect_page`.
29. PayPal cancellation (returning without `redirect_status=succeeded`, or with `requires_payment_method`) restores the CheckoutPage idle state with an inline error message; cached intent is cleared so a retry re-creates; no backend confirm call is made.

## 9. Risks & assumptions

- **R1 — Single Stripe key per build.** Can't swap between sandbox and live without a rebuild. Acceptable because `payment_mode` is stable per deploy; mismatch is asserted in dev.
- **R2 — Intent TTL.** Stripe intents live 24 h by default; we cap reuse at 23 h to give a safety margin. Longer sessions would require more careful retention, but the user funnel is shorter than that.
- **R3 — Cross-tab concurrency.** If the user opens `/checkout` in two tabs with the same `qid`, both will try to reuse or create intents. Stripe is tolerant here, but the second tab might create a second intent if the first hasn't persisted to sessionStorage yet (sessionStorage is **per-tab**). Acceptable for v1; flagged.
- **R4 — Backend confirm idempotency.** If `POST /payment/stripe/first-sale/payments/confirm` is called twice for the same `payment_intent_id` (e.g. retry after transient network failure), the backend should ideally return the same success response. Not documented. Frontend retry UX is designed as if it's idempotent; if the backend 409s on duplicates, retry UX needs a change. **Ask backend team.**
- **R5 — PayPal-via-Stripe vs our backend's `/payment/paypal` endpoint.** Our PayPal button calls `stripe.confirmPayment(..., { payment_method_data: { type: 'paypal' } })`, which is confirmed with the **Stripe** confirm endpoint (`/payment/stripe/first-sale/payments/confirm`), not the backend's separate `/payment/paypal/...` flow. If the backend's Stripe account isn't configured with PayPal as an enabled payment method, `confirmPayment` will error. Backend team should confirm Stripe-side PayPal is enabled before this ships.
- **R6 — Subscription authorisation.** We aren't setting up a subscription intent with Stripe directly — the backend handles the post-first-sale subscription. If that's not wired server-side, the fine print "subscription begins automatically" is false and legal risk grows. Out of frontend scope; flagged.
- **R7 — 3DS during intent reuse.** If a cached intent requires 3DS and the user refreshes mid-3DS, the 3DS page URL is lost. We can still recover via the cached intent and prompt them to pay again (Stripe is idempotent on re-confirmation). Worst case: one re-auth round.
- **R8 — URL shares Stripe params.** If a user shares their URL right after returning from Stripe, they'd leak intent IDs. We `replaceState` as the first render step to prevent that, but there's a ~50ms window. Acceptable.
- **R9 — ECE wallet availability.** ECE handles `canMakePayment` equivalents internally and renders only the wallets the browser supports — Google Pay surfaces on Chrome with a saved Google wallet, Apple Pay specifically requires Safari (macOS or iOS Simulator) for verification. There is no application-level availability check; ECE's slot may render nothing on unsupported browsers, and that is the expected state. Flagged for marketing if a "wallets unavailable" treatment is desired.
- **R10 — Stripe Elements immutability.** `<Elements>` is immutable after creation in either configuration mode. Under the deferred-mode contract used here, `mode + amount + currency` must be present at provider-creation time and `clientSecret` is supplied at confirm time only. If `pricing` is undefined when `CheckoutForm` mounts, ECE does not mount (see R11'). The card path's separate scoped `<Elements clientSecret={...}>` (retained per Design Doc KDD-1) follows the same immutability rule — it remounts fresh when `clientSecret` resolves.
- **R11' — Elements provider hoisting / pricing dependency.** `<Elements>` is hoisted in `CheckoutForm` with deferred `mode='payment' + amount + currency`. This adds a render dependency on `pricing` being present at mount time; if pricing is undefined, ECE does not mount. The mount sequence already has Module 2 pricing resolution upstream of CheckoutForm, but a regression there would silently disable the wallet path.
- **R12 — `user_on_iqbooster` required by backend.** The backend rejects intent creation and confirm calls with 422 when `user_on_iqbooster` is missing, even though there is no iqbooster concept in this funnel. We always send `''`. If the backend team renames / removes this field, both hooks need updating.
- **R13 — Apple Pay live-mode prerequisites.** Apple Pay in production requires (a) Stripe Dashboard domain registration under Settings > Payment Methods > Apple Pay, and (b) serving the `apple-developer-merchantid-domain-association` file at `/.well-known/` from the production domain. Implementation tests run in Stripe **test mode** where these prerequisites are not required for browser support detection. The deployment task tracks both items (§10 O6, O7).
- **R14 — ECE branding / visual control.** ECE's button rendering is Stripe-controlled. `buttonType`, `buttonTheme`, and `buttonHeight` are configurable options, but specific pixel-level matching to the previous custom Google Pay pill is not guaranteed. Marketing / design alignment may require a Stripe option pass before launch.

## 10. Open items

- **O1** Backend confirm idempotency (R4) — confirm with backend team.
- **O2** Whether the backend's Stripe account has alternative payment methods enabled (Link, PayPal). If not, the `layout: 'tabs'` Payment Element will only show card and the tabs become a single tab — still works, just visually different. (Apple Pay is no longer speculative — it's in scope via ECE; see §10 O6 / O7 for the deployment-task prerequisites.)
- **O3** Accessibility audit on the consent checkbox + legal copy — not prioritised for v1 but worth a pass.
- **O4** Whether the existing `/subscription-policy`, `/terms-conditions`, `/privacy-policy` routes are final copy — the consent label links them.
- **O5 (resolved 2026-04-29)** Backend `payment_method_type` for the wallet path — **LOCKED to `'card'`**. Probed 2026-04-29 against `d:/Projects/JadeApp/jadeapp-backend/`; that repo is a separate (subscription-focused) service exposing only `POST /api/v1/common/stripe/buySubscription` and does not own `POST /payment/stripe/create-payment-intent`. The TestIQ backend that owns the create-intent endpoint was not accessible, so the documented fallback (`'card'`) was applied per Design Doc §Backend contract → Default / fallback. ECE does not expose the chosen wallet at create-intent time, so a single value covers both Google Pay and Apple Pay. See Design Doc KDD-3.
- **O6** Apple Pay live-mode — register the production domain in Stripe Dashboard > Settings > Payment Methods > Apple Pay. Owned by deployment.
- **O7** Apple Pay live-mode — serve the `apple-developer-merchantid-domain-association` file from `/.well-known/` at the production domain. Place the file in `public/.well-known/`. Owned by deployment; Vite / Express must serve `.well-known` directly (no path rewrite).
- **O8 (resolved)** Card-path `<Elements>` provider disposition — **KEEP NESTED** per Design Doc KDD-1. The card path retains its own scoped `<Elements options={{ clientSecret }}>` for `<PaymentElement>`, nested under the hoisted deferred-mode provider. Merge was rejected because Stripe Elements groups are immutable after mount and `clientSecret` cannot be added to a deferred provider retroactively.

## 11. Work plan (high level)

1. Install `@stripe/stripe-js` + `@stripe/react-stripe-js`. Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.example`.
2. Create `src/lib/stripe.ts` with `stripePromise` + `assertKeyMatchesMode`.
3. Extend `FunnelSession` in `src/lib/session.ts` with `paymentIntent` field (including `keyedBy.methodType`).
4. Create `src/hooks/usePaymentIntent.ts` implementing the §4.3 on-demand lifecycle (`createIntent(methodType)` + read-only mount recovery) and §4.4.4 return-handling state machine.
5. Delete `src/hooks/useGooglePay.ts` and `src/hooks/useGooglePay.test.tsx`. Create `src/hooks/useExpressCheckout.ts` wrapping ECE configuration (button options, `onConfirm` handler shape). The hook is consumed inside the hoisted `<Elements>` provider in `CheckoutForm` — it does not own a Stripe instance directly, since ECE relies on the Elements ancestor.
6. Create `src/components/checkout/CardForm.tsx` — inline `<PaymentElement>` form with its own Pay button. Uses `stripe.confirmPayment({ elements, confirmParams, redirect: 'if_required' })`.
7. Create `src/components/checkout/CheckoutForm.tsx` — the outer wrapper that owns consent, the wallets slot (ECE) + PayPal + Card surfaces, `activeMethod` state, per-method handlers, and the hoisted `<Elements>` provider with deferred `options.mode='payment'` + `amount` + `currency` from `PricingInfo`. ECE renders inside this provider as the wallets slot. The card path's `<Elements>` arrangement (merged under the hoisted provider vs nested / sibling with `clientSecret`) is deferred to the Design Doc — see §10 O8.
8. Refactor [CheckoutPage.tsx](src/pages/CheckoutPage.tsx): mount `<CheckoutForm />` in place of the standalone buttons area, remove the two "Skip and see basic results" links. All other layout preserved.
9. Manual QA walkthrough against §8 (cross-cutting + card + wallets + PayPal):
   - Card test (no 3DS) — `4242 4242 4242 4242`.
   - 3DS card test — `4000 0027 6000 3184`.
   - Declined card — `4000 0000 0000 0002`.
   - PayPal round-trip (sandbox) — check promo params survive the return URL.
   - Wallets via ECE — Chrome with a saved Google Pay card (verify the GPay button renders inside ECE, `onConfirm` flow runs end-to-end); Safari (macOS or iOS Simulator) with Apple Pay configured (verify the Apple Pay button renders inside ECE, `onConfirm` flow runs end-to-end); Firefox without a wallet (verify the ECE slot renders nothing or a Stripe placeholder, no console errors, the rest of the form is still usable).
   - Click Card, close form, click PayPal — expect a second `create-payment-intent` with `payment_method_type: 'paypal'`.
   - Refresh `/checkout` mid-session after a card intent — expect zero new `create-payment-intent` call (cache hit).
   - Close tab after Stripe success, reopen `/checkout?qid=…` — expect automatic backend confirm and navigate to next page.
   - Promo run with `?mdid=50` — check it flows through to both intent-create and confirm bodies, and survives the return URL.
10. Deployment task (out of implementation scope for this PRD; tracked in §10 O6 / O7): place the `apple-developer-merchantid-domain-association` file under `public/.well-known/` (a placeholder README in that path documents the requirement) and register the production domain in the Stripe Dashboard under Settings > Payment Methods > Apple Pay before enabling Apple Pay in live mode.
