import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveRedirect } from "./redirectRouter";

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
