import { describe, expect, it } from "vitest";

import { getDeviceInfo } from "./deviceInfo";

const UA = {
  androidChrome:
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  windowsEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  windowsFirefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
} as const;

describe("getDeviceInfo", () => {
  it("classifies Mobile Chrome on Android", () => {
    expect(getDeviceInfo(UA.androidChrome)).toEqual({
      user_device: "Mobile",
      user_os: "Android",
      user_browser: "Chrome",
    });
  });

  it("classifies iPhone Safari", () => {
    expect(getDeviceInfo(UA.iphoneSafari)).toEqual({
      user_device: "Mobile",
      user_os: "iOS",
      user_browser: "Safari",
    });
  });

  it("classifies Desktop Chrome on Windows", () => {
    expect(getDeviceInfo(UA.windowsChrome)).toEqual({
      user_device: "Desktop",
      user_os: "Windows",
      user_browser: "Chrome",
    });
  });

  it("classifies Desktop Chrome on macOS", () => {
    expect(getDeviceInfo(UA.macChrome)).toEqual({
      user_device: "Desktop",
      user_os: "MacOS",
      user_browser: "Chrome",
    });
  });

  it("classifies Edge (not Chrome) on Windows", () => {
    const info = getDeviceInfo(UA.windowsEdge);

    expect(info.user_os).toBe("Windows");
    expect(info.user_browser).toBe("Edge");
  });

  it("classifies Firefox on Windows", () => {
    const info = getDeviceInfo(UA.windowsFirefox);

    expect(info.user_browser).toBe("Firefox");
  });

  it("returns Other/Other/Desktop for an empty UA", () => {
    expect(getDeviceInfo("")).toEqual({
      user_device: "Desktop",
      user_os: "Other",
      user_browser: "Other",
    });
  });
});
