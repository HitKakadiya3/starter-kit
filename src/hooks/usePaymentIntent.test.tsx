/**
 * Unit tests for `usePaymentIntent` — the on-demand intent lifecycle hook.
 *
 * After the switch to on-demand intent creation, the hook no longer POSTs
 * on mount. Creation only happens when the caller invokes
 * `createIntent(methodType)`. Mount-time logic is limited to return-URL
 * recovery and cached-succeeded recovery.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { clearSession, getSession, patchSession } from "@/lib/session";

const retrievePaymentIntentMock = vi.fn();

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() =>
    Promise.resolve({
      retrievePaymentIntent: (clientSecret: string) =>
        retrievePaymentIntentMock(clientSecret),
    }),
  ),
}));

vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      public readonly status: number,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

const mockedApiPost = vi.mocked(apiPost);

import { usePaymentIntent } from "./usePaymentIntent";

function makePricing(overrides: Partial<PricingInfo> = {}): PricingInfo {
  return {
    currency_code: "USD",
    first_sale_price: "4.99",
    first_sale_price_label: "$4.99",
    cross_sale_price: "9.99",
    cross_sale_price_label: "$9.99",
    subscription_price: "29.99",
    subscription_price_label: "$29.99",
    payment_gateways: [{ id: "1", name: "Stripe" }],
    ...overrides,
  };
}

function setUrl(search: string): void {
  window.history.replaceState(null, "", `/checkout${search}`);
}

describe("usePaymentIntent (on-demand)", () => {
  beforeEach(() => {
    mockedApiPost.mockReset();
    retrievePaymentIntentMock.mockReset();
    // Default to a benign response so tests that don't care about Stripe's
    // mount-time retrieve don't surface an unhandled rejection when the
    // mount effect's step B runs with a cached intent.
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method" },
    });
    clearSession();
    setUrl("");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearSession();
    setUrl("");
  });

  it("stays in idle on mount with no return params and no cached intent — no POST fires", async () => {
    patchSession({ qidRaw: 42, email: "a@b.co", pricingInfo: makePricing() });
    const { result } = renderHook(() => usePaymentIntent());

    await waitFor(() => {
      expect(result.current.state).toBe("idle");
    });
    expect(mockedApiPost).not.toHaveBeenCalled();
  });

  it("createIntent('card') POSTs with payment_method_type 'card' and caches the intent", async () => {
    patchSession({ qidRaw: 42, email: "a@b.co", pricingInfo: makePricing() });
    mockedApiPost.mockResolvedValueOnce({
      client_secret: "cs_card",
      id: "pi_card",
    });

    const { result } = renderHook(() => usePaymentIntent());

    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent("card");
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/create-payment-intent",
      expect.objectContaining({
        payment_method_type: "card",
        quiz_result_id: 42,
        user_on_iqbooster: "",
      }),
    );
    expect(result.current.clientSecret).toBe("cs_card");
    expect(result.current.intentId).toBe("pi_card");
    expect(result.current.state).toBe("ready");

    const cached = getSession().paymentIntent;
    expect(cached?.keyedBy.methodType).toBe("card");
    expect(cached?.keyedBy.qidRaw).toBe(42);
    expect(cached?.clientSecret).toBe("cs_card");
  });

  it("createIntent reuses the cache when methodType + keyedBy match (no second POST)", async () => {
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_cached",
        clientSecret: "cs_cached",
        keyedBy: { qidRaw: 42, prcId: "", mdid: "", methodType: "card" },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_cached" },
    });

    const { result } = renderHook(() => usePaymentIntent());

    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent("card");
    });

    expect(mockedApiPost).not.toHaveBeenCalled();
    expect(result.current.clientSecret).toBe("cs_cached");
    expect(result.current.intentId).toBe("pi_cached");
  });

  it("createIntent creates a fresh intent when methodType differs from the cache", async () => {
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_card",
        clientSecret: "cs_card",
        keyedBy: { qidRaw: 42, prcId: "", mdid: "", methodType: "card" },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_card" },
    });
    mockedApiPost.mockResolvedValueOnce({
      client_secret: "cs_paypal",
      id: "pi_paypal",
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent("paypal");
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/create-payment-intent",
      expect.objectContaining({ payment_method_type: "paypal" }),
    );
    expect(getSession().paymentIntent?.keyedBy.methodType).toBe("paypal");
  });

  it("on mount, URL return params with redirect_status=succeeded set recoveredSucceeded + strip the params", async () => {
    patchSession({ qidRaw: 42, email: "a@b.co", pricingInfo: makePricing() });
    setUrl(
      "?payment_intent=pi_ret&payment_intent_client_secret=cs_ret&redirect_status=succeeded",
    );
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_ret" },
    });

    const { result } = renderHook(() => usePaymentIntent());

    await waitFor(() => {
      expect(result.current.recoveredSucceeded).toBe(true);
    });
    expect(result.current.intentId).toBe("pi_ret");
    expect(result.current.state).toBe("ready");
    expect(window.location.search).toBe("");
  });

  it("on mount, cached intent reported succeeded by Stripe triggers recoveredSucceeded (tab-close recovery)", async () => {
    patchSession({
      qidRaw: 42,
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_cached",
        clientSecret: "cs_cached",
        keyedBy: { qidRaw: 42, prcId: "", mdid: "", methodType: "card" },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_cached" },
    });

    const { result } = renderHook(() => usePaymentIntent());

    await waitFor(() => {
      expect(result.current.recoveredSucceeded).toBe(true);
    });
    expect(result.current.intentId).toBe("pi_cached");
    expect(result.current.clientSecret).toBe("cs_cached");
  });

  it("finalizeAfterStripeSuccess POSTs backend confirm and merges cross_sale into pricingInfo.transactions", async () => {
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_done",
        clientSecret: "cs_done",
        keyedBy: { qidRaw: 42, prcId: "", mdid: "", methodType: "card" },
        createdAt: Date.now(),
      },
    });
    mockedApiPost.mockResolvedValueOnce({
      cross_sale: {
        is_compulsory: false,
        description: "IQ Pro",
        amount: "8.99",
        amount_cents: "899",
      },
      redirect_page: "CROSS_SELL_OFFER_PAGE",
      first_sale_usd_price: 4.99,
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    let response: Awaited<
      ReturnType<typeof result.current.finalizeAfterStripeSuccess>
    >;
    await act(async () => {
      response = await result.current.finalizeAfterStripeSuccess("pi_done");
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/first-sale/payments/confirm",
      expect.objectContaining({
        payment_intent_id: "pi_done",
        quiz_result_id: 42,
        user_on_iqbooster: "",
      }),
    );
    expect(response!.redirect_page).toBe("CROSS_SELL_OFFER_PAGE");

    const session = getSession();
    expect(session.paymentIntent).toBeUndefined();
    const txns = (session.pricingInfo as unknown as {
      transactions: { cross_sale: { amount: string } };
    }).transactions;
    expect(txns.cross_sale.amount).toBe("8.99");
  });

  it("createIntent errors surface as state='error' and throw to the caller", async () => {
    patchSession({ qidRaw: 42, email: "a@b.co", pricingInfo: makePricing() });
    mockedApiPost.mockRejectedValueOnce(new Error("network"));

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    let caught: unknown;
    await act(async () => {
      try {
        await result.current.createIntent("card");
      } catch (e) {
        caught = e;
      }
    });

    expect((caught as Error).message).toBe("network");
    expect(result.current.state).toBe("error");
  });
});
