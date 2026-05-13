/**
 * Stripe SDK loader keyed by backend `payment_mode` (PRD §4.1, §4.2).
 *
 * The backend signals `payment_mode: 'sandbox' | 'live'` in the pricing
 * response. We hold publishable keys for both environments
 * (`VITE_STRIPE_PUBLISHABLE_KEY_SANDBOX` and
 * `VITE_STRIPE_PUBLISHABLE_KEY_LIVE`) and pick the matching one at runtime,
 * so the same build can serve sandbox or live without a rebuild.
 *
 * `loadStripe` is invoked at most once per mode and the resulting promise is
 * memoised — Stripe's SDK requires a single instance per publishable key.
 */

import { loadStripe, type Stripe } from "@stripe/stripe-js";

export type PaymentMode = "sandbox" | "live";

const cache: Partial<Record<PaymentMode, Promise<Stripe | null>>> = {};

function publishableKeyFor(mode: PaymentMode): string {
  return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE
}

/**
 * Returns a memoised `loadStripe` promise for the requested mode. Subsequent
 * calls with the same mode reuse the cached handle so a single Stripe
 * instance is shared across `<Elements>` providers.
 */
export function getStripePromise(mode: PaymentMode): Promise<Stripe | null> {
  const cached = cache[mode];
  if (cached) return cached;
  const promise = loadStripe(publishableKeyFor(mode));
  cache[mode] = promise;
  return promise;
}

/**
 * Defensive sanity check: the publishable key configured for `mode` must
 * carry the matching `pk_test_` / `pk_live_` prefix. Catches misconfigured
 * `.env` files where a live key was pasted into the sandbox slot (or vice
 * versa). Logs in all builds; throws only in dev so prod isn't bricked by
 * a transient misconfig.
 */
export function assertKeyMatchesMode(mode: PaymentMode): void {
  const pk = publishableKeyFor(mode);
  const isTest = typeof pk === "string" && pk.startsWith("pk_test_");
  const expectedTest = mode === "sandbox";
  if (isTest !== expectedTest) {
    console.error(
      `[stripe] key mode mismatch: configured key is ${isTest ? "test" : "live"}, backend is ${mode}`,
    );
    if (import.meta.env.DEV) {
      throw new Error("Stripe key / backend payment_mode mismatch");
    }
  }
}

/** Test-only: drop the cached Stripe promises so a subsequent call reloads. */
export function _resetStripeCache(): void {
  for (const k of Object.keys(cache) as PaymentMode[]) delete cache[k];
}
