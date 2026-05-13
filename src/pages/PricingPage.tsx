import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, FileText, Brain, Dumbbell, Users, TrendingUp, BarChart3 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocalizedNavigate } from '@/hooks/useLocale';
import { usePricing } from '@/hooks/usePricing';
import {
  DEFAULT_SUBSCRIPTION_DAYS,
  TRIAL_DAYS,
} from '@/lib/pricingConstants';
import { withPromoParams } from '@/lib/promoUrl';

const PricingPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const { current, isLoading, isError, refetch } = usePricing();

  const features = [
    { icon: FileText, title: t('pricing.f1Title'), desc: t('pricing.f1Desc') },
    { icon: Brain, title: t('pricing.f2Title'), desc: t('pricing.f2Desc') },
    { icon: Dumbbell, title: t('pricing.f3Title'), desc: t('pricing.f3Desc') },
    { icon: Users, title: t('pricing.f4Title'), desc: t('pricing.f4Desc') },
    { icon: TrendingUp, title: t('pricing.f5Title'), desc: t('pricing.f5Desc') },
    { icon: BarChart3, title: t('pricing.f6Title'), desc: t('pricing.f6Desc') },
  ];

  const planFeatures = [
    t('pricing.feature1'),
    t('pricing.feature2'),
    t('pricing.feature3'),
    t('pricing.feature4'),
  ];

  const pricePlaceholder = (
    <span
      className="inline-block h-5 w-16 bg-muted rounded animate-pulse align-baseline"
      aria-hidden="true"
    />
  );

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-16 flex items-center">
          <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 w-full text-center space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              Couldn&apos;t load pricing. Please try again.
            </h2>
            <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-4">{t('pricing.title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">{t('pricing.subtitle')}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">{t('pricing.planTitle')}</h2>
            <span className="inline-block whitespace-nowrap bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              {t('pricing.badge')}
            </span>
          </div>

          <p className="text-primary font-semibold mb-6">
            {isLoading || !current ? (
              pricePlaceholder
            ) : (
              <>
                {current.first_sale_price_label} today. After the {TRIAL_DAYS}-day trial, {current.subscription_price_label} billed every {DEFAULT_SUBSCRIPTION_DAYS} days.
              </>
            )}
          </p>

          <ul className="space-y-3 mb-8">
            {planFeatures.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <Button
            variant="hero"
            size="lg"
            className="w-full text-base"
            onClick={() => navigate(withPromoParams('/instructions'))}
          >
            {t('pricing.cta')}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {isLoading || !current ? (
              pricePlaceholder
            ) : (
              <>
                After a {TRIAL_DAYS} days trial, membership renews automatically at {current.subscription_price_label} every {DEFAULT_SUBSCRIPTION_DAYS} days unless cancelled.
              </>
            )}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-primary font-bold text-lg mb-2">{t('pricing.addonTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('pricing.addonBody')}</p>
            </div>
            <span className="text-3xl font-extrabold text-foreground whitespace-nowrap">
              {isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-accent-foreground" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">{title}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PricingPage;
