import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { captureCampaignParams } from "./campaign";
import { clearSession, getSession, patchSession } from "./session";

/**
 * Navigate the jsdom window to a new URL without triggering a reload.
 * `history.pushState` keeps the rest of window.location in sync, which is
 * important because `captureCampaignParams` reads `window.location.href`.
 */
function navigateTo(url: string): void {
  window.history.pushState({}, "", url);
}

describe("captureCampaignParams", () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clearSession();
    navigateTo("/");
    replaceStateSpy = vi.spyOn(window.history, "replaceState");
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("writes landingUrl/landingTime on first call with no marketing params", () => {
    navigateTo("/");

    captureCampaignParams();

    const session = getSession();
    expect(session.prcId).toBeUndefined();
    expect(session.mdid).toBeUndefined();
    expect(session.landingUrl).toBe(window.location.href);
    expect(typeof session.landingTime).toBe("number");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("captures prc_id when only prc_id is present", () => {
    navigateTo("/?prc_id=ABC");

    captureCampaignParams();

    expect(getSession().prcId).toBe("ABC");
    expect(getSession().mdid).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("captures mdid when only mdid is present", () => {
    navigateTo("/?mdid=50");

    captureCampaignParams();

    expect(getSession().mdid).toBe("50");
    expect(getSession().prcId).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("captures both prc_id and mdid when both are present — backend accepts them together", () => {
    navigateTo("/?prc_id=ABC&mdid=50");

    captureCampaignParams();

    expect(getSession().prcId).toBe("ABC");
    expect(getSession().mdid).toBe("50");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("never mutates the URL — URL is the source of truth", () => {
    navigateTo("/?prc_id=ABC");

    captureCampaignParams();

    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(window.location.search).toBe("?prc_id=ABC");
  });

  it("does not overwrite pre-seeded landingUrl/landingTime", () => {
    patchSession({ landingUrl: "/old", landingTime: 123 });
    navigateTo("/?prc_id=X");

    captureCampaignParams();

    const session = getSession();
    expect(session.landingUrl).toBe("/old");
    expect(session.landingTime).toBe(123);
    expect(session.prcId).toBe("X");
  });

  it("clears session.mdid when a subsequent navigation drops ?mdid from the URL", () => {
    navigateTo("/?mdid=50");
    captureCampaignParams();
    expect(getSession().mdid).toBe("50");

    // User navigates to a page without the discount param.
    navigateTo("/checkout?qid=12345");
    captureCampaignParams();

    expect(getSession().mdid).toBeUndefined();
    expect(getSession().prcId).toBeUndefined();
  });

  it("clears session.prcId when a subsequent navigation drops ?prc_id from the URL", () => {
    navigateTo("/?prc_id=ABC");
    captureCampaignParams();
    expect(getSession().prcId).toBe("ABC");

    navigateTo("/pricing");
    captureCampaignParams();

    expect(getSession().prcId).toBeUndefined();
  });
});
