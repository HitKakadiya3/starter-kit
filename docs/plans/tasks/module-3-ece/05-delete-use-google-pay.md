# Task 05 — Delete legacy `useGooglePay.ts` + `useGooglePay.test.tsx`

**Phase:** 4 · Delete legacy `useGooglePay`
**Work plan task id:** T4.1
**Size:** Small (2 files deleted)
**Dependencies:**
- `04-checkout-form-ece-refactor.md` — must complete first; no consumer can reference `useGooglePay`.

## Purpose / why this task exists

Now that no consumer references `useGooglePay`, delete the source files. Verify zero remaining importers via grep. Run full `vitest run` to confirm green.

This is a contained cleanup task. The risk is low. If `grep` reveals a missed importer, that is a Task 04 escape — go back and fix. Do NOT silently re-add a stub or work around a missed reference.

## PRD / Design Doc / ADR anchors

- Work plan §Phase 4 / Task 4.1 — verbatim procedure.
- Design Doc §Files Changed — `useGooglePay.ts` (Delete), `useGooglePay.test.tsx` (Delete).
- ADR-0001 §Implementation Guidance — "Delete `useGooglePay` and its test file rather than retaining them as dead code".

## AC coverage

Indirect closure for **AC-D03** (no application-level `canMakePayment()` — supported by absence of the legacy hook). No new test resolution; the 14/14 target was reached in Task 04.

## Scope

**Delete:**

- `d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.ts`
- `d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.test.tsx`

**Do NOT touch** (in this task):

- Any other file. This is a delete-only commit.

## Backend contract reference

None. Backend contract is unchanged across the entire ECE migration.

## Step-by-step procedure

### Step 1 — Pre-deletion grep guard

From `d:/Projects/TestIQ/typestest`:

```sh
grep -rn "useGooglePay" src
```

**Expected**: matches ONLY in `src/hooks/useGooglePay.ts` and `src/hooks/useGooglePay.test.tsx`.

If any other hit exists (e.g. `src/components/checkout/CheckoutForm.tsx` still imports it, or `src/pages/CheckoutPage.tsx` still references it) → **HALT**. Return to Task 04 and fix the importer. Do NOT proceed to deletion until this grep is clean.

### Step 2 — Delete both files

```sh
git rm d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.ts d:/Projects/TestIQ/typestest/src/hooks/useGooglePay.test.tsx
```

(Use the equivalent `rm` command if the repo is not in a git working tree state that supports `git rm`; the orchestrator's quality-fixer + commit cycle handles the staging.)

### Step 3 — Run the full repo test suite

```sh
npx vitest run
```

**Expected**: all tests green. The deletion of `useGooglePay.test.tsx` reduces the test count by however many tests it had; confirm no other test fails because of the deletion.

If any test fails because it references `useGooglePay` from outside the deleted files → that is a Task 04 escape (the importer was missed). Halt, return to Task 04, fix.

### Step 4 — Run the rest of the quality gate

```sh
npx tsc --noEmit
npm run lint
npm run build
```

All three must pass.

### Step 5 — Final isolation grep

```sh
grep -rn "useGooglePay" src
```

**Expected**: zero hits.

```sh
grep -rn "useGooglePay\|paymentRequest\|canMakePayment" src
```

**Expected**: returns only legitimate Stripe-internal references (if any in the new ECE wiring) — no app-level Google Pay code remains. If any non-Stripe-internal reference appears, investigate and fix.

## Completion criteria (done-when)

- [x] `src/hooks/useGooglePay.ts` deleted.
- [x] `src/hooks/useGooglePay.test.tsx` deleted.
- [x] Full repo `npx vitest run` green (no regressions; the deleted test file's tests are no longer counted, but no other test fails).
- [x] `npx tsc --noEmit` + `npm run lint` + `npm run build` all green.
- [x] `grep -rn "useGooglePay" src` → zero hits.
- [x] `git status` for the commit shows only the two deletions and nothing else.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
grep -rn "useGooglePay" src                                       # → zero hits.
grep -rn "useGooglePay\|paymentRequest\|canMakePayment" src       # → zero app-level hits (Stripe-internal references in new ECE wiring acceptable).
npx vitest run                                                    # Full suite green.
npx tsc --noEmit                                                  # Zero errors.
npm run lint                                                      # Zero errors.
npm run build                                                     # Succeeds.
git status                                                        # → only the two deletions staged.
```

## Notes / ambiguities

- **No new tests added**: this task is a deletion. The full repo suite passing IS the test (no broken consumer means no broken test).
- **Pre-deletion grep is the binding check**: if Step 1 shows any hit outside the two files about to be deleted, that is a Task 04 escape — never delete in spite of a remaining reference. Quality-fixer should refuse to commit; if it does not, manually halt.
- **`paymentRequest` / `canMakePayment` references**: these are Stripe SDK methods. The new ECE wiring may use them internally inside the SDK; the grep in Step 5 should NOT flag SDK-internal usage (e.g. inside `node_modules`) — only app-level `src/` usage. The grep is scoped to `src` so this is implicit; if a result appears, inspect to confirm it is not application code.
- **Risk note**: Low. If grep reveals a missed importer, that's a Task 04 escape — go back and fix.
- **Commit message body should note**: "Closes Task 4.1 (delete legacy useGooglePay). All wallet path code now lives in `useExpressCheckout` + `CheckoutForm`."
