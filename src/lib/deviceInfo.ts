/**
 * Lightweight UA-regex device classifier for the `/questions/submit` body
 * (`user_device_info` field, PRD §4.8). No dependency on `ua-parser-js`.
 *
 * Accepts an optional `ua` argument so tests can drive fixed strings without
 * mutating `navigator`. Order of regexes matters — see inline notes.
 */

export interface DeviceInfo {
  user_device: "Mobile" | "Desktop";
  user_os: "Windows" | "MacOS" | "Android" | "iOS" | "Other";
  user_browser: "Edge" | "Chrome" | "Firefox" | "Safari" | "Other";
}

export function getDeviceInfo(ua: string = navigator.userAgent): DeviceInfo {
  return {
    user_device: /Mobi|Android/i.test(ua) ? "Mobile" : "Desktop",
    user_os: /Windows/.test(ua)
      ? "Windows"
      : /Macintosh/.test(ua)
        ? "MacOS"
        : /Android/.test(ua)
          ? "Android"
          : /iPhone|iPad/.test(ua)
            ? "iOS"
            : "Other",
    // Edge must be checked before Chrome — the Edge UA contains `Chrome/`.
    // Safari must be checked last — Chrome UA also contains `Safari/`.
    user_browser: /Edg\//.test(ua)
      ? "Edge"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Other",
  };
}
