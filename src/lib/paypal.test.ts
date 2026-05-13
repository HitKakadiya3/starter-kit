/**
 * Unit tests for the PayPal Browser SDK loader.
 *
 * `loadScript` from `@paypal/paypal-js` is mocked so the tests stay hermetic
 * and never touch the network. Each test resets the module-level cache via
 * `_resetPayPalSdkCache()` so caching behaviour is observed in isolation.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loadScript } from "@paypal/paypal-js";

vi.mock("@paypal/paypal-js", () => ({
  loadScript: vi.fn(),
}));

const mockedLoadScript = vi.mocked(loadScript);

import { _resetPayPalSdkCache, loadPayPalSdk } from "./paypal";

describe("loadPayPalSdk", () => {
  beforeEach(() => {
    _resetPayPalSdkCache();
    mockedLoadScript.mockReset();
    vi.stubEnv("VITE_PAYPAL_CLIENT_ID_SANDBOX", "sandbox-paypal-client-id");
    vi.stubEnv("VITE_PAYPAL_CLIENT_ID_LIVE", "live-paypal-client-id");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    _resetPayPalSdkCache();
  });

  it("caches the SDK promise per mode — two consecutive calls in the same mode produce one loadScript invocation", async () => {
    const fakePayPal = { Buttons: vi.fn(), version: "8.0.0" };
    mockedLoadScript.mockResolvedValue(fakePayPal as never);

    const a = await loadPayPalSdk("sandbox");
    const b = await loadPayPalSdk("sandbox");

    expect(a).toBe(fakePayPal);
    expect(b).toBe(fakePayPal);
    expect(mockedLoadScript).toHaveBeenCalledTimes(1);
    expect(mockedLoadScript).toHaveBeenCalledWith(
      expect.objectContaining({ "client-id": "sandbox-paypal-client-id" }),
    );
  });

  it("loads each mode independently with the matching client-id", async () => {
    const fakePayPal = { Buttons: vi.fn(), version: "8.0.0" };
    mockedLoadScript.mockResolvedValue(fakePayPal as never);

    await loadPayPalSdk("sandbox");
    await loadPayPalSdk("live");

    expect(mockedLoadScript).toHaveBeenCalledTimes(2);
    expect(mockedLoadScript).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ "client-id": "sandbox-paypal-client-id" }),
    );
    expect(mockedLoadScript).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ "client-id": "live-paypal-client-id" }),
    );
  });

  it("propagates loadScript rejection and clears the cache so a retry reloads", async () => {
    mockedLoadScript.mockRejectedValueOnce(new Error("network down"));

    await expect(loadPayPalSdk("sandbox")).rejects.toThrow("network down");

    // Second call should attempt the network load again.
    const fakePayPal = { Buttons: vi.fn(), version: "8.0.0" };
    mockedLoadScript.mockResolvedValueOnce(fakePayPal as never);

    const result = await loadPayPalSdk("sandbox");
    expect(result).toBe(fakePayPal);
    expect(mockedLoadScript).toHaveBeenCalledTimes(2);
  });

  it("rejects when VITE_PAYPAL_CLIENT_ID_SANDBOX is missing for sandbox mode", async () => {
    vi.stubEnv("VITE_PAYPAL_CLIENT_ID_SANDBOX", "");

    await expect(loadPayPalSdk("sandbox")).rejects.toThrow(
      "VITE_PAYPAL_CLIENT_ID_SANDBOX is not set",
    );
    expect(mockedLoadScript).not.toHaveBeenCalled();
  });

  it("rejects when VITE_PAYPAL_CLIENT_ID_LIVE is missing for live mode", async () => {
    vi.stubEnv("VITE_PAYPAL_CLIENT_ID_LIVE", "");

    await expect(loadPayPalSdk("live")).rejects.toThrow(
      "VITE_PAYPAL_CLIENT_ID_LIVE is not set",
    );
    expect(mockedLoadScript).not.toHaveBeenCalled();
  });

  it("rejects when loadScript resolves to null (PayPal's documented null return)", async () => {
    mockedLoadScript.mockResolvedValueOnce(null);

    await expect(loadPayPalSdk("sandbox")).rejects.toThrow(
      "PayPal SDK failed to load",
    );
  });
});
