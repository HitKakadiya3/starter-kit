/**
 * Mount-only hook that POSTs `customer/thankyou` and exposes the report
 * payload as `{ data, loading, error }`.
 *
 * Mirrors the lifecycle pattern of `useRedirectGuard` — a single
 * `useEffect(() => { … }, [])` that fires once per mount. The backend may
 * rotate the quiz id pair (raw + encrypted) in the response, so the hook
 * re-persists both onto the session via `patchSession` (Module 5 §4.1).
 *
 * Consumed by `PremiumReportPage` in T2; this file ships standalone with
 * unit tests in T1.
 */

import { useEffect, useState } from "react";

import { ApiError, NetworkError, apiPost } from "@/lib/api";
import { pushDataLayerBatch } from "@/lib/analytics";
import { getSession, patchSession } from "@/lib/session";

/**
 * Per-axis breakdown returned by the backend. Five entries: the four MBTI
 * axes plus `assertive_turbulent`. `sixteentypes_full_result.percent` is the
 * percentage of the *first* pole named in `category` (e.g. for
 * `extraversion_introversion` it is the % Extraversion, so the % Introversion
 * is `100 - percent`).
 */
export interface CategoryResult {
  category:
    | "extraversion_introversion"
    | "sensing_intuition"
    | "thinking_feeling"
    | "judging_perceiving"
    | "assertive_turbulent"
    | string;
  rating_score_sum: number;
  sixteentypes_result: string;
  sixteentypes_full_result: { letter: string; percent: number };
  name: string;
  id: number;
}

export interface SixteenTypesReportDetail {
  personality_type: string;
  identity: "A" | "T";
  turbulent_percent: number;
  social_battery: number;
  stress_marker: number;
  /** Per-axis percentages — drives the four hero bars on the report. */
  category_result?: CategoryResult[];
}

export interface ThankyouResponse {
  report_file_url?: string;
  certificate_file_url?: string;
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
  promocode_url?: string | null;
  personality_type?: string;
  sixteentypes_report_detail: SixteenTypesReportDetail;
  is_cross_sale_transaction_completed?: boolean;
  /**
   * Mirrors the funnel `redirect_page` enum returned by other state-mutating
   * endpoints (`/questions/results`, `payment/confirm`, `customer/update`,
   * `payment/cross-sale/payments/confirm`). Surfaced here so `/results` can
   * bounce users back to the correct funnel step when the backend reports
   * they haven't completed checkout / cross-sell / details — `/results`
   * carries an encrypted qid and `/questions/results` only accepts the raw
   * integer, so the resume guard short-circuits for this route and
   * `customer/thankyou` is the only place this signal arrives.
   */
  redirect_page?: string;
  /**
   * Backend-prepared GA4 dataLayer entries (sale, subscription_event,
   * View page Payment Completed, Cross_Sell_Page, …). Each entry is pushed
   * to `window.dataLayer` verbatim on first successful response.
   */
  googleAnalyticsData?: {
    message?: string;
    dataLayers?: Array<Record<string, unknown>>;
  };
}

interface State {
  data: ThankyouResponse | null;
  loading: boolean;
  error: ApiError | NetworkError | null;
}

export function useCustomerThankyou(): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const qidEncrypted = getSession().qidEncrypted;
    if (!qidEncrypted) {
      setState({
        data: null,
        loading: false,
        error: new ApiError(
          "Session is missing the encrypted quiz id. Please restart the test.",
          0,
        ),
      });
      return;
    }

    apiPost<ThankyouResponse>("customer/thankyou", {
      quiz_result_id: qidEncrypted,
      old_quiz_id: "",
    })
      .then((data) => {
        // Backend may rotate qids — re-persist (Module 5 §4.1 precedent).
        patchSession({
          qidRaw: data.quiz_result_id,
          qidEncrypted: data.encrypted_quiz_result_id,
        });
        // Replay GA4 dataLayer entries the backend prepared for us
        // (Sale_Event, subscription_event, View page Payment Completed,
        // Cross_Sell_Page). Each entry already carries every field GTM
        // needs — we forward them unchanged.
        pushDataLayerBatch(data.googleAnalyticsData?.dataLayers);
        // Debug aid for live-shape verification (R2 in plan).
        console.debug("[customer/thankyou] response", data);
        setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        const error =
          err instanceof ApiError || err instanceof NetworkError
            ? err
            : new NetworkError((err as Error)?.message ?? "Unknown error");
        setState({ data: null, loading: false, error });
      });
    // Mount-only — same pattern as useRedirectGuard.
  }, []);

  return state;
}
