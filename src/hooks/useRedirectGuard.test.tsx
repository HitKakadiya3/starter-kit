import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sessionState: {
  qidRaw?: number;
  qidEncrypted?: string;
  prcId?: string;
  mdid?: string;
  crossSellResolved?: boolean;
  customerUpdateSubmitted?: boolean;
} = {};
const patchCalls: Array<Record<string, unknown>> = [];

const apiPostMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("@/lib/api", () => ({
  apiPost: (path: string, body: unknown) => apiPostMock(path, body),
}));

vi.mock("@/lib/session", () => ({
  getSession: () => sessionState,
  patchSession: (partial: Record<string, unknown>) => {
    patchCalls.push(partial);
    Object.assign(sessionState, partial);
  },
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { useRedirectGuard } from "./useRedirectGuard";

function Probe({ route }: { route: string }) {
  const ready = useRedirectGuard(route);
  return <div data-testid="ready">{String(ready)}</div>;
}

function renderAt(initialPath: string, route: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Probe route={route} />
    </MemoryRouter>,
  );
}

describe("useRedirectGuard", () => {
  beforeEach(() => {
    apiPostMock.mockReset();
    navigateMock.mockReset();
    patchCalls.length = 0;
    sessionState.qidRaw = undefined;
    sessionState.qidEncrypted = undefined;
    sessionState.prcId = undefined;
    sessionState.mdid = undefined;
    sessionState.crossSellResolved = undefined;
    sessionState.customerUpdateSubmitted = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to / and skips api call when no qid in URL or session", async () => {
    renderAt("/checkout", "/checkout");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    });
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });

  it("patches session and marks ready when server redirect matches current route", async () => {
    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "INITIAL_PAYMENT_PAGE",
    });

    renderAt("/checkout?qid=42", "/checkout");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });

    // URL qid is parsed to Number and passed as quiz_result_id in the body.
    expect(apiPostMock).toHaveBeenCalledWith("questions/results", expect.objectContaining({
      quiz_result_id: 42,
    }));
    expect(patchCalls).toContainEqual({
      qidRaw: 42,
      qidEncrypted: "ENC123",
      email: "a@b.co",
      pricingInfo: { plan: "basic" },
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("navigates to the resolved route when server redirect does not match current route", async () => {
    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "INITIAL_PAYMENT_PAGE",
    });

    renderAt("/cross-sell?qid=42", "/cross-sell");

    await waitFor(() => {
      // Forwarded URL carries the raw integer quiz_result_id, not the
      // encrypted form (backend rejects encrypted on /questions/results).
      expect(navigateMock).toHaveBeenCalledWith("/checkout?qid=42", {
        replace: true,
      });
    });
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });

  it("treats CROSS_SELL_OFFER_PAGE as CUSTOMER_DETAILS_PAGE when session.crossSellResolved is true", async () => {
    sessionState.crossSellResolved = true;

    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "CROSS_SELL_OFFER_PAGE",
    });

    // Caller is on /details. Without the override, the guard would navigate
    // to /cross-sell?qid=42 and loop the user. With the override, the guard
    // marks ready because the effective redirect resolves to CUSTOMER_DETAILS_PAGE → /details.
    renderAt("/details?qid=42", "/details");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does NOT override other redirect values when crossSellResolved is true", async () => {
    sessionState.crossSellResolved = true;

    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "INITIAL_PAYMENT_PAGE",
    });

    renderAt("/details?qid=42", "/details");

    await waitFor(() => {
      // Still navigates to /checkout — the flag only affects CROSS_SELL_OFFER_PAGE.
      expect(navigateMock).toHaveBeenCalledWith("/checkout?qid=42", {
        replace: true,
      });
    });
  });

  it("navigates to / when the api call rejects", async () => {
    apiPostMock.mockRejectedValue(new Error("boom"));

    renderAt("/checkout?qid=42", "/checkout");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    });
    expect(screen.getByTestId("ready").textContent).toBe("false");
  });

  it("navigates to / when the URL qid is not numeric and no session qidRaw exists (non-/results route)", async () => {
    renderAt("/checkout?qid=NOT_NUMERIC", "/checkout");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    });
    expect(apiPostMock).not.toHaveBeenCalled();
  });

  it("treats a non-numeric URL qid on /results as the encrypted id (fresh browser, empty session)", async () => {
    renderAt("/results?qid=1AYRxE8X7L9Emdr3", "/results");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });

    // The encrypted id is persisted so useCustomerThankyou can pick it up.
    expect(patchCalls).toContainEqual({ qidEncrypted: "1AYRxE8X7L9Emdr3" });
    // /questions/results is skipped — backend rejects encrypted ids there,
    // and customer/thankyou (called by the page) is the validity check.
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("/career-report: persists URL qid as encrypted and marks ready without an api call", async () => {
    renderAt("/career-report?qid=1AYRxE8X7L9Emdr3", "/career-report");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });

    expect(patchCalls).toContainEqual({ qidEncrypted: "1AYRxE8X7L9Emdr3" });
    // /career-report is past the redirect-page state machine — calling
    // /questions/results would just bounce the user back to /results.
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("/career-report: marks ready with no API call even when URL qid is missing (session.qidEncrypted carries the id)", async () => {
    sessionState.qidEncrypted = "ALREADY_THERE";
    renderAt("/career-report", "/career-report");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });

    // No URL qid → no patch (existing session.qidEncrypted is reused).
    expect(patchCalls).toHaveLength(0);
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("forwards CROSS_SELL_OFFER_PAGE → CUSTOMER_DETAILS_PAGE for the skip path (same as accept)", async () => {
    sessionState.crossSellResolved = true;

    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "CROSS_SELL_OFFER_PAGE",
    });

    // User clicked Skip, navigated to /details. On mount the guard
    // fetches results, gets CROSS_SELL_OFFER_PAGE back, overrides it to
    // CUSTOMER_DETAILS_PAGE and lets /details render.
    renderAt("/details?qid=42", "/details");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("forwards CUSTOMER_DETAILS_PAGE → THANK_YOU_PAGE when customerUpdateSubmitted is true", async () => {
    sessionState.customerUpdateSubmitted = true;

    apiPostMock.mockResolvedValue({
      quiz_result_id: 42,
      encrypted_quiz_result_id: "ENC123",
      email: "a@b.co",
      pricing_info: { plan: "basic" },
      redirect_page: "CUSTOMER_DETAILS_PAGE",
    });

    // Caller is on /results. With the submitted flag, the backend's stale
    // CUSTOMER_DETAILS_PAGE is forwarded to THANK_YOU_PAGE so /results
    // renders instead of bouncing back to /details.
    renderAt("/results?qid=42", "/results");

    await waitFor(() => {
      expect(screen.getByTestId("ready").textContent).toBe("true");
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
