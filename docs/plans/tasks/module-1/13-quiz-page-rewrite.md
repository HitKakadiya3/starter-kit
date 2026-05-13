# Task 13 — Rewrite `src/pages/QuizPage.tsx`

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.4
**Size:** Medium (1 file, moderate rewrite of data-loading parts)
**Dependencies:** `10-api-types.md`, `11-usequiz-rewrite.md`, `12-scale-selector-callback.md`, `02-api-client.md`

## Purpose / why this task exists

QuizPage today imports a static `questions` array from `src/utils/questions.ts` and calls `persistResult(scores)` before navigating. Module 1 moves questions to the backend, removes scoring, and passes `{ answers, startTime, endTime }` forward via route state. This is the first page-level consumer of `apiGet`, the new `useQuiz` contract, and the new `ScaleSelector` callback signature — it stitches them together.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.3 QuizPage (Data, Behavior, Loading state, Error state, Empty state, ScaleSelector changes).
- `docs/prd/module-1-load-questions.md` §7 Changes to existing code — `QuizPage.tsx` row.
- `docs/prd/module-1-load-questions.md` §5 Data flow — `GET /questions?variant_type=&tag=` → filter → shuffle → take 60.

## AC coverage

- **AC 2** — Questions visibly come from the backend; a second run produces different ordering (Fisher–Yates shuffle).
- **AC 7** — Network failure on `/questions` displays a retryable error card; no fallback to local questions.
- Contributes to **AC 1** (happy path — quiz answers captured and passed to `/calculating`).
- Contributes to **AC 6** (timing stamped correctly; `useQuiz` owns the stamps, but QuizPage is the host).

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/QuizPage.tsx`

**Do NOT touch in this task:**
- `d:/Projects/TestIQ/typestest/src/utils/questions.ts` — deletion is Task 16. Simply stop importing it here.
- `d:/Projects/TestIQ/typestest/src/utils/scoring.ts` / `mbtiResult.ts` — deletion is Task 16. Stop calling `persistResult`.
- `d:/Projects/TestIQ/typestest/src/components/ScaleSelector.tsx` — already swapped in Task 12.
- `d:/Projects/TestIQ/typestest/src/hooks/useQuiz.ts` — already rewritten in Task 11.

Keep the existing visual layout (progress bar, container, animations). Only the data-loading and navigation paths change.

## Step-by-step implementation

1. Read the current `typestest/src/pages/QuizPage.tsx` to inventory what must stay (layout, progress bar, transitions) vs. what must go (static `questions` import, `persistResult(scores)` call, any `scores` local state).

2. Remove the following imports:
   - `questions` from `@/utils/questions`.
   - `persistResult` from `@/utils/mbtiResult` (if present).
   - `Scores` / `initialScores` / `applyAnswer` from `@/utils/scoring` (if present).

3. Add imports:
   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { useMemo } from 'react';
   import { apiGet } from '@/lib/api';
   import type { ApiQuestion } from '@/lib/apiTypes';
   ```

4. Add a `useQuery`:
   ```ts
   const { data, isLoading, isError, refetch } = useQuery({
     queryKey: ['questions'],
     queryFn: () => apiGet<ApiQuestion[]>('questions?variant_type=&tag='),
     staleTime: Infinity, // don't refetch mid-quiz
     retry: 0,            // single-shot; user retries via button
   });
   ```

5. Filter + shuffle + slice into a memoized value so it is stable across re-renders. Stability matters: without `useMemo`, each render reshuffles and the user sees a different question per keystroke.
   ```ts
   const preparedQuestions = useMemo(() => {
     if (!data) return [];
     const valid = data.filter(q =>
       q.question_type_id === 6 &&
       Array.isArray(q.options) &&
       q.options.length === 5 &&
       q.options.every(o => typeof o.text === 'string' && typeof o.weight === 'number'),
     );
     if (valid.length !== data.length) {
       console.warn(`QuizPage: dropped ${data.length - valid.length} non-Likert items`);
     }
     // Fisher–Yates
     const shuffled = [...valid];
     for (let i = shuffled.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
     }
     const sliced = shuffled.slice(0, 60);
     if (sliced.length < 60) {
       console.warn(`QuizPage: only ${sliced.length} valid questions available (<60)`);
     }
     return sliced;
   }, [data]);
   ```

6. Pass the prepared list into `useQuiz`:
   ```ts
   const quiz = useQuiz(preparedQuestions);
   ```

7. Wire `ScaleSelector`:
   ```tsx
   <ScaleSelector onSelect={(positionIndex) => quiz.answer(positionIndex)} />
   ```
   `positionIndex` flows from Task 12's new callback into Task 11's `useQuiz.answer`.

8. Handle states:
   - **Loading** (`isLoading`): render a full-screen centered spinner with copy "Loading your questions…". Reuse existing spinner patterns if any; otherwise inline a simple one.
   - **Error** (`isError`): render a full-page error card with a Retry button that calls `refetch()`. The card should say something like "We couldn't load the quiz. Please try again." Do NOT fall back to any local questions.
   - **Empty after filter** (`!isLoading && !isError && preparedQuestions.length === 0`): render "This test isn't available right now" with a Try Again button that calls `refetch()`.
   - **Ready:** render the existing quiz UI (progress bar + current question + ScaleSelector).

9. Navigation on completion. Replace any `persistResult(scores)` + `navigate('/calculating')` with:
   ```ts
   useEffect(() => {
     if (quiz.isComplete) {
       navigate('/calculating', {
         state: {
           answers: quiz.answers,
           startTime: quiz.startTime,
           endTime: quiz.endTime,
         },
         replace: false,
       });
     }
   }, [quiz.isComplete, quiz.answers, quiz.startTime, quiz.endTime, navigate]);
   ```

10. Remove any local `scores` state or `applyAnswer` calls.

11. Confirm the progress bar uses `quiz.questionIndex / quiz.totalQuestions` (or the equivalent existing variable names after rewrite).

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `npm run build` — succeeds.
- `npm run dev`, then manual:
  1. Visit `http://localhost:8080/` → `/instructions` → `/quiz`. DevTools Network shows `GET /questions?variant_type=&tag=` with `Authorization`, `x-host`, `ip_address` headers.
  2. Loading spinner visible during fetch.
  3. Block `/questions` via DevTools (Network → right-click → Block request URL). Refresh `/quiz`. Error card appears with a Retry button. Unblock, click Retry, questions load.
  4. Take the quiz twice in one session — order of questions differs (AC 2). Verify by noting the first question text on each run.
  5. Console shows a warn if backend returns any non-Likert items.
  6. On final answer, app navigates to `/calculating`. `location.state` on `/calculating` should contain `answers`, `startTime`, `endTime` (inspect via React DevTools or a temporary `console.log` in CalculatingPage that you remove before Task 14 commits).
- `grep -rn "from '@/utils/questions'" typestest/src/pages/QuizPage.tsx` → zero hits.
- `grep -rn "persistResult\|applyAnswer\|initialScores" typestest/src/pages/QuizPage.tsx` → zero hits.

## Done-when

- QuizPage fetches from `GET /questions?variant_type=&tag=` via `apiGet`.
- Filter/shuffle/slice pipeline runs once per fetch (memoized).
- Loading / error / empty states render per PRD §6.3.
- On completion, navigates to `/calculating` with `{ answers, startTime, endTime }` in route state.
- No imports of `@/utils/questions`, `@/utils/scoring`, or `@/utils/mbtiResult` remain in this file.
- AC 2 and AC 7 verified manually.

## Notes / ambiguities

- **Work plan Open Items #2 / PRD §6.3:** ScaleSelector position ordering. PRD assumes the backend's `options[]` is in the same top-to-bottom order the UI renders (Strongly Agree → Strongly Disagree). **Verify with one real `/questions` response during the manual smoke above.** If the backend returns a different order, the one-line fix goes here (e.g., sort `q.options` by `weight` descending so index 0 is the `weight=2` option) — not in Task 11 or Task 12.
- **Work plan Risk A1:** `answer` field is the option id (not position). If the real submit (Task 15) returns a 4xx complaining about answer shape, the fix is a one-liner in `useQuiz.answer()` (Task 11) — not here. Do not attempt to switch during this task.
- **Shuffle stability:** the `useMemo([data])` dependency means a new shuffle happens only when `data` changes (once per fetch). A retry via `refetch()` produces a fresh `data` reference and thus a fresh shuffle, which is the intended behavior for AC 2.
- Retain any existing `ScrollToTop` / animation wrappers — the App.tsx router already handles scroll reset.
- React Query is already installed; no new dependency.
