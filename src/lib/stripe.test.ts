import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `src/lib/stripe.ts` reads `VITE_STRIPE_PUBLISHABLE_KEY` at module load. To
// vary the key/DEV flag per case we stub `import.meta.env` via `vi.stubEnv`,
// reset the module cache so the next `import()` re-evaluates the top-level
// `const pk`, and load a fresh copy of `./stripe`.
async function loadStripeModule(
  key: string | undefined,
  dev: boolean,
): Promise<typeof import("./stripe")> {
  if (key === undefined) {
    vi.stubEnv("VITE_STRIPE_PUBLISHABLE_KEY", "");
  } else {
    vi.stubEnv("VITE_STRIPE_PUBLISHABLE_KEY", key);
  }
  vi.stubEnv("DEV", dev ? "true" : "");
  vi.resetModules();
  return await import("./stripe");
}

// The Stripe SDK tries to inject a script tag into jsdom at module load; mock
// `loadStripe` to keep the test hermetic and avoid network calls.
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

  it("pk_test key + mode 'sandbox' does not throw and does not console.error", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule("pk_test_abc123", true);

    expect(() => assertKeyMatchesMode("sandbox")).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("pk_live key + mode 'live' does not throw and does not console.error", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule("pk_live_abc123", true);

    expect(() => assertKeyMatchesMode("live")).not.toThrow();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("pk_live key + mode 'sandbox' in DEV throws and logs mismatch with both labels", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule("pk_live_abc123", true);

    expect(() => assertKeyMatchesMode("sandbox")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    const msg = String((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(msg).toContain("key is live");
    expect(msg).toContain("backend is sandbox");
  });

  it("pk_test key + mode 'live' in DEV throws", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule("pk_test_abc123", true);

    expect(() => assertKeyMatchesMode("live")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    const msg = String((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(msg).toContain("key is test");
    expect(msg).toContain("backend is live");
  });

  it("mismatched prefix in non-DEV does not throw but still logs", async () => {
    const { assertKeyMatchesMode } = await loadStripeModule("pk_live_abc123", false);

    expect(() => assertKeyMatchesMode("sandbox")).not.toThrow();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("undefined / empty key + mode 'sandbox' is treated as non-test; throws in DEV", async () => {
    // Empty string behaves as undefined for the startsWith('pk_test_') check.
    const { assertKeyMatchesMode } = await loadStripeModule(undefined, true);

    expect(() => assertKeyMatchesMode("sandbox")).toThrow(
      "Stripe key / backend payment_mode mismatch",
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
