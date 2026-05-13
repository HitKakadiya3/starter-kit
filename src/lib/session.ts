/**
 * Typed accessor over sessionStorage under a single key.
 *
 * The funnel persists progress here so a page refresh (same tab) retains
 * quiz result ids, captured email, pricing info, and marketing params.
 * Callers must go through these three functions — never touch the raw key.
 *
 * `localStorage['user_gender']` is deliberately NOT read or written from
 * this module; InstructionsPage continues to own that key (PRD §4.3).
 */

import type { PricingInfo } from "./apiTypes";

export interface FunnelSession {
  qidRaw?: number;
  qidEncrypted?: string;
  email?: string;
  gender?: "male" | "female";
  ipAddress?: string;
  pricingInfo?: PricingInfo;
  /**
   * Cached Stripe PaymentIntent for the current `(qidRaw, prcId, mdid)` tuple
   * (PRD §4.3). `usePaymentIntent` writes this on creation and clears it on
   * successful backend confirm. Reused across refreshes up to 23h; reuse
   * requires the `keyedBy` tuple to still match.
   */
  paymentIntent?: {
    id: string;
    clientSecret: string;
    keyedBy: {
      qidRaw: number;
      prcId: string;
      mdid: string;
      /** Which payment method the intent was created for (`card`, `paypal`,
       *  `google_pay`, …). Caching is keyed by method too so a user who
       *  switches buttons gets a fresh intent with the right type. */
      methodType: string;
    };
    createdAt: number;
  };
  prcId?: string;
  mdid?: string;
  landingUrl?: string;
  landingTime?: number;
  /**
   * Set to `true` by CrossSellPage after the user has either accepted or
   * skipped the cross-sale offer. Consumed by `useRedirectGuard` via
   * `resolveEffectiveRedirect` to avoid a resume loop — the backend keeps
   * returning `redirect_page: CROSS_SELL_OFFER_PAGE` until the next
   * state-advancing action completes (PUT /customer/update), so without
   * this flag a post-skip or post-accept refresh would bounce back to
   * `/cross-sell`. Both skip and accept route forward to `/details`; there
   * is no separate skip-specific navigation.
   */
  crossSellResolved?: boolean;
  /**
   * Set to `true` by DetailsPage after `PUT /customer/update` succeeds. The
   * backend's `/questions/results` keeps reporting `CUSTOMER_DETAILS_PAGE`
   * even after a successful update, so the guard uses this flag to route
   * a refreshed `/results` correctly instead of bouncing back to `/details`.
   */
  customerUpdateSubmitted?: boolean;
}

const KEY = "testiq.session";

export function getSession(): FunnelSession {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[session] invalid JSON in sessionStorage; returning empty");
    return {};
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as FunnelSession;
  }
  return {};
}

export function patchSession(partial: Partial<FunnelSession>): void {
  const next: FunnelSession = { ...getSession(), ...partial };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY);
}
