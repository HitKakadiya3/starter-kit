/**
 * Inline Stripe PaymentElement form — rendered inside `<Elements>`.
 *
 * Uses Stripe's PaymentElement (https://docs.stripe.com/payments/payment-element)
 * which handles card input, 3DS, Link, regional card options, and any other
 * card-type methods the intent is configured to accept — all inside a single
 * drop-in UI. Replaces the earlier CardElement + manual billing-details
 * plumbing.
 *
 * On submit, calls `stripe.confirmPayment({ elements, confirmParams: {
 * return_url } })`. Stripe handles 3DS / bank-redirects inline; on a
 * no-redirect success, the returned `paymentIntent.status === 'succeeded'`
 * and we invoke `onSuccess(intentId)`. On redirect-based authentication,
 * Stripe bounces the browser to `return_url` and `usePaymentIntent`'s mount
 * recovery picks it up when the user returns.
 */

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type {
  StripePaymentElementChangeEvent,
} from "@stripe/stripe-js";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export interface CardFormProps {
  clientSecret: string;
  /** Captured session email; forwarded into Stripe's `confirmParams` so
   *  the PaymentElement can autofill / save it on the intent. */
  email: string | undefined;
  /** Formatted price label from `usePricing().current.first_sale_price_label`
   *  (e.g. `"$4.99"`). Rendered verbatim inside the Pay button. */
  priceLabel: string;
  /** Parent-controlled; reflects in-flight Stripe confirm + backend confirm. */
  submitting: boolean;
  /** Parent-controlled; defence-in-depth against mounting without consent. */
  consented: boolean;
  /** Full URL Stripe redirects back to after bank auth / 3DS etc. */
  returnUrl: string;
  onSuccess: (intentId: string) => void;
  onError: (message: string) => void;
}

export function CardForm(props: CardFormProps) {
  const {
    email,
    priceLabel,
    submitting,
    consented,
    returnUrl,
    onSuccess,
    onError,
  } = props;

  const stripe = useStripe();
  const elements = useElements();
  const [complete, setComplete] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleChange = (event: StripePaymentElementChangeEvent) => {
    setComplete(event.complete);
    setInlineError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setInlineError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: email
          ? { billing_details: { email } }
          : undefined,
      },
      // Stay on this page for inline-success flows (no redirect); only the
      // explicitly-redirecting methods (e.g. bank debit, some 3DS flows)
      // will navigate away. `if_required` is Stripe's documented value for
      // this behaviour.
      redirect: "if_required",
    });

    if (result.error) {
      const msg = result.error.message ?? "Payment failed";
      setInlineError(msg);
      onError(msg);
      return;
    }

    const pi = result.paymentIntent;
    if (pi?.status === "succeeded") {
      onSuccess(pi.id);
      return;
    }
    // Other statuses (processing, requires_action) — the returning-from-
    // redirect code path in usePaymentIntent handles those on remount.
  };

  const disabled = !complete || !consented || submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PaymentElement
        onChange={handleChange}
        options={{ layout: "tabs" }}
      />
      {inlineError && (
        <div role="alert" className="text-sm text-destructive">
          {inlineError}
        </div>
      )}
      <Button
        type="submit"
        disabled={disabled}
        className="w-full py-6 text-lg font-semibold"
        size="lg"
      >
        {submitting ? "Processing…" : `Pay ${priceLabel}`}
      </Button>
    </form>
  );
}
