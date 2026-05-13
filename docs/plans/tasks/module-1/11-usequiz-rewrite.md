# Task 11 — Rewrite `src/hooks/useQuiz.ts`

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.2
**Size:** Small (2 files)
**Dependencies:** `10-api-types.md`

## Purpose / why this task exists

The current `useQuiz` iterates a local `questions` array and calls `applyAnswer(scores, pole, weight)` to compute client-side MBTI scores. Module 1 moves scoring server-side: the hook must stop scoring, accept a backend-supplied question list as input, record raw `{id, answer}` pairs, and capture `startTime`/`endTime`. This commit is the cleanest point to also add the hook's first unit tests.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.3 QuizPage (behavior), §7 Changes to existing code (`useQuiz.ts` row).

## AC coverage

- AC 6 (`start_time` / `end_time` in submit body accurately bracket the quiz) — this hook is where timing is stamped.
- Foundation for AC 1 (happy path) and AC 7 (error retry — the hook does not own retry but must not break when the question list is empty).

## Scope

**Rewrite:**
- `d:/Projects/TestIQ/typestest/src/hooks/useQuiz.ts`

**Add:**
- `d:/Projects/TestIQ/typestest/src/hooks/useQuiz.test.ts`

**Do NOT touch:**
- `typestest/src/utils/questions.ts` — deletion is Task 16. The rewritten hook simply stops importing it.
- `typestest/src/utils/scoring.ts` — deletion is Task 16. The rewritten hook stops importing `applyAnswer`, `Scores`, `initialScores`.

## New hook contract

**Input:** filtered, shuffled, sliced list of `ApiQuestion` (passed in by `QuizPage`).

**Returned shape:**

```ts
{
  currentQuestion: ApiQuestion | undefined;
  questionIndex: number;             // 0-based; equals answers.length
  totalQuestions: number;
  answers: QuizAnswer[];             // [{ id, answer }]
  isComplete: boolean;
  startTime: number | undefined;
  endTime: number | undefined;
  answer: (positionIndex: number) => void;
  reset: () => void;
}
```

**Behavior:**
- `answer(positionIndex)`:
  - Maps to `currentQuestion.options[positionIndex].id`. If out of range or `currentQuestion` is undefined, no-op.
  - Pushes `{ id: currentQuestion.id, answer: optionId }` to `answers`.
  - If this is the FIRST call and `startTime` is undefined, stamp `startTime = Date.now()`.
  - If this is the LAST call (`answers.length === questions.length`), stamp `endTime = Date.now()` and set `isComplete = true`.
- `reset()`: clears `answers`, `startTime`, `endTime`, `isComplete`.

**Scoring removed:** no `Scores`, no `applyAnswer`, no `persistResult`, no `dim`/`pole` reads.

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/hooks/useQuiz.test.ts`. Use `@testing-library/react` `renderHook` + `act`. Mock `Date.now` with `vi.useFakeTimers()` / `vi.setSystemTime(...)` or `vi.spyOn(Date, 'now')`. Build a small fixture:

```ts
const Q1 = { id: 'q1', question_type_id: 6, text: 'Q1', options: [
  { id: 'o1a', text: 'A', weight: 2 }, { id: 'o1b', text: 'B', weight: 1 },
  { id: 'o1c', text: 'C', weight: 0 }, { id: 'o1d', text: 'D', weight: -1 },
  { id: 'o1e', text: 'E', weight: -2 },
] };
const Q2 = { ...Q1, id: 'q2' };
```

Tests:

1. **Initial state:** `questionIndex === 0`, `answers === []`, `isComplete === false`, `startTime === undefined`, `currentQuestion === Q1`, `totalQuestions === 2`.
2. **First answer stamps startTime:** fake `Date.now() = 1000`. `act(() => result.current.answer(0))`. Assert `answers[0] === { id: 'q1', answer: 'o1a' }`, `startTime === 1000`, `endTime === undefined`, `isComplete === false`, `questionIndex === 1`, `currentQuestion === Q2`.
3. **Final answer completes:** advance time to 5000. `act(() => result.current.answer(2))`. Assert `answers.length === 2`, `answers[1] === { id: 'q2', answer: 'o1c' }`, `endTime === 5000`, `isComplete === true`.
4. **Out-of-range positionIndex is a no-op:** `act(() => result.current.answer(99))`. Assert `answers` unchanged.
5. **`reset()` returns to initial state.**
6. **Empty question list:** `renderHook(() => useQuiz([]))` → `currentQuestion === undefined`, `totalQuestions === 0`, `isComplete === false` (because no answer can be given). `answer(0)` is a no-op.

### Green phase — implement

```ts
import { useState, useCallback } from 'react';
import type { ApiQuestion, QuizAnswer } from '@/lib/apiTypes';

export interface UseQuizState {
  currentQuestion: ApiQuestion | undefined;
  questionIndex: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  startTime: number | undefined;
  endTime: number | undefined;
  answer: (positionIndex: number) => void;
  reset: () => void;
}

export function useQuiz(questions: ApiQuestion[]): UseQuizState {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();

  const questionIndex = answers.length;
  const currentQuestion = questions[questionIndex];
  const isComplete = questions.length > 0 && answers.length === questions.length;

  const answer = useCallback((positionIndex: number) => {
    setAnswers(prev => {
      const q = questions[prev.length];
      if (!q) return prev;
      const opt = q.options?.[positionIndex];
      if (!opt) return prev;
      const next = [...prev, { id: q.id, answer: opt.id }];
      if (prev.length === 0) setStartTime(Date.now());
      if (next.length === questions.length) setEndTime(Date.now());
      return next;
    });
  }, [questions]);

  const reset = useCallback(() => {
    setAnswers([]);
    setStartTime(undefined);
    setEndTime(undefined);
  }, []);

  return {
    currentQuestion, questionIndex, totalQuestions: questions.length,
    answers, isComplete, startTime, endTime, answer, reset,
  };
}
```

### Refactor phase

- Confirm zero imports from `@/utils/questions`, `@/utils/scoring`, `@/utils/mbtiResult`.
- Confirm no `Scores`, `applyAnswer`, `calculateType` references remain in this file.
- Confirm `startTime` is stamped inside the `setAnswers` updater, NOT on hook mount (PRD §6.3 open item — see Notes).

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/hooks/useQuiz.test.ts` — all 6 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `grep -n "applyAnswer\|Scores\|initialScores" typestest/src/hooks/useQuiz.ts` — zero hits.

## Done-when

- All 6 tests pass.
- Hook no longer imports anything from `@/utils/questions` or `@/utils/scoring`.
- `startTime` stamped on first `answer()` call, `endTime` on final `answer()` call.
- `reset()` clears all state.

## Notes / ambiguities

- **Work plan Open Items #1 / PRD §6.3:** PRD says "On first question paint, record `startTime = Date.now()`" but this task stamps on first-answer-click. Difference is typically seconds. Pick: **first-click** (simpler; hook owns state; no useEffect timing) to match this implementation. If AC 6 manual verification (Task 15 smoke) shows `start_time` values look off vs. the user's sense of "when the quiz started", revisit and move the stamp into a `useEffect(() => setStartTime(Date.now()), [])` in QuizPage. Do NOT change this task retroactively — log in Module 1 open items and fix in a follow-up.
- Do NOT delete `src/utils/questions.ts` or any scoring helpers in this task. Task 16 handles deletions after all consumers are rewritten.
