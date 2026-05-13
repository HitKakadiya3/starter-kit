# Task 99 — Manual acceptance walkthrough (informational, non-blocking)

**Phase:** 6 · Manual acceptance walkthrough
**Work plan task id:** T99 (informational)
**Size:** N/A (verification only — no commits)
**Dependencies:** All tasks 00–06 complete and committed.

> **THIS FILE IS A MANUAL CHECKLIST, NOT AN AUTOMATED TASK.**
>
> The orchestrator's task-executor → quality-fixer → commit cycle does NOT pick this up. Phase 6 is **informational**; it does NOT block commit / merge if Tasks 00–06 pass automated tests. This task exists for a human (PR author + reviewer) to close any ACs that automated tests cannot verify (notably PRD §8 AC 22 — Safari + Apple Pay) and to provide a final visual sanity check on Stripe's default ECE button styling.

## Purpose / why this task exists

The 14 ECE-track automated tests (filled across Tasks 02–04) cover every AC that can be verified with mocked Stripe SDKs. The remaining coverage requires a running build against a real backend with a real `pk_test_` Stripe key:

- Live Google Pay sheet on Chrome (PRD §8 AC 21).
- **Apple Pay on Safari (PRD §8 AC 22) — cannot be automated in this repo today.**
- Real ECE button rendering / Stripe-controlled visuals (Design Doc DD-OQ-1).
- Legacy-cache-miss end-to-end behaviour against Stripe test mode (PRD §8 AC 25a).
- Card-form no-remount visual confirmation under wallet interactions (Design Doc AC-D09).

This walkthrough is that verification. It produces walkthrough notes attached to the merge request as documentation. Hard failures file follow-up issues; if a failure indicates an automated-test gap, return to the relevant Task 02–04 and add the missing test in that task's commit (do NOT add the test in this informational task).

## PRD / Design Doc / ADR anchors

- PRD §8 ACs 21, 22, 23, 25a — manual-verifiable surfaces.
- PRD §11 step 9 — manual QA bullets.
- Design Doc §Test Strategy → "E2E and manual acceptance".
- Design Doc AC-D11 — no-association-file resilience (informational here; verified by absence in test mode).
- Design Doc Risk R-D7 — Safari automation gap.
- Design Doc DD-OQ-1 — ECE button visual tuning (post-merge).
- ADR-0001 §Negative Consequences — "Apple Pay button does not render on Chrome/Firefox even in test mode; manual acceptance must include Safari".
- Existing manual checklist: `tests/e2e/checkout-ece-manual.md` (7 sub-walkthroughs; this task references and uses that file).
- Work plan §Phase 6 / Task 99 — verbatim 7-walkthrough list.

## AC coverage

Closes (informationally):

- **PRD §8 AC 21** — Chrome + Google Pay end-to-end (also covered by automated test).
- **PRD §8 AC 22** — Safari + Apple Pay (manual-only — R-D7).
- **PRD §8 AC 23** — unsupported browsers (Firefox without wallet).
- **PRD §8 AC 25a** — legacy cache-key migration end-to-end.
- **Design Doc AC-D11** — no-association-file resilience (informational; live-mode property — verified by absence in test mode).
- **Design Doc DD-OQ-1** — ECE button visual sanity (flag if visibly off).

## Scope

**Files touched:** none.

**Artifacts produced:**

- Walkthrough notes captured in `tests/e2e/checkout-ece-manual.md` (or attached to the merge request as a separate verification note) — pass/fail/notes per sub-walkthrough.
- Any hard failure → file follow-up issue; do NOT block merge unless the failure indicates an automated-test gap (in which case go back, add the missing test in the relevant Task 02–04, fix).

## Prerequisites

1. **Real `pk_test_` publishable key** paired with the backend's sandbox Stripe account. Place in `typestest/.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…` (file is untracked).
2. **Backend dev URL reachable** with a current bearer token.
3. **Chrome with a configured Google Pay wallet** for walkthrough 1.
4. **Safari (macOS) or iOS Simulator with Apple Pay configured** for walkthrough 2 — if unavailable, this walkthrough is deferred to release checklist (R-D7).
5. **A non-Chromium browser without wallet support** (Firefox) for walkthrough 3.
6. **Module 1 + Module 2 + first-payment + ECE Tasks 02–06 all merged** to the working branch.
7. **Pre-flight quality gate green**: `npx tsc --noEmit` + `npm run lint` + `npx vitest run` + `npm run build` all pass.

## Walkthroughs

The 7 sub-walkthroughs are defined in `tests/e2e/checkout-ece-manual.md` and reproduced here per work plan §Phase 6 / Task 99 for self-containment. Run each one against `npm run dev` with the test-mode key configured.

### W1 — Chrome + Google Pay (automatable in concept)

Fresh incognito → walk funnel from `/` to `/checkout?qid=…` → tick consent → click the GPay button rendered inside the ECE slot → native sheet appears → select method → success.

**DevTools Network expectations:**

- Exactly one `POST /payment/stripe/create-payment-intent` (or zero if cache-hit) with `payment_method_type: <locked wallet value>`.
- Exactly one `POST /payment/stripe/first-sale/payments/confirm`.

**Closes:** PRD §8 AC 21; Design Doc AC-D03, AC-D04, AC-D06.

### W2 — Safari + Apple Pay (manual-only — R-D7)

macOS Safari or iOS Simulator with Apple Pay configured. Same steps as W1.

**Verify:** Apple Pay button renders inside ECE → click → Apple Pay sheet → succeed → confirm → navigate.

If Safari hardware is unavailable, **this walkthrough is deferred to the release checklist**. Note in the merge request: "Safari verification deferred to release checklist."

**Closes:** PRD §8 AC 22.

### W3 — Firefox without wallet (no-wallet automatable)

Firefox without any Apple Pay or GPay wallet → ECE slot renders nothing (or Stripe's empty state) → no console errors → card + PayPal still work.

**Closes:** PRD §8 AC 23; Design Doc AC-D11 (informational by absence in test mode).

### W4 — Legacy-cache-miss walkthrough (automatable in concept)

Pre-populate `sessionStorage.funnelSession` with `paymentIntent.keyedBy.methodType === 'google_pay'` (manually inject via DevTools → Application → Session Storage → edit `funnel` key to set the legacy literal).

Refresh `/checkout?qid=…` → tick consent → click ECE wallet button → verify exactly one fresh `POST /payment/stripe/create-payment-intent` with `payment_method_type: <locked wallet value>` → new entry overwrites legacy (inspect Session Storage post-click; `keyedBy.methodType` now matches the locked value).

**Closes:** PRD §8 AC 25a; Design Doc AC-D07 (integration-level verification — Tasks 03 and 04 verified at hook + integration test levels).

### W5 — No-pricing graceful skip (AC-D02)

Dev-injection scenario — temporarily mock `usePricing` to return `undefined` (e.g. via React DevTools or a one-line patch in dev). Mount `/checkout`.

**Verify:** ECE slot is absent → card + PayPal still render → no console error → CheckoutForm renders without throwing.

Revert the patch after verification (do NOT commit).

**Closes:** Design Doc AC-D02.

### W6 — Card-path no-remount (AC-D09 visual)

Open `/checkout` → tick consent → click "Credit or debit card" → type into the card number field → click somewhere outside the card form (without collapsing) → click the wallet button (don't complete) → cancel the wallet sheet → return to the card form.

**Verify:** the previously-typed text is still there. CardForm did NOT remount on the wallet interaction.

**Closes:** Design Doc AC-D09 (visual confirmation; Task 04's integration test asserts no-remount programmatically).

### W7 — ECE button visual sanity

Visually inspect the wallet button rendered by Stripe with defaults: `buttonType`, `buttonTheme`, `buttonHeight`.

**Verify:** the button is reasonably sized and themed for the page. If visibly off (e.g. extreme size, clashing colour), flag DD-OQ-1 (design tuning) in the merge request.

**Closes:** Design Doc DD-OQ-1 informationally; sets the baseline for any post-merge marketing/design pass.

## Outcomes

- Walkthrough notes captured in `tests/e2e/checkout-ece-manual.md` or attached to the merge request — pass/fail/notes per sub-walkthrough.
- Walkthrough W2 (Safari) is the only one with a hard manual dependency. The other walkthroughs could be automated in a future Playwright slice (DD-OQ-2).

### Acceptance gate (informational, NOT blocking)

- [ ] Walkthroughs W1, W3, W4, W5, W6, W7 pass.
- [ ] Walkthrough W2 (Safari) passes if Safari is available; otherwise deferred to release checklist with explicit note in merge request.

### What blocks merge

**NOTHING in this task blocks merge** under the Phase 6 informational gate. Tasks 00–06 automated tests are the binding gate.

**Exception**: if a hard failure in W1 / W3 / W4 / W5 / W6 / W7 indicates an automated-test gap (e.g. W4 fails because Task 03's cache-miss assertion was wrong), return to the relevant Task 02 / 03 / 04, add the missing test, fix in that task's scope. Do NOT add the test or fix in this informational task.

## Completion criteria (done-when)

- [ ] All 7 walkthroughs executed against Stripe test mode (W2 deferred if Safari hardware unavailable).
- [ ] Walkthrough notes captured in `tests/e2e/checkout-ece-manual.md` or attached to the merge request.
- [ ] No regressions surfaced; if any, they are documented as follow-up issues.
- [ ] DD-OQ-1 design-tuning observation recorded (pass/flag).
- [ ] Manual checklist signed off (or W2 deferred per release checklist).
- [ ] ECE button visual: snapshot or note attached to the merge request.

## Verification commands

This task does NOT run automated commands. The pre-flight quality gate must be green (run from `d:/Projects/TestIQ/typestest`):

```sh
npx tsc --noEmit                                                  # Zero errors.
npm run lint                                                      # Zero errors.
npx vitest run                                                    # Full suite green.
npm run build                                                     # Succeeds.
```

If pre-flight fails, return to the relevant Task 02–06 and fix before walking the scenarios.

## Notes / ambiguities

- **W2 (Safari) deferred when hardware unavailable**: this is acceptable per work plan §Phase 6 / Risk R-D7 ("Apple Pay manual acceptance gap (no Safari automation)"). Document the deferral in the merge request body.
- **W4 sessionStorage editing**: editing storage manually via DevTools is the documented method. Do NOT add a script or fixture to the codebase to automate this; the manual walkthrough is the gate.
- **W5 dev-injection patch**: never commit the patch. Revert and double-check `git status` before the merge request goes up.
- **No commits should land from this task**: only walkthrough notes attached to the merge request body. The commit trail for the ECE migration stops at Task 06.
- **Apple Pay live-mode AC-D11 verification**: AC-D11 is a live-mode property (no-association-file resilience). It's verified informationally here by *absence* — the README in Task 06 captures the deployment requirement, and test-mode walkthroughs do not require the association file. Live-mode verification happens during release.
- **Time budget**: a full pass of W1–W7 typically takes 20–40 minutes. Allocate accordingly.
