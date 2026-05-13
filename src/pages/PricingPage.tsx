import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, FileText, Brain, Dumbbell, Users, TrendingUp, BarChart3 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePricing } from '@/hooks/usePricing';
import {
  DEFAULT_SUBSCRIPTION_DAYS,
  TRIAL_DAYS,
} from '@/lib/pricingConstants';
import { withPromoParams } from '@/lib/promoUrl';

const features = [
  { icon: FileText, title: 'Personalized Personality Report', desc: 'Downloadable detailed report based on your personality profile.' },
  { icon: Brain, title: 'Comprehensive Cognitive Analysis', desc: 'Key strengths & growth areas across multiple domains.' },
  { icon: Dumbbell, title: 'Scientifically‑calibrated Training', desc: 'Exercises designed from leading research to help you improve.' },
  { icon: Users, title: 'Expert‑led Content', desc: 'Tips and guidance to get more from each training session.' },
  { icon: TrendingUp, title: 'Personalized Development Path', desc: 'Adaptive program that evolves with your performance.' },
  { icon: BarChart3, title: 'Progress Dashboard', desc: 'Track sessions, streaks, and measurable gains over time.' },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { current, isLoading, isError, refetch } = usePricing();

  const pricePlaceholder = (
    <span
      className="inline-block h-5 w-16 bg-muted rounded animate-pulse align-baseline"
      aria-hidden="true"
    />
  );

  const bulletItems = [
    'Detailed personality profile & downloadable report',
    'In-depth insights into your traits and strengths',
    `${TRIAL_DAYS}‑day full access to IQ Booster Brain training`,
    'Cancel any time',
  ];

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
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-4">Our Pricing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Begin your journey to enhance your cognitive skills and unlock your full potential with our brain training program. Here are the plan details to get started.
          </p>
        </div>

        {/* Main pricing card */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Personality report + {TRIAL_DAYS}‑Day Trial to IQ Booster, brain training platform
            </h2>
            <span className="inline-block whitespace-nowrap bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Includes full trial access
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
            {bulletItems.map((item) => (
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
            Start your journey
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

        {/* Add-on card */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6 md:p-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-primary font-bold text-lg mb-2">Add‑on: IQ Pro</h3>
              <p className="text-sm text-muted-foreground">
                Discover what your IQ is with our professional IQ Test. Get your instant IQ score, detailed report, and downloadable certificate — all based on a scientifically designed assessment.
              </p>
            </div>
            <span className="text-3xl font-extrabold text-foreground whitespace-nowrap">
              {isLoading || !current ? pricePlaceholder : current.cross_sale_price_label}
            </span>
          </div>
        </div>

        {/* Features grid */}
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
