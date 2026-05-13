/**
 * Native PayPal checkout hook.
 *
 * Owns the PayPal SDK lifecycle for the `/checkout` page: loads the SDK
 * singleton, renders branded `paypal.Buttons` into a caller-supplied
 * container, captures the order client-side, and POSTs the captured
 * fields to the backend's
 * `payment/paypal/first-sale/payments/confirm` endpoint.
 *
 * The hook is self-contained — it does not share any state with
 * `usePaymentIntent` (which only handles Stripe-mediated methods).
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, NetworkError, apiPost } from "@/lib/api";
import { pushDataLayer } from "@/lib/analytics";
import type {
  PayPalConfirmRequestBody,
  PayPalConfirmResponse,
  PayPalCreateOrderRequestBody,
  PayPalCreateOrderResponse,
} from "@/lib/apiTypes";
import { isPayPalCurrencySupported, loadPayPalSdk } from "@/lib/paypal";
import { getSession } from "@/lib/session";
import type { PaymentMode } from "@/lib/stripe";

export interface UsePayPalCheckoutArgs {
  /** Backend's `payment_mode` — selects sandbox vs. live PayPal client-id. */
  mode: PaymentMode;
  /** Amount as decimal number (e.g. 4.99). Caller converts from string. */
  amount: number;
  /** ISO currency code, e.g. "USD". */
  currency: string;
  /** Description shown in the PayPal checkout modal. */
  description?: string;
  /**
   * Called after successful capture + backend confirm. `redirectPage` is
   * the server-driven next route (e.g. `/cross-sell`).
   */
  onSuccess: (redirectPage: string) => void;
  /** Called on any failure: SDK load, button render, capture, or confirm. */
  onError: (message: string) => void;
  /**
   * When true, the PayPal Buttons reject the click with an inline message
   * (PayPal's `onClick` → `actions.reject()` pattern).
   */
  disabled?: boolean;
  /** Message surfaced via PayPal's reject UI when disabled. */
  disabledMessage?: string;
}

export interface UsePayPalCheckoutResult {
  /**
   * Renders PayPal Buttons into the given container. Idempotent — calling
   * again with a new container re-renders.
   */
  render: (container: HTMLElement | null) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export function usePayPalCheckout(
  args: UsePayPalCheckoutArgs,
): UsePayPalCheckoutResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Keep the latest props in a ref so the rendered Buttons read fresh values
  // (especially `disabled`) without re-rendering the buttons themselves.
  const argsRef = useRef(args);
  argsRef.current = args;

  const buttonsRef = useRef<{ close?: () => Promise<void> } | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const render = useCallback(
    (container: HTMLElement | null) => {
      containerRef.current = container;
      if (!container) return;
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      // PayPal CAPTURE-intent rejects unsupported currencies (INR, ZAR, …)
      // with `CURRENCY_NOT_SUPPORTED`. Short-circuit here so the user sees
      // the Card/GPay fallback instead of a broken button. Surfaced via
      // local `isError` only — don't bubble to `onError`, since that would
      // push a top-level toast on initial render even if the user is about
      // to pay with Card.
      if (!isPayPalCurrencySupported(args.currency)) {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(
          `PayPal does not support ${args.currency} payments. Please use Card or Google Pay.`,
        );
        return;
      }
      loadPayPalSdk(args.mode, { currency: args.currency })
        .then((paypal) => {
          if (!paypal.Buttons) {
            throw new Error("PayPal Buttons unavailable");
          }
          // Tear down any previous instance first so a re-render with a new
          // container replaces the old buttons rather than stacking them.
          if (buttonsRef.current?.close) {
            void buttonsRef.current.close();
          }
          const buttons = paypal.Buttons({
            // Force a single PayPal-only button. `disable-funding` on the SDK
            // loader already prunes the others, but pinning the source here
            // is defensive against future SDK default changes.
            fundingSource: paypal.FUNDING.PAYPAL,
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
              // SDK accepts 25–55; 55 fills the 56px wrapper. The wrapper's
              // border-radius (calc(var(--radius) + 4px)) overrides PayPal's
              // corner shape via overflow: hidden on the parent.
              height: 55,
            },
            onClick: (_data, actions) => {
              if (argsRef.current.disabled) {
                return actions.reject();
              }
              return actions.resolve();
            },
            createOrder: async () => {
              // Order creation runs on our backend, not via the SDK's
              // `actions.order.create()`. PayPal rejects vault-attribute
              // create-order calls signed by the browser-minted SDK token
              // with `NOT_AUTHORIZED` — the vault scope is only granted
              // to tokens minted server-side from the merchant's REST
              // credentials. The backend builds the full order body
              // (intent, purchase_units, payment_source.paypal.attributes
              // .vault, experience_context) and returns the order id.
              // amount/currency intentionally NOT sent from the client —
              // backend derives them from `prc_id` to prevent tampering.
              const session = getSession();
              // PayPal's vault flow requires non-empty return_url / cancel_url
              // in experience_context. The SDK button uses a popup and never
              // navigates to these — popup close drives onApprove/onCancel —
              // but the URLs must still be valid or PayPal rejects the order
              // with RETURN_URL_REQUIRED / CANCEL_URL_REQUIRED.
              const pageUrl =
                window.location.origin + window.location.pathname;
              const body: PayPalCreateOrderRequestBody = {
                email: session.email,
                quiz_result_id: session.qidRaw,
                user_on_iqbooster: "",
                payment_method_type: "paypal",
                prc_id: session.prcId ?? "",
                pricing_discount: session.mdid
                  ? { mdid: session.mdid }
                  : "",
                return_url: pageUrl,
                cancel_url: pageUrl,
              };
              const res = await apiPost<PayPalCreateOrderResponse>(
                "payment/paypal/first-sale/payments/create-order",
                body,
              );
              return res.order_id;
            },
            onApprove: async (data, actions) => {
              try {
                // const order = await actions.order!.capture();
                // const capture =
                //   order.purchase_units?.[0]?.payments?.captures?.[0];
                // if (!capture) {
                //   throw new Error("PayPal capture missing from order");
                // }
                const session = getSession();
                const body: PayPalConfirmRequestBody = {
                  quiz_result_id: session.qidRaw ?? 0,
                  user_on_iqbooster: "",
                  prc_id: session.prcId ?? "",
                  pricing_discount: session.mdid ?? "",
                  payment_method: "paypal",
                  payment_status: "paid",
                  charge_id: "",
                  paypal_order_id: data.orderID ?? "",
                  item_price: 0,
                  paypal_customer_email: "",
                  payment_method_id:  "",
                  paypal_customer_id: "",
                };
                const res = await apiPost<PayPalConfirmResponse>(
                  "payment/paypal/first-sale/payments/confirm",
                  body,
                );
                pushDataLayer({ event: "paypal_payment" });
                argsRef.current.onSuccess(res.redirect_page);
              } catch (e) {
                pushDataLayer({ event: "paypal_payment_failed" });
                const msg =
                  e instanceof ApiError
                    ? `Backend confirm failed: ${e.message}`
                    : e instanceof NetworkError
                      ? "Network error during PayPal confirm"
                      : (e as Error).message || "PayPal payment failed";
                argsRef.current.onError(msg);
              }
            },
            onError: (err: unknown) => {
              pushDataLayer({ event: "paypal_payment_failed" });
              argsRef.current.onError(
                (err as Error)?.message ?? "PayPal payment failed",
              );
            },
            onCancel: () => {
              // User dismissed PayPal modal — no error, just stop loading.
            },
          });
          buttonsRef.current = buttons as { close?: () => Promise<void> };
          setIsLoading(false);
          return buttons.render(container);
        })
        .catch((e) => {
          setIsLoading(false);
          setIsError(true);
          const msg = (e as Error).message ?? "PayPal failed to load";
          setErrorMessage(msg);
          argsRef.current.onError(msg);
        });
    },
    [args.currency],
  );

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (buttonsRef.current?.close) {
        void buttonsRef.current.close();
      }
    };
  }, []);

  return { render, isLoading, isError, errorMessage };
}
