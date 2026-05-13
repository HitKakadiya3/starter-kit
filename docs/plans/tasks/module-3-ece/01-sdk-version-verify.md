# Task 01 — Verify `@stripe/react-stripe-js >= 2.1.0` (upgrade if needed)

**Phase:** 0 · Backend probe + domain prep
**Work plan task id:** T0.2
**Size:** Small (verify-only when version is already current; up to 2 files modified if upgrade is needed)
**Dependencies:** `00-backend-probe.md` — backend probe must be locked before any code touches the wallet path; this task technically can run in parallel with Task 00 because it does not depend on the locked value, but the work plan orders it after Task 00 to keep Phase 0 sequential.

## Purpose / why this task exists

Avoid a Phase 1 import-resolution failure (R-D9). Stripe's `<ExpressCheckoutElement>` component was added in `@stripe/react-stripe-js` version `2.1.0`. If the repo's installed version is below that, Task 02's `import { ExpressCheckoutElement } from '@stripe/react-stripe-js'` would fail at compile time and the entire ECE slice would be blocked.

This task either confirms the current version is sufficient (no file changes) or performs the minimum-required upgrade with the lockfile committed alongside. Verification follows: a clean `npx tsc --noEmit` against a scratch import line proves the type is exported.

## PRD / Design Doc / ADR anchors

- Work plan §Phase 0 / Task 0.2 — verbatim procedure.
- PRD §7 "Dependencies added" — `@stripe/react-stripe-js >= 2.1.0` requirement.
- Risk R-D9 — "`@stripe/react-stripe-js` version in repo is too old for `<ExpressCheckoutElement>`".

## AC coverage

No AC fully closed by this task. Foundation for all downstream tasks (02, 03, 04) — without this verification, imports in Task 02 and Task 04 would fail.

## Scope

**Modify (only if upgrade is needed):**

- `d:/Projects/TestIQ/typestest/package.json` — bump `@stripe/react-stripe-js` to `>= 2.1.0` (match existing caret/exact-pin convention).
- `d:/Projects/TestIQ/typestest/package-lock.json` and/or `d:/Projects/TestIQ/typestest/bun.lockb` — refreshed by the install. Include whichever lockfile the repo already tracks (do not introduce a new one).

**Do NOT touch** (in this task):

- Any file under `src/`, `docs/`, `public/`, `tests/`.
- `.env.example` or any other config file.
- `@stripe/stripe-js` unless Stripe's own peer requirements force a bump (verify in Step 4 below; usually no separate bump needed).

## Backend contract reference

None. This task is a build-tooling change only.

## Step-by-step procedure

### Step 1 — Inspect current `@stripe/react-stripe-js` version

From `d:/Projects/TestIQ/typestest/`:

```sh
node -e "console.log(require('./package.json').dependencies['@stripe/react-stripe-js'])"
```

Expected output: a version string. Compare to `2.1.0`:

- If `>= 2.1.0` → proceed to Step 5 (no upgrade needed).
- If `< 2.1.0` (or missing entirely) → proceed to Step 2.

### Step 2 — Upgrade `@stripe/react-stripe-js` (only if needed)

From `d:/Projects/TestIQ/typestest/`:

```sh
npm install @stripe/react-stripe-js@latest
```

Version policy: match the repo's existing convention. If `package.json` uses carets (`^`) for other dependencies, the install will produce a caret pin; otherwise pin exact. Do not introduce a new convention.

Commit the lockfile update alongside the `package.json` change.

### Step 3 — Confirm `@stripe/stripe-js` peer compatibility

From `d:/Projects/TestIQ/typestest/`:

```sh
node -e "console.log(require('./package.json').dependencies['@stripe/stripe-js'])"
```

`@stripe/react-stripe-js >= 2.1.0` typically requires `@stripe/stripe-js >= 2.0.0`. Stripe's own peer requirements should be satisfied by any reasonably-current version. If `npm install` in Step 2 emitted a peer-dependency warning, bump `@stripe/stripe-js` to the latest as well:

```sh
npm install @stripe/stripe-js@latest
```

If no peer warning was emitted, do NOT bump `@stripe/stripe-js` — minimise the diff.

### Step 4 — Verify the type resolves

Create a scratch one-liner to confirm the import works (do NOT commit this):

```sh
node -e "console.log(Object.keys(require('@stripe/react-stripe-js')))" | tr ',' '\n' | grep -i ExpressCheckout
```

Expected output: at least one line containing `ExpressCheckoutElement`. If the grep returns no match, the upgrade did not produce the expected module surface — halt and investigate.

Then verify TypeScript types resolve:

```sh
npx tsc --noEmit
```

Expected: zero errors. (No new code references `<ExpressCheckoutElement>` yet, so this just confirms the upgrade did not break existing typings.)

### Step 5 — Run full quality gate

Whether or not an upgrade was performed, confirm the repo is still green:

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run test
```

All four must pass. If the upgrade introduced breaking changes (rare for a minor bump within a `2.x` series), surface the breaking-change list and decide whether to fix in this task or revert and escalate.

### Step 6 — Document the version state in the commit message

Include in the commit message body:

- Pre-task version (from Step 1).
- Post-task version (same as pre-task if no upgrade, or the new version if upgraded).
- Whether `@stripe/stripe-js` was also bumped (and why, if so).

## Completion criteria (done-when)

- [x] `import { ExpressCheckoutElement } from '@stripe/react-stripe-js'` resolves without TS error (verified via Step 4 type-check).
- [x] `@stripe/react-stripe-js` version in `package.json` is `>= 2.1.0`.
- [x] If upgraded: lockfile (`package-lock.json` and/or `bun.lockb`, whichever the repo tracks) is refreshed and committed alongside `package.json`.
- [x] If upgraded: `npx tsc --noEmit` + `npm run lint` + `npm run build` + `npm run test` all green (no breaking changes from minor upgrade).
- [x] Pre/post-task version recorded in the commit message.
- [x] No file under `src/`, `docs/`, `public/`, `tests/` modified.

## Verification commands

Run from `d:/Projects/TestIQ/typestest`:

```sh
node -e "console.log(require('./package.json').dependencies['@stripe/react-stripe-js'])"
# Expected: version >= 2.1.0.

node -e "console.log(Object.keys(require('@stripe/react-stripe-js')))" | tr ',' '\n' | grep -i ExpressCheckout
# Expected: at least one match (ExpressCheckoutElement).

npx tsc --noEmit                 # Zero errors.
npm run lint                     # Zero errors.
npm run build                    # Succeeds.
npm run test                     # Full repo suite green (including Module 1 + 2 + the predecessor first-payment tests).
```

If no upgrade was performed, the diff is empty and only the verification output documents the task — that is acceptable; commit an empty change is NOT acceptable. If `node -e` confirms `>= 2.1.0` and no source change is needed, treat this task as a no-op verification (no commit) and note it on the work plan progress tracker. The orchestrator skips an empty-commit phase.

## Notes / ambiguities

- **Empty-commit case**: If the repo's installed `@stripe/react-stripe-js` is already `>= 2.1.0`, this task produces no diff. Record the verification outcome in the work plan progress tracker (Phase 0 notes) and proceed to Task 02. Do NOT create an empty commit.

## Execution log (2026-04-29)

This task executed as a **no-op verification** — the empty-commit case applied:

- Step 1 — `node -e "console.log(require('./package.json').dependencies['@stripe/react-stripe-js'])"` → `^6.2.0`. Well above the `2.1.0` minimum, so Steps 2–3 (upgrade) skipped.
- Step 4 — `node -e "console.log(Object.keys(require('@stripe/react-stripe-js'))..."` → `ExpressCheckoutElement` confirmed present. `npx tsc --noEmit` → zero errors.
- Step 5 — Full quality gate (lint/build/test) deferred to quality-fixer; the SDK-related verification surfaces (`tsc --noEmit` + module-export check) are clean.
- Step 6 — Pre-task version: `^6.2.0`. Post-task version: `^6.2.0` (unchanged). No `@stripe/stripe-js` bump (would only be needed on peer warning during upgrade; no upgrade performed). No commit (per the empty-commit policy in this file).

Outcome recorded in the work plan Phase 0 progress tracker (`docs/plans/module-3-stripe-wallets-ece.md` §Progress Tracking → Phase 0). Phase 0 Completion-Criteria checkboxes for SDK version verification updated.
- **Lockfile policy**: If the repo tracks `bun.lockb` but `npm install` was used, also refresh `bun.lockb` via `bun install` to keep both lockfiles consistent. If only one is tracked, ignore the other. This matches the convention from the predecessor task (`module-3/01-stripe-sdk-and-env.md` Step 1).
- **`@stripe/stripe-js` bump policy**: Do NOT bump `@stripe/stripe-js` unless a peer-dependency warning is emitted in Step 3. The minimum-diff principle applies.
- **Risk R-D9 trigger**: If Step 4's grep returns no `ExpressCheckoutElement` match even after the upgrade, the upgrade did not land correctly (e.g. the version pin resolved to `2.0.x` due to a transitive constraint). Halt and inspect the resolved version in the lockfile. This is the only failure mode that blocks Task 02.
