/**
 * Integration tests for `<CheckoutForm>` (PRD §4.1, §4.4.1–§4.4.3, §4.6, §4.7,
 * §4.9, §4.10, §6.1, §6.3 gating + preservation).
 *
 * Stripe SDK, `usePaymentIntent`, `useGooglePay`, `react-router-dom`, and
 * `resolveRedirect` are fully mocked so the component's own wiring (Elements
 * options, consent gating, button onClicks, error slot, auto-finalise) is
 * exercised without any real Stripe load.
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Module mocks ---------------------------------------------------------
//
// `vi.mock` factories are hoisted above all imports, so any spies or fixtures
// referenced from inside them must come from `vi.hoisted` (which is hoisted
// with them). Plain `const` declarations at module scope would still be in
// the temporal-dead-zone when the factory runs.

const hoisted = vi.hoisted(() => {
  const assertKeyMatchesModeMock = vi.fn();
  const stripeConfirmCardPaymentMock = vi.fn();
  const stripeConfirmPaymentMock = vi.fn();
  const stripeConfirmPayPalPaymentMock = vi.fn();
  const stripeHandleCardActionMock = vi.fn();
  const fakeStripe = {
    confirmCardPayment: stripeConfirmCardPaymentMock,
    confirmPayment: stripeConfirmPaymentMock,
    confirmPayPalPayment: stripeConfirmPayPalPaymentMock,
    handleCardAction: stripeHandleCardActionMock,
  };
  const navigateMock = vi.fn();
  return {
    assertKeyMatchesModeMock,
    stripeConfirmCardPaymentMock,
    stripeConfirmPaymentMock,
    stripeConfirmPayPalPaymentMock,
    stripeHandleCardActionMock,
    fakeStripe,
    navigateMock,
  };
});
const {
  assertKeyMatchesModeMock,
  stripeConfirmCardPaymentMock,
  stripeConfirmPaymentMock,
  stripeConfirmPayPalPaymentMock,
  stripeHandleCardActionMock,
  fakeStripe,
  navigateMock,
} = hoisted;

vi.mock("@/lib/stripe", () => ({
  stripePromise: Promise.resolve(hoisted.fakeStripe),
  assertKeyMatchesMode: (mode: "sandbox" | "live") =>
    hoisted.assertKeyMatchesModeMock(mode),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useStripe: vi.fn(() => hoisted.fakeStripe),
  useElements: vi.fn(() => ({ getElement: () => ({ __pe: true }) })),
  PaymentElement: (props: { onChange?: (event: unknown) => void }) => (
    <div
      data-testid="payment-element"
      onClick={() => props.onChange?.({ complete: true })}
    />
  ),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => hoisted.navigateMock,
  };
});

vi.mock("@/lib/redirectRouter", () => ({
  // Mirror the real redirectRouter's enum mapping so expected `navigate`
  // URLs (`/cross-sell`, `/results`, …) are produced as in production.
  resolveRedirect: (page: string | undefined) => {
    if (!page) return "/checkout";
    const map: Record<string, string> = {
      INITIAL_PAYMENT_PAGE: "/checkout",
      CROSS_SELL_OFFER_PAGE: "/cross-sell",
      CUSTOMER_DETAILS_PAGE: "/details",
      THANK_YOU_PAGE: "/results",
      PAYMENT_FAILED_PAGE: "/checkout",
    };
    return map[page] ?? "/checkout";
  },
}));

const sessionHoisted = vi.hoisted(() => {
  const getSessionMock = vi.fn(() => ({
    qidRaw: 42,
    qidEncrypted: "enc_42",
    email: "x@y.co",
  }));
  return { getSessionMock };
});
const { getSessionMock } = sessionHoisted;
vi.mock("@/lib/session", () => ({
  getSession: () => sessionHoisted.getSessionMock(),
}));

import { usePaymentIntent } from "@/hooks/usePaymentIntent";
import { useGooglePay } from "@/hooks/useGooglePay";

vi.mock("@/hooks/usePaymentIntent", () => ({
  usePaymentIntent: vi.fn(),
}));

vi.mock("@/hooks/useGooglePay", () => ({
  useGooglePay: vi.fn(),
}));

const mockedUsePaymentIntent = vi.mocked(usePaymentIntent);
const mockedUseGooglePay = vi.mocked(useGooglePay);

// Captured payment method callback from useGooglePay(opts).onPaymentMethod.
let capturedOnPaymentMethod:
  | ((event: {
      paymentMethod: { id: string };
      complete: (status: "success" | "fail") => void;
    }) => Promise<void>)
  | undefined;

import { CheckoutForm } from "./CheckoutForm";
import type { PricingInfo } from "@/lib/apiTypes";

// --- Fixtures -------------------------------------------------------------

const basePricing: PricingInfo & { payment_mode?: "sandbox" | "live" } = {
  currency_code: "USD",
  first_sale_price: "4.99",
  first_sale_price_label: "$4.99",
  cross_sale_price: "0.00",
  cross_sale_price_label: "$0.00",
  subscription_price: "39.00",
  subscription_price_label: "$39.00",
  subscription_day_label: "28",
  payment_gateways: [],
  payment_mode: "sandbox",
};

type IntentOverrides = Partial<ReturnType<typeof usePaymentIntent>>;
type GPayOverrides = Partial<ReturnType<typeof useGooglePay>>;

function setupIntent(overrides: IntentOverrides = {}): ReturnType<
  typeof usePaymentIntent
> {
  const finalizeAfterStripeSuccess = vi
    .fn()
    .mockResolvedValue({
      cross_sale: { is_compulsory: false },
      redirect_page: "CROSS_SELL_OFFER_PAGE",
      first_sale_usd_price: "4.99",
    });
  const retry = vi.fn();
  // Default `createIntent` mock: immediately resolves with the same
  // cs_test/pi_ready so the on-demand "click button → createIntent →
  // proceed" flow can run end-to-end in one tick.
  const createIntent = vi
    .fn()
    .mockResolvedValue({ clientSecret: "cs_test", intentId: "pi_ready" });
  const intent = {
    // Under on-demand creation, the initial state is idle and clientSecret
    // is undefined until the user clicks a method button. Tests that rely
    // on pre-populated secrets can override via the `overrides` arg.
    state: "idle" as const,
    clientSecret: "cs_test",
    intentId: "pi_ready",
    error: undefined,
    recoveredSucceeded: false,
    processingTimedOut: false,
    retry,
    createIntent,
    finalizeAfterStripeSuccess,
    ...overrides,
  };
  mockedUsePaymentIntent.mockReturnValue(intent);
  return intent;
}

function setupGPay(overrides: GPayOverrides = {}): ReturnType<
  typeof useGooglePay
> {
  const show = vi.fn();
  const result = {
    available: true as boolean | null,
    show,
    paymentRequest: undefined,
    ...overrides,
  };
  mockedUseGooglePay.mockImplementation((opts) => {
    capturedOnPaymentMethod = opts.onPaymentMethod as typeof capturedOnPaymentMethod;
    return result;
  });
  return result;
}

function renderForm(
  propsOverrides: Partial<React.ComponentProps<typeof CheckoutForm>> = {},
) {
  const props: React.ComponentProps<typeof CheckoutForm> = {
    priceLabel: "$4.99",
    pricing: basePricing,
    email: "x@y.co",
    gpayIcon: "/fixtures/gpay.png",
    ...propsOverrides,
  };
  return render(<CheckoutForm {...props} />);
}

function tickConsent() {
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
}

function getGPayButton(): HTMLElement {
  // GPay button hosts the <img alt="Google Pay">.
  const img = screen.getByAltText("Google Pay");
  return img.closest("button") as HTMLElement;
}

function getPayPalButton(): HTMLElement {
  return screen.getByRole("button", { name: /^paypal$/i });
}

function getCardButton(): HTMLElement {
  return screen.getByRole("button", { name: /credit or debit card/i });
}

// --- Tests ----------------------------------------------------------------

describe("<CheckoutForm>", () => {
  beforeEach(() => {
    mockedUsePaymentIntent.mockReset();
    mockedUseGooglePay.mockReset();
    navigateMock.mockReset();
    assertKeyMatchesModeMock.mockReset();
    stripeConfirmCardPaymentMock.mockReset();
    stripeConfirmPaymentMock.mockReset();
    stripeHandleCardActionMock.mockReset();
    capturedOnPaymentMethod = undefined;
    getSessionMock.mockReturnValue({
      qidRaw: 42,
      qidEncrypted: "enc_42",
      email: "x@y.co",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("1. initial render, ready + available, consent unchecked → all three buttons disabled; no CardForm", () => {
    setupIntent();
    setupGPay({ available: true });
    renderForm();

    expect(getGPayButton()).toBeDisabled();
    expect(getPayPalButton()).toBeDisabled();
    expect(getCardButton()).toBeDisabled();
    expect(screen.queryByTestId("card-element")).toBeNull();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("2. tick consent → all three buttons enabled when ready + gpay available", () => {
    setupIntent();
    setupGPay({ available: true });
    renderForm();

    tickConsent();

    expect(getGPayButton()).not.toBeDisabled();
    expect(getPayPalButton()).not.toBeDisabled();
    expect(getCardButton()).not.toBeDisabled();
  });

  it("3. gpay.available: false with consent ticked → GPay disabled with tooltip", () => {
    setupIntent();
    setupGPay({ available: false });
    renderForm();

    tickConsent();

    const gpay = getGPayButton();
    expect(gpay).toBeDisabled();
    expect(gpay.getAttribute("title")).toBe(
      "Google Pay isn't available in this browser",
    );
  });

  it("4. click card button → createIntent('card') + CardForm renders below buttons", async () => {
    const intent = setupIntent();
    setupGPay({ available: true });
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getCardButton());
    });

    expect(intent.createIntent).toHaveBeenCalledWith("card");
    // The PaymentElement is rendered inside <Elements> only when
    // clientSecret is available; our mock returns it synchronously so
    // the test sees the card-element stub after the async click.
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();
  });

  it("5. click card button a second time → CardForm unmounts", async () => {
    setupIntent();
    setupGPay({ available: true });
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getCardButton());
    });
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getCardButton());
    });
    expect(screen.queryByTestId("payment-element")).toBeNull();
  });

  it("6. intent.state: 'creating' → all three buttons disabled; consent still interactable", () => {
    setupIntent({ state: "creating", clientSecret: undefined, intentId: undefined });
    setupGPay({ available: true });
    renderForm();

    tickConsent();

    expect(getGPayButton()).toBeDisabled();
    expect(getPayPalButton()).toBeDisabled();
    expect(getCardButton()).toBeDisabled();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("7. intent.state: 'error' → error alert rendered; Try again calls retry", () => {
    const intent = setupIntent({
      state: "error",
      error: "Intent failed",
      clientSecret: undefined,
      intentId: undefined,
    });
    setupGPay({ available: null });
    renderForm();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Intent failed");
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(intent.retry).toHaveBeenCalledTimes(1);
  });

  it("8. click PayPal with consent → createIntent('paypal') + stripe.confirmPayPalPayment called", async () => {
    const intent = setupIntent();
    setupGPay({ available: true });
    stripeConfirmPayPalPaymentMock.mockResolvedValue({});
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getPayPalButton());
    });

    expect(intent.createIntent).toHaveBeenCalledWith("paypal");
    expect(stripeConfirmPayPalPaymentMock).toHaveBeenCalledTimes(1);
    const args = stripeConfirmPayPalPaymentMock.mock.calls[0];
    expect(args[0]).toBe("cs_test");
    expect(args[1]).toEqual(
      expect.objectContaining({
        return_url: expect.stringMatching(/\/checkout\?qid=/),
      }),
    );
  });

  it("9. PayPal confirmPayPalPayment returns error → inline alert surfaces message; no navigation", async () => {
    setupIntent();
    setupGPay({ available: true });
    stripeConfirmPayPalPaymentMock.mockResolvedValue({
      error: { message: "User cancelled" },
    });
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getPayPalButton());
    });

    const alerts = screen.getAllByRole("alert");
    const hasMsg = alerts.some((el) => el.textContent?.includes("User cancelled"));
    expect(hasMsg).toBe(true);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("10. click GPay when enabled → createIntent('card') + gpay.show() called", async () => {
    const intent = setupIntent();
    const gpay = setupGPay({ available: true });
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getGPayButton());
    });

    expect(intent.createIntent).toHaveBeenCalledWith("card");
    expect(gpay.show).toHaveBeenCalledTimes(1);
  });

  it("11. GPay paymentmethod succeeded → event.complete('success') + finalize + navigate", async () => {
    const intent = setupIntent();
    setupGPay({ available: true });
    stripeConfirmCardPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_gpay", status: "succeeded" },
    });
    renderForm();

    tickConsent();
    // Click GPay first so createIntent('card') resolves and the clientSecret
    // ref is populated before the paymentmethod event fires.
    await act(async () => {
      fireEvent.click(getGPayButton());
    });

    const completeSpy = vi.fn();
    await act(async () => {
      await capturedOnPaymentMethod?.({
        paymentMethod: { id: "pm_x" },
        complete: completeSpy,
      });
    });

    expect(stripeConfirmCardPaymentMock).toHaveBeenCalledWith(
      "cs_test",
      { payment_method: "pm_x" },
      { handleActions: false },
    );
    expect(completeSpy).toHaveBeenCalledWith("success");
    expect(intent.finalizeAfterStripeSuccess).toHaveBeenCalledWith("pi_gpay");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });

  it("12. GPay paymentmethod requires_action → handleCardAction + finalize fire", async () => {
    const intent = setupIntent();
    setupGPay({ available: true });
    stripeConfirmCardPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_gpay", status: "requires_action" },
    });
    stripeHandleCardActionMock.mockResolvedValue({
      paymentIntent: { id: "pi_gpay_done", status: "succeeded" },
    });
    renderForm();

    tickConsent();
    await act(async () => {
      fireEvent.click(getGPayButton());
    });

    const completeSpy = vi.fn();
    await act(async () => {
      await capturedOnPaymentMethod?.({
        paymentMethod: { id: "pm_x" },
        complete: completeSpy,
      });
    });

    expect(stripeHandleCardActionMock).toHaveBeenCalledWith("cs_test");
    expect(completeSpy).toHaveBeenCalledWith("success");
    expect(intent.finalizeAfterStripeSuccess).toHaveBeenCalledWith("pi_gpay_done");
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it("13. CardForm onSuccess → finalize + navigate", async () => {
    const intent = setupIntent();
    setupGPay({ available: true });
    // PaymentElement's stripe.confirmPayment resolves with a succeeded
    // intent inline (no redirect path).
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_abc", status: "succeeded" },
    });
    renderForm();

    tickConsent();
    // Click card button → createIntent('card') → PaymentElement renders.
    await act(async () => {
      fireEvent.click(getCardButton());
    });
    // Our PaymentElement stub fires onChange({complete: true}) on click.
    fireEvent.click(screen.getByTestId("payment-element"));

    const payBtn = screen.getByRole("button", { name: /pay \$4\.99/i });
    await act(async () => {
      fireEvent.click(payBtn);
    });

    expect(intent.finalizeAfterStripeSuccess).toHaveBeenCalledWith("pi_abc");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });

  it("14. finalize throws → backend-confirm error alert + Retry re-invokes finalize", async () => {
    const finalize = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({
        cross_sale: { is_compulsory: false },
        redirect_page: "CROSS_SELL_OFFER_PAGE",
        first_sale_usd_price: "4.99",
      });
    setupIntent({ finalizeAfterStripeSuccess: finalize });
    setupGPay({ available: true });
    stripeConfirmCardPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_gpay", status: "succeeded" },
    });
    renderForm();

    tickConsent();
    // Click GPay first so createIntent('card') populates the clientSecret ref.
    await act(async () => {
      fireEvent.click(getGPayButton());
    });
    const completeSpy = vi.fn();
    await act(async () => {
      await capturedOnPaymentMethod?.({
        paymentMethod: { id: "pm_x" },
        complete: completeSpy,
      });
    });

    const alerts = screen.getAllByRole("alert");
    const hasMsg = alerts.some((el) =>
      el.textContent?.includes(
        "Your payment went through, but we had trouble finalising your order",
      ),
    );
    expect(hasMsg).toBe(true);
    expect(navigateMock).not.toHaveBeenCalled();

    const retryBtn = screen.getByRole("button", { name: /^retry$/i });
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(finalize).toHaveBeenCalledTimes(2);
    expect(finalize).toHaveBeenLastCalledWith("pi_gpay");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });

  it("15. assertKeyMatchesMode throws on mount → render throws (dev-mode mismatch)", () => {
    setupIntent();
    setupGPay({ available: true });
    assertKeyMatchesModeMock.mockImplementation(() => {
      throw new Error("Stripe key / backend payment_mode mismatch");
    });

    // Silence React's error-boundary console noise for this assertion.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderForm()).toThrow(
      /Stripe key \/ backend payment_mode mismatch/,
    );
    spy.mockRestore();
  });

  it("16. intent.recoveredSucceeded on mount → auto-finalise + navigate fires without clicks", async () => {
    const intent = setupIntent({
      recoveredSucceeded: true,
      intentId: "pi_recovered",
    });
    setupGPay({ available: true });
    renderForm();

    // Give the useEffect microtask a chance to flush.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(intent.finalizeAfterStripeSuccess).toHaveBeenCalledWith("pi_recovered");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });
});
