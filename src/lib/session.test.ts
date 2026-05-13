import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearSession, getSession, patchSession } from "./session";

const STORAGE_KEY = "testiq.session";

describe("session accessor", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns {} when sessionStorage is empty", () => {
    expect(getSession()).toEqual({});
  });

  it("persists a field written via patchSession", () => {
    patchSession({ email: "a@b.co" });

    expect(getSession().email).toBe("a@b.co");
  });

  it("merges partial updates shallowly and preserves unspecified fields", () => {
    patchSession({ email: "a@b.co" });
    patchSession({ prcId: "X" });

    expect(getSession()).toEqual({ email: "a@b.co", prcId: "X" });
  });

  it("clearSession empties storage so getSession returns {}", () => {
    patchSession({ email: "a@b.co", qidRaw: 42 });

    clearSession();

    expect(getSession()).toEqual({});
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("returns {} and logs a warning when storage contains invalid JSON", () => {
    sessionStorage.setItem(STORAGE_KEY, "{not json");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = getSession();

    expect(result).toEqual({});
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("returns {} when stored value is valid JSON but not an object (e.g., null)", () => {
    sessionStorage.setItem(STORAGE_KEY, "null");

    expect(getSession()).toEqual({});
  });
});
