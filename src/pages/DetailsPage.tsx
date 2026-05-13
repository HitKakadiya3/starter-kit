import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { useLocalizedNavigate } from '@/hooks/useLocale';
import { useRedirectGuard } from '@/hooks/useRedirectGuard';
import { ApiError, NetworkError, apiPut } from '@/lib/api';
import { withPromoParams } from '@/lib/promoUrl';
import {
  qidParamForRoute,
  resolveEffectiveRedirect,
  resolveRedirect,
} from '@/lib/redirectRouter';
import { getSession, patchSession } from '@/lib/session';

interface CustomerUpdateResponse {
  redirect_page: string;
  quiz_result_id: number;
  encrypted_quiz_result_id: string;
}

const DetailsPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const ready = useRedirectGuard('/details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>(
    () => localStorage.getItem('user_gender') ?? '',
  );
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !age || !gender || loading) {
      if (!gender) {
        setSubmitError(
          'Please select a gender to continue.',
        );
      }
      return;
    }

    const session = getSession();
    if (!session.qidRaw || !session.email) {
      setSubmitError('Your session looks incomplete. Please restart the test.');
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await apiPut<CustomerUpdateResponse>('customer/update', {
        email: session.email,
        quiz_result_id: session.qidRaw,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        age,
        gender,
      });

      // Keep the session in sync with the latest backend-issued qids.
      // `customerUpdateSubmitted` stops the redirect guard from bouncing a
      // refreshed `/results` back here — the backend keeps reporting
      // CUSTOMER_DETAILS_PAGE (or CROSS_SELL_OFFER_PAGE, when the user
      // skipped the upsell client-side) until the next state-advancing
      // action.
      patchSession({
        qidRaw: response.quiz_result_id,
        qidEncrypted: response.encrypted_quiz_result_id,
        customerUpdateSubmitted: true,
      });

      // The PUT response's `redirect_page` is subject to the same staleness
      // as `/questions/results` — it can echo a step the user has already
      // passed. Apply the cascading override so we navigate forward to
      // THANK_YOU_PAGE in one shot instead of bouncing through
      // /cross-sell or /details and triggering the guard repeatedly.
      const effective = resolveEffectiveRedirect(
        response.redirect_page,
        getSession(),
      );
      const route = resolveRedirect(effective);
      const qidParam = qidParamForRoute(
        route,
        response.quiz_result_id,
        response.encrypted_quiz_result_id,
      );
      navigate(withPromoParams(`${route}?qid=${qidParam}`), {
        replace: true,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message || 'Something went wrong. Please try again.');
      } else if (err instanceof NetworkError) {
        setSubmitError(
          'Network error. Check your connection and try again.',
        );
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  const genderStoredInLocalStorage = Boolean(localStorage.getItem('user_gender'));

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-6">
        <svg className="animate-spin h-14 w-14 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-base font-semibold text-foreground">{t('details.generating')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header with logo */}
      <nav className="w-full border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center h-20">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0 w-7 h-7 md:w-10 md:h-10">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 16;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return (
                  <g key={angle}>
                    <line x1={20} y1={20} x2={cx} y2={cy} stroke="hsl(270 30% 80%)" strokeWidth="1" />
                    <circle cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} fill={i % 2 === 0 ? 'hsl(270 50% 45%)' : 'hsl(270 40% 65%)'} />
                  </g>
                );
              })}
              {[30, 120, 210, 300].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const r = 8;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return <circle key={angle} cx={cx} cy={cy} r="1.8" fill="hsl(270 50% 55%)" />;
              })}
              <circle cx="20" cy="20" r="3" fill="hsl(270 50% 45%)" />
            </svg>
            <div className="flex flex-col" style={{ lineHeight: '1.1' }}>
              <span className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.06em]">
                <span style={{ color: 'hsl(270 50% 45%)' }}>16</span>
                <span className="text-foreground"> {t('brand.name')}</span>
              </span>
              <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-muted-foreground">{t('brand.tagline')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 md:pt-12">
        <div className="max-w-lg w-full bg-card shadow-card rounded-2xl overflow-hidden">
          {/* Card body */}
          <div className="px-6 md:px-10 py-8 md:py-10 space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {t('details.title')}
              </h1>
              <div className="w-12 h-[3px] bg-primary rounded-full" />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-2">
                {t('details.subhead')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder={t('details.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-12 text-base bg-background border-2 border-foreground/40 rounded-lg"
              />
              <Input
                placeholder={t('details.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-12 text-base bg-background border-2 border-foreground/40 rounded-lg"
              />
              <div className="relative">
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-lg border-2 border-foreground/40 bg-background px-3 py-2 text-base text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-10"
                >
                  <option value="" disabled>{t('details.age')}</option>
                  {Array.from({ length: 83 }, (_, i) => i + 18).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Gender fallback: InstructionsPage stores this in localStorage.
                  If the user cleared storage mid-funnel, let them re-select
                  here instead of bouncing them back. */}
              {!genderStoredInLocalStorage && (
                <div className="relative">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="flex h-12 w-full rounded-lg border-2 border-foreground/40 bg-background px-3 py-2 text-base text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-10"
                  >
                    <option value="" disabled>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-sm"
                >
                  {submitError}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="rounded-full font-bold text-base"
                  disabled={loading}
                >
                  {t('details.generate')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                {t('details.privacy')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
