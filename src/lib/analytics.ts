/**
 * GTM dataLayer helpers.
 *
 * `window.dataLayer` is initialised by the Google Tag Manager snippet in
 * `index.html`. We only push to it; reading is GTM's job. Each push site in
 * the codebase calls `pushDataLayer` directly with a literal object so that
 * grepping for `event: 'paypal_payment'` etc. finds the call site without
 * having to chase wrapper functions.
 */

export type DataLayerEvent = Record<string, unknown> & { event: string };

interface WindowWithDataLayer {
  dataLayer?: Array<Record<string, unknown>>;
}

export function pushDataLayer(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as WindowWithDataLayer;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(payload);
}

/**
 * Replays an array of pre-built dataLayer entries returned by the backend
 * (e.g. `/customer/thankyou` → `googleAnalyticsData.dataLayers`). Each entry
 * is pushed verbatim. Entries without a string `event` field are skipped so
 * a malformed backend response never crashes the page.
 */
export function pushDataLayerBatch(
  entries: ReadonlyArray<Record<string, unknown>> | undefined,
): void {
  if (!Array.isArray(entries)) return;
  for (const entry of entries) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof (entry as { event?: unknown }).event === "string"
    ) {
      pushDataLayer(entry as DataLayerEvent);
    }
  }
}
