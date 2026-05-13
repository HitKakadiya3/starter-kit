# Task 05 — Campaign param capture `src/lib/campaign.ts`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.2
**Size:** Small (2 files)
**Dependencies:** `03-session-accessor.md`

## Purpose / why this task exists

Marketing deep-links carry `?prc_id=...` or `?mdid=...` query params that must be captured into session before any API call and before the user can navigate away from the landing URL. This task also captures `landingUrl` and `landingTime` (needed by the submit body in Task 15) and strips the query string from the address bar so refresh/bookmark behaviour is clean.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.5 Marketing params, §6.1 IntroPage side effects.

## AC coverage

- AC 3 (`prc_id` in URL → submit body).
- AC 4 (`mdid` in URL → submit body).
- AC 5 (both present → `mdid` wins + `console.warn`).

End-to-end verified in Task 15 (EmailCapturePage submit body inspection).

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/campaign.ts`
- `d:/Projects/TestIQ/typestest/src/lib/campaign.test.ts`

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/lib/campaign.test.ts`. Use `jsdom`. In each test, set `window.location` via `Object.defineProperty` (or `history.pushState`) and spy on `history.replaceState`. Cover:

1. **Neither param:** URL `/`. Call `captureCampaignParams()`. Session empty. `history.replaceState` still called (normalises URL to pathname). `landingUrl`/`landingTime` populated.
2. **`prc_id` only:** URL `/?prc_id=ABC`. Call `captureCampaignParams()`. Session has `{ prcId: 'ABC' }`. No warn.
3. **`mdid` only:** URL `/?mdid=50`. Session has `{ mdid: '50' }`. No warn.
4. **Both present:** URL `/?prc_id=ABC&mdid=50`. Session has `{ mdid: '50' }` and NO `prcId`. `console.warn` spy called exactly once with a message containing both param names.
5. **URL stripped:** after any capture, `history.replaceState` was called with `['', '', '/']` (or equivalent `window.location.pathname`).
6. **Landing captured once:** pre-seed session with `{ landingUrl: '/old', landingTime: 123 }`. Call `captureCampaignParams()` on URL `/?prc_id=X`. `landingUrl`/`landingTime` unchanged.
7. **Idempotent on second call:** call twice, second call is a no-op (params already captured and URL already stripped).

### Green phase — implement

```ts
import { getSession, patchSession } from './session';

export function captureCampaignParams(): void {
  const url = new URL(window.location.href);
  const prcId = url.searchParams.get('prc_id') ?? undefined;
  const mdid  = url.searchParams.get('mdid')   ?? undefined;
  const current = getSession();

  const patch: Parameters<typeof patchSession>[0] = {};

  if (prcId && mdid) {
    console.warn('[campaign] both prc_id and mdid present; keeping mdid, dropping prc_id');
    if (!current.mdid) patch.mdid = mdid;
  } else if (mdid && !current.mdid) {
    patch.mdid = mdid;
  } else if (prcId && !current.prcId) {
    patch.prcId = prcId;
  }

  if (!current.landingUrl) patch.landingUrl = window.location.href;
  if (!current.landingTime) patch.landingTime = Date.now();

  if (Object.keys(patch).length > 0) patchSession(patch);

  // Strip query string from the address bar.
  if (url.search) {
    window.history.replaceState({}, '', url.pathname);
  }
}
```

### Refactor phase

- Confirm `landingUrl` captures the full URL (`window.location.href`) BEFORE the stripping, so marketing URLs survive for the submit body.
- Confirm second-call idempotency: once session has `landingUrl` and (prcId | mdid), nothing changes.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/campaign.test.ts` — all 7 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.

## Done-when

- All 7 tests pass.
- Both-params case writes `mdid`, drops `prcId`, emits warn.
- `history.replaceState` is called to strip the query string.
- `landingUrl`/`landingTime` captured on first call only.

## Notes / ambiguities

- PRD §4.5 says "if both present, keep `mdid` and discard `prc_id`". The test for the both-params case is the canonical interpretation of that rule. Do not change without PRD update.
- `landingUrl` is stored BEFORE the query is stripped, so the backend submit body can include the original marketing URL the user arrived on (PRD §6.5 `landing_url_detail.landing_url`).
