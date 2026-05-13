import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sessionState: { ipAddress?: string } = {};
const patchCalls: Array<{ ipAddress?: string }> = [];

vi.mock("./session", () => ({
  getSession: () => sessionState,
  patchSession: (partial: { ipAddress?: string }) => {
    patchCalls.push(partial);
    if ("ipAddress" in partial) sessionState.ipAddress = partial.ipAddress;
  },
}));

import { resolveIp } from "./ip";

function makeResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("resolveIp", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    sessionState.ipAddress = undefined;
    patchCalls.length = 0;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns { ok: true } without calling fetch when session already has an ipAddress", async () => {
    sessionState.ipAddress = "9.9.9.9";
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await resolveIp();

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(patchCalls).toHaveLength(0);
  });

  it("fetches ipify, writes ipAddress into session, and returns { ok: true } on success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(makeResponse({ ip: "1.2.3.4" }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await resolveIp();

    expect(fetchMock).toHaveBeenCalledWith("https://api.ipify.org?format=json");
    expect(patchCalls).toEqual([{ ipAddress: "1.2.3.4" }]);
    expect(result).toEqual({ ok: true });
  });

  it("returns { ok: false, error } and does not modify session when fetch rejects", async () => {
    const networkError = new TypeError("Failed to fetch");
    const fetchMock = vi.fn().mockRejectedValue(networkError);
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await resolveIp();

    expect(result).toEqual({ ok: false, error: networkError });
    expect(patchCalls).toHaveLength(0);
    expect(sessionState.ipAddress).toBeUndefined();
  });

  it("returns { ok: false } and does not modify session when response is non-2xx", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(makeResponse({}, false, 503));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await resolveIp();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain("503");
    }
    expect(patchCalls).toHaveLength(0);
    expect(sessionState.ipAddress).toBeUndefined();
  });
});
