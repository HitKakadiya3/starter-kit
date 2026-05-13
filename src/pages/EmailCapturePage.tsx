import { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale, useLocalizedNavigate, withLocalePrefix } from '@/hooks/useLocale';
import { apiPost, ApiError, NetworkError } from '@/lib/api';
import { pushDataLayer } from '@/lib/analytics';
import { formatJerusalemDateTime } from '@/lib/datetime';
import { getSession, patchSession } from '@/lib/session';
import { resolveRedirect } from '@/lib/redirectRouter';
import { getDeviceInfo } from '@/lib/deviceInfo';
import { withPromoParams } from '@/lib/promoUrl';
import type {
  QuizAnswer,
  QuizSubmitRequestBody,
  QuizSubmitResponse,
} from '@/lib/apiTypes';

interface EmailRouteState {
  answers: QuizAnswer[];
  startTime: number;
  endTime: number;
}

const EmailCapturePage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const locale = useLocale();
  const { t } = useTranslation();
  const state = location.state as EmailRouteState | null;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!state?.answers || !state.startTime || !state.endTime) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.answers || !state.startTime || !state.endTime) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const session = getSession();
    const body: QuizSubmitRequestBody = {
      email,
      variant_type: '',
      quiz_data: state.answers,
      start_time: state.startTime,
      end_time: state.endTime,
      prc_id: session.prcId ?? '',
      pricing_discount: session.mdid ? { mdid: session.mdid } : { mdid: '' },
      user_device_info: getDeviceInfo(),
      landing_url_detail: {
        landing_url: session.landingUrl ?? window.location.origin + '/',
        landing_time:
          session.landingTime != null
            ? formatJerusalemDateTime(session.landingTime)
            : null,
      },
      geo_data: { city: '', region: '' },
    };

    try {
      const res = await apiPost<QuizSubmitResponse>('questions/submit', body);
      // GA4 `test_completed` (autoEvent / funnel). Fired after the backend
      // accepts the submission so abandoned-then-resubmitted retries don't
      // double-count.
      pushDataLayer({
        event: 'autoEvent',
        eventCategory: 'funnel',
        eventAction: 'test_completed',
        type: {
          test_type: '50_questions',
          start_time: state.startTime,
          completion_time: state.endTime,
          test_duration: state.endTime - state.startTime,
        },
      });
      // A fresh quiz submission starts a brand-new funnel run. Clear every
      // per-run flag from session so a user who took a previous quiz in
      // this tab doesn't get the previous run's `crossSellResolved` /
      // `customerUpdateSubmitted` overrides applied to the new funnel.
      // Flags are quiz-scoped — resetting on new qidRaw is equivalent to
      // keeping them keyed by qid.
      patchSession({
        qidRaw: res.quiz_result_id,
        qidEncrypted: res.encrypted_quiz_result_id,
        email,
        pricingInfo: res.pricing_info,
        crossSellResolved: undefined,
        customerUpdateSubmitted: undefined,
        paymentIntent: undefined,
      });
      const route = resolveRedirect(res.redirect_page);
      // URL carries the raw integer quiz_result_id because /questions/results
      // rejects the encrypted form ("must be a number"). The encrypted id is
      // still cached in session.qidEncrypted for /customer/thankyou later.
      // withPromoParams forwards ?prc_id / ?mdid so the discount persists
      // across every funnel page.
      navigate(withPromoParams(`${route}?qid=${res.quiz_result_id}`), {
        replace: true,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || t('common.somethingWentWrong'));
      } else if (err instanceof NetworkError) {
        toast.error(t('common.somethingWentWrong'));
      } else {
        toast.error(t('common.somethingWentWrong'));
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30 flex flex-col items-center justify-start pt-24 md:pt-32 px-4">
      <div className="flex flex-col items-center space-y-8 animate-fade-in max-w-md w-full text-center bg-card border border-border rounded-2xl shadow-lg p-8">
        {/* Logo icon */}
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
            {t('email.title')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {t('email.subhead')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2 text-center">
            <label htmlFor="email" className="text-base font-medium text-foreground">
              {t('email.label')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base bg-background border-2 border-foreground/40"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full collect-email-btn" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('common.processing')}
              </span>
            ) : (
              t('common.continue')
            )}
          </Button>
          <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
            {t('email.consent')}{' '}
            <a href={withLocalePrefix('/privacy-policy', locale)} target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">{t('email.privacyPolicy')}</a> {t('email.and')}{' '}
            <a href={withLocalePrefix('/terms-conditions', locale)} target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">{t('email.termsOfUse')}</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmailCapturePage;
