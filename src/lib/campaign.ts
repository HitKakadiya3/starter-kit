/**
 * Sync marketing deep-link params (`prc_id`, `mdid`) from the URL into the
 * funnel session. The URL is the source of truth — every navigation re-runs
 * this so that a user who arrives without `?mdid=...` never sees a stale
 * discount from an earlier session.
 *
 * Contract:
 *  - `session.prcId` / `session.mdid` mirror the current URL. Absent from URL
 *    → cleared from session.
 *  - Both `prc_id` and `mdid` may be present simultaneously — backend accepts
 *    them together and we forward both on every API call that takes them.
 *  - `landingUrl` and `landingTime` are captured on the very first call and
 *    never overwritten — those record the original entry, not the current URL.
 *  - The URL is **not** mutated. Consumers preserve `prc_id` / `mdid` on every
 *    internal navigation via `withPromoParams` (see `./promoUrl`).
 */

import { getSession, patchSession } from "./session";

export function captureCampaignParams(): void {
  const url = new URL(window.location.href);
  const urlPrc = url.searchParams.get("prc_id");
  const urlMdid = url.searchParams.get("mdid");
  const current = getSession();

  const patch: Parameters<typeof patchSession>[0] = {
    // Always write, even when undefined, so a navigation without promo params
    // clears any earlier session value. URL is the source of truth.
    prcId: urlPrc ?? undefined,
    mdid: urlMdid ?? undefined,
  };

  if (!current.landingUrl) patch.landingUrl = window.location.href;
  if (!current.landingTime) patch.landingTime = Date.now();

  patchSession(patch);
}
