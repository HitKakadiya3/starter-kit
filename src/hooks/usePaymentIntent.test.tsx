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

import type { PaymentIntentMethodType } from "./usePaymentIntent";
import { WALLET_METHOD_TYPE } from "./usePaymentIntent";

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
    // Simulates a legacy session pre-populated with the now-removed
    // `'google_pay'` literal (sessionStorage written by a pre-ECE build that
    // is still resident in a user's tab). The cast bypasses the narrowed
    // `PaymentIntentMethodType` union (collapsed to `'card'` per Design Doc
    // KDD-3) so we can exercise the legacy-cache-byte-equality miss path —
    // KDD-2's whole point is that no migration code is needed because the
    // structural `===` check in `isKeyedByMatch` already rejects the stale
    // entry. The companion `createIntent` call uses a non-`'card'` literal
    // (also cast) to drive the methodType-mismatch branch and assert a
    // fresh POST is issued. The narrower union does not eliminate this
    // runtime path; it only prevents NEW callers from passing the legacy
    // value at compile time.
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_card",
        clientSecret: "cs_card",
        keyedBy: {
          qidRaw: 42,
          prcId: "",
          mdid: "",
          methodType: "card" as PaymentIntentMethodType,
        },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_card" },
    });
    mockedApiPost.mockResolvedValueOnce({
      client_secret: "cs_gpay",
      id: "pi_gpay",
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent(
        "google_pay" as unknown as PaymentIntentMethodType,
      );
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/create-payment-intent",
      expect.objectContaining({ payment_method_type: "google_pay" }),
    );
    expect(getSession().paymentIntent?.keyedBy.methodType).toBe("google_pay");
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

  // ===========================================================================
  // SKELETONS — ECE wallet path: legacy cache-key migration
  // ===========================================================================
  //
  // Generated: 2026-04-29
  // Source:
  //   - Design Doc `docs/design/module-3-stripe-wallets-ece.md`
  //     §KDD-2 "Cache invalidation strategy for legacy keyedBy.methodType ===
  //     'google_pay': NATURAL CACHE MISS"
  //   - Design Doc AC-D07; PRD §8 AC 25a
  //   - Design Doc §Test Strategy → Unit tests bullet 4 (usePaymentIntent
  //     extension): "Cache hit: legacy keyedBy.methodType === 'google_pay' +
  //     new wallet payment_method_type call → fresh POST issued; cache
  //     overwritten."
  //
  // Status: SKELETONS ONLY — bodies are placeholders for the task-executor
  // to fill in once `PaymentIntentMethodType` is widened (Design Doc Files
  // Changed table → `usePaymentIntent.ts` Modify row).
  //
  // Note: the existing test
  //   "createIntent creates a fresh intent when methodType differs from the
  //    cache"
  // already covers the structural case (card → google_pay miss). The NEW
  // skeletons below specifically capture the WALLET-PATH MIGRATION semantic
  // — when the *new* wallet `payment_method_type` (default candidate 'card'
  // per KDD-3) is sent against a session pre-populated with the *legacy*
  // 'google_pay' value. The two are not redundant because once the union
  // is widened, callers will pass the new value and the regression risk
  // shifts to that exact call shape.

  it("AC-D07 / KDD-2: legacy keyedBy.methodType === 'google_pay' + new wallet methodType call → fresh POST + cache overwritten", async () => {
    // KDD-2 NATURAL CACHE MISS — a session pre-populated with the (now
    // removed) legacy `'google_pay'` literal must NOT cache-hit when the
    // wallet path issues `createIntent(WALLET_METHOD_TYPE)`. The cast
    // simulates legacy sessionStorage data left by a pre-ECE build still
    // resident in a user's tab; runtime byte-equality on `methodType`
    // rejects it without any explicit migration code (per ADR-0001 OQ#3
    // resolution).
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_legacy",
        clientSecret: "cs_legacy",
        keyedBy: {
          qidRaw: 42,
          prcId: "",
          mdid: "",
          methodType: "google_pay" as unknown as PaymentIntentMethodType,
        },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_legacy" },
    });
    mockedApiPost.mockResolvedValueOnce({
      client_secret: "cs_wallet_new",
      id: "pi_wallet_new",
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent(WALLET_METHOD_TYPE);
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/create-payment-intent",
      expect.objectContaining({ payment_method_type: WALLET_METHOD_TYPE }),
    );
    expect(result.current.clientSecret).toBe("cs_wallet_new");
    expect(result.current.intentId).toBe("pi_wallet_new");
    expect(result.current.state).toBe("ready");
    expect(result.current.error).toBeUndefined();

    const cached = getSession().paymentIntent;
    expect(cached?.keyedBy.methodType).toBe(WALLET_METHOD_TYPE);
    expect(cached?.id).toBe("pi_wallet_new");
    expect(cached?.clientSecret).toBe("cs_wallet_new");
  });

  it("no regression: card-path cache reuse still works after the union narrowing (createIntent('card') hits a 'card'-keyed cache)", async () => {
    // Regression guard for Design Doc §Module / hook contracts table —
    // "createIntent signature: Unchanged" and "Cache key: Unchanged
    // (same shape; widened/narrowed union only)". A 'card'-keyed cache
    // within TTL must still cache-hit when `createIntent('card')` runs.
    // Distinct from the existing "createIntent reuses the cache when
    // methodType + keyedBy match" test in that the assertion explicitly
    // covers the post-narrowing single-literal union — proving the
    // collapse of `'card' | 'google_pay'` to `'card'` did not regress the
    // happy path.
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_card_cached",
        clientSecret: "cs_card_cached",
        keyedBy: { qidRaw: 42, prcId: "", mdid: "", methodType: "card" },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_card_cached" },
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent("card");
    });

    expect(mockedApiPost).not.toHaveBeenCalled();
    expect(result.current.clientSecret).toBe("cs_card_cached");
    expect(result.current.intentId).toBe("pi_card_cached");
    expect(result.current.state).toBe("ready");
  });

  it("no regression: legacy 'paypal' methodType cache entry yields a natural miss against a 'card' call (no accidental cross-method cache hit)", async () => {
    // Non-regression for the cache-key shape: a legacy/foreign cache
    // entry stamped with a `methodType` literal that is NOT in the
    // current narrowed union (e.g. `'paypal'` from a hypothetical past
    // build, or external data planted in sessionStorage) must NOT
    // cache-hit when `createIntent('card')` runs. Cast through `unknown`
    // because `'paypal'` is intentionally excluded from
    // `PaymentIntentMethodType` per Design Doc — `usePayPalCheckout`
    // uses the native `@paypal/paypal-js` SDK and never calls
    // `createIntent`. The runtime equality check still distinguishes
    // string values regardless of their type-level legality, which is
    // exactly the property KDD-2 relies on.
    patchSession({
      qidRaw: 42,
      email: "a@b.co",
      pricingInfo: makePricing(),
      paymentIntent: {
        id: "pi_pp_legacy",
        clientSecret: "cs_pp_legacy",
        keyedBy: {
          qidRaw: 42,
          prcId: "",
          mdid: "",
          methodType: "paypal" as unknown as PaymentIntentMethodType,
        },
        createdAt: Date.now(),
      },
    });
    retrievePaymentIntentMock.mockResolvedValue({
      paymentIntent: { status: "requires_payment_method", id: "pi_pp_legacy" },
    });
    mockedApiPost.mockResolvedValueOnce({
      client_secret: "cs_card_fresh",
      id: "pi_card_fresh",
    });

    const { result } = renderHook(() => usePaymentIntent());
    await waitFor(() => expect(result.current.state).toBe("idle"));

    await act(async () => {
      await result.current.createIntent("card");
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/stripe/create-payment-intent",
      expect.objectContaining({ payment_method_type: "card" }),
    );
    expect(result.current.clientSecret).toBe("cs_card_fresh");
    expect(getSession().paymentIntent?.keyedBy.methodType).toBe("card");
    expect(getSession().paymentIntent?.id).toBe("pi_card_fresh");
  });
});
