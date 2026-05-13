/**
 * Forwards marketing deep-link params (`prc_id`, `mdid`) from the current
 * URL onto a destination URL. Every internal `navigate()` call in the
 * funnel goes through this so a user who arrived with a discount code
 * keeps seeing that code all the way through /checkout / /cross-sell /
 * /details / /results — even though those pages use their own `?qid=…`
 * parameter.
 *
 * URL is the source of truth for promo params (see `./campaign`). This
 * helper reads from `window.location.search` so that any navigation
 * preserves whatever's currently in the address bar.
 */

export function withPromoParams(url: string): string {
  const params = new URLSearchParams(window.location.search);
  const prcId = params.get("prc_id");
  const mdid = params.get("mdid");

  const extras: string[] = [];
  if (prcId) extras.push(`prc_id=${encodeURIComponent(prcId)}`);
  if (mdid) extras.push(`mdid=${encodeURIComponent(mdid)}`);
  if (extras.length === 0) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${extras.join("&")}`;
}
