import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sessionState: { ipAddress?: string } = { ipAddress: "1.2.3.4" };

vi.mock("./session", () => ({
  getSession: () => sessionState,
}));

// ensureIpResolved is a no-op in tests — we want to assert on the EXACT
// fetch init object without an intervening ipify request muddling the mock
// call log. The session ipAddress is still what api.ts reads to build the
// header, so testing "empty ip_address when session has none" still works.
vi.mock("./ip", () => ({
  ensureIpResolved: async () => {},
}));

import { apiGet, apiPost, ApiError, NetworkError } from "./api";

function makeOkResponse<T>(data: T, status = 200, message = "ok"): Response {
  return {
    json: async () => ({ meta: { success: true, status, message }, data }),
  } as unknown as Response;
}

function makeFailResponse(message: string, status: number): Response {
  return {
    json: async () => ({ meta: { success: false, status, message }, data: null }),
  } as unknown as Response;
}

describe("api client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    sessionState.ipAddress = "1.2.3.4";
    vi.stubEnv("VITE_API_BASE_URL", "http://example.test/api/v1/");
    vi.stubEnv("VITE_API_TOKEN", "test-token");
    vi.stubEnv("VITE_X_HOST", "test-host.com");
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    window.history.replaceState({}, "", "/");
  });

  it("injects Authorization, x-host, ip_address, and Content-Type headers on every request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("foo");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).toEqual({
      Authorization: "Bearer test-token",
      "x-host": "test-host.com",
      ip_address: "1.2.3.4",
      "Content-Type": "application/json",
    });
  });

  it("appends the URL's locale segment to x-host on non-default-locale routes", async () => {
    window.history.replaceState({}, "", "/ja/quiz");
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("foo");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["x-host"]).toBe("test-host.com/ja");
  });

  it("does not append the default locale (en) — English lives at the root", async () => {
    window.history.replaceState({}, "", "/quiz");
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("foo");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["x-host"]).toBe("test-host.com");
  });

  it("ignores non-locale first segments (e.g. /quiz) and keeps base host", async () => {
    window.history.replaceState({}, "", "/checkout");
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("foo");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["x-host"]).toBe("test-host.com");
  });

  it("sends ip_address header as empty string when session has no ipAddress", async () => {
    sessionState.ipAddress = undefined;
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("foo");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.ip_address).toBe("");
  });

  it("prefixes VITE_API_BASE_URL on the requested path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiGet("questions");

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://example.test/api/v1/questions");
  });

  it("unwraps the envelope and returns meta.success=true payload data", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ foo: "bar" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await apiGet<{ foo: string }>("foo");

    expect(result).toEqual({ foo: "bar" });
  });

  it("throws ApiError with meta.message and meta.status when meta.success is false", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(makeFailResponse("Invalid token", 401));
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(apiGet("foo")).rejects.toMatchObject({
      name: "ApiError",
      message: "Invalid token",
      status: 401,
    });
    await expect(apiGet("foo")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws NetworkError when fetch rejects", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new TypeError("Failed to fetch"));
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(apiGet("foo")).rejects.toBeInstanceOf(NetworkError);
  });

  it("serializes body as JSON and uses POST method for apiPost", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeOkResponse({ ok: true }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await apiPost("submit", { email: "a@b.com", n: 1 });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ email: "a@b.com", n: 1 }));
  });
});
