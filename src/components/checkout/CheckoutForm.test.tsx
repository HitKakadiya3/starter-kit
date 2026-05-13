/**
 * Integration tests for `<CheckoutForm>` (PRD §4.1, §4.4.1–§4.4.3, §4.6,
 * §4.9, §4.10, §6.1, §6.3 preservation; Module 3 ECE refactor
 * Design Doc AC-D01..AC-D10 + PRD §8 AC 23).
 *
 * Stripe SDK, `usePaymentIntent`, `useExpressCheckout`, `usePayPalCheckout`,
 * `react-router-dom`, and `resolveRedirect` are fully mocked so the
 * component's own wiring (Elements options, ECE onConfirm wiring,
 * button onClicks, error slot, auto-finalise, PayPal container) is
 * exercised without any real Stripe or PayPal load.
 *
 * The subscription-consent checkbox was removed in a follow-up to Task 04;
 * payment surfaces (Card, PayPal, ECE) are always enabled at idle and only
 * gated by `submitting` (in-flight Stripe + backend confirm) and `creating`
 * (intent creation in flight). Tests reflect that contract.
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Side-effect import: initialises the shared `i18next` instance so
// `useTranslation` returns real strings instead of returning the raw keys.
import "@/i18n";

// --- Module mocks ---------------------------------------------------------
//
// `vi.mock` factories are hoisted above all imports, so any spies or fixtures
// referenced from inside them must come from `vi.hoisted` (which is hoisted
// with them). Plain `const` declarations at module scope would still be in
// the temporal-dead-zone when the factory runs.

const hoisted = vi.hoisted(() => {
  const assertKeyMatchesModeMock = vi.fn();
  const stripeConfirmPaymentMock = vi.fn();
  const fakeStripe = {
    confirmPayment: stripeConfirmPaymentMock,
  };
  const navigateMock = vi.fn();
  // ECE / hoisted-Elements capture spies — mutated by the
  // `@stripe/react-stripe-js` mock factory below.
  const eceOnConfirmMock = vi.fn();
  const elementsOptionsCaptures: Array<Record<string, unknown> | undefined> = [];
  const eceOptionsCaptures: Array<Record<string, unknown> | undefined> = [];
  // Toggleable: when true, the ECE stub renders a clickable wallet button
  // surrogate. Defaults to `true`; the unsupported-browser test flips it to
  // `false` to assert the form is still usable when Stripe shows nothing.
  const eceRenderState = { renderButton: true };
  const fakeElementsInstance = { __deferredElements: true };
  return {
    assertKeyMatchesModeMock,
    stripeConfirmPaymentMock,
    fakeStripe,
    navigateMock,
    eceOnConfirmMock,
    elementsOptionsCaptures,
    eceOptionsCaptures,
    eceRenderState,
    fakeElementsInstance,
  };
});
const {
  assertKeyMatchesModeMock,
  stripeConfirmPaymentMock,
  fakeStripe,
  navigateMock,
  eceOnConfirmMock,
  elementsOptionsCaptures,
  eceOptionsCaptures,
  eceRenderState,
  fakeElementsInstance,
} = hoisted;

vi.mock("@/lib/stripe", () => ({
  getStripePromise: (_mode: "sandbox" | "live") =>
    Promise.resolve(hoisted.fakeStripe),
  assertKeyMatchesMode: (mode: "sandbox" | "live") =>
    hoisted.assertKeyMatchesModeMock(mode),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({
    children,
    options,
  }: {
    children: React.ReactNode;
    options?: Record<string, unknown>;
  }) => {
    hoisted.elementsOptionsCaptures.push(options);
    return (
      <div
        data-testid="elements-mock"
        data-options={JSON.stringify(options ?? {})}
      >
        {children}
      </div>
    );
  },
  ExpressCheckoutElement: (props: {
    onConfirm: (event: unknown) => Promise<void>;
    options?: Record<string, unknown>;
  }) => {
    hoisted.eceOnConfirmMock(props.onConfirm);
    hoisted.eceOptionsCaptures.push(props.options);
    if (!hoisted.eceRenderState.renderButton) {
      // Simulate Stripe rendering nothing on unsupported browsers.
      return <div data-testid="ece-stub" data-empty="true" />;
    }
    return (
      <button
        type="button"
        data-testid="ece-stub"
        aria-label="Express Checkout"
      >
        wallet
      </button>
    );
  },
  useStripe: vi.fn(() => hoisted.fakeStripe),
  useElements: vi.fn(() => hoisted.fakeElementsInstance),
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
    // `useLocalizedNavigate` (now used by CheckoutForm) calls `useLocation()`
    // to read the locale prefix. The component is rendered without a router
    // wrapper here, so stub a default English (`/`) location.
    useLocation: () => ({ pathname: "/", search: "", hash: "", state: null, key: "default" }),
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

import {
  usePaymentIntent,
  WALLET_METHOD_TYPE,
} from "@/hooks/usePaymentIntent";
import { useExpressCheckout } from "@/hooks/useExpressCheckout";
import { usePayPalCheckout } from "@/hooks/usePayPalCheckout";

vi.mock("@/hooks/usePaymentIntent", async () => {
  const actual = await vi.importActual<typeof import("@/hooks/usePaymentIntent")>(
    "@/hooks/usePaymentIntent",
  );
  return {
    ...actual,
    usePaymentIntent: vi.fn(),
  };
});

// `useExpressCheckout` is mocked as a passthrough that captures the
// consumer-supplied `onConfirm` and exposes the latest args. The hook's
// `disabled` arg is part of its public input surface (production hook
// signature unchanged) but its value is not asserted across these tests
// since payment surfaces are always enabled at idle.
const expressCheckoutHoisted = vi.hoisted(() => {
  const lastArgs: { value: unknown } = { value: null };
  return { lastArgs };
});
vi.mock("@/hooks/useExpressCheckout", () => ({
  useExpressCheckout: vi.fn((opts: unknown) => {
    expressCheckoutHoisted.lastArgs.value = opts;
    const typed = opts as {
      pricing: unknown;
      disabled: boolean;
      onConfirm: (event: unknown) => Promise<void>;
    };
    if (typed.pricing === undefined) {
      return { eceProps: undefined, ready: false };
    }
    return {
      eceProps: {
        options: { buttonHeight: 44 },
        onConfirm: typed.onConfirm,
        onReady: vi.fn(),
      },
      ready: false,
    };
  }),
}));

const paypalHoisted = vi.hoisted(() => {
  const renderSpy = vi.fn();
  const state = {
    isLoading: false,
    isError: false,
    errorMessage: null as string | null,
  };
  let lastArgs: unknown = null;
  return {
    renderSpy,
    state,
    getLastArgs: () => lastArgs,
    setLastArgs: (a: unknown) => {
      lastArgs = a;
    },
  };
});
vi.mock("@/hooks/usePayPalCheckout", () => ({
  usePayPalCheckout: vi.fn((args: unknown) => {
    paypalHoisted.setLastArgs(args);
    return {
      render: paypalHoisted.renderSpy,
      isLoading: paypalHoisted.state.isLoading,
      isError: paypalHoisted.state.isError,
      errorMessage: paypalHoisted.state.errorMessage,
    };
  }),
}));

const mockedUsePaymentIntent = vi.mocked(usePaymentIntent);
const mockedUseExpressCheckout = vi.mocked(useExpressCheckout);
const mockedUsePayPalCheckout = vi.mocked(usePayPalCheckout);

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

function renderForm(
  propsOverrides: Partial<React.ComponentProps<typeof CheckoutForm>> = {},
) {
  const props: React.ComponentProps<typeof CheckoutForm> = {
    pricing: basePricing,
    email: "x@y.co",
    ...propsOverrides,
  };
  return render(<CheckoutForm {...props} />);
}

function getCardButton(): HTMLElement {
  return screen.getByRole("button", { name: /credit or debit card/i });
}

function getPayPalContainer(): HTMLElement | null {
  return document.getElementById("paypal-button-container");
}

/** Returns the most recent `onConfirm` callback captured by the ECE stub. */
function getCapturedEceOnConfirm(): (event: unknown) => Promise<void> {
  expect(eceOnConfirmMock).toHaveBeenCalled();
  const lastIdx = eceOnConfirmMock.mock.calls.length - 1;
  return eceOnConfirmMock.mock.calls[lastIdx][0] as (
    event: unknown,
  ) => Promise<void>;
}

/** Builds an ECE confirm-event fixture matching
 *  `StripeExpressCheckoutElementConfirmEvent`. The `paymentFailed` callback
 *  is a `vi.fn` so tests can assert it was invoked on the failure path. */
function makeEceEvent() {
  const paymentFailed = vi.fn();
  const event = {
    paymentFailed,
    expressPaymentType: "google_pay" as const,
  };
  return { event, paymentFailed };
}

/** Returns the first <Elements> options capture (the hoisted provider). */
function getHoistedElementsOptions(): Record<string, unknown> | undefined {
  return elementsOptionsCaptures[0];
}

/**
 * Resets every spy and helper to a clean per-test baseline. Vitest hooks
 * declared inside a `describe` only apply to tests in that block — sharing
 * setup across the two `describe` blocks therefore goes through this helper
 * rather than relying on hook inheritance. The explicit `mock.calls.length`
 * truncation is defensive: in some vitest interactions with the
 * React-cleanup teardown the counter survives `mockClear()`.
 */
function resetAllSpies() {
  navigateMock.mockClear();
  navigateMock.mockReset();
  navigateMock.mock.calls.length = 0;
  navigateMock.mock.results.length = 0;
  stripeConfirmPaymentMock.mockClear();
  stripeConfirmPaymentMock.mockReset();
  stripeConfirmPaymentMock.mock.calls.length = 0;
  stripeConfirmPaymentMock.mock.results.length = 0;
  eceOnConfirmMock.mockClear();
  eceOnConfirmMock.mockReset();
  eceOnConfirmMock.mock.calls.length = 0;
  assertKeyMatchesModeMock.mockClear();
  assertKeyMatchesModeMock.mockReset();
  assertKeyMatchesModeMock.mock.calls.length = 0;
  mockedUsePaymentIntent.mockReset();
  mockedUseExpressCheckout.mockClear();
  mockedUsePayPalCheckout.mockClear();
  elementsOptionsCaptures.length = 0;
  eceOptionsCaptures.length = 0;
  eceRenderState.renderButton = true;
  expressCheckoutHoisted.lastArgs.value = null;
  paypalHoisted.renderSpy.mockClear();
  paypalHoisted.state.isLoading = false;
  paypalHoisted.state.isError = false;
  paypalHoisted.state.errorMessage = null;
  paypalHoisted.setLastArgs(null);
  sessionStorage.clear();
  getSessionMock.mockReturnValue({
    qidRaw: 42,
    qidEncrypted: "enc_42",
    email: "x@y.co",
  });
  // Re-install the useExpressCheckout passthrough since `mockClear()`
  // wipes the implementation. The implementation must mirror the
  // top-of-file factory.
  mockedUseExpressCheckout.mockImplementation((opts: unknown) => {
    expressCheckoutHoisted.lastArgs.value = opts;
    const typed = opts as {
      pricing: unknown;
      disabled: boolean;
      onConfirm: (event: unknown) => Promise<void>;
    };
    if (typed.pricing === undefined) {
      return { eceProps: undefined, ready: false };
    }
    return {
      eceProps: {
        options: { buttonHeight: 44 },
        onConfirm: typed.onConfirm,
        onReady: vi.fn(),
      },
      ready: false,
    };
  });
  // Re-install the usePayPalCheckout passthrough as well.
  mockedUsePayPalCheckout.mockImplementation((args: unknown) => {
    paypalHoisted.setLastArgs(args);
    return {
      render: paypalHoisted.renderSpy,
      isLoading: paypalHoisted.state.isLoading,
      isError: paypalHoisted.state.isError,
      errorMessage: paypalHoisted.state.errorMessage,
    };
  });
}

// --- Tests ----------------------------------------------------------------

describe("<CheckoutForm>", () => {
  beforeEach(resetAllSpies);

  // No `vi.restoreAllMocks()` — the hoisted spies are reset explicitly in
  // beforeEach. `restoreAllMocks` would restore module-level `vi.fn()`
  // bindings to their original empty impls, defeating the per-test setup.

  it("2. card button is enabled at idle state (intent idle, not submitting)", () => {
    setupIntent();
    renderForm();

    expect(getCardButton()).not.toBeDisabled();
    expect(screen.queryByTestId("payment-element")).toBeNull();
  });

  it("4. click card button → createIntent('card') + CardForm renders below buttons", async () => {
    const intent = setupIntent();
    renderForm();

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
    renderForm();

    await act(async () => {
      fireEvent.click(getCardButton());
    });
    expect(screen.getByTestId("payment-element")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getCardButton());
    });
    expect(screen.queryByTestId("payment-element")).toBeNull();
  });

  it("6. intent.state: 'creating' → card button disabled", () => {
    setupIntent({ state: "creating", clientSecret: undefined, intentId: undefined });
    renderForm();

    expect(getCardButton()).toBeDisabled();
  });

  it("7. intent.state: 'error' → error alert rendered; Try again calls retry", () => {
    const intent = setupIntent({
      state: "error",
      error: "Intent failed",
      clientSecret: undefined,
      intentId: undefined,
    });
    renderForm();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Intent failed");
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(intent.retry).toHaveBeenCalledTimes(1);
  });

  it("8. PayPal SDK loads OK → renders the PayPal button container", () => {
    setupIntent();
    renderForm();

    expect(getPayPalContainer()).not.toBeNull();
    // Hook's render() is called once via the mount effect.
    expect(paypalHoisted.renderSpy).toHaveBeenCalledTimes(1);
    // The render call receives the actual <div> ref, which equals the
    // `paypal-button-container` element we just queried.
    expect(paypalHoisted.renderSpy).toHaveBeenCalledWith(getPayPalContainer());
  });

  it("9. usePayPalCheckout reports isError → unavailable message renders, container hidden", () => {
    setupIntent();
    paypalHoisted.state.isError = true;
    paypalHoisted.state.errorMessage = "down";
    renderForm();

    expect(getPayPalContainer()).toBeNull();
    expect(
      screen.getByText(/PayPal is unavailable\. Please use Card or another wallet\./i),
    ).toBeInTheDocument();
  });

  it("13. CardForm onSuccess → finalize + navigate", async () => {
    const intent = setupIntent();
    // PaymentElement's stripe.confirmPayment resolves with a succeeded
    // intent inline (no redirect path).
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_abc", status: "succeeded" },
    });
    renderForm();

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
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_wallet", status: "succeeded" },
    });
    renderForm();

    // Drive the captured ECE onConfirm so finalize is invoked via the
    // wallet path (formerly via GPay).
    const onConfirm = getCapturedEceOnConfirm();
    const { event } = makeEceEvent();
    await act(async () => {
      await onConfirm(event);
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
    expect(finalize).toHaveBeenLastCalledWith("pi_wallet");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });

  it("15. assertKeyMatchesMode throws on mount → render throws (dev-mode mismatch)", () => {
    setupIntent();
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

// =============================================================================
// Stripe wallets via ExpressCheckoutElement (Module 3 ECE refactor)
// =============================================================================
//
// Source: Design Doc `docs/design/module-3-stripe-wallets-ece.md` ACs
//   AC-D01..AC-D07 + PRD §8 AC 20 + AC 23.
//
// Mocking strategy (see top-of-file `vi.mock("@stripe/react-stripe-js", ...)`):
//   - The hoisted `<Elements>` mock captures `options` into
//     `elementsOptionsCaptures` (FIFO; index 0 is the hoisted provider, later
//     entries are the nested card-path provider).
//   - `<ExpressCheckoutElement>` is stubbed: it captures `onConfirm` into
//     `eceOnConfirmMock` and `options` into `eceOptionsCaptures`. Tests
//     retrieve via `getCapturedEceOnConfirm()` and invoke as
//     `await onConfirm(event)` where `event = makeEceEvent().event`.
//   - `useExpressCheckout` is mocked as a passthrough: it returns
//     `eceProps` echoing the consumer-supplied `onConfirm` so the production
//     `<ExpressCheckoutElement {...eceProps}>` wires through to our stub.

describe("Stripe wallets via ExpressCheckoutElement", () => {
  // Vitest's `beforeEach` is scoped to the enclosing `describe`, so we
  // re-register the shared spy reset here rather than relying on inheritance
  // from the outer block.
  beforeEach(resetAllSpies);

  it("AC-D01: hoisted <Elements> mounts with mode='payment' + amount + currency derived from PricingInfo", () => {
    setupIntent();
    renderForm({ pricing: basePricing });

    const options = getHoistedElementsOptions();
    expect(options).toBeDefined();
    expect(options!.mode).toBe("payment");
    // 4.99 USD → 499 cents (minor units).
    expect(options!.amount).toBe(499);
    // Currency is lowercased per Stripe Elements convention.
    expect(options!.currency).toBe("usd");
    // ECE stub renders inside the hoisted provider.
    expect(screen.getByTestId("ece-stub")).toBeInTheDocument();
  });

  it("AC-D02: pricing undefined → ECE rendering suppressed; no console errors; rest of form usable", () => {
    setupIntent();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderForm({ pricing: undefined });

    // Hoisted <Elements> does not mount without amount + currency.
    expect(screen.queryByTestId("elements-mock")).toBeNull();
    // ECE stub is not rendered.
    expect(screen.queryByTestId("ece-stub")).toBeNull();
    // Rest of CheckoutForm still renders.
    expect(getCardButton()).toBeInTheDocument();
    expect(getPayPalContainer()).not.toBeNull();
    // No console errors during the graceful no-pricing render.
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("AC-D03: ECE.onConfirm calls intent.createIntent(WALLET_METHOD_TYPE) once then stripe.confirmPayment with correct shape (in order)", async () => {
    const intent = setupIntent();
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_wallet", status: "succeeded" },
    });
    renderForm();

    const onConfirm = getCapturedEceOnConfirm();
    const { event } = makeEceEvent();
    await act(async () => {
      await onConfirm(event);
    });

    expect(intent.createIntent).toHaveBeenCalledTimes(1);
    expect(intent.createIntent).toHaveBeenCalledWith(WALLET_METHOD_TYPE);
    expect(stripeConfirmPaymentMock).toHaveBeenCalledTimes(1);
    expect(stripeConfirmPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        elements: fakeElementsInstance,
        clientSecret: "cs_test",
        confirmParams: expect.objectContaining({
          return_url: expect.stringContaining("/checkout?qid=42"),
        }),
        redirect: "if_required",
      }),
    );
    // Order: createIntent must precede confirmPayment.
    const createOrder = (intent.createIntent as unknown as { mock: { invocationCallOrder: number[] } })
      .mock.invocationCallOrder[0];
    const confirmOrder = stripeConfirmPaymentMock.mock.invocationCallOrder[0];
    expect(createOrder).toBeLessThan(confirmOrder);
  });

  it("AC-D04: confirmPayment success → finalizeAfterStripeSuccess(paymentIntent.id) + navigate(redirect_page)", async () => {
    const intent = setupIntent();
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_wallet", status: "succeeded" },
    });
    renderForm();

    const onConfirm = getCapturedEceOnConfirm();
    const { event } = makeEceEvent();
    await act(async () => {
      await onConfirm(event);
    });

    expect(intent.finalizeAfterStripeSuccess).toHaveBeenCalledWith("pi_wallet");
    expect(navigateMock).toHaveBeenCalledWith("/cross-sell?qid=42");
  });

  it("AC-D05: confirmPayment returns error → inline alert with error.message; finalize NOT called; event.paymentFailed called", async () => {
    const intent = setupIntent();
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: null,
      error: { message: "Your card was declined." },
    });
    renderForm();

    const onConfirm = getCapturedEceOnConfirm();
    const { event, paymentFailed } = makeEceEvent();
    await act(async () => {
      await onConfirm(event);
    });

    // Inline alert surfaces the Stripe error message verbatim.
    const alerts = screen.getAllByRole("alert");
    const hasMsg = alerts.some((el) =>
      el.textContent?.includes("Your card was declined."),
    );
    expect(hasMsg).toBe(true);
    // intent.createIntent ran (the failure happens after), but
    // finalizeAfterStripeSuccess MUST NOT be called on the error path.
    expect(intent.createIntent).toHaveBeenCalledTimes(1);
    expect(intent.finalizeAfterStripeSuccess).not.toHaveBeenCalled();
    // ECE's button-state error indicator is signalled via event.paymentFailed.
    expect(paymentFailed).toHaveBeenCalled();
    // No navigation on the error path.
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("defence-in-depth: while submitting is in flight, a second onConfirm does NOT trigger createIntent and event.paymentFailed() is invoked", async () => {
    const intent = setupIntent();
    // Make the first confirmPayment hang so submitting stays true while the
    // second onConfirm fires. Resolved later just to let the test exit
    // cleanly; the assertion targets the second invocation in mid-flight.
    let resolveFirst: ((value: unknown) => void) | undefined;
    stripeConfirmPaymentMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
    );
    renderForm();

    const onConfirmInitial = getCapturedEceOnConfirm();

    // First call transitions the form to submitting === true (and stays
    // there until we resolve the pending confirmPayment).
    const first = makeEceEvent();
    let firstPromise: Promise<void> | undefined;
    await act(async () => {
      firstPromise = onConfirmInitial(first.event);
      // Yield so the React state update for `setSubmitting(true)` is
      // committed (which re-runs `useCallback` with submitting=true and
      // re-renders ECE with the new handler).
      await Promise.resolve();
    });

    // Reset so we can assert nothing happens on the second invocation.
    intent.createIntent = vi.fn();
    stripeConfirmPaymentMock.mockClear();

    // Re-fetch the latest captured onConfirm — its closure now sees
    // submitting === true, so it should early-return and call paymentFailed.
    const onConfirmWhileSubmitting = getCapturedEceOnConfirm();
    const second = makeEceEvent();
    await act(async () => {
      await onConfirmWhileSubmitting(second.event);
    });

    expect(intent.createIntent).not.toHaveBeenCalled();
    expect(stripeConfirmPaymentMock).not.toHaveBeenCalled();
    expect(second.paymentFailed).toHaveBeenCalled();

    // Drain the first in-flight confirm so React/vitest don't complain
    // about unsettled promises at the end of the test.
    await act(async () => {
      resolveFirst?.({ paymentIntent: { id: "pi_x", status: "succeeded" } });
      await firstPromise;
    });
  });

  it("AC-D07: legacy session.paymentIntent.keyedBy.methodType === 'google_pay' → wallet onConfirm calls createIntent(WALLET_METHOD_TYPE) (cache-miss-by-design)", async () => {
    // Pre-populate sessionStorage so the (mocked) usePaymentIntent reflects
    // the legacy state. The CheckoutForm-level guarantee here is that the
    // wallet path INVOKES createIntent with the new methodType — the actual
    // cache-miss logic is verified at the hook level in
    // usePaymentIntent.test.tsx.
    sessionStorage.setItem(
      "testiq.session",
      JSON.stringify({
        qidRaw: 42,
        paymentIntent: {
          id: "pi_legacy",
          clientSecret: "cs_legacy",
          keyedBy: {
            qidRaw: 42,
            prcId: "",
            mdid: "",
            methodType: "google_pay",
          },
          createdAt: Date.now(),
        },
      }),
    );
    const intent = setupIntent();
    stripeConfirmPaymentMock.mockResolvedValue({
      paymentIntent: { id: "pi_wallet_fresh", status: "succeeded" },
    });
    renderForm();

    const onConfirm = getCapturedEceOnConfirm();
    const { event } = makeEceEvent();
    await act(async () => {
      await onConfirm(event);
    });

    // The wallet path invokes createIntent with the NEW wallet methodType
    // (not the legacy 'google_pay') — the cache layer in usePaymentIntent
    // sees the methodType mismatch and POSTs a fresh intent, but that
    // belongs to the hook's own test.
    expect(intent.createIntent).toHaveBeenCalledWith(WALLET_METHOD_TYPE);
    expect(WALLET_METHOD_TYPE).not.toBe("google_pay");
    // No error alert surfaces on the migration path.
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("PRD §8 AC 23: unsupported browser (ECE renders no clickable button) → CheckoutForm remains usable; PayPal + Card still interactable; no console errors", () => {
    setupIntent();
    eceRenderState.renderButton = false;
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderForm();

    // ECE stub mounts but renders no clickable wallet button.
    const stub = screen.getByTestId("ece-stub");
    expect(stub.getAttribute("data-empty")).toBe("true");
    expect(screen.queryByRole("button", { name: /express checkout/i })).toBeNull();

    // Rest of CheckoutForm is usable.
    expect(getPayPalContainer()).not.toBeNull();
    expect(getCardButton()).toBeInTheDocument();
    // Card button is enabled at idle since payment surfaces are no longer
    // gated by consent.
    expect(getCardButton()).not.toBeDisabled();

    // No console errors during the graceful unsupported-browser render.
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
