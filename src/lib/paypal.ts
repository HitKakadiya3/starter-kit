/**
 * PayPal Browser SDK loader (singleton per `payment_mode`).
 *
 * Loads `https://www.paypal.com/sdk/js?client-id=...` once per mode via
 * `@paypal/paypal-js`'s `loadScript` helper and reuses the same Promise on
 * subsequent calls so the script tag is never injected twice for the same
 * environment. Resolves to the global `paypal` namespace exposed by the SDK.
 *
 * The publishable client-id is read from `VITE_PAYPAL_CLIENT_ID_LIVE` or
 * `VITE_PAYPAL_CLIENT_ID_SANDBOX` based on the backend's `payment_mode`.
 */

import { loadScript, type PayPalNamespace } from "@paypal/paypal-js";

import type { PaymentMode } from "./stripe";
import { config } from "../config";

/**
 * Currencies PayPal accepts for CAPTURE-intent orders. INR, RON, ZAR and
 * others are intentionally absent — PayPal rejects them with
 * `CURRENCY_NOT_SUPPORTED`. Source:
 * https://developer.paypal.com/docs/integration/direct/rest/currency-codes/
 */
export const PAYPAL_SUPPORTED_CURRENCIES: ReadonlySet<string> = new Set([
  "AUD", "BRL", "CAD", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF",
  "ILS", "JPY", "MXN", "MYR", "NOK", "NZD", "PHP", "PLN", "RUB", "SEK",
  "SGD", "CHF", "THB", "TWD", "USD",
]);

/** True iff PayPal accepts orders priced in the given ISO currency code. */
export function isPayPalCurrencySupported(currencyCode: string | undefined | null): boolean {
  if (!currencyCode) return false;
  return PAYPAL_SUPPORTED_CURRENCIES.has(currencyCode.toUpperCase());
}

const cache: Partial<Record<PaymentMode, Promise<PayPalNamespace>>> = {};

function clientIdFor(mode: PaymentMode): string {
  return mode === "sandbox" ? config.paypalClientIdSandbox : config.paypalClientIdLive;
}

/**
 * Load the PayPal Browser SDK once per `payment_mode` and reuse the same
 * Promise on subsequent calls. Resolves to the global `paypal` namespace.
 *
 * Rejects when the matching `VITE_PAYPAL_CLIENT_ID_{LIVE,SANDBOX}` is
 * missing — the developer must supply it via `.env` before running the app.
 */
export function loadPayPalSdk(
  mode: PaymentMode,
  args?: { currency?: string },
): Promise<PayPalNamespace> {
  const cached = cache[mode];
  if (cached) return cached;
  const clientId = clientIdFor(mode);
  if (!clientId) {
    const envName = "VITE_PAYPAL_CLIENT_ID_LIVE";
    return Promise.reject(new Error(`${envName} is not set`));
  }
  const promise = loadScript({
    // "client-id": clientId,
    clientId: clientId,
    currency: args?.currency ?? "USD",
    intent: "capture",
    components: "buttons",
    vault:true,
    disableFunding:["card,credit,paylater,venmo"]
    // Only the PayPal funding source — never render a separate Card / Credit
    // / Pay Later / Venmo button alongside it. Card is handled by Stripe.
    // "disable-funding": "",
  }).then((paypal) => {
    if (!paypal) throw new Error("PayPal SDK failed to load");
    return paypal;
  });
  cache[mode] = promise;
  // Clear cache on failure so a subsequent call can retry the network load.
  promise.catch(() => {
    if (cache[mode] === promise) delete cache[mode];
  });
  return promise;
}

/** Test-only: reset the cached promises for both modes. */
export function _resetPayPalSdkCache(): void {
  for (const k of Object.keys(cache) as PaymentMode[]) delete cache[k];
}
