/**
 * Unit tests for `useGooglePay`.
 *
 * The hook reads `stripePromise` from `@/lib/stripe` directly (not via
 * `useStripe()`), so the tests mock that module with a mutable promise
 * handle that each test controls.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mutable container the mock reads from; each test writes to
// `stripeHandle.current` before the hook mounts.
const stripeHandle: { current: unknown } = { current: null };

vi.mock("@/lib/stripe", () => ({
  get stripePromise() {
    // Return a fresh resolved promise on every access so the hook's
    // .then() always sees the current test's stripe value.
    return Promise.resolve(stripeHandle.current);
  },
  assertKeyMatchesMode: vi.fn(),
}));

import { useGooglePay } from "./useGooglePay";

interface FakePR {
  canMakePayment: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  show: ReturnType<typeof vi.fn>;
}

function makeFakePR(
  canMakePaymentResult: unknown = { googlePay: true },
): FakePR {
  return {
    canMakePayment: vi.fn(() => Promise.resolve(canMakePaymentResult)),
    on: vi.fn(),
    off: vi.fn(),
    show: vi.fn(),
  };
}

function makeFakeStripe(pr: FakePR) {
  const paymentRequest = vi.fn(() => pr);
  return { paymentRequest } as unknown as {
    paymentRequest: typeof paymentRequest;
  };
}

const basePricing = {
  currency_code: "USD",
  first_sale_price: "4.99",
};

describe("useGooglePay", () => {
  beforeEach(() => {
    stripeHandle.current = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("1. stripe not yet loaded → available: null, paymentRequest undefined, show() is a no-op", async () => {
    stripeHandle.current = null;
    const onPaymentMethod = vi.fn();

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod,
      }),
    );

    expect(result.current.available).toBeNull();
    expect(result.current.paymentRequest).toBeUndefined();
    expect(() => result.current.show()).not.toThrow();
  });

  it("2. mount with valid inputs → stripe.paymentRequest called once with computed amount (499) and lowercase currency", async () => {
    const pr = makeFakePR();
    const stripe = makeFakeStripe(pr);
    stripeHandle.current = stripe;

    renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(stripe.paymentRequest).toHaveBeenCalledTimes(1);
    });
    expect(stripe.paymentRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        country: "US",
        currency: "usd",
        total: { label: "Total", amount: 499 },
      }),
    );
  });

  it("3. canMakePayment resolves { googlePay: true } → available: true", async () => {
    const pr = makeFakePR({ googlePay: true });
    stripeHandle.current = makeFakeStripe(pr);

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.available).toBe(true);
    });
  });

  it("4. canMakePayment resolves null → available: false", async () => {
    const pr = makeFakePR(null);
    stripeHandle.current = makeFakeStripe(pr);

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.available).toBe(false);
    });
  });

  it("5. canMakePayment resolves { applePay: true } → available: true (documented expansion)", async () => {
    const pr = makeFakePR({ applePay: true });
    stripeHandle.current = makeFakeStripe(pr);

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.available).toBe(true);
    });
  });

  it("6. paymentmethod event fires → injected onPaymentMethod callback is invoked with the event", async () => {
    const pr = makeFakePR();
    stripeHandle.current = makeFakeStripe(pr);
    const onPaymentMethod = vi.fn();

    renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod,
      }),
    );

    await waitFor(() => {
      expect(pr.on).toHaveBeenCalledWith("paymentmethod", expect.any(Function));
    });

    // Retrieve the handler passed to `on` and fire it with a synthetic event.
    const onCall = pr.on.mock.calls.find((c) => c[0] === "paymentmethod");
    expect(onCall).toBeDefined();
    const handler = onCall?.[1] as (ev: unknown) => unknown;
    const syntheticEvent = {
      paymentMethod: { id: "pm_123" },
      complete: vi.fn(),
    };
    handler(syntheticEvent);

    expect(onPaymentMethod).toHaveBeenCalledTimes(1);
    expect(onPaymentMethod).toHaveBeenCalledWith(syntheticEvent);
  });

  it("7. show() called while available: true → pr.show() invoked exactly once", async () => {
    const pr = makeFakePR({ googlePay: true });
    stripeHandle.current = makeFakeStripe(pr);

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.available).toBe(true);
    });

    act(() => {
      result.current.show();
    });

    expect(pr.show).toHaveBeenCalledTimes(1);
  });

  it("8. show() called while available: false → pr.show() NOT called (no-op branch)", async () => {
    const pr = makeFakePR(null);
    stripeHandle.current = makeFakeStripe(pr);

    const { result } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.available).toBe(false);
    });

    act(() => {
      result.current.show();
    });

    expect(pr.show).not.toHaveBeenCalled();
  });

  // Test 9 removed — after the on-demand refactor, `clientSecret` is no
  // longer a hook input (the parent manages it per-click), so there is no
  // "clientSecret changes → rebuild PaymentRequest" behaviour to cover.

  it("10. unmount → pr.off('paymentmethod', …) called to release the listener", async () => {
    const pr = makeFakePR();
    stripeHandle.current = makeFakeStripe(pr);

    const { unmount } = renderHook(() =>
      useGooglePay({
        pricing: basePricing,
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(pr.on).toHaveBeenCalled();
    });

    unmount();

    expect(pr.off).toHaveBeenCalledWith(
      "paymentmethod",
      expect.any(Function),
    );
  });

  it("11. first_sale_cents_price: '499' explicit → amount 499 without multiplying from dollars", async () => {
    const pr = makeFakePR();
    const stripe = makeFakeStripe(pr);
    stripeHandle.current = stripe;

    renderHook(() =>
      useGooglePay({
        pricing: {
          currency_code: "USD",
          first_sale_cents_price: "499",
          first_sale_price: "99.99", // intentionally misleading — cents takes precedence
        },
        onPaymentMethod: vi.fn(),
      }),
    );

    await waitFor(() => {
      expect(stripe.paymentRequest).toHaveBeenCalledTimes(1);
    });
    expect(stripe.paymentRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        total: { label: "Total", amount: 499 },
      }),
    );
  });
});
