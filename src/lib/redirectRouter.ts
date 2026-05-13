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

/**
 * Applies client-side overrides over the backend `redirect_page` enum.
 *
 * The backend's `/questions/results` doesn't advance state until the next
 * state-mutating endpoint succeeds, so it keeps reporting earlier stages
 * (e.g. `CROSS_SELL_OFFER_PAGE`) after the user has already moved past
 * them client-side. Two flags compensate:
 *
 *   - `crossSellResolved`        — set by CrossSellPage on accept or skip.
 *     `CROSS_SELL_OFFER_PAGE` → `CUSTOMER_DETAILS_PAGE`.
 *   - `customerUpdateSubmitted`  — set by DetailsPage on successful PUT.
 *     `CUSTOMER_DETAILS_PAGE`  → `THANK_YOU_PAGE`.
 *
 * The two rules are applied in cascade so that a user who skipped the
 * cross-sale and then completed the details form is forwarded all the way
 * to `THANK_YOU_PAGE` — without this, the override would stop at
 * `CUSTOMER_DETAILS_PAGE` and bounce them back to `/details` after submit.
 *
 * Pure function — takes the session subset it cares about as a parameter
 * so this module stays free of a session-storage import.
 */
export function resolveEffectiveRedirect(
  serverRedirect: string | undefined,
  session: { crossSellResolved?: boolean; customerUpdateSubmitted?: boolean },
): string | undefined {
  let r = serverRedirect;
  if (r === "CROSS_SELL_OFFER_PAGE" && session.crossSellResolved) {
    r = "CUSTOMER_DETAILS_PAGE";
  }
  if (r === "CUSTOMER_DETAILS_PAGE" && session.customerUpdateSubmitted) {
    r = "THANK_YOU_PAGE";
  }
  return r;
}

/**
 * Returns the value to use for the `?qid=` query param when navigating to
 * `route`. Resume-guarded routes (`/checkout`, `/cross-sell`, `/details`)
 * call `/questions/results`, which only accepts the raw integer
 * `quiz_result_id`. Post-purchase pages — `/results` (Thank You) and
 * `/career-report` (cross-sale upsell) — call `customer/thankyou`, which
 * accepts the encrypted id; exposing the encrypted id in the URL avoids
 * leaking the raw db id and lets these pages be opened in a fresh browser.
 */
export function qidParamForRoute(
  route: string,
  rawQid: number | string | null | undefined,
  encryptedQid: string | null | undefined,
): string {
  if (route === "/results" || route === "/career-report") {
    return encodeURIComponent(encryptedQid ?? "");
  }
  return rawQid != null ? String(rawQid) : "";
}
