/**
 * Unit tests for `useExpressCheckout`.
 *
 * Source: Design Doc `docs/design/module-3-stripe-wallets-ece.md`
 *   - §Test Strategy → Unit tests bullet for `useExpressCheckout.test.tsx`
 *   - §Module / hook contracts → `useExpressCheckout(options)` contract table
 *   - KDD-4: "useExpressCheckout does not own a Stripe instance" — it is a
 *     pure adapter consumed inside the hoisted <Elements> provider; it does
 *     NOT subscribe to `stripePromise` (unlike the deleted `useGooglePay`).
 *
 * Mocking pattern:
 *   - Follows the canonical `useGooglePay.test.tsx` setup (see that file's
 *     `stripeHandle` mutable container pattern) but inverted: this hook
 *     should NEVER read `stripePromise`. The mock for `@/lib/stripe` is
 *     therefore present primarily so absence-of-interaction can be
 *     asserted (KDD-4 guard test).
 *   - `@stripe/react-stripe-js` is NOT needed at the hook level — the hook
 *     only returns config props; consumers spread them onto
 *     <ExpressCheckoutElement> at the component layer (covered in
 *     CheckoutForm.test.tsx).
 *
 * AC traceability:
 *   - AC-D02 (graceful no-pricing path) → "pricing undefined → eceProps suppress rendering"
 *   - Design Doc §Test Strategy bullet 2 → "buttonType / buttonTheme / buttonHeight defaults"
 *   - KDD-4 → "hook does NOT subscribe to stripePromise directly"
 */

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock for @/lib/stripe is intentionally a spy-able shape. The hook MUST
// NOT touch `getStripePromise` (KDD-4); the third test asserts this.
const stripePromiseAccessSpy = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripePromise: (mode: "sandbox" | "live") => {
    stripePromiseAccessSpy(mode);
    return Promise.resolve(null);
  },
  assertKeyMatchesMode: vi.fn(),
}));

import type { PricingWithMode } from "@/components/checkout/CheckoutForm";

import { useExpressCheckout } from "./useExpressCheckout";

const basePricing: PricingWithMode = {
  currency_code: "USD",
  first_sale_price: "4.99",
  first_sale_price_label: "$4.99",
  cross_sale_price: "0.00",
  cross_sale_price_label: "$0.00",
  subscription_price: "0.00",
  subscription_price_label: "$0.00",
  payment_gateways: [],
};

describe("useExpressCheckout", () => {
  beforeEach(() => {
    stripePromiseAccessSpy.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("AC-D02: when pricing is undefined, the hook returns props that suppress ECE rendering (eceProps undefined, ready false)", () => {
    // AC: Design Doc AC-D02 (hook-level half) — "When `pricing` is undefined
    // at <CheckoutForm> mount, the system shall not mount
    // <ExpressCheckoutElement> and shall not throw."
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useExpressCheckout({
        pricing: undefined,
        disabled: false,
        onConfirm,
      }),
    );

    // Suppression sentinel: eceProps is undefined so consumer pattern
    // `eceProps && <ExpressCheckoutElement {...eceProps} />` skips render.
    expect(result.current.eceProps).toBeUndefined();
    expect(result.current.ready).toBe(false);
  });

  it("when pricing is defined, returned eceProps.options includes configured buttonType / buttonTheme / buttonHeight defaults", () => {
    // Design Doc §Test Strategy bullet 2 + §Module / hook contracts →
    // `eceProps` row notes options include `buttonType`, `buttonTheme`,
    // `buttonHeight`. Specific defaults are Stripe defaults per R-D3 /
    // DD-OQ-1 (marketing tuning is post-merge); the test asserts keys are
    // present and non-undefined.
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useExpressCheckout({
        pricing: basePricing,
        disabled: false,
        onConfirm,
      }),
    );

    expect(result.current.eceProps).toBeDefined();
    const options = result.current.eceProps?.options;
    expect(options).toBeDefined();
    expect(options).toEqual(
      expect.objectContaining({
        buttonType: expect.anything(),
        buttonTheme: expect.anything(),
        buttonHeight: expect.any(Number),
      }),
    );
    expect(options?.buttonType).not.toBeUndefined();
    expect(options?.buttonTheme).not.toBeUndefined();
    expect(options?.buttonHeight).not.toBeUndefined();

    // The hook also wires the consumer-supplied `onConfirm` onto the
    // returned eceProps so the consumer can spread eceProps directly onto
    // <ExpressCheckoutElement>.
    expect(result.current.eceProps?.onConfirm).toBeDefined();
  });

  it("restricts paymentMethods to Apple Pay + Google Pay; hides Link, Amazon Pay, PayPal-via-ECE, Klarna", () => {
    // PRD scope: ECE wallet slot surfaces ONLY Google Pay + Apple Pay.
    // PayPal stays on its native SDK slot; Link / Amazon Pay / Klarna are
    // explicitly out of scope per Design Doc §Scope.
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useExpressCheckout({ pricing: basePricing, disabled: false, onConfirm }),
    );

    const pm = result.current.eceProps?.options.paymentMethods;
    expect(pm).toBeDefined();
    expect(pm?.applePay).toBe("always");
    expect(pm?.googlePay).toBe("always");
    expect(pm?.link).toBe("never");
    expect(pm?.amazonPay).toBe("never");
    expect(pm?.paypal).toBe("never");
    expect(pm?.klarna).toBe("never");
  });

  it("forces single-column layout (one wallet button per row) to match adjacent PayPal/Card slots", () => {
    const onConfirm = vi.fn();

    const { result } = renderHook(() =>
      useExpressCheckout({ pricing: basePricing, disabled: false, onConfirm }),
    );

    const layout = result.current.eceProps?.options.layout;
    expect(layout).toBeDefined();
    // `layout` is a union of strings or an object — assert object form.
    expect(typeof layout).toBe("object");
    if (typeof layout === "object") {
      expect(layout.maxColumns).toBe(1);
    }
  });

  it("regression: buttonHeight stays in Stripe's valid range [40, 55] regardless of `disabled`", () => {
    // Stripe's ECE validator throws IntegrationError when buttonHeight is
    // outside [40, 55]. An earlier draft of this hook collapsed the slot by
    // setting buttonHeight to 0 when disabled, which crashed at runtime.
    // The visual disable now happens at the consumer's wrapper div
    // (aria-disabled + pointer-events: none); the hook itself must always
    // produce a Stripe-valid height.
    const onConfirm = vi.fn();

    const enabled = renderHook(() =>
      useExpressCheckout({ pricing: basePricing, disabled: false, onConfirm }),
    );
    const disabled = renderHook(() =>
      useExpressCheckout({ pricing: basePricing, disabled: true, onConfirm }),
    );

    const enabledHeight = enabled.result.current.eceProps?.options.buttonHeight;
    const disabledHeight = disabled.result.current.eceProps?.options.buttonHeight;

    expect(enabledHeight).toBeGreaterThanOrEqual(40);
    expect(enabledHeight).toBeLessThanOrEqual(55);
    expect(disabledHeight).toBeGreaterThanOrEqual(40);
    expect(disabledHeight).toBeLessThanOrEqual(55);
  });

  it("KDD-4: hook does NOT subscribe to stripePromise directly (no module-level mock interaction, no available/show surface)", async () => {
    // Design Doc KDD-4 — "useExpressCheckout does not own a Stripe instance.
    // […] No useEffect for SDK loading, no `available` state, no `show()`
    // imperative handle." Regression guard against accidentally porting the
    // deleted useGooglePay's stripePromise-subscription pattern into the new
    // hook.
    const onConfirm = vi.fn();

    const { result, unmount } = renderHook(() =>
      useExpressCheckout({
        pricing: basePricing,
        disabled: false,
        onConfirm,
      }),
    );

    // Flush any microtasks the hook may have queued.
    await Promise.resolve();
    await Promise.resolve();

    // Architectural guard: stripePromise was never read.
    expect(stripePromiseAccessSpy).not.toHaveBeenCalled();

    // The legacy useGooglePay surface fields must NOT exist on the result.
    const surface = result.current as unknown as Record<string, unknown>;
    expect(surface.available).toBeUndefined();
    expect(surface.paymentRequest).toBeUndefined();
    expect(surface.show).toBeUndefined();

    unmount();

    // Still no read after teardown either.
    expect(stripePromiseAccessSpy).not.toHaveBeenCalled();
  });
});
