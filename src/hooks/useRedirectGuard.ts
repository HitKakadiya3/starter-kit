/**
 * Resume-guard hook (PRD §4.7).
 *
 * On mount, verifies that the `qid` in the URL (or, if absent, `qidEncrypted`
 * in the session) matches a backend-known quiz result, and that the backend's
 * `redirect_page` maps to the caller-supplied `currentRoute`. Consumers in
 * Module 2 onwards will call this at the top of each post-submit page.
 *
 * No production code consumes this in Module 1 — the hook ships with unit
 * tests only. See `useRedirectGuard.test.tsx` for the four branches.
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { withPromoParams } from "@/lib/promoUrl";
import { resolveRedirect } from "@/lib/redirectRouter";
import { getSession, patchSession } from "@/lib/session";
import type { FunnelSession } from "@/lib/session";

interface QuizResultResponse {
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
  email?: string;
  pricing_info?: PricingInfo;
  redirect_page?: string;
}

/**
 * Override lingering backend redirect_page values when a client-only state
 * flag proves the user has already passed that step. The backend's
 * `/questions/results` only advances state when a state-mutating endpoint
 * succeeds, so between (say) a successful `/customer/update` and the next
 * backend action the server still reports `CUSTOMER_DETAILS_PAGE` — which
 * would bounce a refreshed `/results` page backward without the override.
 *
 * Rules:
 *   CROSS_SELL_OFFER_PAGE + crossSellResolved → CUSTOMER_DETAILS_PAGE
 *     (accept or skip: both set `crossSellResolved` and both route to
 *     /details; skip is purely client-side, accept has already been
 *     confirmed to backend via the cross-sale confirm endpoint)
 *   CUSTOMER_DETAILS_PAGE + customerUpdateSubmitted → THANK_YOU_PAGE
 *     (post-update resume bounce-forward)
 *
 * All other redirect values are returned unchanged.
 */
function resolveEffectiveRedirect(
  serverRedirect: string | undefined,
  session: FunnelSession,
): string | undefined {
  if (
    serverRedirect === "CROSS_SELL_OFFER_PAGE" &&
    session.crossSellResolved
  ) {
    return "CUSTOMER_DETAILS_PAGE";
  }
  if (
    serverRedirect === "CUSTOMER_DETAILS_PAGE" &&
    session.customerUpdateSubmitted
  ) {
    return "THANK_YOU_PAGE";
  }
  return serverRedirect;
}

export function useRedirectGuard(currentRoute: string): boolean {
  const [qid] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // URL carries the raw integer quiz_result_id. /questions/results rejects
    // anything non-numeric. Session fallback is the cached raw qid from an
    // earlier submit in the same tab.
    const urlQid = qid.get("qid");
    const numericQid =
      urlQid && /^\d+$/.test(urlQid) ? Number(urlQid) : getSession().qidRaw;
    if (!numericQid) {
      navigate("/", { replace: true });
      return;
    }

    apiPost<QuizResultResponse>("questions/results", {
      quiz_result_id: numericQid,
      prc_id: getSession().prcId ?? "",
      pricing_discount: getSession().mdid ? { mdid: getSession().mdid } : "",
    })
      .then((data) => {
        patchSession({
          qidRaw: data.quiz_result_id,
          qidEncrypted: data.encrypted_quiz_result_id,
          email: data.email,
          pricingInfo: data.pricing_info,
        });
        const effectiveRedirect = resolveEffectiveRedirect(
          data.redirect_page,
          getSession(),
        );
        const expected = resolveRedirect(effectiveRedirect);
        if (expected !== currentRoute) {
          navigate(withPromoParams(`${expected}?qid=${data.quiz_result_id}`), {
            replace: true,
          });
        } else {
          setReady(true);
        }
      })
      .catch(() => navigate("/", { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
