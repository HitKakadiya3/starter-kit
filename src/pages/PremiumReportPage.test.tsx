/**
 * Page-level smoke tests for `<PremiumReportPage>` (Module 5 — T2).
 *
 * Three cases:
 *   1. Missing `qidEncrypted` in session → error variant, no thankyou call.
 *   2. Happy path → API-driven render: stress marker `style.left` and social
 *      battery percent reflect the contract response.
 *   3. Dev `state.scores` path → no thankyou call; client-side report mounts.
 *
 * Mirrors the mocking conventions of `useRedirectGuard.test.tsx` /
 * `useCustomerThankyou.test.tsx`: `apiPost` is mocked at module level for
 * both `'questions/results'` (resume guard) and `'customer/thankyou'`
 * (live report). `react-pdf` is stubbed to keep PDF generation off the
 * test path.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiPost } from "@/lib/api";
import { clearSession, patchSession } from "@/lib/session";
import type { Scores } from "@/utils/scoring";
// Side-effect import: initialises the shared `i18next` instance so
// `useTranslation` returns real strings instead of warning about a missing
// instance. Mirrors the production bootstrap in `main.tsx`.
import "@/i18n";

// jsdom does not implement IntersectionObserver. The page's section animation
// + sidebar scroll-spy use it; provide a no-op stub so React effects can mount.
class IntersectionObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverStub,
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

// Stub @react-pdf/renderer — the page imports `pdf()` for the PDF download
// path. We never trigger a download in these tests, but the module is
// evaluated at import time, so a lightweight stub avoids dragging the real
// renderer (and its native deps) into the jsdom environment.
vi.mock("@react-pdf/renderer", () => ({
  pdf: () => ({ toBlob: () => Promise.resolve(new Blob()) }),
  Document: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  View: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Text: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Image: () => null,
  StyleSheet: { create: <T,>(s: T) => s },
  Font: { register: () => undefined },
}));

vi.mock("@/pdf/ReportPdf", () => ({
  ReportPdf: () => null,
}));

const mockedApiPost = vi.mocked(apiPost);

import PremiumReportPage from "./PremiumReportPage";

interface ApiPostCall {
  path: string;
  body: unknown;
}

function setupApiPost(handler: (call: ApiPostCall) => unknown): void {
  mockedApiPost.mockImplementation((path: string, body?: unknown) => {
    const result = handler({ path, body });
    return Promise.resolve(result);
  });
}

describe("<PremiumReportPage>", () => {
  beforeEach(() => {
    clearSession();
    mockedApiPost.mockReset();
  });

  afterEach(() => {
    clearSession();
    vi.clearAllMocks();
  });

  it("renders the error variant when the session is missing qidEncrypted (no thankyou call)", async () => {
    // Session has the raw qid + the customerUpdateSubmitted override flag,
    // but no qidEncrypted — the hook short-circuits before calling apiPost.
    patchSession({ qidRaw: 1, customerUpdateSubmitted: true });

    setupApiPost(({ path }) => {
      if (path === "questions/results") {
        // Backend says CUSTOMER_DETAILS_PAGE; the override flag forwards it
        // to THANK_YOU_PAGE → /results, so the guard marks ready. The
        // returned encrypted_quiz_result_id is empty so the thankyou hook
        // still trips the `!qidEncrypted` short-circuit.
        return {
          quiz_result_id: 1,
          encrypted_quiz_result_id: "",
          redirect_page: "CUSTOMER_DETAILS_PAGE",
        };
      }
      throw new Error(`Unexpected apiPost path: ${path}`);
    });

    render(
      <MemoryRouter initialEntries={["/results?qid=1"]}>
        <PremiumReportPage />
      </MemoryRouter>,
    );

    // Error variant uses i18n keys; with no provider the literal key falls
    // back to itself, which is enough to verify the variant rendered.
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    // Retry button is rendered (key falls back to literal in tests without
    // an i18n provider, or to translated text when one exists).
    const retryButtons = screen.getAllByRole("button");
    expect(retryButtons.length).toBeGreaterThanOrEqual(2);

    // No thankyou call was ever fired — the hook short-circuited.
    const thankyouCalls = mockedApiPost.mock.calls.filter(
      ([p]) => p === "customer/thankyou",
    );
    expect(thankyouCalls).toHaveLength(0);
  });

  it("renders the API-driven report on a happy thankyou response", async () => {
    patchSession({
      qidRaw: 1,
      qidEncrypted: "enc-abc",
      customerUpdateSubmitted: true,
    });

    setupApiPost(({ path }) => {
      if (path === "questions/results") {
        return {
          quiz_result_id: 1,
          encrypted_quiz_result_id: "enc-abc",
          redirect_page: "CUSTOMER_DETAILS_PAGE",
        };
      }
      if (path === "customer/thankyou") {
        return {
          quiz_result_id: 99,
          encrypted_quiz_result_id: "enc-rotated",
          sixteentypes_report_detail: {
            personality_type: "ISTJ",
            identity: "T",
            turbulent_percent: 58,
            social_battery: 41,
            stress_marker: 47,
          },
        };
      }
      throw new Error(`Unexpected apiPost path: ${path}`);
    });

    render(
      <MemoryRouter initialEntries={["/results?qid=1"]}>
        <PremiumReportPage />
      </MemoryRouter>,
    );

    // Wait for the live report to mount.
    const stressMarker = await screen.findByTestId("stress-marker-dot");
    expect(stressMarker).toHaveStyle({ left: "47%" });

    const battery = await screen.findByTestId("social-battery-percent");
    expect(battery.textContent).toBe("41%");

    // Thankyou was called exactly once with the encrypted qid + empty old id.
    const thankyouCalls = mockedApiPost.mock.calls.filter(
      ([p]) => p === "customer/thankyou",
    );
    expect(thankyouCalls).toHaveLength(1);
    expect(thankyouCalls[0]?.[1]).toEqual({
      quiz_result_id: "enc-abc",
      old_quiz_id: "",
    });
  });

  it("dev state.scores path: no thankyou call, client-side report mounts", async () => {
    // Set a default mock so accidental calls are visible. The dev path must
    // not hit the network at all.
    setupApiPost(({ path }) => {
      throw new Error(`Unexpected apiPost path: ${path}`);
    });

    const fixtureScores: Scores = { E: 5, I: 3, S: 4, N: 5, T: 6, F: 2, J: 5, P: 3 };

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/results", state: { scores: fixtureScores } },
        ]}
      >
        <PremiumReportPage />
      </MemoryRouter>,
    );

    // Sanity: client report mounted — the PortraitSection renders an h2
    // "Type Portrait" heading immediately on the dev path.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: "Type Portrait" }),
      ).toBeInTheDocument();
    });

    // Zero thankyou calls.
    const thankyouCalls = mockedApiPost.mock.calls.filter(
      ([p]) => p === "customer/thankyou",
    );
    expect(thankyouCalls).toHaveLength(0);

    // No questions/results either — the dev path skips the resume guard.
    const resultsCalls = mockedApiPost.mock.calls.filter(
      ([p]) => p === "questions/results",
    );
    expect(resultsCalls).toHaveLength(0);
  });
});
