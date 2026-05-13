# Task 09 — Wire boot side effects into `App.tsx`

**Phase:** 2 · App-boot side effects
**Work plan task id:** 2.6
**Size:** Small (1 file)
**Dependencies:** `04-ip-resolution.md`, `05-campaign-params.md`

## Purpose / why this task exists

Phase 1 and the earlier Phase 2 tasks built the primitives. Now we actually run them on app boot so that by the time the user clicks "Start Test" on the intro page, the session contains `ipAddress`, `prcId`/`mdid`, `landingUrl`, and `landingTime`. Without this wiring, every submit request would be missing marketing attribution.

## PRD anchor

- `docs/prd/module-1-load-questions.md` §4.4 IP resolution, §4.5 Marketing params, §5 Data flow, §6.1 IntroPage.

## AC coverage

- AC 3 (`prc_id` captured + stripped) — manually verifiable end-to-end after this task.
- AC 4 (`mdid` captured + stripped).
- AC 5 (both present → `mdid` wins + warn).
- AC 12 (`ip_address` header populated by ipify cache).

## Scope

**Modify:**
- `d:/Projects/TestIQ/typestest/src/App.tsx`

## Step-by-step implementation

1. Open `typestest/src/App.tsx`. Read the existing structure first — it currently mounts `<BrowserRouter>`, `<Routes>`, `<Toaster />`, `<Sonner />`, etc.
2. Add imports:
   ```ts
   import { useEffect } from 'react';
   import { toast } from 'sonner';
   import { resolveIp } from '@/lib/ip';
   import { captureCampaignParams } from '@/lib/campaign';
   ```
3. Create a small `<AppBoot />` component (mounted once inside `<BrowserRouter>`, above `<Routes>`) OR a top-level `useEffect` in the existing `App` component. Preferred: a dedicated `<AppBoot />` so the concern is named.

   ```tsx
   function AppBoot() {
     useEffect(() => {
       // Synchronous — must run before any API call and before the user
       // can click "Start Test".
       captureCampaignParams();

       // Async — not blocking page paint, but blocks the funnel if it fails
       // (PRD §4.4: show blocking toast on ipify failure).
       void resolveIp().then((res) => {
         if (!res.ok) {
           toast.error('Could not start the test. Please refresh.');
         }
       });
     }, []);
     return null;
   }
   ```
4. Mount `<AppBoot />` inside `<BrowserRouter>`, above `<Routes>`. Example diff shape:
   ```tsx
   <BrowserRouter>
     <AppBoot />
     <ScrollToTop />
     <Routes>
       ...existing routes...
     </Routes>
   </BrowserRouter>
   ```
5. **Do NOT** change the route definitions, the `QueryClientProvider`, `<Toaster />`, or `<Sonner />` mountings.
6. **Do NOT** mount `useRedirectGuard` anywhere (PRD §4.7).

## Verification commands

Run from `d:/Projects/TestIQ/typestest/`:

- `npm run build` — succeeds.
- `npm run lint` — clean.
- `npx tsc --noEmit` — passes.
- `npm run dev` — dev server boots; open `http://localhost:8080`.

### Manual smoke (required — this is the Phase 2 gate)

1. Visit `http://localhost:8080/?prc_id=ABC`. Open DevTools:
   - Application → Session Storage → `testiq.session` contains `{"prcId":"ABC", ...}`.
   - Address bar shows `http://localhost:8080/` (no query).
   - Network tab shows one request to `api.ipify.org`.
2. Open a new incognito tab, visit `http://localhost:8080/?mdid=50&prc_id=XYZ`:
   - Session has `mdid: "50"`, no `prcId`.
   - Console shows one warn from campaign capture.
3. Close incognito, open a new tab, visit `http://localhost:8080/` with DevTools Network tab blocking `api.ipify.org` (right-click request → Block request URL). Reload:
   - Toast "Could not start the test. Please refresh." appears.
4. Unblock ipify, reload:
   - ipify request fires, session populated with `ipAddress`. Reload again — no second ipify request (cache hit).

## Done-when

- `AppBoot` (or equivalent `useEffect`) runs on every app mount.
- `captureCampaignParams` runs synchronously before `resolveIp` is awaited.
- ipify failure surfaces a `sonner` toast.
- All 4 manual smoke checks pass.
- `npm run build`, `npm run lint`, `npx tsc --noEmit` all clean.

## Notes / ambiguities

- **PRD §10 ipify blocking:** Module 1 picks blocking behavior (show toast, do not silently continue). If QA finds this too aggressive on real networks, revisit — but not in this task.
- Toast copy is placeholder (PRD §10 open items). Use the exact string `"Could not start the test. Please refresh."` per PRD §4.4.
- Do NOT move `QueryClientProvider` or any other provider. Only add `<AppBoot />`.
