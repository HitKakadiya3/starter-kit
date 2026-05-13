# Task 02 — Create `useExpressCheckout.ts` + fill 3 unit-test skeletons

**Phase:** 1 · `useExpressCheckout` hook
**Work plan task id:** T1.1
**Size:** Small (1 file new, 1 file modified)
**Dependencies:**
- `00-backend-probe.md` — wallet `payment_method_type` value must be locked. (The hook itself does NOT call `createIntent`, so it does not directly consume the locked value, but Phase 0 must complete before any Phase 1+ work begins per the work plan's phase ordering.)
- `01-sdk-version-verify.md` — `<ExpressCheckoutElement>` must resolve from `@stripe/react-stripe-js`.

## Purpose / why this task exists

Create the thin pure adapter hook that wires `pricing` → ECE button options + `onConfirm` glue. Per Design Doc KDD-4, the hook does NOT own a Stripe instance — no `stripePromise` import, no `useEffect` for SDK loading, no `available` state, no imperative `show()` handle. It is consumed inside the hoisted `<Elements>` provider in `<CheckoutForm>` (Task 04); Stripe is read implicitly by `<ExpressCheckoutElement>` via React context.

The hook is testable in isolation under a mocked `<Elements>` context before any UI consumes it. Three unit tests verify the contract; one is an architectural guard test that fails if a future change to `useExpressCheckout` adds a `stripePromise` import (KDD-4 by design).

This task lands the hook + tests with NO consumer in `src/components/` or `src/pages/`. Task 04 wires it into `<CheckoutForm>`.

## PRD / Design Doc / ADR anchors

- Design Doc §Module / hook contracts → `useExpressCheckout(options)` contract — input/output table verbatim.
- Design Doc KDD-4 — "`useExpressCheckout` does not own a Stripe instance".
- Design Doc §Test Strategy → Unit tests bullet for `useExpressCheckout.test.tsx`.
- ADR-0001 §Implementation Guidance → "Wallet abstraction: Introduce a new `useExpressCheckout` hook with responsibilities scoped to ECE's lifecycle".
- PRD §4.4.2 step 1 — "`useExpressCheckout({ pricing, onConfirm })` returns the ECE configuration".
- Work plan §Phase 1 / Task 1.1 — verbatim hook contract + test cases + acceptance.

## AC coverage

Foundation for **AC-D03** (ECE renders supported wallet buttons inside the hoisted Elements provider) and **AC-D10** (consent gate via `disabled`). Neither is fully closed by this task — both are closed by Task 04's integration tests once the hook is mounted in `<CheckoutForm>`.

Test resolution progress: 3 / 14 ECE-track tests resolved after this task.

## Scope

**Add:**

- `d:/Projects/TestIQ/typestest/src/hooks/useExpressCheckout.ts`

**Modify:**

- `d:/Projects/TestIQ/typestest/src/hooks/useExpressCheckout.test.tsx` — fill in 3 skeletons. The file already exists from the test-design phase; do NOT recreate it. If the file does not exist, halt and surface as an unexpected-state error (the test-design phase should have created it).

**Do NOT touch** (in this task):

- `src/components/checkout/CheckoutForm.tsx` — Task 04 wires the hook in.
- `src/components/checkout/CheckoutForm.test.tsx` — Task 04 fills its 8 ECE skeletons.
- `src/hooks/usePaymentIntent.ts` — Task 03 widens its union; Task 02 does not depend on it.
- `src/hooks/useGooglePay.ts` and `src/hooks/useGooglePay.test.tsx` — Task 05 deletes them; this task must not import them.
- `src/lib/stripe.ts` — explicit non-import (KDD-4 architectural guard).
- `src/lib/session.ts` — Task 03 owns its widening.

## Backend contract reference

None directly. The hook's `onConfirm` callback is supplied by the consumer (CheckoutForm in Task 04) and that consumer calls `intent.createIntent(<wallet methodType>)` → backend `POST /payment/stripe/create-payment-intent`. The hook itself has no backend interaction.

## Step-by-step implementation

### Step 1 — Confirm the test skeleton exists

```sh
ls d:/Projects/TestIQ/typestest/src/hooks/useExpressCheckout.test.tsx
```

If it does not exist, halt — the test-design phase produced it. If it exists, open it and inventory the 3 skeletons. Each skeleton should have a `test.todo` or `test.skip` placeholder describing one of the three test cases listed in Step 4.

### Step 2 — Identify any existing similar hook for reference

The closest sibling pattern is `src/hooks/useGooglePay.ts` (167 lines) — but that hook DOES own a Stripe instance and DOES subscribe to `stripePromise`. `useExpressCheckout` is intentionally NOT a fork of `useGooglePay`; the two have no shared abstraction. Read `useGooglePay.ts` only for context on what NOT to do (KDD-4). Do not extract any shared utility.

### Step 3 — Red phase (write the test bodies first)

Open `src/hooks/useExpressCheckout.test.tsx`. Fill in the 3 skeleton bodies before writing any production code in `useExpressCheckout.ts`.

Use Vitest + `@testing-library/react`'s `renderHook` (or the existing repo convention if it differs). Mock `@stripe/react-stripe-js` and `@/lib/stripe` per the conventions below.

Three test cases (matching the work plan §Phase 1 / Task 1.1 test cases):

1. **`pricing === undefined` → suppression sentinel**
   When `pricing` is undefined, `useExpressCheckout({ pricing: undefined, disabled: false, onConfirm: vi.fn() })` returns a result where `eceProps` is the suppression sentinel — concretely, `eceProps === undefined` (or another agreed-upon falsy sentinel; match the work plan's "consumer can detect and skip rendering ECE" intent). `ready === false`.

2. **`pricing` present → button options propagated**
   When `pricing` is a fully-populated `PricingWithMode` value, the returned `eceProps.options` includes `buttonType`, `buttonTheme`, and `buttonHeight` keys with the configured defaults (assertable via direct object access). Specific default values are an implementation choice — assert that the keys exist and the values are non-undefined. The defaults are Stripe defaults (R-D3: marketing tuning is post-merge).

3. **KDD-4 architectural guard — no `stripePromise` subscription**
   The hook does not import or subscribe to `stripePromise` from `@/lib/stripe`. Verification pattern (match the skeleton's intent — adjust if the skeleton uses a different verification approach):

   ```ts
   import * as libStripe from '@/lib/stripe';

   vi.mock('@/lib/stripe', () => ({
     stripePromise: { __mockProbe: vi.fn() },
     assertKeyMatchesMode: vi.fn(),
   }));

   it('does not subscribe to stripePromise (KDD-4)', () => {
     const onConfirm = vi.fn();
     renderHook(() => useExpressCheckout({ pricing, disabled: false, onConfirm }));
     // The hook must not have read or awaited stripePromise — the spy is never invoked.
     expect((libStripe.stripePromise as unknown as { __mockProbe: Mock }).__mockProbe).not.toHaveBeenCalled();
   });
   ```

   Equivalent acceptable patterns: `vi.spyOn(libStripe, 'stripePromise', 'get')` and assert `not.toHaveBeenCalled()`; or a static-analysis assertion that `useExpressCheckout.ts`'s source contains no `from '@/lib/stripe'` substring (read the file content with `fs.readFileSync` and use `expect(content).not.toMatch(/from\s+['"]@\/lib\/stripe['"]/)`). Pick whichever the skeleton intends.

Mocking strategy for `@stripe/react-stripe-js`:

```ts
vi.mock('@stripe/react-stripe-js', () => ({
  ExpressCheckoutElement: vi.fn(),
  useStripe: vi.fn(() => null),
  useElements: vi.fn(() => null),
}));
```

The hook does not need a real `<Elements>` context to be tested — its return shape is computed from `pricing` synchronously.

Run the suite:

```sh
npx vitest run src/hooks/useExpressCheckout.test.tsx
```

Expected: 3 failing tests with "module not found" or "useExpressCheckout is not a function" or similar. That is the red phase.

### Step 4 — Green phase (create `src/hooks/useExpressCheckout.ts`)

Create the file. The hook's contract per Design Doc §Module / hook contracts:

**Inputs:**
- `pricing: PricingWithMode | undefined`
- `disabled: boolean`
- `onConfirm: (event, helpers: { resolve, reject, paymentFailed, ... }) => Promise<void>`
- `onReady?: () => void` (optional)

**Outputs:**
- `eceProps` — object spread onto `<ExpressCheckoutElement>` (includes `onConfirm`, `options.buttonType`, `options.buttonTheme`, `options.buttonHeight`, `onReady`). When `pricing === undefined`, `eceProps` is the suppression sentinel (e.g. `undefined`).
- `ready: boolean` — true once `onReady` has fired at least once.

**Lifecycle:** pure (no side effects). Re-runs only when `pricing` scalars (`first_sale_price`, `currency_code`, `first_sale_cents_price`) change.

**Disabled behaviour:** when `disabled === true`, ECE's button options are configured to treat the slot as non-interactive. Use Stripe's documented options for visually + behaviourally disabling the button. Specific option keys are an implementation choice — verify against `@stripe/react-stripe-js` types at implementation time.

**Hard prohibitions (KDD-4):**

- Do NOT `import { stripePromise } from '@/lib/stripe'`.
- Do NOT `import { loadStripe } from '@stripe/stripe-js'`.
- Do NOT use `useEffect` for SDK loading.
- Do NOT expose an `available` tri-state.
- Do NOT expose an imperative `show()` handle.

**Required (KDD-4):**

- The hook is consumed only inside the hoisted `<Elements>` provider; Stripe is read implicitly by `<ExpressCheckoutElement>` via React context.

Re-run the test suite. Three green.

### Step 5 — Refactor phase

- Add a JSDoc block above the hook's exported signature documenting the Design Doc §Module / hook contracts contract verbatim and citing KDD-4.
- Confirm `useMemo` (or equivalent) is used to stabilise `eceProps.options` so consumers do not see referential churn on every render. The pricing-scalars dependency policy must be encoded in the memo's dependency array.
- Run all 3 tests; all green.

### Step 6 — Architectural guard verification

Confirm no `@/lib/stripe` import:

```sh
grep -n "from.*lib/stripe" d:/Projects/TestIQ/typestest/src/hooks/useExpressCheckout.ts
```

Expected: zero hits. Anything else is a KDD-4 violation — fix and re-run.

### Step 7 — Isolation check

Confirm no consumer of the hook exists yet in production code:

```sh
grep -rn "useExpressCheckout" d:/Projects/TestIQ/typestest/src/components d:/Projects/TestIQ/typestest/src/pages
```

Expected: zero hits. Tasks 04 wires the consumer in.

```sh
grep -rn "useExpressCheckout" d:/Projects/TestIQ/typestest/src
```

Expected: only `src/hooks/useExpressCheckout.ts` and `src/hooks/useExpressCheckout.test.tsx` match.

## Completion criteria (done-when)

- [x] `src/hooks/useExpressCheckout.ts` matches the Design Doc §Module / hook contracts contract.
- [x] `useExpressCheckout.ts` does NOT import `@/lib/stripe`, does NOT import `loadStripe`, does NOT use `useEffect` for SDK loading, does NOT expose `available` or `show()`.
- [x] `src/hooks/useExpressCheckout.test.tsx` 3/3 green.
- [x] KDD-4 architectural guard test (case 3) is present and passing — verifies no `stripePromise` subscription.
- [x] No file in `src/components/` or `src/pages/` imports `useExpressCheckout` (isolation grep in Step 7).
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/hooks/useExpressCheckout.test.tsx     # → 3/3 passing.
grep -n "from.*lib/stripe" src/hooks/useExpressCheckout.ts   # → zero hits (KDD-4 guard).
grep -rn "useExpressCheckout" src/components src/pages       # → zero hits (isolation check).
npx tsc --noEmit                                              # Zero errors.
npm run lint                                                  # Zero errors.
npm run build                                                 # Succeeds.
npm run test                                                  # Full suite green.
```

## Notes / ambiguities

- **Suppression sentinel shape**: the work plan describes `{ eceProps: undefined, ready: false }` as illustrative. Match the skeleton file's expectation — if the skeleton asserts `eceProps === undefined`, return `eceProps: undefined`; if it expects a more elaborate sentinel, match that. Either is consistent with "consumer can detect and skip rendering ECE".
- **Default ECE button options**: `buttonType`, `buttonTheme`, `buttonHeight` defaults are Stripe defaults, not custom. Implementation lands with whatever Stripe ships. R-D3 (marketing tuning) is explicitly out of scope; flagged under DD-OQ-1 in Design Doc.
- **`PricingWithMode` import**: the type lives in the Module 2 pricing module (likely `src/hooks/usePricing.ts` or `src/lib/pricing.ts`). Import it; do NOT redeclare. If the type's name differs in the codebase, match the actual export.
- **`onConfirm` signature**: follows ECE's published `onConfirm: (event, helpers) => Promise<void>` shape. The `helpers` object's exact members are exposed by `@stripe/react-stripe-js` types — do NOT hand-roll a custom shape; spread the SDK's typed signature.
- **Test isolation**: each test must use `vi.unmock` / `vi.resetModules` / `afterEach` cleanup as the existing tests do (see `src/components/checkout/CheckoutForm.test.tsx` setup for the canonical pattern in this repo).
- **Risk note**: Low. The hook is intentionally thin. Most behavioural logic lives in `<CheckoutForm>`'s `onConfirm` and is verified in Task 04.
