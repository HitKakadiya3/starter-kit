import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import iqTestPreview from '@/assets/iq-test-preview.png';
import { Button } from '@/components/ui/button';
import { useRedirectGuard } from '@/hooks/useRedirectGuard';
import { usePricing } from '@/hooks/usePricing';
import { ApiError, NetworkError, apiPost } from '@/lib/api';
import { withPromoParams } from '@/lib/promoUrl';
import { resolveRedirect } from '@/lib/redirectRouter';
import { getSession, patchSession } from '@/lib/session';

interface CrossSaleConfirmResponse {
  redirect_page: string;
}

const CrossSellPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qid = searchParams.get('qid');
  const ready = useRedirectGuard('/cross-sell');
  const { current, isLoading, isError, refetch } = usePricing();

  // Read the session fresh on every render — the guard populates `pricingInfo`
  // asynchronously, so the first (pre-ready) render has stale data.
  const session = getSession();
  const isCompulsory = Boolean(session.pricingInfo?.cross_sale_compulsory);
  const hasCrossSaleData = Boolean(session.pricingInfo?.transactions?.cross_sale);
  const showCrossSalePage = session.pricingInfo?.show_cross_sale_page !== false;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // PRD §4.2 visibility gates (belt-and-braces): if cross-sell should not
  // render or its transaction payload is missing, bounce to /details. The
  // Module 1 guard should have already routed us away in most of these
  // cases, but this effect defends the edge. Must run in an effect rather
  // than during render to avoid React's "navigate during render" warning.
  useEffect(() => {
    if (!ready) return;
    if (!showCrossSalePage || !hasCrossSaleData) {
      navigate(withPromoParams(`/details?qid=${encodeURIComponent(qid ?? '')}`), { replace: true });
    }
  }, [ready, showCrossSalePage, hasCrossSaleData, navigate, qid]);

  const handleAccept = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body = {
        quiz_result_id: session.qidRaw,
        // PRD §4.1 — backend expects this key even when empty (Module 3 precedent:
        // the create-intent endpoint returned 422 without it).
        user_on_iqbooster: '',
        prc_id: session.prcId ?? '',
        pricing_discount: session.mdid ? { mdid: session.mdid } : '',
      };
      const response = await apiPost<CrossSaleConfirmResponse>(
        'payment/cross-sale/payments/confirm',
        body,
      );
      // Patch before navigate: `replace: true` unmounts this component
      // immediately, so a post-navigate patch might not flush in time.
      patchSession({ crossSellResolved: true });
      const next = resolveRedirect(response.redirect_page);
      const q = session.qidRaw ? String(session.qidRaw) : qid ?? '';
      navigate(withPromoParams(`${next}?qid=${encodeURIComponent(q)}`), { replace: true });
    } catch (e) {
      if (e instanceof ApiError || e instanceof NetworkError) {
        setSubmitError("Card on file couldn't be charged. Please continue without the add-on.");
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
      // Success branch does NOT setSubmitting(false): the component unmounts
      // on navigate and a post-unmount setState would warn.
    }
  }, [submitting, session.qidRaw, session.prcId, session.mdid, qid, navigate]);

  const handleSkip = useCallback(() => {
    if (submitting) return;
    // Skip goes to /details — the user still needs to fill out name/age/
    // gender for the report regardless of whether they accepted the
    // upsell. `crossSellResolved` tells the guard not to bounce them
    // back here on refresh (backend's /questions/results keeps reporting
    // CROSS_SELL_OFFER_PAGE until the customer update advances state).
    patchSession({ crossSellResolved: true });
    const q = session.qidRaw ? String(session.qidRaw) : qid ?? '';
    navigate(withPromoParams(`/details?qid=${encodeURIComponent(q)}`), { replace: true });
  }, [submitting, session.qidRaw, qid, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Couldn&apos;t load pricing. Please try again.
          </h2>
          <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const pricePlaceholder = (
    <span
      className="inline-block h-4 w-12 bg-muted rounded animate-pulse align-baseline"
      aria-hidden="true"
    />
  );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Main Card */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 md:pt-12">
        <div className="max-w-xl w-full bg-card shadow-card rounded-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-secondary text-secondary-foreground py-5 text-center space-y-1">
            <p className="text-lg md:text-xl font-bold">Payment Completed</p>
            <p className="text-base md:text-lg font-semibold">Your Personality report is ready</p>
          </div>

          {/* Card Body */}
          <div className="px-6 md:px-10 py-8 space-y-6">
            {/* Description */}
            <p className="text-[13px] md:text-[14.5px] text-muted-foreground leading-relaxed">
              After reviewing your personality profile, we'd like to offer you the chance to take our IQ Test for just {isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}. The test includes 30 questions and takes only a few minutes to complete. Once finished, you'll receive your IQ score, an official IQ certificate, and a detailed report with insights into key areas such as reasoning, logic, and problem-solving. Get your personalized score report and see how you compare to thousands of adults from around the world.
            </p>

            {/* Product Card */}
            <div className="bg-muted/50 rounded-2xl p-3 md:p-4 border border-border flex items-center gap-5">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg md:text-xl font-bold text-foreground">IQ Pro</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Find out your IQ score and receive an official IQ certificate, along with a customized assessment report.
                </p>
              </div>
              <div className="flex-shrink-0 w-20 md:w-24 rounded-xl overflow-hidden">
                <img src={iqTestPreview} alt="IQ Test Preview" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>

            {/* Inline error alert (PRD §4.3 / §6.1) */}
            {submitError && (
              <div
                role="alert"
                className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm"
              >
                {submitError}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col items-center space-y-3">
              <Button
                variant="hero"
                size="xl"
                className="max-w-sm mx-auto w-full text-base md:text-lg font-bold rounded-full"
                onClick={handleAccept}
                disabled={submitting}
              >
                {submitting ? 'Processing…' : 'Yes, add the IQ test to my order'}
              </Button>

              {/* Skip is hidden when the upsell is compulsory (PRD §4.2). When a
                  non-compulsory accept fails, Skip is visually promoted so the
                  user has an obvious forward path. */}
              {!isCompulsory && (
                <button
                  onClick={handleSkip}
                  disabled={submitting}
                  className={`text-sm md:text-base font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors py-2 ${
                    submitError ? 'text-base md:text-lg font-bold' : ''
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Skip and get my personality report only
                </button>
              )}

              {/* Compulsory + error → Retry replaces the absent Skip. Reuses
                  the same accept handler (retry is just another attempt). */}
              {isCompulsory && submitError && (
                <Button
                  variant="outline"
                  size="lg"
                  className="max-w-sm mx-auto w-full"
                  onClick={handleAccept}
                  disabled={submitting}
                >
                  Retry
                </Button>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
              {isCompulsory
                ? 'This add-on is required to continue.'
                : '*You will be charged for the add-on services or products selected at the time of purchase.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossSellPage;
