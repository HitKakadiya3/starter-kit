/**
 * Unit tests for CardForm after the switch from CardElement to
 * PaymentElement. PaymentElement is a Stripe iframe black-box; the
 * component's observable behaviour is:
 *   - Pay button gating on `complete` + `submitting`.
 *   - Pay button label text.
 *   - On click, calls `stripe.confirmPayment({ elements, confirmParams })`.
 *   - Surfaces errors and invokes `onSuccess(id)` on inline success.
 */

import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StripePaymentElementChangeEvent } from "@stripe/stripe-js";

// Side-effect import: initialises the shared `i18next` instance so
// `useTranslation` returns real strings instead of returning the raw keys.
import "@/i18n";

import { CardForm } from "./CardForm";

// Capture the PaymentElement's onChange so tests can fire `complete`.
let lastOnChange: ((e: StripePaymentElementChangeEvent) => void) | undefined;

const confirmPaymentMock = vi.fn();
const useStripeMock = vi.fn(() => ({
  confirmPayment: confirmPaymentMock,
}));
const useElementsMock = vi.fn(() => ({
  getElement: vi.fn(),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  PaymentElement: ({
    onChange,
  }: {
    onChange: (e: StripePaymentElementChangeEvent) => void;
  }) => {
    lastOnChange = onChange;
    return <div data-testid="payment-element" />;
  },
  useStripe: () => useStripeMock(),
  useElements: () => useElementsMock(),
}));

const baseProps = {
  clientSecret: "cs_test",
  email: "a@b.co",
  submitting: false,
  returnUrl: "http://localhost/checkout?qid=42",
  onSuccess: vi.fn(),
  onError: vi.fn(),
};

describe("<CardForm>", () => {
  beforeEach(() => {
    lastOnChange = undefined;
    confirmPaymentMock.mockReset();
    baseProps.onSuccess = vi.fn();
    baseProps.onError = vi.fn();
  });

  it("renders the PaymentElement and a disabled Pay button with the dynamic price label", () => {
    render(<CardForm {...baseProps} />);

    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /pay \$4\.99/i });
    expect(button).toBeDisabled();
  });

  it("enables Pay once PaymentElement reports complete: true", () => {
    render(<CardForm {...baseProps} />);

    act(() => {
      lastOnChange?.({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    const button = screen.getByRole("button", { name: /pay \$4\.99/i });
    expect(button).not.toBeDisabled();
  });

  it("shows 'Processing…' and disables Pay when submitting is true", () => {
    render(<CardForm {...baseProps} submitting={true} />);

    act(() => {
      lastOnChange?.({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    const button = screen.getByRole("button", { name: /processing/i });
    expect(button).toBeDisabled();
  });

  it("on Pay click, invokes stripe.confirmPayment with elements + return_url + redirect: 'if_required'", async () => {
    confirmPaymentMock.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_ok" },
    });
    render(<CardForm {...baseProps} />);

    act(() => {
      lastOnChange?.({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    await act(async () => {
      screen.getByRole("button", { name: /pay \$4\.99/i }).click();
    });

    expect(confirmPaymentMock).toHaveBeenCalledTimes(1);
    const arg = confirmPaymentMock.mock.calls[0][0];
    expect(arg.confirmParams.return_url).toBe(baseProps.returnUrl);
    expect(arg.redirect).toBe("if_required");
    expect(
      arg.confirmParams.payment_method_data.billing_details.email,
    ).toBe("a@b.co");
  });

  it("on succeeded intent, calls onSuccess(paymentIntent.id)", async () => {
    confirmPaymentMock.mockResolvedValue({
      paymentIntent: { status: "succeeded", id: "pi_ok" },
    });
    render(<CardForm {...baseProps} />);

    act(() => {
      lastOnChange?.({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    await act(async () => {
      screen.getByRole("button", { name: /pay/i }).click();
    });

    expect(baseProps.onSuccess).toHaveBeenCalledWith("pi_ok");
  });

  it("on Stripe error, renders inline alert and calls onError(message)", async () => {
    confirmPaymentMock.mockResolvedValue({
      error: { message: "Your card was declined." },
    });
    render(<CardForm {...baseProps} />);

    act(() => {
      lastOnChange?.({
        complete: true,
      } as StripePaymentElementChangeEvent);
    });

    await act(async () => {
      screen.getByRole("button", { name: /pay/i }).click();
    });

    expect(
      screen.getByRole("alert").textContent,
    ).toContain("Your card was declined.");
    expect(baseProps.onError).toHaveBeenCalledWith("Your card was declined.");
  });
});
