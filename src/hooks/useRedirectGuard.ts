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
import { useSearchParams } from "react-router-dom";

import { useLocalizedNavigate } from "@/hooks/useLocale";
import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { withPromoParams } from "@/lib/promoUrl";
import {
  qidParamForRoute,
  resolveEffectiveRedirect,
  resolveRedirect,
} from "@/lib/redirectRouter";
import { getSession, patchSession } from "@/lib/session";

interface QuizResultResponse {
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
  email?: string;
  pricing_info?: PricingInfo;
  redirect_page?: string;
}

export function useRedirectGuard(currentRoute: string): boolean {
  const [qid] = useSearchParams();
  // Locale-aware navigate so the guard preserves the `/ja` prefix when it
  // bounces a user from `/ja/cross-sell` back to checkout. Pages still pass
  // the locale-less `currentRoute` (e.g. `/cross-sell`) — the comparison
  // below is between two locale-less route keys, and the navigate helper
  // re-applies the prefix when the URL changes.
  const navigate = useLocalizedNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urlQid = qid.get("qid");

    // `/career-report` doesn't participate in the redirect-page state machine
    // — it's reached only after `/results`, and `/questions/results` would
    // route the user back to `/results`. Bridge the URL qid into session
    // (so `useCustomerThankyou` can read it) and mark ready immediately.
    if (currentRoute === "/career-report") {
      if (urlQid && !/^\d+$/.test(urlQid)) {
        patchSession({ qidEncrypted: urlQid });
      }
      setReady(true);
      return;
    }

    // `/results` carries the *encrypted* qid in the URL (see
    // `qidParamForRoute`). A fresh browser tab has no session, so the URL is
    // the sole source of truth — but `/questions/results` only accepts the
    // raw integer id. Persist the encrypted form for `useCustomerThankyou`
    // and short-circuit ready: the subsequent `customer/thankyou` call
    // doubles as the validity check (4xx → the page's existing error state).
    if (currentRoute === "/results" && urlQid && !/^\d+$/.test(urlQid)) {
      patchSession({ qidEncrypted: urlQid });
      setReady(true);
      return;
    }

    // URL carries the raw integer quiz_result_id. /questions/results rejects
    // anything non-numeric. Session fallback is the cached raw qid from an
    // earlier submit in the same tab.
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
          const qidParam = qidParamForRoute(
            expected,
            data.quiz_result_id,
            data.encrypted_quiz_result_id,
          );
          navigate(withPromoParams(`${expected}?qid=${qidParam}`), {
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
