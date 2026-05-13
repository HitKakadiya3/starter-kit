# Task 06 — Redirect router `src/lib/redirectRouter.ts`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.3
**Size:** Small (2 files)
**Dependencies:** none

## Purpose / why this task exists

The backend returns a `redirect_page` enum string on quiz-submit and resume-check responses. The frontend maps it to a route. Isolating the map in one module means when a real enum value is observed that doesn't match our assumption, we change one file — no hunting.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.6 `redirect_page` router.

## AC coverage

- AC 10 (`INITIAL_PAYMENT_PAGE` → `/checkout`) — map entry.
- AC 11 (unknown value → `/checkout` + warn) — default branch.

End-to-end verified in Task 15 (submit response → navigation).

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/redirectRouter.ts`
- `d:/Projects/TestIQ/typestest/src/lib/redirectRouter.test.ts`

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/lib/redirectRouter.test.ts`. Cover:

1. **`INITIAL_PAYMENT_PAGE` → `/checkout`.**
2. **`CROSS_SELL_PAGE` → `/cross-sell`.**
3. **`CUSTOMER_DETAILS_PAGE` → `/details`.**
4. **`RESULT_PAGE` → `/results`.**
5. **`THANKYOU_PAGE` → `/results`.**
6. **`undefined` → `/checkout`.**
7. **`''` (empty string) → `/checkout`.**
8. **Unknown string (e.g. `'BANANA'`) → `/checkout` AND `console.warn` called once with a message referencing the unknown value.**

### Green phase — implement

```ts
export const REDIRECT_TO_ROUTE: Record<string, string> = {
  INITIAL_PAYMENT_PAGE:  '/checkout',
  CROSS_SELL_PAGE:       '/cross-sell',
  CUSTOMER_DETAILS_PAGE: '/details',
  RESULT_PAGE:           '/results',
  THANKYOU_PAGE:         '/results',
};

export function resolveRedirect(page: string | undefined): string {
  if (!page) return '/checkout';
  const mapped = REDIRECT_TO_ROUTE[page];
  if (!mapped) {
    console.warn(`[redirectRouter] unknown redirect_page: "${page}"; defaulting to /checkout`);
    return '/checkout';
  }
  return mapped;
}
```

### Refactor phase

- Confirm the module has zero runtime imports (pure data + one function).
- Confirm the default branch logs a warn — fail-loud per `ai-development-guide`.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/redirectRouter.test.ts` — all 8 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.

## Done-when

- All 8 tests pass.
- `REDIRECT_TO_ROUTE` exported as a `Record<string, string>`.
- `resolveRedirect(undefined)` and `resolveRedirect('unknown')` both return `'/checkout'`; the latter also warns.

## Notes / ambiguities

- **Work plan Open Items #6 / Scope Assumption #8:** The enum values beyond `INITIAL_PAYMENT_PAGE` (`CROSS_SELL_PAGE`, `CUSTOMER_DETAILS_PAGE`, `RESULT_PAGE`, `THANKYOU_PAGE`) are best-guess strings. When a real response is observed that doesn't match, update this one file and the Task 15 smoke test notes.
- PRD §4.6 explicitly says "Unknown values log a warning and fall through to `/checkout` as a safe default" — do NOT add a different fallback like `/` or `/error`.
