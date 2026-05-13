/**
 * Resolves the caller's public IP address via ipify and caches it in session.
 *
 * Called once on app boot (see App.tsx integration in Task 09). The API client
 * injects the cached value as the `ip_address` header on every backend request.
 *
 * Failure is surfaced as a typed result — never thrown — so the caller can
 * show a blocking toast per PRD §4.4 without an Error Boundary trip.
 */

import { getSession, patchSession } from "./session";

export type ResolveIpResult =
  | { ok: true }
  | { ok: false; error: Error };

const IPIFY_URL = "https://api.ipify.org?format=json";

export async function resolveIp(): Promise<ResolveIpResult> {
  if (getSession().ipAddress) return { ok: true };

  try {
    const res = await fetch(IPIFY_URL);
    if (!res.ok) {
      return { ok: false, error: new Error(`ipify HTTP ${res.status}`) };
    }

    const body = (await res.json()) as { ip?: unknown };
    if (typeof body.ip !== "string" || body.ip.length === 0) {
      return { ok: false, error: new Error("ipify response missing ip") };
    }

    patchSession({ ipAddress: body.ip });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}

// Request-gate so concurrent callers share a single in-flight resolution.
let resolveInFlight: Promise<void> | null = null;

/**
 * Await IP resolution before continuing. Safe to call from any number of
 * concurrent callers — they all await the same in-flight `resolveIp` call.
 * Intentionally swallows failure: the caller (api client) will send the
 * `ip_address` header as an empty string if ipify is unreachable, rather
 * than blocking the entire app.
 *
 * Used by `src/lib/api.ts` so that the first real backend request on a
 * fresh session (cleared cookies/storage) is never sent with an empty
 * `ip_address` header — the backend's pricing logic depends on it.
 */
export async function ensureIpResolved(): Promise<void> {
  if (getSession().ipAddress) return;
  if (!resolveInFlight) {
    resolveInFlight = resolveIp().then(() => {
      resolveInFlight = null;
    });
  }
  await resolveInFlight;
}
