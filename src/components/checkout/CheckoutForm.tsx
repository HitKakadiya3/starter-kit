/**
 * Payment-surface wrapper for `/checkout`.
 *
 * On-demand flow: no PaymentIntent is created until the user clicks one of
 * the three method buttons. Each button calls `intent.createIntent(type)`
 * with its own `payment_method_type` and then runs the method-specific
 * Stripe surface:
 *
 *   - Card   → mount `<Elements>` + `<CardForm>` (PaymentElement) below the
 *              buttons; `stripe.confirmPayment({ elements, confirmParams })`
 *              inside CardForm.
 *   - GPay   → `stripe.paymentRequest(...).show()`; `paymentmethod` event
 *              handled by this component via `useGooglePay`.
 *   - PayPal → `stripe.confirmPayment({ clientSecret, confirmParams: {
 *              return_url, payment_method_data: { type: 'paypal' } } })`;
 *              full-page redirect, recovered on return via
 *              `usePaymentIntent`'s mount step A.
 *
 * All three methods route through `usePaymentIntent.finalizeAfterStripeSuccess`
 * on inline-success and through the recovery handler on return-from-redirect.
 */

import { Elements } from "@stripe/react-stripe-js";
import type {
  PaymentRequestPaymentMethodEvent,
  StripePaymentRequestButtonElementClickEvent,
} from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGooglePay } from "@/hooks/useGooglePay";
import { usePaymentIntent } from "@/hooks/usePaymentIntent";
import type { PricingInfo } from "@/lib/apiTypes";
import { DEFAULT_SUBSCRIPTION_DAYS, TRIAL_DAYS } from "@/lib/pricingConstants";
import { withPromoParams } from "@/lib/promoUrl";
import { resolveRedirect } from "@/lib/redirectRouter";
import { getSession } from "@/lib/session";
import { assertKeyMatchesMode, stripePromise } from "@/lib/stripe";

import { CardForm } from "./CardForm";

const BACKEND_CONFIRM_FAILURE_MESSAGE =
  "Your payment went through, but we had trouble finalising your order. Please contact support.";

/** Widen `PricingInfo` with `payment_mode` until Module 2's shape ships it. */
export type PricingWithMode = PricingInfo & {
  payment_mode?: "sandbox" | "live";
};

export interface CheckoutFormProps {
  priceLabel: string;
  pricing: PricingWithMode | undefined;
  email: string | undefined;
  gpayIcon: string;
}

export function CheckoutForm(props: CheckoutFormProps) {
  const intent = usePaymentIntent();

  // Dev-time assertion: Stripe key's test/live prefix must match the
  // backend's `payment_mode`. Idempotent; safe to run on every render.
  if (props.pricing?.payment_mode) {
    assertKeyMatchesMode(props.pricing.payment_mode);
  }

  const navigate = useNavigate();
  const [consented, setConsented] = useState(false);
  const [activeMethod, setActiveMethod] = useState<"card" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [methodError, setMethodError] = useState<string | null>(null);
  const lastIntentIdRef = useRef<string | null>(null);

  // GPay handler reads the latest clientSecret at event time via a ref —
  // the value isn't known until `intent.createIntent('card')` resolves on
  // button click, but the paymentmethod listener was registered earlier.
  const gpayClientSecretRef = useRef<string | null>(null);

  const handleFinalize = async (piId: string): Promise<void> => {
    setSubmitting(true);
    setMethodError(null);
    lastIntentIdRef.current = piId;
    try {
      const response = await intent.finalizeAfterStripeSuccess(piId);
      const route = resolveRedirect(response.redirect_page);
      const session = getSession();
      navigate(
        withPromoParams(`${route}?qid=${session.qidRaw ?? ""}`),
      );
    } catch {
      setMethodError(BACKEND_CONFIRM_FAILURE_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryFinalize = () => {
    if (lastIntentIdRef.current) void handleFinalize(lastIntentIdRef.current);
  };

  const handleCardSuccess = (piId: string) => {
    void handleFinalize(piId);
  };

  // Auto-finalise when mount recovery produces a succeeded intent (user
  // closed tab after Stripe success but before backend confirm, or came
  // back from a PayPal redirect with status=succeeded).
  const autoFinalisedRef = useRef(false);
  useEffect(() => {
    if (
      intent.recoveredSucceeded &&
      intent.intentId &&
      !autoFinalisedRef.current
    ) {
      autoFinalisedRef.current = true;
      void handleFinalize(intent.intentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent.recoveredSucceeded, intent.intentId]);

  const handleCardClick = async () => {
    if (submitting || !consented) return;
    setMethodError(null);
    setActiveMethod((prev) => (prev === "card" ? null : "card"));
    // Fire intent creation only when opening the form; toggling closed
    // leaves the cached intent in place for reuse on next open.
    if (activeMethod !== "card") {
      try {
        await intent.createIntent("card");
      } catch (e) {
        setMethodError((e as Error).message || "Couldn't start the payment");
      }
    }
  };

  const handlePayPalClick = async () => {
    if (submitting || !consented) return;
    setSubmitting(true);
    setMethodError(null);
    try {
      const { clientSecret } = await intent.createIntent("paypal");
      const stripe = await stripePromise;
      if (!stripe) {
        setMethodError("Stripe failed to load");
        setSubmitting(false);
        return;
      }
      const session = getSession();
      const returnUrl = `${window.location.origin}${withPromoParams(
        `/checkout?qid=${session.qidRaw ?? ""}`,
      )}`;
      // The intent was created with `payment_method_type: 'paypal'`, so
      // `confirmPayPalPayment` just needs the clientSecret + return_url.
      // Using the per-method confirm function avoids Stripe's typed
      // rejection of `payment_method_data: { type: 'paypal' }` in the
      // generic confirmPayment call.
      const { error } = await stripe.confirmPayPalPayment(clientSecret, {
        return_url: returnUrl,
      });
      if (error) {
        setMethodError(error.message ?? "PayPal payment failed");
        setSubmitting(false);
      }
      // Success: Stripe redirects the browser; no JS continuation.
    } catch (e) {
      setMethodError((e as Error).message || "PayPal payment failed");
      setSubmitting(false);
    }
  };

  const handleGooglePayMethod = async (
    event: PaymentRequestPaymentMethodEvent,
  ): Promise<void> => {
    setSubmitting(true);
    setMethodError(null);
    const stripe = await stripePromise;
    const clientSecret = gpayClientSecretRef.current;
    if (!stripe || !clientSecret) {
      event.complete("fail");
      setMethodError("Stripe not ready");
      setSubmitting(false);
      return;
    }
    const { paymentIntent: pi, error } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: event.paymentMethod.id },
      { handleActions: false },
    );
    if (error || !pi) {
      event.complete("fail");
      setMethodError(error?.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }
    event.complete("success");
    if (pi.status === "requires_action") {
      const { error: actionError, paymentIntent: pi2 } =
        await stripe.handleCardAction(clientSecret);
      if (actionError || pi2?.status !== "succeeded") {
        setMethodError(actionError?.message ?? "Authentication failed");
        setSubmitting(false);
        return;
      }
      await handleFinalize(pi2.id);
      return;
    }
    if (pi.status === "succeeded") {
      await handleFinalize(pi.id);
      return;
    }
    setSubmitting(false);
  };

  const gpay = useGooglePay({
    pricing: props.pricing,
    onPaymentMethod: handleGooglePayMethod,
  });

  const handleGooglePayClick = async () => {
    if (submitting || !consented || gpay.available !== true) return;
    setSubmitting(true);
    setMethodError(null);
    try {
      const { clientSecret } = await intent.createIntent("card");
      gpayClientSecretRef.current = clientSecret;
      gpay.show();
      // The paymentmethod event fires asynchronously; clear submitting
      // optimistically so the user can cancel the sheet and retry.
      setSubmitting(false);
    } catch (e) {
      setMethodError((e as Error).message || "Couldn't start Google Pay");
      setSubmitting(false);
    }
  };

  const creating = intent.state === "creating";
  const baseDisabled = !consented || submitting || creating;
  const gpayDisabled = baseDisabled || gpay.available !== true;

  const subscriptionDayLabel =
    props.pricing?.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS;

  const session = getSession();
  const cardReturnUrl = `${window.location.origin}${withPromoParams(
    `/checkout?qid=${session.qidRaw ?? ""}`,
  )}`;

  return (
    <div className="space-y-3">
      {/* Consent gate */}
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <Checkbox
          id="subscription-consent"
          checked={consented}
          onCheckedChange={(v) => setConsented(v === true)}
        />
        <span className="leading-relaxed">
          I understand that after the {TRIAL_DAYS}-day trial my subscription
          will begin automatically at{" "}
          {props.pricing?.subscription_price_label ?? "…"} every{" "}
          {subscriptionDayLabel} days until I cancel. I agree to the{" "}
          <a href="/subscription-policy" className="underline">
            Subscription Policy
          </a>
          ,{" "}
          <a href="/terms-conditions" className="underline">
            Terms of Use
          </a>
          , and{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {/* Intent-creation / retrieval error slot */}
      {intent.state === "error" && intent.error && (
        <div
          role="alert"
          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm space-y-2"
        >
          <div>{intent.error}</div>
          <Button
            onClick={intent.retry}
            variant="outline"
            size="sm"
            className="mt-1"
          >
            Try again
          </Button>
        </div>
      )}

      {/* Per-method error slot */}
      {methodError && (
        <div
          role="alert"
          className="bg-destructive/10 text-destructive rounded-md p-3 text-sm space-y-2"
        >
          <div>{methodError}</div>
          {lastIntentIdRef.current && (
            <Button
              onClick={handleRetryFinalize}
              variant="outline"
              size="sm"
              className="mt-1"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Google Pay — VISUAL LOCK */}
      <Button
        className="w-full py-6 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background"
        size="lg"
        disabled={gpayDisabled}
        title={
          gpay.available === false
            ? "Google Pay isn't available in this browser"
            : undefined
        }
        onClick={handleGooglePayClick}
      >
        <img
          src={props.gpayIcon}
          alt="Google Pay"
          className="h-7 w-[130px] max-w-full object-contain"
        />
      </Button>

      {/* PayPal — VISUAL LOCK */}
      <Button
        className="w-full py-6 text-lg font-bold"
        size="lg"
        style={{ backgroundColor: "hsl(213 100% 44%)", color: "white" }}
        disabled={baseDisabled}
        onClick={handlePayPalClick}
      >
        PayPal
      </Button>

      {/* Credit or debit card — VISUAL LOCK */}
      <Button
        className="w-full py-6 text-lg font-semibold"
        size="lg"
        style={{ backgroundColor: "hsl(var(--success))", color: "white" }}
        disabled={baseDisabled}
        onClick={handleCardClick}
      >
        Credit or debit card
      </Button>

      {/* Inline card form — Stripe requires the Elements group to be
          created WITH a clientSecret (or deferred `mode`) up front, so
          we mount <Elements> only after createIntent('card') resolves.
          useGooglePay doesn't use this provider (it reads `stripePromise`
          directly). */}
      {activeMethod === "card" && intent.clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: intent.clientSecret,
            appearance: {
              theme: "stripe",
              variables: { colorPrimary: "hsl(270 50% 45%)" },
            },
            loader: "auto",
          }}
        >
          <CardForm
            clientSecret={intent.clientSecret}
            email={props.email}
            priceLabel={props.priceLabel}
            submitting={submitting}
            consented={consented}
            returnUrl={cardReturnUrl}
            onSuccess={handleCardSuccess}
            onError={setMethodError}
          />
        </Elements>
      )}
    </div>
  );
}

export type { StripePaymentRequestButtonElementClickEvent };
