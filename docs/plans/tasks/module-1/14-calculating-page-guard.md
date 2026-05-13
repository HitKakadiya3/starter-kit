# Task 14 — `CalculatingPage` state guard

**Phase:** 3 · Quiz funnel rewrites
**Work plan task id:** 3.5
**Size:** Small (1 file)
**Dependencies:** `13-quiz-page-rewrite.md` (produces the new `{ answers, startTime, endTime }` route state this page must accept)

## Purpose / why this task exists

CalculatingPage today reads `location.state.scores` as the entry guard and passes `scores` forward to `/email`. Module 1 replaces `scores` with `{ answers, startTime, endTime }`. This is a minimal, surgical change — the 8-second animation stays, the MBTI-letter flicker animation stays (it's cosmetic and has no real dependency on scoring). Only the guard type and the forwarded state shape change.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §6.4 CalculatingPage.
- `docs/prd/module-1-load-questions.md` §7 Changes to existing code — `CalculatingPage.tsx` row.

## AC coverage

- Contributes to **AC 1** (happy path — state carries through to `/email`).
- No AC is closed exclusively by this task.

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/pages/CalculatingPage.tsx`

**Do NOT touch:**
- The 8-second animation timing.
- The MBTI-letter flicker animation (`allLetters` cycling). Per work plan Task 3.5: "retain the `allLetters` cycling animation for visuals — it doesn't depend on real scoring, it just flickers letters."
- Any other page.

## Step-by-step implementation

1. Open `typestest/src/pages/CalculatingPage.tsx`.

2. Remove the `Scores` import from `@/utils/scoring` (if present). Do NOT delete `scoring.ts` — Task 16 handles that.

3. Type the route state:
   ```ts
   import type { QuizAnswer } from '@/lib/apiTypes';

   interface CalculatingRouteState {
     answers: QuizAnswer[];
     startTime: number;
     endTime: number;
   }

   const location = useLocation();
   const state = location.state as CalculatingRouteState | null;
   ```

4. Swap the guard. Replace any existing check like `if (!state?.scores) navigate('/', { replace: true })` with:
   ```ts
   useEffect(() => {
     if (!state?.answers) {
       navigate('/', { replace: true });
     }
   }, [state, navigate]);
   ```

5. Forward the full state object to `/email` on animation completion:
   ```ts
   // existing setTimeout(..., 8000) block
   navigate('/email', { state, replace: false });
   ```
   Do NOT spread or reshape — pass the exact `state` object through.

6. Keep the `allLetters` flicker animation intact. If it imported `Scores` or any scoring symbol, strip that import (the animation just cycles letters; it does not need real scores).

7. If the MBTI-letter animation currently reads `state.scores` to pick which letters to display, replace with a static rotation of the 8 MBTI letters (E/I/S/N/T/F/J/P) or whatever the current cosmetic fallback is. **Flag in Notes below** if you find such a read; the work plan's expectation is the animation is purely cosmetic.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `npm run build` — succeeds.
- `npm run dev`, then manual:
  1. Direct-navigate to `http://localhost:8080/calculating` (paste URL). App must bounce to `/` immediately.
  2. Full funnel: `/` → `/instructions` → `/quiz` → answer 60 → `/calculating`. Animation plays for ~8s, then `/email` loads. `location.state` on `/email` still has `answers` (verify via React DevTools or a temporary `console.log(state)` at the top of `EmailCapturePage` that you remove before Task 15 commits).
- `grep -n "from '@/utils/scoring'" typestest/src/pages/CalculatingPage.tsx` → zero hits.

## Done-when

- `CalculatingPage` entry guard checks for `state?.answers`, not `state?.scores`.
- Full state object (`{ answers, startTime, endTime }`) is forwarded unchanged to `/email`.
- The letter-flicker animation still runs; the page still idles for ~8s.
- No `Scores` import remains in this file.
- `npx tsc --noEmit` and `npm run build` both pass.

## Notes / ambiguities

- **Work plan Task 3.5 decision (restated):** Retain the `allLetters` cycling animation — it doesn't depend on real scoring. Only the guard and state-passthrough change. If during implementation you find the animation reads `state.scores` or any scoring symbol, strip that read and cycle a static set of MBTI letters instead; flag the finding back to the user so the Module 1 Open Items list can be refreshed.
- No tests are added for this page. The existing codebase has no CalculatingPage tests and the change is mechanical.
- Do not replace the 8s timer with a shorter value during development — the animation duration is part of the UX specified in PRD §6.4 ("Unchanged animation timing (~8 s)").
