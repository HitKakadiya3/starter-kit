import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { clearSession, patchSession } from "@/lib/session";

import { usePricing } from "./usePricing";

vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
}));

const mockedApiPost = vi.mocked(apiPost);

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function wrapperFor(qc: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

// Helper: build a PricingInfo with a settable `first_sale_price`.
function makePricing(first_sale_price: string, extra: Partial<PricingInfo> = {}): PricingInfo {
  return {
    currency_code: "USD",
    first_sale_price,
    first_sale_price_label: `$${first_sale_price}`,
    cross_sale_price: "9.99",
    cross_sale_price_label: "$9.99",
    subscription_price: "29.99",
    subscription_price_label: "$29.99",
    payment_gateways: [{ id: "1", name: "Stripe" }],
    ...extra,
  };
}

describe("usePricing", () => {
  beforeEach(() => {
    mockedApiPost.mockReset();
    clearSession();
  });

  afterEach(() => {
    clearSession();
    vi.restoreAllMocks();
  });

  it("post-submit, no promo — returns session pricingInfo without any network call", async () => {
    const sessionPricing = makePricing("6.99");
    patchSession({ qidRaw: 42, pricingInfo: sessionPricing });

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    expect(result.current.current).toEqual(sessionPricing);
    expect(result.current.strikethrough).toBeUndefined();
    expect(result.current.hasPromo).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(mockedApiPost).not.toHaveBeenCalled();
  });

  it("post-submit, with promo, different base price — runs base query and surfaces strikethrough", async () => {
    const sessionPricing = makePricing("4.99");
    const baseResult = makePricing("6.99");
    patchSession({ qidRaw: 42, pricingInfo: sessionPricing, mdid: "50" });

    mockedApiPost.mockResolvedValueOnce(baseResult);

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.strikethrough).toEqual(baseResult);
    });

    expect(result.current.current).toEqual(sessionPricing);
    expect(result.current.hasPromo).toBe(true);
    // Only the base query fires — current came from session, not a promo call.
    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith("price", {});
  });

  it("post-submit, with promo, identical base price — strikethrough suppressed by equal-price guard", async () => {
    const sessionPricing = makePricing("6.99");
    const baseResult = makePricing("6.99");
    patchSession({ qidRaw: 42, pricingInfo: sessionPricing, mdid: "50" });

    mockedApiPost.mockResolvedValueOnce(baseResult);

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(mockedApiPost).toHaveBeenCalledTimes(1);
    });

    expect(result.current.current).toEqual(sessionPricing);
    expect(result.current.strikethrough).toBeUndefined();
    expect(result.current.hasPromo).toBe(true);
  });

  it("pre-submit, no promo — returns base query result with no strikethrough; exactly one network call", async () => {
    const baseResult = makePricing("6.99");
    mockedApiPost.mockResolvedValueOnce(baseResult);

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.current).toEqual(baseResult);
    });

    expect(result.current.strikethrough).toBeUndefined();
    expect(result.current.hasPromo).toBe(false);
    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith("price", {});
  });

  it("pre-submit, promo with real discount — current is promo, strikethrough is base", async () => {
    const baseResult = makePricing("6.99");
    const promoResult = makePricing("4.99");
    patchSession({ mdid: "50" });

    // apiPost is called twice — the order depends on React Query scheduling.
    // Route by body contents to keep the test deterministic.
    mockedApiPost.mockImplementation(async (_path, body) => {
      const b = body as Record<string, unknown> | undefined;
      if (b && b.pricing_discount && typeof b.pricing_discount === "object") {
        return promoResult;
      }
      return baseResult;
    });

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.current).toEqual(promoResult);
    });

    expect(result.current.strikethrough).toEqual(baseResult);
    expect(result.current.hasPromo).toBe(true);
  });

  it("pre-submit, promo with identical price — no strikethrough", async () => {
    const baseResult = makePricing("6.99");
    const promoResult = makePricing("6.99");
    patchSession({ mdid: "50" });

    mockedApiPost.mockImplementation(async (_path, body) => {
      const b = body as Record<string, unknown> | undefined;
      if (b && b.pricing_discount && typeof b.pricing_discount === "object") {
        return promoResult;
      }
      return baseResult;
    });

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.current).toEqual(promoResult);
    });

    expect(result.current.strikethrough).toBeUndefined();
    expect(result.current.hasPromo).toBe(true);
  });

  it("pre-submit, promo query errors — hook reports isError (no silent fallback to base)", async () => {
    const baseResult = makePricing("6.99");
    patchSession({ mdid: "50" });

    mockedApiPost.mockImplementation(async (_path, body) => {
      const b = body as Record<string, unknown> | undefined;
      if (b && b.pricing_discount && typeof b.pricing_discount === "object") {
        throw new Error("promo failed");
      }
      return baseResult;
    });

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("AC 11 defensive — both prcId and mdid set: prefers mdid, warns once, cache key uses mdid", async () => {
    const baseResult = makePricing("6.99");
    const promoResult = makePricing("4.99");
    patchSession({ prcId: "ABC", mdid: "50" });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mockedApiPost.mockImplementation(async (_path, body) => {
      const b = body as Record<string, unknown> | undefined;
      if (b && b.pricing_discount && typeof b.pricing_discount === "object") {
        return promoResult;
      }
      return baseResult;
    });

    const qc = makeQueryClient();
    const { result } = renderHook(() => usePricing(), {
      wrapper: wrapperFor(qc),
    });

    await waitFor(() => {
      expect(result.current.current).toEqual(promoResult);
    });

    // The promo call body prefers mdid — body shape should be { prc_id: "ABC", pricing_discount: { mdid: "50" } }.
    const promoCall = mockedApiPost.mock.calls.find(([, body]) => {
      const b = body as Record<string, unknown> | undefined;
      return !!(b && b.pricing_discount && typeof b.pricing_discount === "object");
    });
    expect(promoCall).toBeDefined();
    expect(promoCall?.[1]).toEqual({
      prc_id: "ABC",
      pricing_discount: { mdid: "50" },
    });

    // Cache discriminator used mdid (not prcId): React Query's queryKey is
    // observable via the client's cache.
    const keys = qc.getQueryCache().getAll().map((q) => q.queryKey);
    expect(keys).toContainEqual(["price", "promo", "50"]);

    // Warn called exactly once, with both keywords.
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const msg = String(warnSpy.mock.calls[0][0]);
    expect(msg).toContain("prcId");
    expect(msg).toContain("mdid");
  });
});
