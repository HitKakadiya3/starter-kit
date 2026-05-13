/**
 * PaymentIntent lifecycle hook for Module 3 (PRD §4.3 + §4.4.4 + §4.5).
 *
 * Owns: URL-return detection, cached-succeeded detection, reuse validation,
 * fresh creation, 2s-interval processing poll with 30s cap, backend confirm
 * (`finalizeAfterStripeSuccess`), and cross-sale merge into
 * `session.pricingInfo.transactions.cross_sale`.
 *
 * The only Stripe SDK surface used here is `stripe.retrievePaymentIntent`.
 * `confirmCardPayment` / `confirmPayment` / `paymentRequest` live in the
 * per-method callers (Task 05 for CheckoutForm; Task 03 for GPay).
 */

import { useCallback, useEffect, useState } from "react";

import { apiPost } from "@/lib/api";
import { getSession, patchSession } from "@/lib/session";
import { stripePromise } from "@/lib/stripe";

export type PaymentIntentState =
  | "idle"
  | "creating"
  | "recovering"
  | "confirming"
  | "ready"
  | "error";

export interface ConfirmResponse {
  cross_sale: { is_compulsory: boolean; [k: string]: unknown };
  redirect_page: string;
  first_sale_usd_price: string;
  [k: string]: unknown;
}

export interface UsePaymentIntentResult {
  state: PaymentIntentState;
  clientSecret: string | undefined;
  intentId: string | undefined;
  error: string | undefined;
  /** True on return-URL-succeeded and cached-succeeded paths. Caller reads
   *  this and calls `finalizeAfterStripeSuccess(intentId)` explicitly. */
  recoveredSucceeded: boolean;
  /** True only when the 30s processing poll expired without transitioning
   *  to `succeeded`. Caller can render a "Continue anyway" CTA. */
  processingTimedOut: boolean;
  retry: () => void;
  /**
   * Creates (or reuses a cached) PaymentIntent for the requested method.
   * Called on demand — when the user clicks the Card / PayPal / GPay button.
   * Resolves to the Stripe `client_secret` + `id`; the same values are also
   * exposed via `clientSecret` / `intentId` after the state transitions to
   * `'ready'`.
   */
  createIntent: (methodType: string) => Promise<{
    clientSecret: string;
    intentId: string;
  }>;
  finalizeAfterStripeSuccess: (intentId: string) => Promise<ConfirmResponse>;
}

// PRD §4.3 reuse cap; Stripe intents live 24h and we keep a 1h margin to
// avoid races where a cached intent dies mid-confirm.
const REUSE_TTL_MS = 23 * 60 * 60 * 1000;
// PRD §4.4.4.1.c: poll every 2s up to 30s for `redirect_status=processing`.
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30_000;

interface CachedIntent {
  id: string;
  clientSecret: string;
  keyedBy: {
    qidRaw: number;
    prcId: string;
    mdid: string;
    /** The `payment_method_type` the intent was created for. Added so a
     *  user who clicks Card first and then PayPal gets a new intent with
     *  the right type, rather than reusing the card intent. */
    methodType: string;
  };
  createdAt: number;
}

interface RetrievedIntent {
  status?: string;
  id?: string;
  last_payment_error?: { message?: string };
}

// Minimal structural type for the portion of the Stripe SDK the hook uses.
// Keeps the hook decoupled from `@stripe/stripe-js`' internal naming.
interface StripeLike {
  retrievePaymentIntent: (
    clientSecret: string,
  ) => Promise<{ paymentIntent?: RetrievedIntent; error?: { message: string } }>;
}

function isKeyedByMatch(
  cached: CachedIntent,
  session: ReturnType<typeof getSession>,
  methodType: string,
): boolean {
  return (
    cached.keyedBy.qidRaw === session.qidRaw &&
    cached.keyedBy.prcId === (session.prcId ?? "") &&
    cached.keyedBy.mdid === (session.mdid ?? "") &&
    cached.keyedBy.methodType === methodType
  );
}

function isCacheFresh(createdAt: number, now: number): boolean {
  return now - createdAt < REUSE_TTL_MS;
}

/**
 * Strips the three Stripe-return params from `search` while preserving the
 * rest. Returns the new search string (including leading `?` when non-empty).
 */
function stripStripeParamsFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  params.delete("payment_intent");
  params.delete("payment_intent_client_secret");
  params.delete("redirect_status");
  const remaining = params.toString();
  return remaining ? `?${remaining}` : "";
}

export function usePaymentIntent(): UsePaymentIntentResult {
  const [state, setState] = useState<PaymentIntentState>("idle");
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [intentId, setIntentId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [recoveredSucceeded, setRecoveredSucceeded] = useState(false);
  const [processingTimedOut, setProcessingTimedOut] = useState(false);

  // Bumps on every `retry()` call so the mount effect can re-run.
  const [attempt, setAttempt] = useState(0);

  /**
   * POSTs `create-payment-intent` on demand for a specific payment method.
   *
   * Called from the per-method onClick handlers in CheckoutForm — the user's
   * choice of method is what drives intent creation. This avoids the old
   * behaviour of creating an unused intent for every visitor regardless of
   * whether they ever submit payment.
   *
   * Reuses the cached session intent when the `(qidRaw, prcId, mdid,
   * methodType)` tuple still matches and the intent is less than the reuse
   * TTL old. Otherwise creates a fresh intent and overwrites the cache.
   *
   * Observed 2026-04-22 against
   * `https://api-cellonnexus-dev.project-demo.info/api/v1/payment/stripe/create-payment-intent`:
   * `apiPost<T>` unwraps `{ meta, data }` so the generic `T` is the inner
   * shape `{ client_secret, id }` (Postman contract + PRD §4.3).
   */
  const createIntent = useCallback(
    async (methodType: string): Promise<{
      clientSecret: string;
      intentId: string;
    }> => {
      const session = getSession();
      if (!session.pricingInfo) {
        // AC 5 — no pricing means no intent.
        const err = "Pricing not ready";
        setError(err);
        setState("error");
        throw new Error(err);
      }

      // Cache hit — reuse without a network call.
      const cached = session.paymentIntent as CachedIntent | undefined;
      if (
        cached &&
        isKeyedByMatch(cached, session, methodType) &&
        isCacheFresh(cached.createdAt, Date.now())
      ) {
        setClientSecret(cached.clientSecret);
        setIntentId(cached.id);
        setError(undefined);
        setState("ready");
        return { clientSecret: cached.clientSecret, intentId: cached.id };
      }

      setState("creating");
      setError(undefined);
      try {
        const body = {
          email: session.email,
          quiz_result_id: session.qidRaw,
          // Backend requires this field even when empty. Confirmed against the
          // dev backend — absence returns a 422.
          user_on_iqbooster: "",
          payment_method_type: methodType,
          prc_id: session.prcId ?? "",
          pricing_discount: session.mdid ? { mdid: session.mdid } : "",
        };
        const data = await apiPost<{ client_secret: string; id: string }>(
          "payment/stripe/create-payment-intent",
          body,
        );

        patchSession({
          paymentIntent: {
            id: data.id,
            clientSecret: data.client_secret,
            keyedBy: {
              qidRaw: session.qidRaw as number,
              prcId: session.prcId ?? "",
              mdid: session.mdid ?? "",
              methodType,
            },
            createdAt: Date.now(),
          },
        });
        setClientSecret(data.client_secret);
        setIntentId(data.id);
        setState("ready");
        return { clientSecret: data.client_secret, intentId: data.id };
      } catch (e) {
        setError((e as Error).message);
        setState("error");
        throw e;
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let pollHandle: ReturnType<typeof setInterval> | null = null;
    let pollTimeoutHandle: ReturnType<typeof setTimeout> | null = null;

    async function run() {
      const stripe = (await stripePromise) as StripeLike | null;
      if (cancelled) return;

      // Mount step A — URL-return detection (PRD §4.4.4 step 1).
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const urlPi = params.get("payment_intent");
      const urlSecret = params.get("payment_intent_client_secret");
      const urlStatus = params.get("redirect_status");

      if (urlPi && urlSecret && urlStatus) {
        // Strip Stripe params before any async work (PRD §9 R8).
        const strippedSearch = stripStripeParamsFromSearch(search);
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${strippedSearch}${window.location.hash}`,
        );

        if (!stripe) {
          setError("Stripe failed to load");
          setState("error");
          return;
        }

        if (urlStatus === "succeeded") {
          setState("recovering");
          const res = await stripe.retrievePaymentIntent(urlSecret);
          if (cancelled) return;
          const pi = res.paymentIntent;
          if (pi?.status === "succeeded") {
            setIntentId(pi.id);
            setClientSecret(urlSecret);
            setRecoveredSucceeded(true);
            setState("ready");
          } else {
            setError(pi?.last_payment_error?.message ?? "Payment failed");
            patchSession({ paymentIntent: undefined });
            setState("error");
          }
          return;
        }

        if (urlStatus === "failed") {
          setState("recovering");
          const res = await stripe.retrievePaymentIntent(urlSecret);
          if (cancelled) return;
          setError(
            res.paymentIntent?.last_payment_error?.message ?? "Payment failed",
          );
          patchSession({ paymentIntent: undefined });
          setState("error");
          return;
        }

        if (urlStatus === "processing") {
          setState("recovering");
          const startedAt = Date.now();
          // Each tick fires one retrieve; on success we clear both timers.
          const tick = async () => {
            if (cancelled) return;
            const res = await stripe.retrievePaymentIntent(urlSecret);
            if (cancelled) return;
            const pi = res.paymentIntent;
            if (pi?.status === "succeeded") {
              if (pollHandle) clearInterval(pollHandle);
              if (pollTimeoutHandle) clearTimeout(pollTimeoutHandle);
              setIntentId(pi.id);
              setClientSecret(urlSecret);
              setRecoveredSucceeded(true);
              setState("ready");
            } else if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
              if (pollHandle) clearInterval(pollHandle);
              if (pollTimeoutHandle) clearTimeout(pollTimeoutHandle);
              setIntentId(pi?.id ?? urlPi);
              setClientSecret(urlSecret);
              setProcessingTimedOut(true);
              setError("Payment is still processing");
              setState("ready");
            }
          };
          pollHandle = setInterval(() => {
            void tick();
          }, POLL_INTERVAL_MS);
          pollTimeoutHandle = setTimeout(() => {
            if (pollHandle) clearInterval(pollHandle);
            if (!cancelled) {
              setProcessingTimedOut(true);
              setError("Payment is still processing");
              setState("ready");
            }
          }, POLL_TIMEOUT_MS);
          return;
        }
      }

      // Mount step B — cached-succeeded detection. If the user closed the
      // tab between Stripe success and our backend confirm, recover the
      // already-succeeded intent so the caller's auto-finalise observer can
      // finalise it without re-charging.
      const sessionSnapshot = getSession();
      const cached = sessionSnapshot.paymentIntent as CachedIntent | undefined;

      if (cached && stripe) {
        const res = await stripe.retrievePaymentIntent(cached.clientSecret);
        if (cancelled) return;
        const status = res.paymentIntent?.status;
        if (status === "succeeded") {
          setIntentId(cached.id);
          setClientSecret(cached.clientSecret);
          setRecoveredSucceeded(true);
          setState("ready");
          return;
        }
        if (status === "canceled") {
          patchSession({ paymentIntent: undefined });
        }
        // Non-succeeded, non-canceled intents (e.g. `requires_payment_method`
        // or `processing`) are left alone — createIntent() will inspect the
        // cache and decide whether to reuse on the next user click.
      }

      // No proactive creation. The hook's initial state is already `idle`;
      // leaving it alone here avoids clobbering a later `createIntent()`
      // call that a fast-clicking test or user might have kicked off
      // before the mount effect finished its async work.
    }

    void run();

    return () => {
      cancelled = true;
      if (pollHandle) clearInterval(pollHandle);
      if (pollTimeoutHandle) clearTimeout(pollTimeoutHandle);
    };
    // `attempt` drives re-entry for `retry()`. Other inputs are read from
    // sessionStorage on each run, so no further deps are needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = useCallback(() => {
    setError(undefined);
    setRecoveredSucceeded(false);
    setProcessingTimedOut(false);
    setAttempt((n) => n + 1);
  }, []);

  /**
   * Posts the backend confirm (PRD §4.5) and merges `cross_sale` into
   * `session.pricingInfo.transactions.cross_sale`. Clears the cached
   * `paymentIntent` only on success so the caller's Retry UX can re-invoke
   * on failure without losing the intent id.
   */
  const finalizeAfterStripeSuccess = useCallback(
    async (piId: string): Promise<ConfirmResponse> => {
      const session = getSession();
      setState("confirming");
      try {
        const response = await apiPost<ConfirmResponse>(
          "payment/stripe/first-sale/payments/confirm",
          {
            payment_intent_id: piId,
            quiz_result_id: session.qidRaw,
            user_on_iqbooster: "",
            prc_id: session.prcId ?? "",
            pricing_discount: session.mdid ? { mdid: session.mdid } : "",
          },
        );

        // Merge cross_sale into pricingInfo.transactions.cross_sale + set
        // cross_sale_compulsory if not already present (PRD §4.5).
        const current = session.pricingInfo;
        if (current) {
          const existingTxns = (current as unknown as {
            transactions?: Record<string, unknown>;
          }).transactions;
          const nextPricing = {
            ...current,
            transactions: {
              ...(existingTxns ?? {}),
              cross_sale: response.cross_sale,
            },
            cross_sale_compulsory:
              current.cross_sale_compulsory ?? response.cross_sale.is_compulsory,
          };
          patchSession({ pricingInfo: nextPricing });
        }

        patchSession({ paymentIntent: undefined });
        setState("ready");
        return response;
      } catch (e) {
        setError((e as Error).message);
        setState("error");
        throw e;
      }
    },
    [],
  );

  return {
    state,
    clientSecret,
    intentId,
    error,
    recoveredSucceeded,
    processingTimedOut,
    retry,
    createIntent,
    finalizeAfterStripeSuccess,
  };
}
