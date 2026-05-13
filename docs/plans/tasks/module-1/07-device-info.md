# Task 07 — Device info `src/lib/deviceInfo.ts`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.4
**Size:** Small (2 files)
**Dependencies:** none

## Purpose / why this task exists

The `/questions/submit` request body includes `user_device_info` (device / OS / browser strings). A lightweight UA-regex helper keeps this as a single pure function with no new dependency. Swappable for `ua-parser-js` in a later cleanup if heuristics prove unreliable.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.8 Device info.

## AC coverage

- AC 14 (`user_device_info` reflects current browser) — this function produces the value; verified end-to-end in Task 15.

## Scope

**Add:**
- `d:/Projects/TestIQ/typestest/src/lib/deviceInfo.ts`
- `d:/Projects/TestIQ/typestest/src/lib/deviceInfo.test.ts`

## Step-by-step implementation

### Red phase — write failing tests

`typestest/src/lib/deviceInfo.test.ts`. Make the implementation accept an optional `ua` argument for testability (defaults to `navigator.userAgent`). Cover at minimum:

1. **Mobile Chrome on Android** → `{ user_device: 'Mobile', user_os: 'Android', user_browser: 'Chrome' }`.
2. **iPhone Safari** → `{ user_device: 'Mobile', user_os: 'iOS', user_browser: 'Safari' }`.
3. **Desktop Chrome on Windows** → `{ user_device: 'Desktop', user_os: 'Windows', user_browser: 'Chrome' }`.
4. **Desktop Chrome on macOS** → `{ user_device: 'Desktop', user_os: 'MacOS', user_browser: 'Chrome' }`.
5. **Edge on Windows** (UA contains `Edg/`) → `{ user_os: 'Windows', user_browser: 'Edge' }`.
6. **Firefox on Windows** → `{ user_browser: 'Firefox' }`.
7. **Unknown UA (empty string)** → `{ user_device: 'Desktop', user_os: 'Other', user_browser: 'Other' }`.

Sample UA strings to use:

- Android Chrome: `Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36`
- iPhone Safari: `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1`
- Windows Chrome: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- macOS Chrome: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- Windows Edge: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0`
- Windows Firefox: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0`

### Green phase — implement

Use the exact regex order from PRD §4.8:

```ts
export interface DeviceInfo {
  user_device: 'Mobile' | 'Desktop';
  user_os: 'Windows' | 'MacOS' | 'Android' | 'iOS' | 'Other';
  user_browser: 'Edge' | 'Chrome' | 'Firefox' | 'Safari' | 'Other';
}

export function getDeviceInfo(ua: string = navigator.userAgent): DeviceInfo {
  return {
    user_device: /Mobi|Android/i.test(ua) ? 'Mobile' : 'Desktop',
    user_os:
      /Windows/.test(ua) ? 'Windows'
      : /Macintosh/.test(ua) ? 'MacOS'
      : /Android/.test(ua) ? 'Android'
      : /iPhone|iPad/.test(ua) ? 'iOS'
      : 'Other',
    user_browser:
      /Edg\//.test(ua) ? 'Edge'
      : /Chrome\//.test(ua) ? 'Chrome'
      : /Firefox\//.test(ua) ? 'Firefox'
      : /Safari\//.test(ua) ? 'Safari'
      : 'Other',
  };
}
```

**Order matters:** `Edge` before `Chrome` (Edge UA contains `Chrome/`). `iOS` regex uses `iPhone|iPad`. `Android` OS check comes before `Other`.

### Refactor phase

- Confirm function is pure (no side effects, no globals read except default `navigator.userAgent`).
- Confirm no `ua-parser-js` or other new dep is imported.

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npx vitest run src/lib/deviceInfo.test.ts` — all 7 tests pass.
- `npx tsc --noEmit` — passes.
- `npm run lint` — clean.

## Done-when

- All 7 tests pass.
- Function is pure; accepts optional UA override for testability.
- Edge detected as `Edge`, not `Chrome`.
- iOS detected as `iOS`, not `Other`.

## Notes / ambiguities

- PRD §4.8 says "If heuristics grow unreliable, swap for `ua-parser-js` in a later cleanup." Module 1 does NOT add that dep (see work plan Dependencies Summary).
