/**
 * Wraps Stripe's `paymentRequest` API for the Google Pay button.
 *
 * Apple-Pay note: the underlying PaymentRequest instance surfaces both Google
 * Pay (Chrome + Android wallet) AND Apple Pay (Safari) when available.
 * `available: true` is returned when either is reported by canMakePayment().
 * Our CheckoutForm renders the same "Google Pay" label + icon regardless —
 * intentional per PRD §3 out-of-scope ("no separate Apple Pay button") and
 * flagged as Open item O5.
 *
 * See PRD §4.4.2 (GPay method flow) + §4.9 (ref-stable PaymentRequest).
 */

import type {
  PaymentRequest,
  PaymentRequestPaymentMethodEvent,
  Stripe,
} from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";

import { stripePromise } from "@/lib/stripe";

export interface UseGooglePayOptions {
  pricing:
    | {
        currency_code: string;
        first_sale_cents_price?: string;
        first_sale_price: string;
      }
    | undefined;
  /** Defaults to `'US'` when unset. */
  country?: string;
  /**
   * Invoked with the full `paymentmethod` event. The caller owns the
   * `confirmCardPayment({ handleActions: false }) → handleCardAction` two-stage
   * flow, is responsible for reading the current `clientSecret` (typically
   * populated by a prior `createIntent('card')` call), and for calling
   * `event.complete('success'|'fail')`.
   */
  onPaymentMethod: (event: PaymentRequestPaymentMethodEvent) => Promise<void>;
}

export interface UseGooglePayResult {
  /** Tri-state: `null` while `canMakePayment()` is in flight, `true` when
   *  Google Pay or Apple Pay is available, `false` otherwise. */
  available: boolean | null;
  /** Imperative handle wired to the GPay button's `onClick`. Silent no-op
   *  when the wallet is unavailable so callers don't need a guard. */
  show: () => void;
  paymentRequest: PaymentRequest | undefined;
}

/** Computes the Stripe `amount` (integer cents) from pricing. */
function computeAmountCents(pricing: {
  first_sale_cents_price?: string;
  first_sale_price: string;
}): number {
  if (pricing.first_sale_cents_price) {
    return parseInt(pricing.first_sale_cents_price, 10);
  }
  return Math.round(Number(pricing.first_sale_price) * 100);
}

export function useGooglePay(opts: UseGooglePayOptions): UseGooglePayResult {
  const { pricing, country, onPaymentMethod } = opts;

  // Resolve stripe directly from `stripePromise` rather than via useStripe(),
  // so consumers of this hook don't need to live under an <Elements>
  // provider — that provider can't always be mounted in the on-demand intent
  // flow (Elements requires clientSecret/mode at creation time).
  const [stripe, setStripe] = useState<Stripe | null>(null);
  useEffect(() => {
    let cancelled = false;
    void stripePromise.then((s) => {
      if (!cancelled) setStripe(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [available, setAvailable] = useState<boolean | null>(null);
  const prRef = useRef<PaymentRequest | undefined>(undefined);

  // Hold the latest `onPaymentMethod` in a ref so we can subscribe with a
  // stable wrapper and avoid re-subscribing on every render. Also required
  // so `off(...)` receives the exact same reference that was passed to `on`.
  const onPaymentMethodRef = useRef(onPaymentMethod);
  useEffect(() => {
    onPaymentMethodRef.current = onPaymentMethod;
  }, [onPaymentMethod]);

  // `first_sale_price` is what actually changes between currencies / tiers;
  // `currency_code` and `country` re-keys come along for the ride.
  const firstSalePrice = pricing?.first_sale_price;
  const firstSaleCents = pricing?.first_sale_cents_price;
  const currency = pricing?.currency_code;

  useEffect(() => {
    // Gate: Stripe SDK must be loaded and pricing known before we can
    // construct a PaymentRequest (currency + total are required). The
    // clientSecret is NOT a prerequisite — the ondemand intent-creation
    // flow only materialises it when the user actually clicks the GPay
    // button, and the `paymentmethod` event handler reads it at call time
    // via the caller's closure/ref.
    if (!stripe || !pricing) {
      return;
    }

    let cancelled = false;
    let pr: PaymentRequest;
    const handler = (event: PaymentRequestPaymentMethodEvent) => {
      void onPaymentMethodRef.current(event);
    };

    try {
      pr = stripe.paymentRequest({
        country: country ?? "US",
        currency: pricing.currency_code.toLowerCase(),
        total: {
          label: "Total",
          amount: computeAmountCents(pricing),
        },
        requestPayerEmail: false,
        requestPayerName: false,
      });
    } catch (err) {
      // Malformed currency or similar — treat as unavailable, don't surface.
      console.error("[useGooglePay] paymentRequest construction failed", err);
      setAvailable(false);
      return;
    }

    prRef.current = pr;
    pr.on("paymentmethod", handler);

    void pr.canMakePayment().then((result) => {
      if (cancelled) return;
      const ok = !!result?.googlePay || !!result?.applePay;
      setAvailable(ok);
    });

    return () => {
      cancelled = true;
      pr.off("paymentmethod", handler);
      if (prRef.current === pr) {
        prRef.current = undefined;
      }
    };
    // Deliberately re-run when pricing-relevant scalars change rather than
    // on object identity of `pricing` (which may churn each render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, firstSalePrice, firstSaleCents, currency, country]);

  const show = () => {
    if (available === true && prRef.current) {
      prRef.current.show();
    }
  };

  return {
    available,
    show,
    paymentRequest: prRef.current,
  };
}
