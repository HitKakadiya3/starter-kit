# Task 00 — Backend probe + lock wallet `payment_method_type` value (Design Doc + PRD doc updates)

**Phase:** 0 · Backend probe + domain prep
**Work plan task ids:** T0.1 + T0.3 (doc updates land in this same task)
**Size:** Small (2 doc files modified; no source code)
**Dependencies:** none (first task of the ECE migration)

## Purpose / why this task exists

Resolve ADR-0001 OQ#1 / Design Doc KDD-3 by locking the backend `payment_method_type` value used on the wallet path. Default candidate is `'card'` (per KDD-3 — ECE wraps card-family wallets and cannot differentiate at create-intent time). The probe procedure either confirms `'card'` or surfaces a backend-side requirement to differentiate. The locked value becomes the single source of truth referenced by Tasks 02, 03, and 04.

This task has **zero source-code changes**. Outputs are documentation only:

- Design Doc KDD-3 wording updated from "default candidate `'card'`" to the locked value with a probe-result note.
- PRD §10 Open Item O5 marked resolved with the locked value and date.

## PRD / Design Doc / ADR anchors

- ADR-0001 §Open Questions #1 — backend `payment_method_type` value for the wallet path.
- Design Doc §Backend contract & probe procedure — verbatim probe steps + escalation rule + default/fallback.
- Design Doc KDD-3 — current "default candidate `'card'`" wording to be replaced.
- PRD §10 O5 — Open Item to be resolved.
- PRD §4.4.2 step 4 — references the locked value as `<wallet payment_method_type — default candidate 'card', see §10 O5>`.

## AC coverage

Foundation for **AC-D04** (correct method-type value flowing into `intent.createIntent`). Does not fully close any AC. AC-D04 is fully closed by Task 04's integration tests once the locked value flows through `<CheckoutForm>` to `intent.createIntent`.

Resolves Open Item PRD §10 O5 (Apple Pay-related O6 / O7 are deployment-task items, not affected here).

## Scope

**Modify (documentation only):**

- `d:/Projects/TestIQ/typestest/docs/design/module-3-stripe-wallets-ece.md` — KDD-3 section: replace "default candidate `'card'`" wording with the locked value + brief probe-result note (1–2 sentences).
- `d:/Projects/TestIQ/typestest/docs/prd/module-3-first-payment.md` — §10 O5: mark resolved with the locked value and date.

**Do NOT touch** (in this task):

- Any source code in `src/`.
- `package.json` (Task 01 owns the SDK version verification).
- ADR-0001 — the ADR remains "Accepted" with OQ#1 unchanged in its body; the resolution is recorded in the Design Doc and PRD per the project's documentation flow.

## Backend contract reference

The backend endpoint contract is **unchanged**. Only the *value* sent for `payment_method_type` on the wallet path is open. Endpoint:

- `POST /payment/stripe/create-payment-intent` — request body includes `payment_method_type` (currently `'card'` | `'paypal'` for the existing flows).

## Step-by-step procedure

### Step 1 — Run the probe procedure (verbatim from Design Doc §Backend contract & probe procedure)

1. **Locate the backend repo.** Not in the orchestrator's working tree (this is a frontend-only repo). If the backend is opaque or inaccessible → fall back to `'card'`, skip to Step 2.
2. **Find the request handler** for `POST /payment/stripe/create-payment-intent`. Search by route string or by the response shape `{ client_secret, id }`.
3. **Inspect the validator/whitelist on `payment_method_type`.** Look for: enum lists, allow-lists, switch/match constructs, or `Stripe::PaymentIntent.create(payment_method_types: [...])` calls.
4. **Determine the accepted set.** Common cases:
   - Only `'card'` and `'paypal'` are accepted → use `'card'` for the wallet path. **Locked.**
   - `'card'`, `'paypal'`, and `'apple_pay'` (or similar) accepted → still use `'card'` because ECE cannot differentiate at create-intent time (KDD-3).
   - Field is unrestricted (free-form string) → use `'card'` for compatibility with Stripe's PaymentIntent API expectations.
5. **Verify in Stripe test mode** that an intent created with the chosen value can be confirmed via ECE on Chrome (Google Pay) — and Safari (Apple Pay) if available — in a scratch local run. Both surfaces should succeed end-to-end.
6. **If the chosen value fails** (intent creation 4xxs, or `confirmPayment` rejects post-create) → **escalate**, halt the plan. Do not silently fall back to a different method's value.

**Outcome to capture for Steps 2–3:** a single string — the locked wallet `payment_method_type` value (default `'card'` unless probe finds a stronger requirement).

### Step 2 — Update Design Doc KDD-3

Open `d:/Projects/TestIQ/typestest/docs/design/module-3-stripe-wallets-ece.md` and locate KDD-3:

> **KDD-3 — Backend `payment_method_type` for the wallet path: PROBE-THEN-LOCK with `'card'` as fallback.** (See §Backend contract for procedure. Tracks ADR-0001 OQ#1.)
>
> Default candidate is `'card'` …

Replace the "default candidate `'card'`" wording so it reflects the locked value — for example, if `'card'` is locked:

> **KDD-3 — Backend `payment_method_type` for the wallet path: LOCKED to `'card'` (resolved 2026-04-XX).** (Closes ADR-0001 OQ#1.)
>
> Locked value is `'card'`, confirmed by backend probe on 2026-04-XX. Backend whitelist: `[summarize what was found, e.g. "accepts only 'card' and 'paypal'"]`. ECE wraps card-family wallets and does not expose the chosen wallet at create-intent time, so a single value covers both Google Pay and Apple Pay.

If a value other than `'card'` is locked, replace `'card'` with the locked value verbatim and adjust the rationale sentence to match.

If the probe was inconclusive (backend opaque) → use the fallback wording:

> **KDD-3 — Backend `payment_method_type` for the wallet path: LOCKED to `'card'` (fallback, backend probe inconclusive 2026-04-XX).** Backend repo was inaccessible/opaque; per Design Doc §Backend contract & probe procedure, fallback is `'card'`. If test-mode confirm fails post-implementation, escalate.

### Step 3 — Update PRD §10 O5

Open `d:/Projects/TestIQ/typestest/docs/prd/module-3-first-payment.md` and locate §10 Open Items, item O5:

> - **O5** Backend `payment_method_type` value for the wallet path — probe before Design Doc finalisation. Default candidate: `'card'`. ECE does not expose the chosen wallet at create-intent time, so a single value covers both Google Pay and Apple Pay.

Replace with a resolved entry:

> - **O5 (resolved 2026-04-XX)** Backend `payment_method_type` for the wallet path — **LOCKED to `'card'`**. Probed [date]; backend [summary]. See Design Doc KDD-3.

If the probe locked a different value, replace `'card'` with the locked value verbatim.

### Step 4 — Verify both docs reference the same locked value

Run a grep to confirm consistency:

```sh
grep -n "payment_method_type" \
  d:/Projects/TestIQ/typestest/docs/design/module-3-stripe-wallets-ece.md \
  d:/Projects/TestIQ/typestest/docs/prd/module-3-first-payment.md
```

Expected: every reference to the wallet `payment_method_type` value across the two files reads the same locked literal. References that quote the default candidate as `'card'` in narrative context (e.g. PRD §10 O5 entry) must have been updated in Step 3.

## Completion criteria (done-when)

- [x] Wallet `payment_method_type` value is locked (default `'card'` or probe-confirmed alternative). Locked value captured in commit message.
- [x] Probe procedure executed (or fall-back invoked with reason recorded in commit message if backend was opaque).
- [x] Design Doc KDD-3 updated: "default candidate" wording replaced with the locked value + 1–2 sentences of probe-result note.
- [x] PRD §10 O5 marked resolved with the locked value and date.
- [x] Both docs reference the same locked value (grep check from Step 4 passes).
- [x] Escalation triggered IF AND ONLY IF probe Step 5 (test-mode confirm) failed outright.
- [x] No source-code change; no `package.json` / lockfile / `src/` modification.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
grep -n "payment_method_type" docs/design/module-3-stripe-wallets-ece.md docs/prd/module-3-first-payment.md
# Expected: locked value referenced consistently across both files.

git status
# Expected: only the two doc files staged.
```

No `npx tsc --noEmit` / `npm run lint` / `npm run build` / `npx vitest run` are required for this task — there is no source-code change.

## Notes / ambiguities

- **Default-lock policy**: `'card'` is the documented default. Locking `'card'` without a successful probe is acceptable per Design Doc §Backend contract → Default / fallback section. The fallback rationale must be captured in the doc updates so a future reviewer understands the locked value's evidentiary basis.
- **Escalation rule**: IF probe Step 5 (test-mode confirm with the chosen value) fails outright AND the backend repo is inaccessible → halt the plan, do not proceed to Task 01. Escalate to the backend owner. This is the only condition that blocks the plan.
- **Risk note (R-D8 / R-D4)**: If the probe yields a backend whitelist that requires per-wallet differentiation (e.g. distinct `'apple_pay'` and `'google_pay'` values), the design contract changes — ECE cannot differentiate at create-intent time, so the architecture would need to defer create-intent until post-confirm. That is out of scope for this slice; halt and escalate.
- **No test coverage**: This is a documentation-only commit. Test coverage for the locked value's correctness lands in Task 03 (cache-key tests) and Task 04 (integration tests asserting `intent.createIntent(<locked value>)` is called).
- **ADR-0001 status**: The ADR remains "Accepted". OQ#1 is logged in the ADR's Open Questions section; resolution is recorded in the Design Doc and PRD per the documentation flow. The ADR body is not edited.
