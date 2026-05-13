# Task 02 — HTTP client `src/lib/api.ts`

**Phase:** 1 · Foundation primitives
**Work plan task id:** 1.2
**Size:** Small (2 files)
**Dependencies:** `01-env-example-and-types.md` (reads `import.meta.env.VITE_*`)

## Purpose / why this task exists

Every API call in every subsequent module goes through this client. It centralises header injection (`Authorization`, `x-host`, `ip_address`, `Content-Type`), envelope unwrapping (`{ meta, data }` → `data`), and error typing (`ApiError` for business failures, `NetworkError` for transport failures). Writing it once here means no page code has to repeat fetch boilerplate or envelope-unwrap logic.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.2 HTTP client.

## AC coverage

- AC 12 (Authorization, x-host, ip_address headers on every API request) — this task is where those headers are added; verified end-to-end in Task 15.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/api.ts`
- `d:/Projects/TestIQ/typestest/src/lib/api.test.ts`

## Backend contract reference

Every response from the backend has the shape:
```
{ meta: { success: boolean, message: string, status: number }, data: T }
```
See `docs/Frontend API List.postman_collection.json` for sample payloads.

## Step-by-step implementation

### Red phase — write failing tests first

Create `typestest/src/lib/api.test.ts`. Tests should use `vi.fn()` to stub global `fetch` and cover:

1. **Headers injected:** `apiGet('foo')` → fetch called with `Authorization: Bearer <token>`, `x-host: <host>`, `ip_address: <ip from session>`, `Content-Type: application/json`.
2. **Empty ip_address still sent:** when session has no `ipAddress`, the header is present with empty string.
3. **Base URL prefix:** `apiGet('questions')` → URL is `${VITE_API_BASE_URL}questions`.
4. **Envelope unwrap:** response `{ meta: { success: true, status: 200, message: 'ok' }, data: { foo: 'bar' } }` → returned value is `{ foo: 'bar' }`.
5. **`meta.success === false` → throws `ApiError`:** thrown error has `.message === meta.message` and `.status === meta.status`.
6. **Network failure → throws `NetworkError`:** when `fetch` rejects (e.g. `Promise.reject(new TypeError('Failed to fetch'))`), an error of class `NetworkError` is thrown.
7. **`apiPost` body serialization:** body is `JSON.stringify`'d; method is `POST`.

To stub session inside tests, import `patchSession`/`clearSession` from `./session` OR mock the session module with `vi.mock('./session', () => ({ getSession: () => ({ ipAddress: '1.2.3.4' }) }))`. **However:** `session.ts` does not yet exist (Task 03 adds it). For this task, implement `api.ts` so it imports `getSession` from `./session`, and in the test file use `vi.mock('./session', ...)` to provide a stub. Task 03 will replace the mock with the real module; tests keep passing.

### Green phase — implement

Create `typestest/src/lib/api.ts`:

```ts
import { getSession } from './session';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

interface Envelope<T> {
  meta: { success: boolean; message: string; status: number };
  data: T;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL;
  const url = `${base}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        'x-host': import.meta.env.VITE_X_HOST,
        ip_address: getSession().ipAddress ?? '',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new NetworkError((e as Error).message);
  }

  let payload: Envelope<T>;
  try {
    payload = await res.json();
  } catch (e) {
    throw new NetworkError('Invalid JSON from server');
  }

  if (!payload.meta?.success) {
    throw new ApiError(payload.meta?.message ?? 'Request failed', payload.meta?.status ?? res.status);
  }
  return payload.data;
}

export const apiGet  = <T>(path: string) => request<T>('GET', path);
export const apiPost = <T>(path: string, body?: unknown) => request<T>('POST', path, body);
export const apiPut  = <T>(path: string, body?: unknown) => request<T>('PUT', path, body);
```

### Refactor phase

- Confirm no retry logic slipped in (PRD explicitly says "No retries in v1").
- Confirm the module has no imports back into any page / hook — it is a leaf.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/api.test.ts` — all tests pass.
- `npm run lint` — no new errors.
- `npx tsc --noEmit` — passes.

## Done-when

- All 7 test cases pass.
- `ApiError`, `NetworkError`, `apiGet`, `apiPost`, `apiPut` are exported.
- No retries exist anywhere in the file.
- `api.ts` does not import anything from `src/pages`, `src/components`, or `src/hooks`.

## Notes / ambiguities

- The `ip_address` header is sent even when empty (work plan Task 1.2 acceptance requires this). When Task 04 (`ip.ts`) resolves ipify and calls `patchSession({ ipAddress })`, subsequent requests pick it up automatically with no change in `api.ts`.
- `session.ts` is introduced in Task 03. This task's test file mocks it; once Task 03 lands, the real module is used and `api.test.ts` still passes unchanged.
