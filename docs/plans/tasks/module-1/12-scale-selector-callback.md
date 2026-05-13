# Task 12 — `ScaleSelector` callback signature

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.3
**Size:** Small (1 file)
**Dependencies:** `11-usequiz-rewrite.md` (the new `useQuiz.answer(positionIndex)` consumes what this task emits)

## Purpose / why this task exists

Today `ScaleSelector.onSelect(weight: number)` emits a signed integer in `{-2,-1,0,1,2}`. Module 1 moves to position-index semantics (0..4) because the backend carries `options[i].id` and we want to pass that id through to the submit body. This is a mechanical type-and-semantics swap in one file.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.3 QuizPage (`ScaleSelector` changes subsection), §7 Changes to existing code (`ScaleSelector.tsx` row).

## AC coverage

- Foundation for AC 1 (happy path — quiz answers flow through correctly).

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/components/ScaleSelector.tsx`

**Do NOT touch:**
- Any page file — QuizPage rewrite is Task 13.
- The component's visual layout, colors, or token classes (`scale-*`).

## Step-by-step implementation

1. Read `typestest/src/components/ScaleSelector.tsx` to understand the current option array and how `weight` is emitted.
2. Change the `onSelect` prop type from `(weight: number) => void` to `(positionIndex: number) => void`.
3. Remove (or rename) the internal `weight` field on each option so it is no longer part of the callback. Options should still render in the same vertical order (Strongly Agree at top → Strongly Disagree at bottom) — position 0 is the topmost button, position 4 is the bottommost.
4. The click handler passes the option's index in the options array to `onSelect(index)`.
5. Do NOT delete the component's `scale-*` Tailwind classes, icons, labels, or animations. The visual must be byte-identical.
6. If the component has any internal prop names or state names referencing `weight`, rename them to `positionIndex` or `index` for clarity. Do not introduce a new export.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — after this change, any existing caller passing `onSelect: (w: number) => ...` still compiles (number signature unchanged) BUT the semantics differ. Look at callers:
  ```
  grep -rn "ScaleSelector" typestest/src
  ```
  The only production caller is `QuizPage.tsx`; Task 13 rewrites that page. For this task's commit, QuizPage still passes `(weight) => ...` — that's fine because Task 13 is the very next commit. Both this task and Task 13 must land before the funnel works again.
- `npm run lint` — clean.
- `npm run build` — succeeds (builds are still green at the commit boundary; the quiz funnel is temporarily broken until Task 13 lands).
- Manual: open `http://localhost:8080/quiz` after Task 13. Verify the UI is unchanged.

## Done-when

- `onSelect` prop signature is `(positionIndex: number) => void`.
- Internal `weight` field is removed from the options (or repurposed to position index).
- Visual output is byte-identical to before.
- `npm run build` passes at this commit.
- No test file is created for this component (consistent with the component's current zero-test state per work plan Task 3.3 acceptance).

## Notes / ambiguities

- **Work plan Open Items #2 / PRD §6.3:** ScaleSelector position ordering. The UI renders options top-to-bottom as Strongly Agree → Strongly Disagree. The PRD's assumption is that the backend's `options` array arrives in the same order. **Verify this during Task 13's smoke test against a real `/questions` response before Phase 3 closes.** If the backend returns a different order, the fix is in Task 13 (`QuizPage`'s filter/map), not here.
- The component currently has zero tests. Do not add a new test file — a callback-type swap does not require one per work plan Task 3.3 acceptance.
- **Temporary build-break window:** this commit leaves `QuizPage` calling the callback with the wrong semantics (it still treats the value as a weight). The next commit (Task 13) rewrites QuizPage and closes that gap. The commit still type-checks because the callback argument is still `number`; the semantics diverge for exactly one commit. This is acceptable per the work plan's ordering, but do not sit on this state for long.
