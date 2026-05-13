/**
 * Maps the backend `redirect_page` enum string onto a frontend route.
 *
 * Enum values confirmed against the dev backend:
 *   INITIAL_PAYMENT_PAGE   → /checkout       (pre-first-sale)
 *   CROSS_SELL_OFFER_PAGE  → /cross-sell     (after first-sale confirm)
 *   CUSTOMER_DETAILS_PAGE  → /details        (after cross-sale decision)
 *   THANK_YOU_PAGE         → /results        (terminal success)
 *   PAYMENT_FAILED_PAGE    → /checkout       (back to checkout to retry)
 *
 * Unknown values (including `undefined` / empty string) fall through to
 * `/checkout` as a safe default. Unknown non-empty values also emit a
 * `console.warn` so that new enum members surface loudly rather than
 * silently deadrouting users.
 */

export const REDIRECT_TO_ROUTE: Record<string, string> = {
  INITIAL_PAYMENT_PAGE: "/checkout",
  CROSS_SELL_OFFER_PAGE: "/cross-sell",
  CUSTOMER_DETAILS_PAGE: "/details",
  THANK_YOU_PAGE: "/results",
  PAYMENT_FAILED_PAGE: "/checkout",
};

export function resolveRedirect(page: string | undefined): string {
  if (!page) return "/checkout";
  const mapped = REDIRECT_TO_ROUTE[page];
  if (!mapped) {
    console.warn(
      `[redirectRouter] unknown redirect_page: "${page}"; defaulting to /checkout`,
    );
    return "/checkout";
  }
  return mapped;
}
