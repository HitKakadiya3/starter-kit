# Task 08 — Resume guard `src/hooks/useRedirectGuard.ts`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.5
**Size:** Small (2 files)
**Dependencies:** `02-api-client.md`, `03-session-accessor.md`, `06-redirect-router.md`

## Purpose / why this task exists

Every post-submit page (starting in Module 2) needs to verify on mount that the `qid` in the URL matches a session the backend knows about, and that the backend says the user belongs on this page. This task ships the hook and its unit tests; **no production code consumes it in Module 1** (PRD §4.7 explicit). Shipping it now means Module 2's CheckoutPage is a one-line `const ready = useRedirectGuard('/checkout')` change instead of a hook + consumer in the same commit.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.7 Resume guard.

## AC coverage

No Module 1 AC directly. The hook is a prerequisite for Module 2.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/hooks/useRedirectGuard.ts`
- `d:/Projects/TestIQ/typestest/src/hooks/useRedirectGuard.test.tsx`

**Do NOT modify:**
- Any page file. The hook must not be mounted anywhere in Module 1.

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/hooks/useRedirectGuard.test.tsx`. Use `@testing-library/react` + `MemoryRouter`. Mock `@/lib/api` (`apiPost`) and `@/lib/session` (`getSession`, `patchSession`). Cover four branches:

1. **No qid in URL and no qidEncrypted in session** → `navigate('/', { replace: true })` is called; `apiPost` is NOT called; `ready === false`.
2. **Success + matching route:** URL has `?qid=ENC123`; `apiPost` resolves with `{ quiz_result_id: 42, encrypted_quiz_result_id: 'ENC123', email: 'a@b.co', pricing_info: {...}, redirect_page: 'INITIAL_PAYMENT_PAGE' }`; caller passes `currentRoute: '/checkout'`. Assert `patchSession` called with `{ qidRaw: 42, qidEncrypted: 'ENC123', email: 'a@b.co', pricingInfo: {...} }`; navigate NOT called; `ready === true` eventually.
3. **Success + mismatched route:** same response but caller passes `currentRoute: '/cross-sell'`. Assert `navigate('/checkout?qid=ENC123', { replace: true })` called.
4. **API failure:** `apiPost` rejects. Assert `navigate('/', { replace: true })` called; `ready === false`.

Rendering pattern:
```tsx
function Probe({ route }: { route: string }) {
  const ready = useRedirectGuard(route);
  return <div data-testid="ready">{String(ready)}</div>;
}
// render inside <MemoryRouter initialEntries={['/checkout?qid=ENC123']}>
```

### Green phase — implement

Follow PRD §4.7 verbatim:

```ts
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiPost } from '@/lib/api';
import { getSession, patchSession } from '@/lib/session';
import { resolveRedirect } from '@/lib/redirectRouter';

interface QuizResultResponse {
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
  email?: string;
  pricing_info?: unknown;
  redirect_page?: string;
}

export function useRedirectGuard(currentRoute: string): boolean {
  const [qid] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const encryptedQid = qid.get('qid') ?? getSession().qidEncrypted;
    if (!encryptedQid) {
      navigate('/', { replace: true });
      return;
    }

    apiPost<QuizResultResponse>('questions/results', {
      quiz_result_id: getSession().qidRaw ?? encryptedQid,
      prc_id: getSession().prcId ?? '',
      pricing_discount: getSession().mdid ? { mdid: getSession().mdid } : '',
    })
      .then((data) => {
        patchSession({
          qidRaw: data.quiz_result_id,
          qidEncrypted: data.encrypted_quiz_result_id,
          email: data.email,
          pricingInfo: data.pricing_info,
        });
        const expected = resolveRedirect(data.redirect_page);
        if (expected !== currentRoute) {
          navigate(`${expected}?qid=${data.encrypted_quiz_result_id}`, { replace: true });
        } else {
          setReady(true);
        }
      })
      .catch(() => navigate('/', { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
```

### Refactor phase

- Confirm effect runs once (empty dep array).
- Confirm the four branches are exactly the four that the test suite covers.
- Confirm no production code imports this hook (`grep -r "useRedirectGuard" typestest/src --exclude-dir=hooks` should return zero hits).

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/hooks/useRedirectGuard.test.tsx` — all 4 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.
- `grep -rn "useRedirectGuard" typestest/src` — only matches the hook file and its test file. NO page or other hook imports it.

## Done-when

- All 4 test branches pass.
- Hook is NOT mounted in any page.
- `npm run build` succeeds.

## Notes / ambiguities

- **Work plan Open Items #7 / Scope Assumption A5:** `getSession().qidRaw ?? encryptedQid` — if the backend rejects the encrypted id as a fallback for `quiz_result_id`, we revisit in Module 2 when the first consumer exists. Do not "fix" this in Module 1.
- Do NOT add a consumer. PRD §4.7 is explicit: "In Module 1, we implement and unit-test this hook but do not mount it anywhere yet — first consumer is CheckoutPage in Module 2."
