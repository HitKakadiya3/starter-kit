/**
 * Stripe SDK singleton + key/mode guard (PRD §4.1, §4.2).
 *
 * `loadStripe` is invoked once at module scope per Stripe's guidance, so the
 * returned `stripePromise` is the memoised handle shared across components
 * (the `<Elements>` provider on CheckoutPage in Module 3 task 05).
 *
 * The real `pk_test_…` / `pk_live_…` value is supplied by each developer in
 * their untracked `.env.local`; `.env.example` only carries the key name.
 */

import { loadStripe, type Stripe } from "@stripe/stripe-js";

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise: Promise<Stripe | null> = loadStripe(pk);

/**
 * Asserts the published Stripe key's test/live prefix matches the backend's
 * `payment_mode` so a live key can't silently charge against a sandbox
 * backend (or vice versa). Logs in all builds; throws only in dev to prevent
 * the classic "prod key with sandbox backend" footgun without bricking prod
 * on transient misconfig (PRD §4.1).
 */
export function assertKeyMatchesMode(mode: "sandbox" | "live"): void {
  // Coerce: `pk` may be undefined when `.env.local` is missing the entry.
  // `undefined.startsWith(...)` would throw; an empty string is treated the
  // same as undefined (non-test prefix → mismatch for sandbox mode).
  const isTest = typeof pk === "string" && pk.startsWith("pk_test_");
  const expectedTest = mode === "sandbox";
  if (isTest !== expectedTest) {
    console.error(
      `[stripe] key mode mismatch: key is ${isTest ? "test" : "live"}, backend is ${mode}`,
    );
    if (import.meta.env.DEV) {
      throw new Error("Stripe key / backend payment_mode mismatch");
    }
  }
}
