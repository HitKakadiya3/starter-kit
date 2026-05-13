# Task 16 — Delete dead code

**Phase:** 4 · Cleanup + Quality Assurance
**Work plan task id:** 4.1
**Size:** Small (1 file deleted, 1 file audited)
**Dependencies:**
- `13-quiz-page-rewrite.md` (QuizPage no longer imports `questions` or `persistResult`)
- `14-calculating-page-guard.md` (CalculatingPage no longer imports `Scores`)
- `15-email-capture-real-submit.md` (EmailCapturePage no longer imports anything from scoring)
- `11-usequiz-rewrite.md` (useQuiz no longer imports `applyAnswer` / `Scores` / `initialScores`)

## Purpose / why this task exists

Module 1 replaces the static question set with a backend-fetched one, so `src/utils/questions.ts` becomes dead code and must be removed to prevent accidental re-import. `persistResult` in `src/utils/mbtiResult.ts` was only invoked by the old `QuizPage` completion flow; once Task 13 lands, it has no callers and is similarly removed.

**Scoring preservation (scope change from original PRD):** `src/utils/scoring.ts` is **kept intact**. Per the latest product direction, Module 5 (Report, TBD) may render client-side scoring using this engine. Preserving it now is cheaper than reintroducing it later. Orphaned exports are acceptable in this commit — no consumer reach is required.

Per the `ai-development-guide` skill (Implementation Completeness Assurance → Impact Analysis), this task begins with an explicit 3-stage discovery before removing any symbol.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §7 Changes to existing code (`questions.ts` row: "Deleted"; `scoring.ts` row now reads: "Preserved intact for potential Module 5 client-side scoring / report use").

## AC coverage

- No PRD §8 AC closed directly. This task protects the integrity of closed ACs by removing code paths that could accidentally be re-imported.

## Scope

**Delete:**
- `d:/Projects/TestIQ/typestest/src/utils/questions.ts` (entire file).

**Audit, then modify or delete:**
- `d:/Projects/TestIQ/typestest/src/utils/mbtiResult.ts` — `persistResult(scores)` was only called from QuizPage and has now been removed. If `persistResult` is the only export, delete the whole file. If the file has other exports still in use, prune only `persistResult`.

**Do NOT touch:**
- `d:/Projects/TestIQ/typestest/src/utils/scoring.ts` — **preserved intact** per product direction (Module 5 may use it). Orphaned exports are acceptable.
- `d:/Projects/TestIQ/typestest/src/hooks/useResults.ts` — PRD §7 explicitly leaves it for Module 5.
- `d:/Projects/TestIQ/typestest/src/utils/types.ts` — `typeData` is Module 5's concern.
- Any page other than what's already rewritten in Tasks 13–15.

## Step-by-step implementation

### Stage 1 — Discovery (impact analysis, required before deleting anything)

Run from `d:/Projects/TestIQ/typestest/`. Capture results in scratch notes.

1. ```
   grep -rn "from '@/utils/questions'" src
   ```
   Expected: **zero hits.** If any file still imports from `questions`, the prerequisite task (usually Task 13) was incomplete — stop and resolve.

2. ```
   grep -rn "persistResult" src
   ```
   Expected: zero hits outside `mbtiResult.ts` itself after Task 13 lands. Confirm before removing the function.

3. ```
   grep -rn "from '@/utils/mbtiResult'" src
   ```
   List every import. If `persistResult` is the only import source across the repo, the file can be deleted entirely. If other exports are still consumed, prune only `persistResult`.

4. (Informational only — do NOT act on these) ```
   grep -rn "from '@/utils/scoring'" src
   ```
   Capture the hit list for the commit message. No deletion is performed against `scoring.ts` in this task.

### Stage 2 — Understanding

Write a one-line reasoning note per finding. The contract for this commit is: remove `questions.ts` and `persistResult`; leave everything else untouched.

### Stage 3 — Identification

Final deletion list before touching code:

- Files fully deleted: `src/utils/questions.ts`; possibly `src/utils/mbtiResult.ts` (only if `persistResult` is its sole export).
- Symbols pruned from `mbtiResult.ts` (if kept): `persistResult` only.
- `scoring.ts`: **no deletions.**

### Execute

1. Delete `typestest/src/utils/questions.ts` (file remove).
2. Open `typestest/src/utils/mbtiResult.ts`. If `persistResult` is the only export, delete the file. Otherwise remove just the function plus any now-unused imports.
3. Run verification (below). Reconcile with Stage 1 output if anything fails.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npm run build` — succeeds.
- `npx tsc --noEmit` — zero errors.
- `npm run lint` — clean.
- `npm run test` — all tests green (in particular `useQuiz.test.ts`, `api.test.ts`, `session.test.ts`, `ip.test.ts`, `campaign.test.ts`, `redirectRouter.test.ts`, `deviceInfo.test.ts`, `useRedirectGuard.test.tsx`).
- Post-delete sanity:
  - `test ! -f typestest/src/utils/questions.ts && echo "deleted" || echo "still present"` → prints `deleted`.
  - `grep -rn "from '@/utils/questions'" typestest/src` → zero hits.
  - `grep -rn "persistResult" typestest/src` → zero hits (if `mbtiResult.ts` was fully deleted, this is automatic).
  - `test -f typestest/src/utils/scoring.ts && echo "scoring preserved"` → prints `scoring preserved`.
- `npm run dev` → full funnel still walks from `/` to `/checkout?qid=…` (sanity check — no regressions from deletions).

## Done-when

- `src/utils/questions.ts` no longer exists.
- `src/utils/scoring.ts` is unchanged — every export preserved intact.
- `mbtiResult.ts` either deleted or pruned of `persistResult` (depending on Stage 1 audit).
- `useResults.ts` is unchanged.
- `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npm run test` all green.
- Impact analysis output (Stage 1 grep results) recorded in commit message or task notes.

## Notes / ambiguities

- **Scoring preservation (product direction, supersedes original PRD §7 deletion list for `scoring.ts`):** The client-side scoring engine stays intact. Module 5 (Report, TBD) may compute the MBTI type on the frontend rather than relying on the backend's `personality_type`. Leaving `scoring.ts` untouched costs nothing today and saves a reintroduction later. This task is narrower than the work plan originally implied — scoped down to `questions.ts` + `persistResult` only.
- **Work plan Open Items #3:** `mbtiResult.ts` cleanup is conditional on Stage 1 audit. Delete the file only if `persistResult` is its sole export.
- **Work plan Open Items #4:** `useResults` / `scoring.ts` co-dependency no longer an issue — `scoring.ts` is preserved in full.
- **Risk:** the deletion can silently break a component that was only loosely typed. Running the full test suite AND the full funnel manually catches both.
- Do NOT attempt to "tidy up" unrelated files in this commit. The commit scope is narrow on purpose — reviewers and rollbacks depend on it.
