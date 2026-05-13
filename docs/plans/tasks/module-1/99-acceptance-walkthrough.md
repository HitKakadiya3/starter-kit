# Task 99 — Acceptance walkthrough + final QA sweep

**Phase:** 4 · Cleanup + Quality Assurance
**Work plan task id:** 4.2
**Size:** N/A (verification only — no code)
**Dependencies:** `16-delete-dead-code.md` (all implementation tasks 01–16 must be committed before this sweep runs)

> **This file is a MANUAL CHECKLIST, not a task-executor task.**
> The automated task-executor should NOT pick this up. It exists to give a human (PR author + reviewer) a single walkthrough page for closing the Module 1 acceptance contract defined in PRD §8. The output of this walkthrough is a signed-off checklist attached to the Module 1 PR description, not a commit.

## Purpose / why this task exists

PRD §8 defines 14 acceptance criteria. Each one is claimed by one or more implementation tasks, but the contract is only considered closed when all 14 are observed holistically against a single running build. This walkthrough is that observation. It doubles as the handoff artifact from Module 1 to Module 2.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §8 Acceptance criteria (all 14).
- `docs/prd/module-1-load-questions.md` §9 Risks & assumptions (to flag anything observed that invalidates an assumption).
- `docs/prd/module-1-load-questions.md` §10 Open items (to be refreshed with anything new).

## AC coverage

All 14 PRD §8 ACs — this is the closure sweep.

## Scope

**Files touched:** none. This is a verification-only checklist.

**Artifacts produced:**
- A completed copy of the checklist below, pasted into the Module 1 PR description or into `docs/plans/module-1-load-questions.md` under "Progress Tracking · Phase 4 · Notes".
- A refreshed Open Items list if any item was resolved or new ones surfaced.

## Pre-walkthrough setup

1. Confirm all implementation tasks (01–16) have landed on the branch. Run:
   - `git log --oneline` and confirm commits for every task file in this directory.
2. From `d:/Projects/TestIQ/typestest/`:
   - `npm install` (fresh).
   - Confirm real `.env` is populated with live `VITE_API_TOKEN` and `VITE_X_HOST` (the one obtained as prereq for Task 01).
   - `npm run lint` — zero errors.
   - `npx tsc --noEmit` — zero errors.
   - `npm run test` — all unit tests pass (`api.test.ts`, `session.test.ts`, `ip.test.ts`, `campaign.test.ts`, `redirectRouter.test.ts`, `deviceInfo.test.ts`, `useRedirectGuard.test.tsx`, `useQuiz.test.ts`).
   - `npm run build` — succeeds.
3. Open `http://localhost:8080/` in a fresh incognito window with DevTools → Network and Application (sessionStorage / localStorage) panes visible.

## Acceptance checklist (PRD §8)

| # | AC | How to verify | Closed by task | Result |
|---|---|---|---|---|
| 1 | Happy path → `/checkout?qid=<encrypted>` with session populated | Fresh incognito → `/` → "Start Test" → `/instructions` → pick gender → `/quiz` → answer 60 → `/calculating` (8s) → `/email` → valid email → arrives at `/checkout?qid=<encrypted>`. sessionStorage `testiq.session` contains `qidRaw`, `qidEncrypted`, `email`, `pricingInfo`. | 15 (3.6) | ☐ |
| 2 | Different question order on second run | Take the test a second time in the same session. Note the first question of run 1 vs. run 2 — text differs. | 13 (3.4) | ☐ |
| 3 | `?prc_id=ABC` persists through session + submit body | Fresh incognito at `/?prc_id=ABC`. After landing, sessionStorage has `prcId: "ABC"` and URL bar is `/` (no query). Complete the funnel; DevTools shows `POST /questions/submit` with `prc_id: "ABC"`. | 05 (2.2), 15 (3.6) | ☐ |
| 4 | `?mdid=50` → `pricing_discount: { mdid: "50" }` | Repeat the above starting at `/?mdid=50`. sessionStorage has `mdid: "50"`; submit body shows `pricing_discount: { mdid: "50" }` and `prc_id: ""`. | 05 (2.2), 15 (3.6) | ☐ |
| 5 | Both params → `mdid` wins + warn | Fresh incognito at `/?prc_id=X&mdid=50`. Console shows the warn message. sessionStorage has `mdid: "50"` and NO `prcId`. URL bar is `/`. | 05 (2.2) | ☐ |
| 6 | `start_time` / `end_time` bracket the quiz | Inspect the submit request body. `start_time` ≈ ms epoch of first answer click; `end_time` ≈ ms epoch of final answer click. Both integers; `end_time > start_time`; difference is plausible (>> 0). | 11 (3.2) | ☐ |
| 7 | `/questions` failure → retry card, no local-questions fallback | In DevTools Network, right-click any `GET /questions…` request → Block request URL. Refresh `/quiz`. Error card with a Retry button renders. Click Retry with the block still on — card persists. Unblock and click Retry — questions load. No local questions ever rendered. | 13 (3.4) | ☐ |
| 8 | `/questions/submit` failure → toast, email retained | With `/questions/submit` blocked, enter email, submit. Toast appears. Email input still shows the typed value. Button re-enables. | 15 (3.6) | ☐ |
| 9 | Empty email blocked client-side | On `/email`, leave the input empty, click submit. Browser's native required-field validation blocks. No network request fires. | 15 (3.6) | ☐ |
| 10 | `INITIAL_PAYMENT_PAGE` → `/checkout` | Happy path from AC 1 — if `redirect_page === 'INITIAL_PAYMENT_PAGE'` in the response, URL ends at `/checkout?qid=…`. | 06 (2.3), 15 (3.6) | ☐ |
| 11 | Unknown `redirect_page` → `/checkout` + warn | Unit test in `redirectRouter.test.ts` covers unknown value. Manual verification is opportunistic — only observable if backend returns a non-`INITIAL_PAYMENT_PAGE` value. If not observable, note "unit-test verified only" and move on. | 06 (2.3) | ☐ |
| 12 | `Authorization`, `x-host`, `ip_address` headers on every API request | DevTools Network → inspect `GET /questions`, `POST /questions/submit`. All three headers present on both. `Authorization` begins `Bearer `, `x-host` matches `VITE_X_HOST`, `ip_address` is a public IPv4 (or empty string if ipify failed — flag in Notes if empty). | 02 (1.2) | ☐ |
| 13 | Session survives single-tab refresh on `/email` | Complete funnel once so session is populated. Navigate manually back to `/email` (or trigger via an unfinished run). Press F5. `sessionStorage['testiq.session']` still has `qidRaw`, `qidEncrypted`, `email`, `pricingInfo`. Note Module 1 does NOT yet route based on session — that's Module 2. | 03 (1.3), 15 (3.6) | ☐ |
| 14 | `user_device_info` reflects current browser | DevTools → device mode → choose "iPhone 14 Pro" (or any iOS profile). Hard refresh. Run funnel. Submit body shows `user_device: "Mobile"`, `user_os: "iOS"`. Switch back to "Desktop" profile (or close device mode), hard refresh, run again. Body shows `user_device: "Desktop"`, `user_os` matches actual host OS. | 07 (2.4), 15 (3.6) | ☐ |

## Quality gates (all must be green)

- ☐ `npm run lint` — zero errors.
- ☐ `npx tsc --noEmit` — zero errors.
- ☐ `npm run test` — all unit tests pass.
- ☐ `npm run build` — succeeds.

## Post-walkthrough

1. Paste the completed checklist into the Module 1 PR description.
2. Refresh the Open Items list in `docs/plans/module-1-load-questions.md` based on what this walkthrough observed:
   - If Open Item #1 (startTime stamping) was observed to produce odd values, note for follow-up.
   - If Open Item #2 (ScaleSelector position ordering) was verified against a real response, close it.
   - If Open Item #6 (unknown `redirect_page` enum values) surfaced real values, note them for Module 2.
   - Add anything new.
3. Obtain user review approval per work plan Phase 4 completion criteria.

## Done-when (for the human running this sweep)

- All 14 AC rows in the table above marked ☑.
- All 4 quality gates green.
- Open Items list refreshed.
- User review approval obtained on the PR.

## Notes / ambiguities

- **This is a manual checklist — the task-executor should not pick it up.** It is intentionally numbered `99-` to sit outside the executor's numeric sequence. If the executor does attempt to run it, the first instruction is "no code — verification only".
- **AC 11 is only opportunistically manually verifiable.** If the backend never returns an unknown `redirect_page` during the sweep, the unit-test coverage from Task 06 is the closure artifact — mark the row as "unit-test verified only" and move on.
- **AC 13 does not require route-based resume.** Module 1 stops at session persistence. Route-based resume is Module 2's `useRedirectGuard` integration (Task 08 unit-tests the hook but it is not mounted).
- **Open Items #5 (ipify blocking) and #7 (`/questions/results` body shape):** cannot be finalized in Module 1. Leave as open.
