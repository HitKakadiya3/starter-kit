/**
 * Unit tests for `useCustomerThankyou` — the mount-only thankyou-report
 * hook.
 *
 * Covers four branches: happy path (qid rotation persisted), missing
 * `qidEncrypted` (no network call), `ApiError` rejection, and
 * `NetworkError` rejection. Mirrors the mocking pattern of
 * `usePaymentIntent.test.tsx`.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, NetworkError, apiPost } from "@/lib/api";
import { clearSession, getSession, patchSession } from "@/lib/session";

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

const mockedApiPost = vi.mocked(apiPost);

import type { ThankyouResponse } from "./useCustomerThankyou";
import { useCustomerThankyou } from "./useCustomerThankyou";

function makeThankyouResponse(
  overrides: Partial<ThankyouResponse> = {},
): ThankyouResponse {
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
    ...overrides,
  };
}

describe("useCustomerThankyou", () => {
  beforeEach(() => {
    clearSession();
    mockedApiPost.mockReset();
  });

  afterEach(() => {
    clearSession();
    vi.clearAllMocks();
  });

  it("happy path — POSTs with encrypted qid, persists rotated qids, exposes data", async () => {
    patchSession({ qidEncrypted: "enc-abc", qidRaw: 1 });
    const response = makeThankyouResponse();
    mockedApiPost.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useCustomerThankyou());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApiPost).toHaveBeenCalledTimes(1);
    expect(mockedApiPost).toHaveBeenCalledWith("customer/thankyou", {
      quiz_result_id: "enc-abc",
      old_quiz_id: "",
    });
    expect(result.current.data).toEqual(response);
    expect(result.current.error).toBeNull();

    const session = getSession();
    expect(session.qidRaw).toBe(99);
    expect(session.qidEncrypted).toBe("enc-rotated");
  });

  it("missing qidEncrypted — does not call apiPost and surfaces an ApiError", async () => {
    const { result } = renderHook(() => useCustomerThankyou());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApiPost).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toContain("restart the test");
  });

  it("ApiError rejection — surfaces the ApiError unchanged", async () => {
    patchSession({ qidEncrypted: "enc-abc" });
    mockedApiPost.mockRejectedValueOnce(new ApiError("boom", 500));

    const { result } = renderHook(() => useCustomerThankyou());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toBe("boom");
    expect(result.current.data).toBeNull();
  });

  it("NetworkError rejection — surfaces the NetworkError unchanged", async () => {
    patchSession({ qidEncrypted: "enc-abc" });
    mockedApiPost.mockRejectedValueOnce(new NetworkError("offline"));

    const { result } = renderHook(() => useCustomerThankyou());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(NetworkError);
    expect(result.current.error?.message).toBe("offline");
    expect(result.current.data).toBeNull();
  });
});
