import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  qidParamForRoute,
  resolveEffectiveRedirect,
  resolveRedirect,
} from "./redirectRouter";

describe("resolveRedirect", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("maps INITIAL_PAYMENT_PAGE to /checkout", () => {
    expect(resolveRedirect("INITIAL_PAYMENT_PAGE")).toBe("/checkout");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("maps CROSS_SELL_OFFER_PAGE to /cross-sell", () => {
    expect(resolveRedirect("CROSS_SELL_OFFER_PAGE")).toBe("/cross-sell");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("maps CUSTOMER_DETAILS_PAGE to /details", () => {
    expect(resolveRedirect("CUSTOMER_DETAILS_PAGE")).toBe("/details");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("maps THANK_YOU_PAGE to /results", () => {
    expect(resolveRedirect("THANK_YOU_PAGE")).toBe("/results");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("maps PAYMENT_FAILED_PAGE to /checkout", () => {
    expect(resolveRedirect("PAYMENT_FAILED_PAGE")).toBe("/checkout");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("falls back to /checkout when page is undefined", () => {
    expect(resolveRedirect(undefined)).toBe("/checkout");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("falls back to /checkout when page is empty string", () => {
    expect(resolveRedirect("")).toBe("/checkout");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("falls back to /checkout and warns exactly once on unknown value", () => {
    expect(resolveRedirect("BANANA")).toBe("/checkout");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const warnMessage = String(warnSpy.mock.calls[0][0]);
    expect(warnMessage).toContain("BANANA");
  });
});

describe("resolveEffectiveRedirect", () => {
  it("passes through unchanged when no flags are set", () => {
    expect(resolveEffectiveRedirect("CROSS_SELL_OFFER_PAGE", {})).toBe(
      "CROSS_SELL_OFFER_PAGE",
    );
    expect(resolveEffectiveRedirect("CUSTOMER_DETAILS_PAGE", {})).toBe(
      "CUSTOMER_DETAILS_PAGE",
    );
    expect(resolveEffectiveRedirect("THANK_YOU_PAGE", {})).toBe(
      "THANK_YOU_PAGE",
    );
  });

  it("overrides CROSS_SELL_OFFER_PAGE → CUSTOMER_DETAILS_PAGE when crossSellResolved", () => {
    expect(
      resolveEffectiveRedirect("CROSS_SELL_OFFER_PAGE", {
        crossSellResolved: true,
      }),
    ).toBe("CUSTOMER_DETAILS_PAGE");
  });

  it("overrides CUSTOMER_DETAILS_PAGE → THANK_YOU_PAGE when customerUpdateSubmitted", () => {
    expect(
      resolveEffectiveRedirect("CUSTOMER_DETAILS_PAGE", {
        customerUpdateSubmitted: true,
      }),
    ).toBe("THANK_YOU_PAGE");
  });

  it("cascades CROSS_SELL_OFFER_PAGE → THANK_YOU_PAGE when both flags are set", () => {
    // The bug: backend keeps echoing CROSS_SELL_OFFER_PAGE after the user
    // skipped the upsell client-side and then completed the details form.
    // Without the cascade, the user gets bounced through /cross-sell →
    // /details and the form re-renders. With it, they go straight to
    // /results.
    expect(
      resolveEffectiveRedirect("CROSS_SELL_OFFER_PAGE", {
        crossSellResolved: true,
        customerUpdateSubmitted: true,
      }),
    ).toBe("THANK_YOU_PAGE");
  });

  it("does not cascade when only the second flag is set", () => {
    // crossSellResolved is required to traverse the first hop; without it
    // the override stays at CROSS_SELL_OFFER_PAGE.
    expect(
      resolveEffectiveRedirect("CROSS_SELL_OFFER_PAGE", {
        customerUpdateSubmitted: true,
      }),
    ).toBe("CROSS_SELL_OFFER_PAGE");
  });

  it("does not over-apply when redirect is already past the override stage", () => {
    expect(
      resolveEffectiveRedirect("THANK_YOU_PAGE", {
        crossSellResolved: true,
        customerUpdateSubmitted: true,
      }),
    ).toBe("THANK_YOU_PAGE");

    expect(
      resolveEffectiveRedirect("INITIAL_PAYMENT_PAGE", {
        crossSellResolved: true,
        customerUpdateSubmitted: true,
      }),
    ).toBe("INITIAL_PAYMENT_PAGE");
  });

  it("returns undefined unchanged", () => {
    expect(
      resolveEffectiveRedirect(undefined, {
        crossSellResolved: true,
        customerUpdateSubmitted: true,
      }),
    ).toBeUndefined();
  });
});

describe("qidParamForRoute", () => {
  it("returns the encrypted qid for /results", () => {
    expect(qidParamForRoute("/results", 42, "ENC123")).toBe("ENC123");
  });

  it("returns the encrypted qid for /career-report (post-purchase route)", () => {
    expect(qidParamForRoute("/career-report", 42, "ENC123")).toBe("ENC123");
  });

  it("returns the raw qid for funnel routes that hit /questions/results", () => {
    expect(qidParamForRoute("/checkout", 42, "ENC123")).toBe("42");
    expect(qidParamForRoute("/cross-sell", 42, "ENC123")).toBe("42");
    expect(qidParamForRoute("/details", 42, "ENC123")).toBe("42");
  });

  it("URI-encodes encrypted qids that contain reserved characters", () => {
    expect(qidParamForRoute("/results", 42, "a/b+c")).toBe("a%2Fb%2Bc");
    expect(qidParamForRoute("/career-report", 42, "a/b+c")).toBe("a%2Fb%2Bc");
  });

  it("returns an empty string when both ids are missing", () => {
    expect(qidParamForRoute("/results", null, null)).toBe("");
    expect(qidParamForRoute("/career-report", undefined, undefined)).toBe("");
    expect(qidParamForRoute("/checkout", null, null)).toBe("");
  });
});
