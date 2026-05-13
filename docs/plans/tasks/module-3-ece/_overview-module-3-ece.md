# Overall Design Document: Module 3 — Stripe Wallets via Express Checkout Element (ECE)

Generation Date: 2026-04-29
Target Plan Document: `docs/plans/module-3-stripe-wallets-ece.md`
Related: `docs/design/module-3-stripe-wallets-ece.md`, `docs/adr/ADR-0001-stripe-wallets-via-express-checkout-element.md`, `docs/prd/module-3-first-payment.md`

## Project Overview

### Purpose and Goals

Migrate the Stripe wallet payments slot in `<CheckoutForm>` from the legacy `stripe.paymentRequest()` + `useGooglePay` two-stage flow to Stripe's Express Checkout Element (ECE), so Google Pay AND Apple Pay render as correctly-branded buttons in a single Stripe-managed slot. Preserve PayPal, Card, consent gating, intent caching, and `assertKeyMatchesMode` semantics. Land the placeholder README for the deployment-side Apple Pay association file. Close ADR-0001 OQ#2 and OQ#3; specify the resolution path for OQ#1 via a backend probe.

### Background and Context

This plan is a follow-up slice on top of the shipped first-payment module (`docs/plans/module-3-first-payment.md`); it is NOT an update of that plan. The predecessor shipped `usePaymentIntent`, `CardForm`, `CheckoutForm`, and `useGooglePay` on `develop`. This slice migrates only the wallet slot.

Key constraints inherited from Design Doc:

- **KDD-1 KEEP NESTED**: Card-path scoped `<Elements clientSecret>` stays nested under the hoisted deferred-mode `<Elements>` provider — Stripe Elements groups are immutable post-mount and the deferred provider cannot supply a `clientSecret` retroactively.
- **KDD-2 NATURAL CACHE MISS**: Legacy `keyedBy.methodType === 'google_pay'` entries fall through structural equality on the new wallet value and are overwritten — no migration code.
- **KDD-3 PROBE-THEN-LOCK**: Backend `payment_method_type` for the wallet path defaults to `'card'`; probe the backend repo and lock the value before any code touches it.
- **KDD-4 hook does not own Stripe instance**: `useExpressCheckout` is a thin pure adapter; no `stripePromise` import, no `useEffect` for SDK loading, no `available` state.

## Task Division Design

### Division Policy

**Strategy: Hybrid (vertical-slice-leaning)** matching Design Doc §Implementation Approach. Tasks are sliced at single-commit granularity with one task per phase, except Phase 0 which produces two tasks because the backend probe and the SDK version verification are independent concerns with different failure modes. T0.3 (doc update) does not get its own task — the doc updates land inside whichever Phase 0 task locks the value (T0.1 → Design Doc KDD-3 + PRD §10 O5 update; T0.2 → no doc update needed except commit message).

Verifiability level distribution:

- **L3 (build)** on every commit: `npx tsc --noEmit` + `npm run lint` + `npm run build`.
- **L2 (unit + integration tests)** for tasks 02 (`useExpressCheckout`), 03 (`usePaymentIntent` extension), 04 (`CheckoutForm` rewrite). Stripe SDK surfaces mocked via `vi.hoisted` + `vi.mock`.
- **L1 (manual smoke)** in task 99 against Stripe test mode.

Phase 6 (manual acceptance) is informational; it is captured as a single task file (`99-manual-acceptance.md`) marked non-blocking. The orchestrator's task-executor → quality-fixer → commit cycle skips it.

### Inter-task Relationship Map

```
Task 00: Backend probe + lock wallet methodType value (T0.1)
  → Deliverable: locked value recorded in Design Doc KDD-3 + PRD §10 O5
  ↓
Task 01: SDK version verify (T0.2)
  → Deliverable: package.json + lockfile (only if upgrade needed)
  ↓
Task 02: useExpressCheckout hook + 3 unit tests (T1.1)
  → Deliverable: src/hooks/useExpressCheckout.ts + .test.tsx
  ↓
Task 03: Widen PaymentIntentMethodType + 3 cache tests (T2.1)         (parallelizable with Task 02 once Task 00 locks the value)
  → Deliverable: usePaymentIntent.ts + session.ts widened; 12/12 green
  ↓ (Tasks 02 + 03 both feed Task 04)
Task 04: CheckoutForm refactor + 8 ECE integration tests (T3.1)
  → Deliverable: src/components/checkout/CheckoutForm.tsx refactored; 24/24 green
  ↓
Task 05: Delete useGooglePay (T4.1)
  → Deliverable: useGooglePay.ts + useGooglePay.test.tsx removed
  ↓
Task 06: Apple Pay well-known README (T5.1)
  → Deliverable: public/.well-known/README.md
  ↓
Task 99: Manual acceptance (T99 — informational, non-blocking)
  → Deliverable: walkthrough notes attached to PR
```

Tasks 02 and 03 have no compile-time dependency on each other once Task 00 has locked the wallet value — they can be parallelised by a second developer. Task 04 depends on both.

### Interface Change Impact Analysis

| Existing Interface | New Interface | Conversion Required | Corresponding Task |
|---|---|---|---|
| `useGooglePay({ pricing, onPaymentMethod })` | `useExpressCheckout({ pricing, disabled, onConfirm, onReady? })` | Yes — wholesale replacement | 02 (create) + 04 (consume) + 05 (delete legacy) |
| `gpay.show()` imperative trigger | (none — ECE owns its own click) | Yes | 04 |
| `gpay.available` tri-state | (none — ECE owns availability internally) | Yes | 04 |
| `useGooglePay.onPaymentMethod(event)` | `onConfirm(event, helpers)` (ECE contract) | Yes | 04 |
| `usePaymentIntent.createIntent(methodType)` | unchanged | No | 03 (union widens; no signature change) |
| `PaymentIntentMethodType` (`"card" \| "google_pay"`) | `"card" \| <locked wallet value>` | No (read sites use `===`) | 03 |
| `FunnelSession.paymentIntent.keyedBy.methodType` | union widens to match | No | 03 |
| Two-stage confirm (`confirmCardPayment` + `handleCardAction`) | Single `stripe.confirmPayment({ elements, clientSecret, ... })` | Yes — flow inversion | 04 |
| `gpayClientSecretRef` + `handleGooglePayMethod` + `handleGooglePayClick` in CheckoutForm | Removed; replaced by ECE `onConfirm` | Yes | 04 |
| Legacy `keyedBy.methodType === 'google_pay'` cached entries | Natural cache miss → fresh intent overwrites | No (KDD-2: no migration code) | 03 (verifies behaviour) + 04 (integration-level verification) |

### Common Processing Points

- **Single source of truth for the locked wallet `payment_method_type` value** (Phase 0 outcome). Recommend a single constant — e.g. `WALLET_METHOD_TYPE = '<locked value>'` — declared in `src/hooks/usePaymentIntent.ts` (alongside the union type) or in a shared constants module if the same literal is used in multiple call sites. Tasks 03 and 04 must reference this constant; Task 02 (the hook) does not need it because it does not call `createIntent` directly.
- **Mocking strategy for `<ExpressCheckoutElement>`** (per Design Doc §Test Strategy): Mock `@stripe/react-stripe-js` to export a stub `<ExpressCheckoutElement>` that renders `data-testid="ece-stub"` and captures `onConfirm` into a hoisted `vi.fn`. Used by Tasks 02 (hook) and 04 (CheckoutForm). Define once in each test file's `vi.mock` factory (no shared helper — Vitest hoisting requires per-file `vi.mock` calls).
- **`vi.hoisted` + `vi.mock` factory pattern** for Stripe SDK + intent hooks — convention established in the existing `CheckoutForm.test.tsx`. Reused verbatim in the new tests.
- **Test-skeleton fills** (work plan inputs from the test-design phase): `useExpressCheckout.test.tsx` (3 skeletons, Task 02), `usePaymentIntent.test.tsx` (3 skeletons appended, Task 03), `CheckoutForm.test.tsx` (8 ECE skeletons appended; existing 16 preserved, Task 04). Total: 14 ECE-track tests filled across the three tasks.

## Implementation Considerations

### Principles to Maintain Throughout

1. **L3 build verification on every commit**: `npx tsc --noEmit` + `npm run lint` + `npm run build` + `npx vitest run` for the touched test files.
2. **Single-commit granularity**: each task lands as exactly one commit after quality-fixer approval.
3. **No broken-test commits**: Task 04 lands the production refactor and the test rewrite in the same commit (the work plan explicitly mandates this — "the production refactor and the test rewrite land together to avoid a broken-test commit").
4. **Architectural guard tests are first-class**: Task 02 includes the KDD-4 test verifying that `useExpressCheckout` does NOT import or subscribe to `stripePromise`. Future regressions of KDD-4 must fail this test — by design.
5. **No backend changes** in this slice; no new env vars; no Stripe Dashboard configuration.
6. **Out of scope** (explicit, do not touch): PayPal flow, Card path business logic, Module 1 / Module 2 hooks, automated Playwright E2E.

### Risks and Countermeasures

- **Risk**: Backend probe (Task 00) finds an unexpected whitelist requiring per-wallet differentiation.
  Countermeasure: Probe procedure has an explicit escalation rule — halt before Task 02 / Task 03; pull in backend owner. Default `'card'` is intentionally non-locked-in.

- **Risk**: `@stripe/react-stripe-js` version is `< 2.1.0` and the upgrade introduces breaking changes.
  Countermeasure: Task 01 verifies and upgrades only if needed; full repo test suite must stay green after upgrade.

- **Risk**: Task 04 is the highest-risk integration commit (R-D1 pricing regression, R-D5 card form re-mount, R-D6 ECE error visual state).
  Countermeasure: All three risks are covered by the 8 ECE integration tests landing in the same commit (AC-D02, AC-D09, AC-D05).

- **Risk**: Task 05 deletes `useGooglePay` while a missed importer still references it.
  Countermeasure: Task 05 begins with `grep -rn "useGooglePay" src` — must return only the two files about to be deleted. If any other hit exists, halt and fix the importer in Task 04 first.

- **Risk**: Phase 6 manual walkthrough surfaces a regression undetected by automated tests.
  Countermeasure: Walkthrough is informational and does not block merge. Any hard failure files a follow-up issue; if the failure indicates an automated-test gap, return to the relevant task and add the missing test.

### Impact Scope Management

**Allowed change scope (per task — see individual task files for absolute paths):**

- Task 00: `docs/design/module-3-stripe-wallets-ece.md`, `docs/prd/module-3-first-payment.md` (doc-only updates).
- Task 01: `package.json`, `package-lock.json` and/or `bun.lockb` (only if upgrade is needed; no other files).
- Task 02: `src/hooks/useExpressCheckout.ts` (new), `src/hooks/useExpressCheckout.test.tsx` (modify — fill 3 skeletons).
- Task 03: `src/hooks/usePaymentIntent.ts` (modify), `src/lib/session.ts` (modify), `src/hooks/usePaymentIntent.test.tsx` (modify — fill 3 skeletons).
- Task 04: `src/components/checkout/CheckoutForm.tsx` (modify — substantial refactor), `src/components/checkout/CheckoutForm.test.tsx` (modify — fill 8 skeletons; 16 existing tests preserved).
- Task 05: `src/hooks/useGooglePay.ts` (delete), `src/hooks/useGooglePay.test.tsx` (delete).
- Task 06: `public/.well-known/README.md` (new).
- Task 99: none (manual checklist only).

**No-change areas (must not be touched in this slice):**

- `src/hooks/usePayPalCheckout.ts` and any PayPal-related code path.
- `src/hooks/useGooglePay.ts` (until Task 05 — Tasks 02–04 must keep it compiling, even though Task 04 removes its imports from `CheckoutForm`).
- `src/lib/stripe.ts` (`stripePromise`, `assertKeyMatchesMode` — unchanged).
- `src/components/checkout/CardForm.tsx` (no code change; only rendered position changes via Task 04 — now nested under hoisted `<Elements>`).
- `src/pages/CheckoutPage.tsx` (no code change; CheckoutForm still mounted in same place).
- Backend endpoints (`/payment/stripe/create-payment-intent`, `/payment/stripe/first-sale/payments/confirm`).
- Module 1 resume guard, Module 2 pricing hook.
- All non-checkout pages and shared UI primitives.

### Test Resolution Progress

Tracked across tasks:

- After Task 02: 3 / 14 ECE-track skeletons resolved.
- After Task 03: 6 / 14 cumulative.
- After Task 04: 14 / 14 — all skeletons resolved.
- Tasks 05, 06 add no new tests.
- Task 99 is manual; not counted toward the 14.
