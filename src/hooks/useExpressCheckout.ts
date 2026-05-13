/**
 * Thin pure adapter for Stripe's Express Checkout Element (ECE).
 *
 * Wires `pricing` → ECE button options + glue for the consumer-supplied
 * `onConfirm` callback. The returned `eceProps` is spread directly onto
 * `<ExpressCheckoutElement>` inside a hoisted `<Elements>` provider; Stripe
 * is read implicitly by `<ExpressCheckoutElement>` via React context.
 *
 * Design Doc: `docs/design/module-3-stripe-wallets-ece.md` §Module / hook
 * contracts → `useExpressCheckout(options)` contract table.
 *
 * KDD-4 (architectural guard): this hook does NOT own a Stripe instance.
 *   - No `import { stripePromise } from '@/lib/stripe'`.
 *   - No `loadStripe(...)` call, no `useEffect` for SDK loading.
 *   - No `available` tri-state, no imperative `show()` handle.
 *
 * Suppression sentinel: when `pricing === undefined` the hook returns
 * `{ eceProps: undefined, ready: false }` so the consumer can skip rendering
 * `<ExpressCheckoutElement>` entirely (`eceProps && <ExpressCheckoutElement
 * {...eceProps} />`).
 */

import type {
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";
import { useCallback, useMemo, useState } from "react";

import type { PricingWithMode } from "@/components/checkout/CheckoutForm";

/** Stripe-default button-type mix across supported wallets. R-D3 / DD-OQ-1
 *  defer marketing tuning; the values below are Stripe's documented
 *  defaults for a "buy now" intent. */
const DEFAULT_BUTTON_TYPE: NonNullable<
  StripeExpressCheckoutElementOptions["buttonType"]
> = {
  applePay: "buy",
  googlePay: "buy",
  paypal: "buynow",
};

/** Stripe-default theme mix. */
const DEFAULT_BUTTON_THEME: NonNullable<
  StripeExpressCheckoutElementOptions["buttonTheme"]
> = {
  applePay: "black",
  googlePay: "black",
  paypal: "gold",
};

/** Maximum button height Stripe's ECE accepts — chosen so the wallet slot
 *  visually matches the 56px PayPal slot in `CheckoutForm`. Stripe's ECE
 *  validator requires `buttonHeight ∈ [40, 55]`; values outside that range
 *  throw an IntegrationError at element creation. Visual disable when
 *  consent is unsatisfied is handled by the consumer wrapping ECE in an
 *  `aria-disabled` div with `pointer-events: none` (mirrors the PayPal
 *  slot's pattern). */
const DEFAULT_BUTTON_HEIGHT = 55;

/** Border radius (px) chosen to match the existing PayPal slot's
 *  `borderRadius: calc(var(--radius) + 4px)` with `--radius: 0.75rem`
 *  (12px) → 16px. Tunable per marketing review (R-D3 / DD-OQ-1). */
const DEFAULT_BUTTON_BORDER_RADIUS = 16;

/** Restrict ECE to Apple Pay + Google Pay only. Other wallets that ECE
 *  surfaces by default (Link, Amazon Pay, PayPal-via-ECE) are hidden:
 *    - PayPal has its own native-SDK slot in CheckoutForm (out of scope
 *      for this slice — the design doc keeps it on `@paypal/paypal-js`).
 *    - Link is a Stripe-managed email-and-card flow not in PRD scope.
 *    - Amazon Pay is not in PRD scope.
 *  `'never'` removes a wallet from the slot even when the buyer's
 *  environment supports it; `'always'` is the closest signal we can
 *  give to "show this if at all possible" — Stripe still suppresses the
 *  button when the buyer's browser/device cannot use the wallet
 *  (e.g. Apple Pay only ever renders on Safari with a configured wallet;
 *  Google Pay needs Chrome/Edge with a saved card). When neither GPay
 *  nor Apple Pay is available, ECE renders nothing — the consumer's
 *  suppression-sentinel handling and the `aria-disabled` wrapper still
 *  apply, but no wallet button is shown. */
const DEFAULT_PAYMENT_METHODS: NonNullable<
  StripeExpressCheckoutElementOptions["paymentMethods"]
> = {
  applePay: "always",
  googlePay: "always",
  link: "never",
  amazonPay: "never",
  paypal: "never",
  klarna: "never",
};

/** One wallet button per row, no row limit. The wallet slot in
 *  `CheckoutForm` sits between the consent gate and the PayPal slot, so
 *  matching their single-button-per-row layout keeps the column visually
 *  consistent. */
const DEFAULT_LAYOUT: NonNullable<
  StripeExpressCheckoutElementOptions["layout"]
> = {
  maxColumns: 1,
  maxRows: 0,
};

export interface UseExpressCheckoutOptions {
  /** When `undefined`, the hook returns the suppression sentinel. */
  pricing: PricingWithMode | undefined;
  /** Forwarded to the consumer for wrapper-level visual disable. The hook
   *  itself does not encode `disabled` into ECE options because Stripe's
   *  ECE validator rejects `buttonHeight: 0` (must be 40–55). The consumer
   *  wraps `<ExpressCheckoutElement>` in an `aria-disabled` /
   *  `pointer-events: none` div when this is `true`, and the wallet path's
   *  `onConfirm` handler also early-returns + calls `event.paymentFailed()`
   *  as defence-in-depth. */
  disabled: boolean;
  /** Called by ECE when the buyer authorises a payment. The consumer owns
   *  the `helpers` (resolve / reject / paymentFailed) flow. */
  onConfirm: (event: StripeExpressCheckoutElementConfirmEvent) => Promise<void>;
  /** Optional ready callback fired once ECE finishes its first render. */
  onReady?: (event: StripeExpressCheckoutElementReadyEvent) => void;
}

/** Props spread onto `<ExpressCheckoutElement>`. Mirrors the subset of
 *  `ExpressCheckoutElementProps` this hook controls. */
export interface ExpressCheckoutElementSpreadProps {
  options: StripeExpressCheckoutElementOptions;
  onClick: (event: StripeExpressCheckoutElementClickEvent) => void;
  onConfirm: (event: StripeExpressCheckoutElementConfirmEvent) => Promise<void>;
  onReady: (event: StripeExpressCheckoutElementReadyEvent) => void;
}

export interface UseExpressCheckoutResult {
  /** `undefined` when `pricing` is missing — the consumer must guard with
   *  `eceProps && <ExpressCheckoutElement {...eceProps} />`. */
  eceProps: ExpressCheckoutElementSpreadProps | undefined;
  /** Flips `true` after ECE's `onReady` fires for the first time. */
  ready: boolean;
}

/**
 * @see Design Doc §Module / hook contracts (KDD-4).
 *
 * Inputs:
 *   - pricing: PricingWithMode | undefined
 *   - disabled: boolean
 *   - onConfirm: (event) => Promise<void>
 *   - onReady?: (event) => void
 *
 * Outputs:
 *   - eceProps: spread onto <ExpressCheckoutElement> (or `undefined` when
 *     pricing is missing — suppression sentinel).
 *   - ready: true once `onReady` has fired at least once.
 *
 * Lifecycle: pure. Re-derives `eceProps.options` only when pricing
 * presence flips (defined ↔ undefined) or `disabled` changes — pricing
 * tier swaps reuse the memoised options object.
 */
export function useExpressCheckout(
  opts: UseExpressCheckoutOptions,
): UseExpressCheckoutResult {
  // `disabled` is part of the public input surface but is intentionally not
  // encoded into ECE options — see UseExpressCheckoutOptions.disabled doc.
  // Read it so unused-param linters stay quiet and the destructure is
  // explicit about what the hook receives.
  void opts.disabled;
  const { pricing, onConfirm, onReady } = opts;

  const [ready, setReady] = useState(false);

  // Stable wrapper for `onReady` so the ECE element doesn't see referential
  // churn each render. The `ready` flag is single-direction (false → true)
  // so re-firing is a no-op.
  const handleReady = useCallback(
    (event: StripeExpressCheckoutElementReadyEvent) => {
      setReady(true);
      // Dev-only diagnostic: ECE reports which wallets are actually
      // available for the buyer's environment via
      // `event.availablePaymentMethods`. When a wallet button is missing
      // (no GPay button despite Chrome + a saved Google Pay card, etc.),
      // the most common causes are:
      //   - The Stripe test/live account has the wallet disabled in
      //     Dashboard → Settings → Payment Methods.
      //   - The Stripe account's country doesn't support that wallet.
      //   - The buyer's browser / Google account / Apple Wallet has no
      //     usable payment instrument.
      // Logging keeps this debuggable without DevTools breakpoints.
      if (import.meta.env.DEV) {
        const apm = (
          event as unknown as {
            availablePaymentMethods?: Record<string, boolean>;
          }
        ).availablePaymentMethods;
        // eslint-disable-next-line no-console
        console.info("[ECE] availablePaymentMethods:", apm ?? "(unavailable)");
      }
      onReady?.(event);
    },
    [onReady],
  );

  // Per-click data-collection contract. ECE asks the underlying wallet for
  // exactly the fields we resolve with — and nothing more. We need none of
  // (email, phone, billing address, shipping address) for the
  // first-payment funnel: the buyer's email is captured upstream in
  // session.email and forwarded into stripe.confirmPayment via the
  // consumer's confirmParams; address/phone are not used at all. Resolving
  // with everything `false` keeps the wallet sheet minimal and stops
  // Apple Pay / Google Pay from prompting for data we'd ignore.
  const handleClick = useCallback(
    (event: StripeExpressCheckoutElementClickEvent) => {
      event.resolve({
        emailRequired: false,
        phoneNumberRequired: false,
        billingAddressRequired: false,
        shippingAddressRequired: false,
      });
    },
    [],
  );

  // Memoise on the pricing-presence flag (not object identity) so
  // currency-tier swaps don't produce gratuitous re-renders of
  // <ExpressCheckoutElement>. Button defaults are fixed; ECE element
  // mounts must use Stripe-valid values (buttonHeight in [40, 55]).
  const hasPricing = pricing !== undefined;

  const options = useMemo<StripeExpressCheckoutElementOptions | undefined>(
    () => {
      if (!hasPricing) return undefined;
      return {
        buttonType: DEFAULT_BUTTON_TYPE,
        buttonTheme: DEFAULT_BUTTON_THEME,
        buttonHeight: DEFAULT_BUTTON_HEIGHT,
        buttonBorderRadius: DEFAULT_BUTTON_BORDER_RADIUS,
        paymentMethods: DEFAULT_PAYMENT_METHODS,
        layout: DEFAULT_LAYOUT,
      };
    },
    [hasPricing],
  );

  const eceProps = useMemo<ExpressCheckoutElementSpreadProps | undefined>(
    () => {
      if (!options) return undefined;
      return {
        options,
        onClick: handleClick,
        onConfirm,
        onReady: handleReady,
      };
    },
    [options, onConfirm, handleClick, handleReady],
  );

  return { eceProps, ready };
}
