/**
 * Payment-surface wrapper for `/checkout`.
 *
 * On-demand flow: no PaymentIntent is created until the user clicks one of
 * the Stripe surfaces (Card or an ECE wallet). PayPal is fully separate —
 * it loads the native `@paypal/paypal-js` SDK and renders branded Buttons.
 *
 *   - Wallets → Stripe Express Checkout Element (ECE) inside the hoisted
 *               `<Elements mode='payment'>` provider; ECE owns
 *               canMakePayment + button rendering. `onConfirm` fires
 *               `intent.createIntent(WALLET_METHOD_TYPE)` then
 *               `stripe.confirmPayment({...})`. Single-stage confirm; 3DS
 *               handled inside Stripe.
 *   - Card   → nested scoped `<Elements options={{ clientSecret }}>` with
 *               `<CardForm>` (PaymentElement) — KDD-1 keeps the secret
 *               scoped to the card surface only, separate from the
 *               deferred-mode hoisted provider.
 *   - PayPal → native PayPal SDK via `@paypal/paypal-js`; renders branded
 *               Buttons into a container; client-side capture; POSTs
 *               `/payment/paypal/first-sale/payments/confirm`.
 *
 * Card and ECE wallets route through `usePaymentIntent.finalizeAfterStripeSuccess`
 * on inline-success and through the recovery handler on return-from-redirect.
 * PayPal handles its own confirm + redirect through `usePayPalCheckout`.
 */

import { Elements, ExpressCheckoutElement, useElements } from "@stripe/react-stripe-js";
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementReadyEvent,
  StripePaymentRequestButtonElementClickEvent,
} from "@stripe/stripe-js";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { pushDataLayer } from "@/lib/analytics";
import { useExpressCheckout } from "@/hooks/useExpressCheckout";
import { useLocale, useLocalizedNavigate, withLocalePrefix } from "@/hooks/useLocale";
import { usePaymentIntent, WALLET_METHOD_TYPE } from "@/hooks/usePaymentIntent";
import { usePayPalCheckout } from "@/hooks/usePayPalCheckout";
import type { PricingInfo } from "@/lib/apiTypes";
import { withPromoParams } from "@/lib/promoUrl";
import { resolveRedirect } from "@/lib/redirectRouter";
import { getSession } from "@/lib/session";
import { assertKeyMatchesMode, getStripePromise, type PaymentMode } from "@/lib/stripe";

import { CardForm } from "./CardForm";

const BACKEND_CONFIRM_FAILURE_MESSAGE =
  "Your payment went through, but we had trouble finalising your order. Please contact support.";

/** Widen `PricingInfo` with `payment_mode` until Module 2's shape ships it. */
export type PricingWithMode = PricingInfo & {
  payment_mode?: PaymentMode;
};

/** Default to sandbox when the backend hasn't declared `payment_mode` yet —
 *  test keys can never charge real cards, so this is the safer fallback. */
const DEFAULT_PAYMENT_MODE: PaymentMode = "sandbox";

export interface CheckoutFormProps {
  pricing: PricingWithMode | undefined;
  email: string | undefined;
}

/** Stripe zero-decimal currencies — `amount` is the integer in the major
 *  unit, NOT multiplied by 100. Sending `19900` for ¥199 makes Apple Pay /
 *  Google Pay sheets render the total as ¥19,900. Source:
 *  https://docs.stripe.com/currencies#zero-decimal */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
  "ugx", "uyi", "vnd", "vuv", "xaf", "xof", "xpf",
]);

/** Stripe `amount` is an integer in the smallest unit Stripe charges for the
 *  currency. For most currencies that's minor units (e.g. USD "4.99" → 499);
 *  for zero-decimal currencies it's the major unit unchanged (e.g. JPY
 *  "199" → 199, NOT 19900). The deferred-mode `<Elements>` provider needs
 *  `amount + currency` upfront and the same value flows to ECE → Apple Pay
 *  / Google Pay sheets, so a wrong scale here is what the buyer sees. */
function toStripeAmount(price: string, currency: string): number {
  const n = Number(price);
  if (!Number.isFinite(n)) return 0;
  if (ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase())) {
    return Math.round(n);
  }
  return Math.round(n * 100);
}

export function CheckoutForm(props: CheckoutFormProps) {
  const mode = props.pricing?.payment_mode ?? DEFAULT_PAYMENT_MODE;
  const locale = useLocale();

  // Dev-time assertion: the publishable key configured for `mode` must
  // carry the matching `pk_test_` / `pk_live_` prefix. Idempotent; safe to
  // run on every render.
  if (props.pricing?.payment_mode) {
    assertKeyMatchesMode(props.pricing.payment_mode);
  }

  // Without pricing the deferred-mode <Elements> provider cannot mount
  // (R-D1 / AC-D02). Render a graceful fallback that keeps PayPal + card
  // button visible so the form is never silently broken.
  if (!props.pricing) {
    return <CheckoutBody mode={mode} pricing={undefined} email={props.email} />;
  }

  const currency = props.pricing.currency_code.toLowerCase();
  const amount = toStripeAmount(props.pricing.first_sale_price, currency);

  return (
    <Elements
      stripe={getStripePromise(mode)}
      options={{
        mode: "payment",
        amount,
        currency,
        locale,
        // Mirrors the backend's `setup_future_usage: 'off_session'` on the
        // wallet PaymentIntent. Stripe's deferred-mode Elements requires
        // the client option to match the server PI; without it the ECE
        // confirm silently drops vaulting and the saved Google Pay /
        // Apple Pay PM is unusable for later off-session charges.
        setupFutureUsage: "off_session",
        appearance: {
          theme: "stripe",
          variables: { colorPrimary: "hsl(270 50% 45%)" },
        },
        loader: "auto",
      }}
    >
      <CheckoutBody
        mode={mode}
        pricing={props.pricing}
        email={props.email}
      />
    </Elements>
  );
}

/**
 * Inner body of CheckoutForm. Runs INSIDE the hoisted <Elements> provider
 * when pricing is present, so `useElements()` returns the deferred-mode
 * Elements instance for ECE's `confirmPayment` call. When pricing is
 * undefined the inner body still renders the card button + PayPal
 * (gracefully skipping the wallet slot).
 */
interface CheckoutBodyProps extends CheckoutFormProps {
  mode: PaymentMode;
}

function CheckoutBody(props: CheckoutBodyProps) {
  const { t } = useTranslation();
  const intent = usePaymentIntent(props.mode);
  // Locale-aware navigate: prefixes `/ja` when the user is on the Japanese
  // tree, so a successful Stripe / PayPal payment from `/ja/checkout` lands
  // on `/ja/cross-sell`, not the English `/cross-sell`.
  const navigate = useLocalizedNavigate();
  const locale = useLocale();
  const elements = useElements();

  const [activeMethod, setActiveMethod] = useState<"card" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [methodError, setMethodError] = useState<string | null>(null);
  // null while ECE is still booting; flips to true/false on first onReady so
  // the slot can collapse instead of reserving 56px of empty space when the
  // buyer's browser/device exposes no wallets (Apple Pay / Google Pay).
  const [hasWallets, setHasWallets] = useState<boolean | null>(null);
  const lastIntentIdRef = useRef<string | null>(null);

  const session = getSession();
  // Stripe's 3DS redirect lands the browser back on this URL. It must keep
  // the locale prefix so the user returns to `/ja/checkout` (not the
  // English `/checkout`) when they started on the Japanese tree.
  const cardReturnUrl = `${window.location.origin}${withPromoParams(
    `${withLocalePrefix("/checkout", locale)}?qid=${session.qidRaw ?? ""}`,
  )}`;

  const handleFinalize = async (piId: string): Promise<void> => {
    setSubmitting(true);
    setMethodError(null);
    lastIntentIdRef.current = piId;
    try {
      const response = await intent.finalizeAfterStripeSuccess(piId);
      const route = resolveRedirect(response.redirect_page);
      const sessionNow = getSession();
      navigate(
        withPromoParams(`${route}?qid=${sessionNow.qidRaw ?? ""}`),
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
      pushDataLayer({ event: "stripe_payment" });
      void handleFinalize(intent.intentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent.recoveredSucceeded, intent.intentId]);

  const handleCardClick = async () => {
    if (submitting) return;
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

  /**
   * ECE wallet `onConfirm` handler — single-stage confirm replacing the
   * legacy two-stage `confirmCardPayment + handleCardAction` flow. Stripe
   * handles 3DS internally inside `confirmPayment`. On error, surface
   * `error.message` inline AND call `event.paymentFailed()` so ECE shows
   * its own button-state error indicator (R-D6).
   */
  const handleEceConfirm = useCallback(
    async (event: StripeExpressCheckoutElementConfirmEvent): Promise<void> => {
      if (submitting) {
        // Defence-in-depth: a stale event reaches us during an in-flight
        // submit. Early-return and tell ECE the attempt failed.
        event.paymentFailed({ reason: "fail" });
        return;
      }

      setSubmitting(true);
      setMethodError(null);
      try {
        let clientSecret: string;
        try {
          const result = await intent.createIntent(WALLET_METHOD_TYPE);
          clientSecret = result.clientSecret;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Could not prepare payment";
          pushDataLayer({ event: "stripe_payment_failed" });
          event.paymentFailed({ reason: "fail" });
          setMethodError(message);
          return;
        }

        const stripe = await getStripePromise(props.mode);
        if (!stripe || !elements) {
          pushDataLayer({ event: "stripe_payment_failed" });
          event.paymentFailed({ reason: "fail" });
          setMethodError("Stripe not ready");
          return;
        }

        const { paymentIntent, error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: cardReturnUrl },
          redirect: "if_required",
        });

        if (error) {
          pushDataLayer({ event: "stripe_payment_failed" });
          event.paymentFailed({ reason: "fail" });
          setMethodError(error.message ?? "Wallet payment failed");
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          pushDataLayer({ event: "stripe_payment" });
          await handleFinalize(paymentIntent.id);
        }
      } finally {
        setSubmitting(false);
      }
    },
    // `handleFinalize` is intentionally captured by closure; including it
    // would churn `eceProps.onConfirm` identity each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submitting, intent, elements, cardReturnUrl, props.mode],
  );

  const handleEceReady = useCallback(
    (event: StripeExpressCheckoutElementReadyEvent) => {
      const apm = event.availablePaymentMethods;
      setHasWallets(Boolean(apm && (apm.applePay || apm.googlePay)));
    },
    [],
  );

  const { eceProps } = useExpressCheckout({
    pricing: props.pricing,
    disabled: submitting,
    onConfirm: handleEceConfirm,
    onReady: handleEceReady,
  });

  const creating = intent.state === "creating";
  const baseDisabled = submitting || creating;

  // PayPal native SDK — owns its own button, capture, and confirm. The hook
  // reads the latest `disabled` value via a ref so we render once on mount.
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypal = usePayPalCheckout({
    mode: props.mode,
    amount: Number(props.pricing?.first_sale_price ?? 0),
    currency: props.pricing?.currency_code ?? "USD",
    description: "16 Types Test — Initial Payment",
    disabled: submitting,
    onSuccess: (redirect) => {
      // Mirror handleFinalize: backend returns a route KEY (e.g.
      // "CROSS_SELL_OFFER_PAGE"), resolveRedirect maps it to a real path
      // (e.g. "/cross-sell"), and qid + promo params are appended so the
      // next page's resume guard sees the funnel state.
      const route = resolveRedirect(redirect);
      const sessionNow = getSession();
      navigate(
        withPromoParams(`${route}?qid=${sessionNow.qidRaw ?? ""}`),
      );
    },
    onError: (msg) => setMethodError(msg),
  });
  useEffect(() => {
    paypal.render(paypalContainerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
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

      {/* Stripe wallets via Express Checkout Element. Renders only when the
          hook returns props (i.e. pricing is present). The browser/device
          decides which wallets to show — no application-level
          canMakePayment() probe.
          VISUAL LOCK — Stripe-controlled ECE rendering replaces the prior
          custom GPay pill (R-D3 / DD-OQ-1: marketing tuning is post-merge).
          Visual disable mirrors the PayPal slot: aria-disabled + opacity +
          pointer-events: none when a submit is in flight. ECE's
          options.buttonHeight must stay in Stripe's [40, 55] range, so we
          cannot collapse the slot via the height knob.
          When the card form is active the slot is collapsed via `hidden`
          so only the inline card UI is visible (parent stays mounted to
          preserve ECE state across toggles). */}
      {eceProps && (
        <div
          data-testid="ece-slot"
          aria-disabled={baseDisabled}
          className={`w-full overflow-hidden transition-opacity ${
            baseDisabled ? "opacity-50 pointer-events-none" : ""
          } ${hasWallets === false || activeMethod === "card" ? "hidden" : ""}`}
          style={{
            minHeight: hasWallets === false ? 0 : "56px",
            borderRadius: "calc(var(--radius) + 4px)",
          }}
        >
          <ExpressCheckoutElement {...eceProps} />
        </div>
      )}

      {/* PayPal — native SDK. The wrapper visually mirrors the disabled
          state of the other buttons (opacity + pointer-events: none) when
          a submit is in flight. The hook also rejects the SDK's onClick
          when `disabled` is true, so the popup can never open even if
          pointer-events somehow reached the iframe. Hidden while the card
          form is active so the user focuses on a single surface. */}
      <div className={`w-full ${activeMethod === "card" ? "hidden" : ""}`}>
        {paypal.isError ? (
          <div className="text-sm text-destructive py-2">
            PayPal is unavailable. Please use Card or another wallet.
          </div>
        ) : (
          <div
            ref={paypalContainerRef}
            id="paypal-button-container"
            aria-disabled={baseDisabled}
            className={`w-full overflow-hidden transition-opacity ${
              baseDisabled ? "opacity-50 pointer-events-none" : ""
            }`}
            style={{
              height: "56px",
              borderRadius: "calc(var(--radius) + 4px)",
            }}
          />
        )}
      </div>

      {/* Credit or debit card — VISUAL LOCK. Hidden when the card form is
          expanded; the back button below replaces it for collapsing the
          form back to the multi-method view.
          `whitespace-normal break-words h-auto` overrides the Button base
          `whitespace-nowrap` + fixed `h-14` so long localized labels (e.g.
          Japanese "クレジットカードまたはデビットカード") wrap inside the
          button on narrow viewports instead of forcing the parent grid
          column wider than the mobile screen. */}
      <Button
        className={`w-full min-h-14 py-2 text-lg font-semibold whitespace-normal break-words h-auto leading-snug ${activeMethod === "card" ? "hidden" : ""}`}
        size="lg"
        style={{ backgroundColor: "hsl(var(--success))", color: "white" }}
        disabled={baseDisabled}
        onClick={handleCardClick}
      >
        {t("checkout.creditCard")}
      </Button>

      {/* Inline card form — KDD-1: the card-path Elements provider stays
          NESTED under the hoisted deferred-mode provider. Stripe explicitly
          supports two coexisting Elements groups (one deferred, one with
          clientSecret). The nested provider mounts only when the card branch
          is active, so toggling it does NOT remount the hoisted provider or
          ECE.
          The wrapping <div> uses `animate-fade-in-up` to slide the form up
          from below as it expands. The "Change method" back button collapses
          the form and restores the other payment surfaces. */}
      {activeMethod === "card" && (
        <div className="animate-fade-in-up space-y-3">
          <button
            type="button"
            onClick={handleCardClick}
            disabled={submitting}
            className="flex items-center gap-2 text-primary text-sm font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t("checkout.changeMethod")}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("checkout.changeMethod")}
          </button>
          {intent.clientSecret ? (
            <Elements
              stripe={getStripePromise(props.mode)}
              options={{
                clientSecret: intent.clientSecret,
                locale,
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
                submitting={submitting}
                returnUrl={cardReturnUrl}
                onSuccess={handleCardSuccess}
                onError={setMethodError}
              />
            </Elements>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center py-10 text-sm text-muted-foreground"
            >
              {t("common.loading")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { StripePaymentRequestButtonElementClickEvent };
