/**
 * Single pricing abstraction for Module 2 (PRD §4.2).
 *
 * Resolves the current price + optional strikethrough anchor from two
 * sources depending on funnel stage:
 *   - Post-submit: `session.pricingInfo` is the source of `current` (written
 *     fresh on every page mount by the Module 1 `useRedirectGuard`). The
 *     base `POST /price` query still fires when a promo is active so
 *     /checkout can show the marketing strikethrough for campaign-funnel
 *     users; otherwise no network call is made.
 *   - Pre-submit: `POST /price` with empty body is the base; when `prcId`
 *     or `mdid` is present, a second `POST /price` call with the promo
 *     body produces `current` and the first call becomes the strikethrough.
 *
 * Equal-price guard (PRD §4.2 resolution step 4): when the promoed price
 * matches the base, no strikethrough renders.
 */

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { apiPost } from "@/lib/api";
import type { PricingInfo } from "@/lib/apiTypes";
import { getSession } from "@/lib/session";

export interface UsePricingResult {
  current: PricingInfo | undefined;
  strikethrough: PricingInfo | undefined;
  hasPromo: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Observed 2026-04-22: POST /price returns `PricingInfo` directly under
// `data` — no second wrapper. Top-level keys include currency_code,
// first_sale_price, first_sale_price_label, payment_gateways, etc.
// See PRD §4.3.

export function usePricing(): UsePricingResult {
  const session = getSession();
  const { qidRaw, pricingInfo, prcId, mdid } = session;

  // Defensive: Module 1 guarantees prcId and mdid are mutually exclusive,
  // but if both are set we prefer mdid and warn once per hook instance.
  // See PRD §8 AC 11 and §9 R6.
  const warnedRef = useRef(false);
  useEffect(() => {
    if (prcId && mdid && !warnedRef.current) {
      console.warn("[usePricing] both prcId and mdid set; preferring mdid");
      warnedRef.current = true;
    }
  }, [prcId, mdid]);

  // Cache-key discriminator and promo body choice — mdid wins over prcId.
  const promoDiscriminator: string | undefined = mdid || prcId || undefined;
  const hasPromo = !!promoDiscriminator;
  const isPostSubmit = !!(qidRaw && pricingInfo);

  // Base query — runs pre-submit (to produce `current` when no promo, or
  // the strikethrough anchor when promoed) and post-submit when a promo is
  // active (campaign-funnel users on /checkout need the marketing anchor).
  const baseQuery = useQuery({
    queryKey: ["price", "base"],
    queryFn: () => apiPost<PricingInfo>("price", {}),
    enabled: !isPostSubmit || hasPromo,
    staleTime: Infinity,
    gcTime: 1_000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Promo query — pre-submit only. Post-submit the promoed current price
  // is already in `session.pricingInfo`; re-fetching would duplicate data.
  const promoQuery = useQuery({
    queryKey: ["price", "promo", promoDiscriminator],
    queryFn: () =>
      apiPost<PricingInfo>("price", {
        prc_id: prcId ?? "",
        // mdid wins over prcId (AC 11) — body mirrors the cache-key choice.
        pricing_discount: mdid ? { mdid } : "",
      }),
    enabled: !isPostSubmit && hasPromo,
    staleTime: Infinity,
    gcTime: 1_000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Resolution (PRD §4.2).
  let current: PricingInfo | undefined;
  let strikethrough: PricingInfo | undefined;

  if (isPostSubmit) {
    current = pricingInfo;
    strikethrough =
      hasPromo &&
      baseQuery.data &&
      baseQuery.data.first_sale_price !== pricingInfo.first_sale_price
        ? baseQuery.data
        : undefined;
  } else if (hasPromo && promoQuery.data) {
    current = promoQuery.data;
    strikethrough =
      baseQuery.data &&
      baseQuery.data.first_sale_price !== promoQuery.data.first_sale_price
        ? baseQuery.data
        : undefined;
  } else if (!hasPromo) {
    current = baseQuery.data;
    strikethrough = undefined;
  }

  const baseEnabled = !isPostSubmit || hasPromo;
  const promoEnabled = !isPostSubmit && hasPromo;

  const anyEnabledLoading =
    (baseEnabled && baseQuery.isFetching && !baseQuery.data) ||
    (promoEnabled && promoQuery.isFetching && !promoQuery.data);
  const isLoading = current === undefined && anyEnabledLoading;

  const isError =
    (baseEnabled && baseQuery.isError && !baseQuery.data) ||
    (promoEnabled && promoQuery.isError && !promoQuery.data);

  return {
    current,
    strikethrough,
    hasPromo,
    isLoading,
    isError,
    refetch: () => {
      if (baseEnabled) baseQuery.refetch();
      if (promoEnabled) promoQuery.refetch();
    },
  };
}
