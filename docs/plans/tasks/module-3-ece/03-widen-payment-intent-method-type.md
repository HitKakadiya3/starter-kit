# Task 03 — Narrow `PaymentIntentMethodType` (locked-`'card'` collapse) + verify cache behaviour

**Phase:** 2 · Narrow `PaymentIntentMethodType` to the locked wallet value + verify cache behaviour
**Work plan task id:** T2.1
**Size:** Small (2 files modified, 1 test file modified — fill 3 skeletons + 1 minor cast in pre-existing test)
**Dependencies:**
- `00-backend-probe.md` — locked wallet `payment_method_type` value (resolved to `'card'` 2026-04-29; KDD-3 fallback applied).
- `01-sdk-version-verify.md` — Phase 0 must complete.
- (Parallel-eligible with Task 02. Compile-time independent. Listed after Task 02 for sequential ordering only.)

## Re-framing (post-Task-00 outcome)

Task 00 locked the wallet `payment_method_type` to `'card'` (KDD-3 fallback). Because the current `PaymentIntentMethodType` is already `"card" | "google_pay"`, the union does NOT need to be **widened** — `'card'` is already present. The task therefore reduces to:

1. **Remove** the legacy `"google_pay"` literal from `PaymentIntentMethodType`, collapsing the union to a single `"card"` literal. Keep the type alias for clarity / future extension.
2. **Export `WALLET_METHOD_TYPE = 'card' as const`** from `usePaymentIntent.ts` so `<CheckoutForm>` (Task 04) and `useExpressCheckout` consumers can import a single source of truth instead of hard-coding the literal.
3. **Update `FunnelSession.paymentIntent.keyedBy.methodType`** in `src/lib/session.ts` to import `PaymentIntentMethodType` from `usePaymentIntent.ts` (type-only import — no runtime cycle).
4. **Validate cache behaviour** for the legacy-cache-natural-miss case (KDD-2): a session holding `keyedBy.methodType === 'google_pay'` (from a pre-ECE build resident in a user's tab) MUST be a cache miss when `createIntent(WALLET_METHOD_TYPE)` is called. The existing `isKeyedByMatch` byte-equality already handles this via simple string inequality — no migration code needed.
5. **Fill the 3 skeleton tests** in `src/hooks/usePaymentIntent.test.tsx` (legacy `'google_pay'` cache miss → fresh POST; card-cache reuse non-regression; PayPal/foreign-key cache non-regression).

### Cache-collision note (intentional, NOT a bug)

Once `WALLET_METHOD_TYPE = 'card'` and `<CheckoutForm>` (Task 04) calls `createIntent('card')` for both the wallet path AND the card path, the cache key tuple `(qidRaw, prcId, mdid, 'card')` is shared between the two surfaces in a single session. **This is desirable** — the same Stripe PaymentIntent can be confirmed via either rail (ECE or `<PaymentElement>`), so reusing it across surfaces saves a backend round-trip. Documented in `usePaymentIntent.ts` JSDoc on the `PaymentIntentMethodType` alias.

### Deviation from "preserved verbatim" guidance

The original task asserted "Existing 9 usePaymentIntent tests preserved verbatim." Reality at task start: 8 actual `it()` tests + 3 `it.todo()` skeletons. One existing test ("createIntent creates a fresh intent when methodType differs from the cache") passed `"google_pay"` literal directly to `createIntent` — this no longer typechecks against the narrowed union. Resolution: kept the test's runtime behaviour verbatim by casting the literal through `as unknown as PaymentIntentMethodType` (with an inline comment documenting the legacy-simulation intent). No assertions or other test scaffolding modified. Final count: **11 tests passing** (8 pre-existing + 3 skeleton fills) + 0 todo for this file.

## Purpose / why this task exists

Land the smallest horizontal-slice prerequisite — widen the `PaymentIntentMethodType` union to include the locked wallet value (Phase 0 outcome) so the wallet path can call `intent.createIntent(<wallet value>)` in Task 04. The widening also propagates to `FunnelSession.paymentIntent.keyedBy.methodType` for type consistency. No signature changes. No migration code (KDD-2).

Verify the natural-cache-miss behaviour for legacy `'google_pay'` entries: when a cached entry with `keyedBy.methodType === 'google_pay'` is compared against a `createIntent(<locked wallet value>)` call, structural equality fails and the cached entry is overwritten by a fresh POST. KDD-2 says no migration code is needed; the assertion confirms the existing equality check already does the right thing.

If the locked value from Task 00 is `'card'`, the union effectively collapses to a single literal (`"card"`) for the wallet AND the card path. Keep the type alias for clarity; do NOT delete it.

## PRD / Design Doc / ADR anchors

- Design Doc KDD-2 — "NATURAL CACHE MISS" resolution.
- Design Doc §Module / hook contracts → `usePaymentIntent` changes table.
- Design Doc §Field Propagation Map — `keyedBy.methodType` row.
- Design Doc AC-D07 — legacy-cache natural miss.
- ADR-0001 §Open Questions #3 — cache invalidation strategy.
- PRD §4.3 — `FunnelSession.paymentIntent` shape; `keyedBy.methodType` field.
- PRD §8 AC 25a — cache key migration cross-cutting AC.
- PRD §8 AC 11a — cache invalidation on `methodType` mismatch.
- Work plan §Phase 2 / Task 2.1 — verbatim acceptance + test cases.

## AC coverage

Fully closes:

- **AC-D07** — legacy-cache natural miss (one-line type widening + behavioural assertion).

Foundation for:

- **AC-D04** — correct method-type value flowing into `intent.createIntent` (closure in Task 04).

Test resolution progress: 6 / 14 ECE-track tests resolved cumulative after this task.

## Scope

**Modify:**

- `d:/Projects/TestIQ/typestest/src/hooks/usePaymentIntent.ts` — widen `PaymentIntentMethodType` from `"card" | "google_pay"` to `"card" | <locked wallet value>`. If the locked value is `'card'`, the union collapses to a single literal `"card"` — keep the type alias for clarity and add a comment noting the widening was deliberate. **No** signature changes to `createIntent` or any other export.
- `d:/Projects/TestIQ/typestest/src/lib/session.ts` — widen `FunnelSession.paymentIntent.keyedBy.methodType` to match `PaymentIntentMethodType`. Use the same type alias (re-export or import from `usePaymentIntent.ts`).
- `d:/Projects/TestIQ/typestest/src/hooks/usePaymentIntent.test.tsx` — fill in 3 skeletons appended in test-design phase. Existing 9 tests preserved (12 / 12 total at end).

**Do NOT touch** (in this task):

- `src/components/checkout/CheckoutForm.tsx` — Task 04 owns the integration.
- `src/components/checkout/CheckoutForm.test.tsx` — Task 04 fills its skeletons.
- `src/hooks/useGooglePay.ts` and `useGooglePay.test.tsx` — still importable; the legacy literal `'google_pay'` may still appear there. Task 05 deletes them.
- Any other test file in the repo (the existing tests must compile against the widened union without modification).

## Backend contract reference

Backend `POST /payment/stripe/create-payment-intent` body field `payment_method_type` is unchanged — only the values the frontend sends are widened. Backend treats whatever it accepts; the locked value (Task 00) must be in the backend's whitelist.

## Step-by-step implementation

### Step 1 — Confirm the test skeleton exists

```sh
ls d:/Projects/TestIQ/typestest/src/hooks/usePaymentIntent.test.tsx
```

Open and inventory: 9 existing tests + 3 skeleton placeholders (12 total). Confirm the three skeletons match the test cases listed in Step 4.

### Step 2 — Widen `PaymentIntentMethodType` in `usePaymentIntent.ts`

Open `src/hooks/usePaymentIntent.ts` and locate the `PaymentIntentMethodType` declaration (currently around line 33 per Design Doc anchors).

Current shape (illustrative):

```ts
export type PaymentIntentMethodType = 'card' | 'google_pay';
```

Widen to:

```ts
// Locked wallet methodType per Design Doc KDD-3 / Task 00 backend probe.
// If the locked value is 'card', the union collapses to a single literal but is kept aliased for clarity.
export type PaymentIntentMethodType = 'card' | <LOCKED_WALLET_VALUE>;
```

Replace `<LOCKED_WALLET_VALUE>` with the literal locked value from Task 00 (e.g. `'card'` if the probe confirmed default fallback). If the locked value is `'card'`, the union is `'card' | 'card'` which TypeScript collapses to `'card'`. That is acceptable; keep the alias.

**Add a single source-of-truth constant** for the wallet methodType:

```ts
/** Wallet `payment_method_type` value sent on the ECE wallet path. Locked per Task 00 (see Design Doc KDD-3). */
export const WALLET_METHOD_TYPE: PaymentIntentMethodType = '<locked value>';
```

Place this near the type alias. Tasks 04 imports this constant; do NOT hard-code the literal in the consumer.

**Do NOT** change `createIntent`'s signature, return type, cache-key logic, or any other export. The widening is type-level only.

### Step 3 — Widen `FunnelSession.paymentIntent.keyedBy.methodType` in `session.ts`

Open `src/lib/session.ts` and locate `FunnelSession.paymentIntent.keyedBy.methodType`. Currently typed as `string` or `'card' | 'google_pay'` (verify at implementation time — PRD §4.3 line 100 captures the field).

Widen to match `PaymentIntentMethodType`. If `session.ts` is intended to be import-cycle-free with `usePaymentIntent.ts`, declare a local type alias that mirrors the union:

```ts
import type { PaymentIntentMethodType } from '@/hooks/usePaymentIntent';

export interface FunnelSession {
  // ...
  paymentIntent?: {
    id: string;
    clientSecret: string;
    keyedBy: {
      qidRaw: number;
      prcId: string;
      mdid: string;
      methodType: PaymentIntentMethodType;
    };
    createdAt: number;
  };
}
```

If the import direction would create a cycle, copy the type alias verbatim into `session.ts` with a comment pointing to `usePaymentIntent.ts` as the source of truth. Do NOT widen to `string` — that loses type safety.

### Step 4 — Red phase (write the 3 test bodies)

Open `src/hooks/usePaymentIntent.test.tsx`. Fill in the 3 skeleton bodies before saving the production-code changes from Steps 2–3 (the test file should fail to compile against the not-yet-widened union; widening in Steps 2–3 is what makes the file compile).

Three test cases (matching work plan §Phase 2 / Task 2.1):

1. **Legacy-cache natural miss (AC-D07)**
   Pre-populate `session.paymentIntent.keyedBy.methodType = 'google_pay'` (a stale literal from the predecessor architecture; cast through `as unknown as PaymentIntentMethodType` if the widened union does not include `'google_pay'`). Set `id`, `clientSecret`, `keyedBy.{qidRaw,prcId,mdid}` to match the test session inputs, and `createdAt: Date.now()` (within 23h TTL).

   Call `createIntent(<locked wallet value>)` (use `WALLET_METHOD_TYPE` constant from Step 2).

   Assert:
   - `apiPost('create-payment-intent')` (or whatever the repo's POST helper is) is called exactly once with `payment_method_type: <locked value>`.
   - On resolution, `session.paymentIntent.keyedBy.methodType === <locked value>` (the legacy entry was overwritten via `patchSession`).
   - No errors raised, no duplicate cache entry persists.
   - The cached `id` and `clientSecret` are the freshly-issued values from the mocked `apiPost` response, not the pre-populated legacy values.

2. **Non-regression: card path cache hit**
   Pre-populate cache with `keyedBy.methodType: 'card'` and a recent `createdAt` (within TTL). Call `createIntent('card')`. Assert: `apiPost` is NOT called (cache hit), returned `clientSecret` matches the cached value.

3. **Non-regression: paypal path cache behaviour**
   Pre-populate with `keyedBy.methodType: 'paypal'` and a recent `createdAt`. Call `createIntent('paypal')`. Assert: same cache-hit behaviour as before — `apiPost` NOT called, returned `clientSecret` matches cached value. This confirms the union widening did not break paypal-path matching.

   Note: `'paypal'` is NOT in the `PaymentIntentMethodType` union (the union covers card + wallet only; PayPal is intentionally excluded per Design Doc — `usePayPalCheckout` uses native SDK and never calls `createIntent`). However, if the existing test file already passes `'paypal'` to `createIntent` (the runtime accepts the wider string and the union widening did not affect this), preserve that pattern. If TypeScript flags the literal, follow the existing test's casting convention. Match what the skeleton expects.

Run:

```sh
npx vitest run src/hooks/usePaymentIntent.test.tsx
```

Expected: 3 failing skeleton bodies + 9 existing passing = 9 pass, 3 fail. That is the red phase.

### Step 5 — Green phase

The Steps 2–3 changes (type widening) make the test file compile. The 3 new tests should pass with no additional production-code changes — KDD-2's whole point is that the existing `===` equality check in `usePaymentIntent.isKeyedByMatch` (around lines 110–115 per Design Doc) already does the right thing.

Re-run:

```sh
npx vitest run src/hooks/usePaymentIntent.test.tsx
```

Expected: 12 / 12 green.

If any of the 3 new tests fail because the equality check does NOT correctly reject the legacy `'google_pay'` entry → STOP. KDD-2 is invalidated; fall back to a manual eviction strategy or escalate. Do NOT silently fix the equality check — the fix would belong in a new ADR.

### Step 6 — Refactor phase

- Confirm the `WALLET_METHOD_TYPE` constant has a JSDoc explaining its provenance (Task 00 / KDD-3 / ADR-0001 OQ#1).
- Confirm `session.ts` does not duplicate the union literally — either imports the type from `usePaymentIntent.ts` or copies it with a clear pointer comment.
- Run the full repo test suite to confirm no other test broke from the union widening.

### Step 7 — Repo-wide tsc check

```sh
npx tsc --noEmit
```

Expected: zero errors. The widening should not break any existing call site. If any caller broke, the widening produced a stronger constraint than before — uncommon but possible if a caller was passing a `string` not in the union. Address the offending site in this task (do NOT defer; widening + downstream fix in one commit).

### Step 8 — Confirm legacy literal is contained

```sh
grep -rn "google_pay" d:/Projects/TestIQ/typestest/src
```

Expected hits: only `src/hooks/useGooglePay.ts` (and possibly its test file) — Task 05 deletes them. Confirms no NEW dependence on the legacy literal landed in this task.

## Completion criteria (done-when)

- [x] `PaymentIntentMethodType` collapsed to single literal `'card'` (legacy `'google_pay'` removed); type alias retained for clarity / future extension.
- [x] `WALLET_METHOD_TYPE` constant exported from `usePaymentIntent.ts`, JSDoc cites Task 00 / KDD-3 / ADR-0001 OQ#1.
- [x] `FunnelSession.paymentIntent.keyedBy.methodType` typed as `PaymentIntentMethodType` (type-only import from `@/hooks/usePaymentIntent`; no runtime cycle).
- [x] `createIntent` signature unchanged.
- [x] `src/hooks/usePaymentIntent.test.tsx` 11/11 green (8 pre-existing + 3 skeleton fills); 8 it.todo skeletons remain across the rest of the suite (down from 11).
- [x] No caller of `createIntent` broken by the narrowing.
- [x] No new dependence on the legacy `'google_pay'` literal — only `useGooglePay.{ts,test.tsx}` (Task 05 deletes them) and the legacy-simulation casts in `usePaymentIntent.test.tsx` reference it.
- [x] Cross-surface cache-key reuse documented in `PaymentIntentMethodType` JSDoc (intentional behaviour per KDD-3 — card and wallet share `'card'`).
- [x] All verification commands below pass.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
npx vitest run src/hooks/usePaymentIntent.test.tsx       # → 12/12 passing.
grep -n "google_pay" src                                  # → only useGooglePay.ts + useGooglePay.test.tsx (legacy, deleted in Task 05).
grep -n "WALLET_METHOD_TYPE" src/hooks/usePaymentIntent.ts   # → exported constant present.
npx tsc --noEmit                                          # Zero errors across whole repo.
npm run lint                                              # Zero errors.
npm run build                                             # Succeeds.
npm run test                                              # Full suite green (Module 1 + 2 + first-payment + this).
```

## Notes / ambiguities

- **Locked value is `'card'`**: the most likely outcome of Task 00. The union becomes `'card'` (collapsed). The `WALLET_METHOD_TYPE` constant resolves to `'card'`. Card path and wallet path send the same `payment_method_type` to the backend; the cache key `methodType` field is also `'card'` for both — meaning a card-path cached intent COULD be reused on a wallet click and vice versa. This is the intended behaviour per KDD-3 (ECE wraps card-family wallets); not a bug. The cache key's other fields (`qidRaw`, `prcId`, `mdid`) provide the necessary uniqueness within a session.
- **Locked value is NOT `'card'`** (e.g. probe locked `'apple_pay'` or some other literal): the union has two distinct values; cache key `methodType` differs between card and wallet paths, so they do NOT share cached intents. Both behaviours are correct; assertions in Step 4's test cases must adapt to whichever locked value is in play.
- **`'paypal'` and the union**: PayPal is intentionally excluded from `PaymentIntentMethodType` per Design Doc — `usePayPalCheckout` uses the native PayPal SDK and never calls `createIntent`. Test case 3 (paypal cache hit) is a non-regression check; if the test file casts `'paypal'` literal to bypass the union check, preserve that. If the test file expects `'paypal'` to be in the union, that's a bug in the skeleton — flag and escalate; do not silently widen the union to include it (that would conflict with Design Doc).
- **Migration code prohibition**: KDD-2 explicitly forbids manual eviction or version bumps. The cache miss for legacy `'google_pay'` entries is achieved structurally via the `===` check on the (now-widened) union value. If a future need for explicit migration arises, that's a new ADR — not this task.
- **Cache hit semantics when locked value is `'card'`**: a session with `keyedBy.methodType === 'card'` from a prior card-button click will produce a cache HIT on a wallet click (because `'card' === 'card'`). This is acceptable per KDD-3 — the same intent can be confirmed via either path; the backend treats them identically. Document this in the test case 1 commentary if surprising.
- **Risk note**: Low. Type-level change with one behavioural assertion (cache miss). KDD-2's whole point is that this is a no-code-change behaviour.
