/**
 * Format an epoch-ms timestamp as `YYYY-MM-DD HH:mm:ss` in the
 * Asia/Jerusalem timezone — matches PHP's `date('Y-m-d H:i:s')` so the
 * backend (which runs in Jerusalem time) can parse it directly without
 * any TZ conversion.
 */
export function formatJerusalemDateTime(epochMs: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(epochMs));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
