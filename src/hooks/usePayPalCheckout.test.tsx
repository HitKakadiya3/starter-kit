/**
 * Unit tests for `usePayPalCheckout` — the native PayPal SDK lifecycle hook.
 *
 * The PayPal SDK loader (`@/lib/paypal`), the API client (`@/lib/api`), and
 * the session reader (`@/lib/session`) are all mocked so the hook's button
 * lifecycle, capture flow, and backend-confirm error handling are exercised
 * without any real network or DOM injection.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, NetworkError, apiPost } from "@/lib/api";
import { loadPayPalSdk } from "@/lib/paypal";
import { getSession } from "@/lib/session";

vi.mock("@/lib/paypal", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/paypal")>("@/lib/paypal");
  return {
    ...actual,
    loadPayPalSdk: vi.fn(),
  };
});

vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      public readonly status: number,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
  NetworkError: class NetworkError extends Error {
    constructor(message = "Network request failed") {
      super(message);
      this.name = "NetworkError";
    }
  },
}));

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

const mockedLoadPayPalSdk = vi.mocked(loadPayPalSdk);
const mockedApiPost = vi.mocked(apiPost);
const mockedGetSession = vi.mocked(getSession);

import { usePayPalCheckout } from "./usePayPalCheckout";
import type {
  UsePayPalCheckoutArgs,
  UsePayPalCheckoutResult,
} from "./usePayPalCheckout";

interface FakeButtons {
  render: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
}

interface CapturedConfig {
  onClick?: (
    data: unknown,
    actions: { reject: () => unknown; resolve: () => unknown },
  ) => unknown;
  createOrder?: (
    data: unknown,
    actions: { order: { create: (req: unknown) => Promise<string> } },
  ) => Promise<string>;
  onApprove?: (
    data: { paymentID?: string | null },
    actions: { order?: { capture: () => Promise<unknown> } },
  ) => Promise<void>;
  onError?: (err: unknown) => void;
  onCancel?: () => void;
  style?: unknown;
}

interface FakePaypal {
  Buttons: ReturnType<typeof vi.fn>;
  FUNDING: { PAYPAL: string };
}

function setupSdk(): {
  capturedConfig: CapturedConfig;
  buttons: FakeButtons;
} {
  const buttons: FakeButtons = {
    render: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  };
  const capturedConfig: CapturedConfig = {};
  const fakePaypal: FakePaypal = {
    Buttons: vi.fn((cfg: CapturedConfig) => {
      Object.assign(capturedConfig, cfg);
      return buttons;
    }),
    FUNDING: { PAYPAL: "paypal" },
  };
  mockedLoadPayPalSdk.mockResolvedValue(fakePaypal as never);
  return { capturedConfig, buttons };
}

function makeFreshContainer(): HTMLDivElement {
  return document.createElement("div");
}

function defaultArgs(
  overrides: Partial<UsePayPalCheckoutArgs> = {},
): UsePayPalCheckoutArgs {
  return {
    mode: "sandbox",
    amount: 4.99,
    currency: "USD",
    description: "16 Types Test — Initial Payment",
    onSuccess: vi.fn(),
    onError: vi.fn(),
    disabled: false,
    ...overrides,
  };
}

describe("usePayPalCheckout", () => {
  beforeEach(() => {
    mockedLoadPayPalSdk.mockReset();
    mockedApiPost.mockReset();
    mockedGetSession.mockReset();
    mockedGetSession.mockReturnValue({
      qidRaw: 42,
      email: "x@y.co",
      prcId: "PRC-1",
      mdid: "MDID-1",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("a. renders Buttons into the container exactly once when render(div) is called", async () => {
    const { buttons } = setupSdk();
    const args = defaultArgs();
    const { result } = renderHook(() => usePayPalCheckout(args));

    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockedLoadPayPalSdk).toHaveBeenCalledTimes(1);
    expect(mockedLoadPayPalSdk).toHaveBeenCalledWith("sandbox", { currency: "USD" });
    expect(buttons.render).toHaveBeenCalledTimes(1);
    expect(buttons.render).toHaveBeenCalledWith(container);
  });

  it("b. createOrder uses the session pricing — amount, currency, description propagate", async () => {
    const { capturedConfig } = setupSdk();
    const args = defaultArgs({
      amount: 4.99,
      currency: "USD",
      description: "16 Types Test — Initial Payment",
    });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const orderCreate = vi.fn().mockResolvedValue("order-id-123");
    await capturedConfig.createOrder!(
      {},
      { order: { create: orderCreate } },
    );

    expect(orderCreate).toHaveBeenCalledTimes(1);
    const arg = orderCreate.mock.calls[0][0] as {
      intent: string;
      purchase_units: Array<{
        description: string;
        amount: { currency_code: string; value: string };
      }>;
    };
    expect(arg.intent).toBe("CAPTURE");
    expect(arg.purchase_units[0].amount.value).toBe("4.99");
    expect(arg.purchase_units[0].amount.currency_code).toBe("USD");
    expect(arg.purchase_units[0].description).toBe(
      "16 Types Test — Initial Payment",
    );
  });

  it("c. onApprove → capture → backend confirm → onSuccess(redirect)", async () => {
    const { capturedConfig } = setupSdk();
    const onSuccess = vi.fn();
    const args = defaultArgs({ onSuccess });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const fakeOrder = {
      id: "ORDER-XYZ",
      payer: {
        email_address: "buyer@example.com",
        payer_id: "PAYER123",
      },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: "CAPTURE456",
                amount: { value: "4.99", currency_code: "USD" },
              },
            ],
          },
        },
      ],
    };
    const capture = vi.fn().mockResolvedValue(fakeOrder);
    mockedApiPost.mockResolvedValueOnce({ redirect_page: "/cross-sell" });

    await act(async () => {
      await capturedConfig.onApprove!(
        { paymentID: "PAY789" },
        { order: { capture } },
      );
    });

    expect(capture).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith(
      "payment/paypal/first-sale/payments/confirm",
      {
        quiz_result_id: 42,
        user_on_iqbooster: "",
        prc_id: "PRC-1",
        pricing_discount: "MDID-1",
        payment_method: "paypal",
        payment_status: "paid",
        charge_id: "CAPTURE456",
        paypal_order_id: "ORDER-XYZ",
        item_price: 4.99,
        paypal_customer_email: "buyer@example.com",
        payment_method_id: "PAY789",
        paypal_customer_id: "PAYER123",
      },
    );
    expect(onSuccess).toHaveBeenCalledWith("/cross-sell");
  });

  it("d. disabled gate — onClick returns actions.reject(), not actions.resolve()", async () => {
    const { capturedConfig } = setupSdk();
    const args = defaultArgs({ disabled: true });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const reject = vi.fn().mockResolvedValue(undefined);
    const resolve = vi.fn().mockResolvedValue(undefined);
    capturedConfig.onClick!({}, { reject, resolve });

    expect(reject).toHaveBeenCalledTimes(1);
    expect(resolve).not.toHaveBeenCalled();
  });

  it("e. capture failure → onError called with the error message", async () => {
    const { capturedConfig } = setupSdk();
    const onError = vi.fn();
    const args = defaultArgs({ onError });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const capture = vi.fn().mockRejectedValue(new Error("capture exploded"));
    await act(async () => {
      await capturedConfig.onApprove!(
        { paymentID: "PAY1" },
        { order: { capture } },
      );
    });

    expect(onError).toHaveBeenCalledWith("capture exploded");
    expect(mockedApiPost).not.toHaveBeenCalled();
  });

  it("f. backend confirm 4xx → onError called with 'Backend confirm failed: ...'", async () => {
    const { capturedConfig } = setupSdk();
    const onError = vi.fn();
    const args = defaultArgs({ onError });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const fakeOrder = {
      id: "ORDER-1",
      payer: { email_address: "b@e.com", payer_id: "P1" },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: "C1",
                amount: { value: "4.99", currency_code: "USD" },
              },
            ],
          },
        },
      ],
    };
    const capture = vi.fn().mockResolvedValue(fakeOrder);
    mockedApiPost.mockRejectedValueOnce(new ApiError("invalid order", 400));

    await act(async () => {
      await capturedConfig.onApprove!(
        { paymentID: "PAY2" },
        { order: { capture } },
      );
    });

    expect(onError).toHaveBeenCalledWith("Backend confirm failed: invalid order");
  });

  it("g. SDK load failure → isError true, errorMessage set, onError called", async () => {
    mockedLoadPayPalSdk.mockRejectedValueOnce(new Error("sdk down"));
    const onError = vi.fn();
    const args = defaultArgs({ onError });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.errorMessage).toBe("sdk down");
    expect(onError).toHaveBeenCalledWith("sdk down");
  });

  it("h. NetworkError on confirm → onError called with 'Network error during PayPal confirm'", async () => {
    const { capturedConfig } = setupSdk();
    const onError = vi.fn();
    const args = defaultArgs({ onError });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();
    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
      await Promise.resolve();
    });

    const fakeOrder = {
      id: "ORDER-N",
      payer: { email_address: "n@e.com", payer_id: "PN" },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: "CN",
                amount: { value: "4.99", currency_code: "USD" },
              },
            ],
          },
        },
      ],
    };
    const capture = vi.fn().mockResolvedValue(fakeOrder);
    mockedApiPost.mockRejectedValueOnce(new NetworkError("offline"));

    await act(async () => {
      await capturedConfig.onApprove!(
        { paymentID: "PAY-N" },
        { order: { capture } },
      );
    });

    expect(onError).toHaveBeenCalledWith("Network error during PayPal confirm");
  });

  it("h. surfaces isError without loading the SDK when currency is unsupported (e.g. INR)", async () => {
    setupSdk();
    const onError = vi.fn();
    const args = defaultArgs({ currency: "INR", onError });
    const { result } = renderHook(() => usePayPalCheckout(args));
    const container = makeFreshContainer();

    await act(async () => {
      result.current.render(container);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.errorMessage).toContain("INR");
    expect(result.current.isLoading).toBe(false);
    // Must NOT load the SDK for an unsupported currency.
    expect(mockedLoadPayPalSdk).not.toHaveBeenCalled();
    // Must NOT bubble to onError — caller's existing isError fallback UI
    // is the right channel; calling onError on initial render would push a
    // top-level toast even if the user is about to pay with Card/GPay.
    expect(onError).not.toHaveBeenCalled();
  });
});

// Sanity: exported types are referenced so the file compiles strictly.
type _Sanity1 = UsePayPalCheckoutArgs;
type _Sanity2 = UsePayPalCheckoutResult;
