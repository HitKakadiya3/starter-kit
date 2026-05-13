import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `src/lib/stripe.ts` reads the `VITE_STRIPE_PUBLISHABLE_KEY_{LIVE,SANDBOX}`
// pair via `import.meta.env`. To vary the key/DEV flag per case we stub
// each variable via `vi.stubEnv`, reset the module cache so the next
// `import()` re-evaluates the loader, and load a fresh copy of `./stripe`.
async function loadStripeModule(args: {
  sandboxKey?: string;
  liveKey?: string;
  dev: boolean;
}): Promise<typeof import("./stripe")> {
  vi.stubEnv(
    "VITE_STRIPE_PUBLISHABLE_KEY_SANDBOX",
    args.sandboxKey ?? "",
  );
  vi.stubEnv("VITE_STRIPE_PUBLISHABLE_KEY_LIVE", args.liveKey ?? "");
  vi.stubEnv("DEV", args.dev ? "true" : "");
  vi.resetModules();
  return await import("./stripe");
}

// The Stripe SDK tries to inject a script tag into jsdom on load; mock
// `loadStripe` to keep the tests hermetic and avoid network calls.
vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve(null)),
}));

describe("assertKeyMatchesMode", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("pk_test sandbox key + mode 'sandbox' does not throw and does not console.error", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule({
      sandboxKey: "pk_test_abc123",
      dev: true,
    });

    expect(() => assertKeyMatchesMode("sandbox")).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("pk_live live key + mode 'live' does not throw and does not console.error", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule({
      liveKey: "pk_live_abc123",
      dev: true,
    });

    expect(() => assertKeyMatchesMode("live")).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("pk_live in sandbox slot + mode 'sandbox' in DEV throws and logs mismatch with both labels", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule({
      sandboxKey: "pk_live_abc123",
      dev: true,
    });

    expect(() => assertKeyMatchesMode("sandbox")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    const msg = String((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(msg).toContain("configured key is live");
    expect(msg).toContain("backend is sandbox");
  });

  it("pk_test in live slot + mode 'live' in DEV throws", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule({
      liveKey: "pk_test_abc123",
      dev: true,
    });

    expect(() => assertKeyMatchesMode("live")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    const msg = String((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(msg).toContain("configured key is test");
    expect(msg).toContain("backend is live");
  });

  it("mismatched prefix in non-DEV does not throw but still logs", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule({
      sandboxKey: "pk_live_abc123",
      dev: false,
    });

    expect(() => assertKeyMatchesMode("sandbox")).not.toThrow();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("empty key for the requested mode is treated as non-test; throws in DEV for sandbox", async () => {
    // Empty string behaves as undefined for the startsWith('pk_test_') check.
    const { assertKeyMatchesMode } = await loadStripeModule({ dev: true });

    expect(() => assertKeyMatchesMode("sandbox")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe("getStripePromise", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("memoises per mode — two calls with the same mode share one loadStripe invocation", async () => {
    const stripeMod = await import("@stripe/stripe-js");
    const loadStripeMock = vi.mocked(stripeMod.loadStripe);
    loadStripeMock.mockClear();

    const { getStripePromise, _resetStripeCache } = await loadStripeModule({
      sandboxKey: "pk_test_sandbox",
      liveKey: "pk_live_live",
      dev: true,
    });
    _resetStripeCache();

    const a = getStripePromise("sandbox");
    const b = getStripePromise("sandbox");
    expect(a).toBe(b);
    expect(loadStripeMock).toHaveBeenCalledTimes(1);
    expect(loadStripeMock).toHaveBeenCalledWith("pk_test_sandbox");
  });

  it("uses different keys per mode and caches each independently", async () => {
    const stripeMod = await import("@stripe/stripe-js");
    const loadStripeMock = vi.mocked(stripeMod.loadStripe);
    loadStripeMock.mockClear();

    const { getStripePromise, _resetStripeCache } = await loadStripeModule({
      sandboxKey: "pk_test_sandbox",
      liveKey: "pk_live_live",
      dev: true,
    });
    _resetStripeCache();

    getStripePromise("sandbox");
    getStripePromise("live");
    getStripePromise("sandbox");
    getStripePromise("live");

    expect(loadStripeMock).toHaveBeenCalledTimes(2);
    expect(loadStripeMock).toHaveBeenNthCalledWith(1, "pk_test_sandbox");
    expect(loadStripeMock).toHaveBeenNthCalledWith(2, "pk_live_live");
  });
});
