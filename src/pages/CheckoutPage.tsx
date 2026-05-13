import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Users, Target, Lightbulb, Heart, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Scores } from '@/utils/scoring';
import { useLocalizedNavigate, useLocale } from '@/hooks/useLocale';
import gpayIcon from '@/assets/gpay-icon.png';
import sarahImg from '@/assets/testimonials/sarah.jpg';
import marcusImg from '@/assets/testimonials/marcus.jpg';
import priyaImg from '@/assets/testimonials/priya.jpg';
import yukiImg from '@/assets/testimonials/yuki.jpg';
import harutoImg from '@/assets/testimonials/haruto.jpg';
import aoiImg from '@/assets/testimonials/aoi.jpg';

import intjImg from '@/assets/personalities/intj-strategist.png';
import intpImg from '@/assets/personalities/intp-thinker.png';
import entjImg from '@/assets/personalities/entj-leader.png';
import entpImg from '@/assets/personalities/entp-innovator.png';
import infjImg from '@/assets/personalities/infj-visionary.png';
import infpImg from '@/assets/personalities/infp-idealist.png';
import enfjImg from '@/assets/personalities/enfj-guide.png';
import enfpImg from '@/assets/personalities/enfp-dreamer.png';
import istjImg from '@/assets/personalities/istj-inspector.png';
import isfjImg from '@/assets/personalities/isfj-protector.png';
import estjImg from '@/assets/personalities/estj-director.png';
import esfjImg from '@/assets/personalities/esfj-caretaker.png';
import istpImg from '@/assets/personalities/istp-craftsman.png';
import isfpImg from '@/assets/personalities/isfp-artist.png';
import estpImg from '@/assets/personalities/estp-daredevil.png';
import esfpImg from '@/assets/personalities/esfp-performer.png';

import intjFImg from '@/assets/personalities-female/intj-strategist.png';
import intpFImg from '@/assets/personalities-female/intp-thinker.png';
import entjFImg from '@/assets/personalities-female/entj-leader.png';
import entpFImg from '@/assets/personalities-female/entp-innovator.png';
import infjFImg from '@/assets/personalities-female/infj-visionary.png';
import infpFImg from '@/assets/personalities-female/infp-idealist.png';
import enfjFImg from '@/assets/personalities-female/enfj-guide.png';
import enfpFImg from '@/assets/personalities-female/enfp-dreamer.png';
import istjFImg from '@/assets/personalities-female/istj-inspector.png';
import isfjFImg from '@/assets/personalities-female/isfj-protector.png';
import estjFImg from '@/assets/personalities-female/estj-director.png';
import esfjFImg from '@/assets/personalities-female/esfj-caretaker.png';
import istpFImg from '@/assets/personalities-female/istp-craftsman.png';
import isfpFImg from '@/assets/personalities-female/isfp-artist.png';
import estpFImg from '@/assets/personalities-female/estp-daredevil.png';
import esfpFImg from '@/assets/personalities-female/esfp-performer.png';

// Countdown Timer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 9, seconds: 59 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="font-semibold">
      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
};

// Social Proof Ticker
const socialProofItems = [
  { name: 'Sarah', flagCode: 'us', type: 'INTJ' },
  { name: 'Marcus', flagCode: 'gb', type: 'ENFP' },
  { name: 'Priya', flagCode: 'in', type: 'ISFJ' },
  { name: 'Carlos', flagCode: 'br', type: 'ENTP' },
  { name: 'Anna', flagCode: 'de', type: 'INFJ' },
  { name: 'Yuki', flagCode: 'jp', type: 'ESTP' },
  { name: 'James', flagCode: 'au', type: 'ISTJ' },
  { name: 'Fatima', flagCode: 'ae', type: 'ENFJ' },
];

const SocialProofTicker = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % socialProofItems.length);
        setIsVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const item = socialProofItems[currentIndex];

  return (
    <div className="bg-card py-2.5 text-center border-b border-border">
      <div className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <img
          src={`https://flagcdn.com/24x18/${item.flagCode}.png`}
          srcSet={`https://flagcdn.com/48x36/${item.flagCode}.png 2x`}
          alt="flag"
          className="w-6 h-[18px] object-cover rounded-sm shadow-sm"
        />
        <span className="font-bold text-foreground">{item.name}</span>
        <span className="text-muted-foreground">
          {t('checkout.ticker')} <span className="text-primary font-bold">{item.type}</span>
        </span>
      </div>
    </div>
  );
};

// 16 Personality Types Grid
const personalityTypes = [
  { code: 'INTJ', label: 'Strategist', color: 'hsl(270 60% 50%)', img: intjImg, imgF: intjFImg },
  { code: 'INTP', label: 'Thinker', color: 'hsl(270 45% 55%)', img: intpImg, imgF: intpFImg },
  { code: 'ENTJ', label: 'Leader', color: 'hsl(270 70% 45%)', img: entjImg, imgF: entjFImg },
  { code: 'ENTP', label: 'Innovator', color: 'hsl(270 50% 50%)', img: entpImg, imgF: entpFImg },
  { code: 'INFJ', label: 'Visionary', color: 'hsl(160 50% 45%)', img: infjImg, imgF: infjFImg },
  { code: 'INFP', label: 'Idealist', color: 'hsl(160 40% 50%)', img: infpImg, imgF: infpFImg },
  { code: 'ENFJ', label: 'Guide', color: 'hsl(160 60% 40%)', img: enfjImg, imgF: enfjFImg },
  { code: 'ENFP', label: 'Dreamer', color: 'hsl(160 45% 48%)', img: enfpImg, imgF: enfpFImg },
  { code: 'ISTJ', label: 'Inspector', color: 'hsl(210 55% 50%)', img: istjImg, imgF: istjFImg },
  { code: 'ISFJ', label: 'Protector', color: 'hsl(210 45% 55%)', img: isfjImg, imgF: isfjFImg },
  { code: 'ESTJ', label: 'Director', color: 'hsl(210 65% 45%)', img: estjImg, imgF: estjFImg },
  { code: 'ESFJ', label: 'Caretaker', color: 'hsl(210 50% 50%)', img: esfjImg, imgF: esfjFImg },
  { code: 'ISTP', label: 'Craftsman', color: 'hsl(40 65% 50%)', img: istpImg, imgF: istpFImg },
  { code: 'ISFP', label: 'Artist', color: 'hsl(40 55% 55%)', img: isfpImg, imgF: isfpFImg },
  { code: 'ESTP', label: 'Daredevil', color: 'hsl(40 70% 48%)', img: estpImg, imgF: estpFImg },
  { code: 'ESFP', label: 'Performer', color: 'hsl(40 60% 52%)', img: esfpImg, imgF: esfpFImg },
];

const PersonalityTypesGrid = () => {
  const { t } = useTranslation();
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const gender = localStorage.getItem('user_gender');

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedIndex(prev => {
        if (prev >= personalityTypes.length - 1) return prev;
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const getImg = (type: typeof personalityTypes[0], index: number) => {
    if (gender === 'female') return type.imgF;
    if (gender === 'male') return type.img;
    // No gender saved: alternate male/female
    return index % 2 === 0 ? type.img : type.imgF;
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="grid grid-cols-8 gap-2">
        {personalityTypes.map((type, index) => (
          <div
            key={type.code}
            className="flex flex-col items-center justify-center rounded-xl p-2 border border-border/50 transition-all duration-300"
            style={{
              opacity: index <= revealedIndex ? 1 : 0.3,
              transform: index <= revealedIndex ? 'scale(1)' : 'scale(0.9)',
              backgroundColor: index <= revealedIndex ? 'hsl(30 30% 96%)' : 'transparent',
            }}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-border/50 mb-1">
              <img src={getImg(type, index)} alt={type.code} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className="text-[10px] md:text-[11px] font-extrabold text-foreground tracking-wide">{type.code}</span>
            <span className="hidden md:block text-[8px] text-muted-foreground">{t(`sixteenTypes.labels.${type.code}`, type.label)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const scores = (location.state as { scores: Scores } | null)?.scores;

  const trustFeatures = [
    { icon: Users, title: t('checkout.trust.f1Title'), description: t('checkout.trust.f1Desc') },
    { icon: Target, title: t('checkout.trust.f2Title'), description: t('checkout.trust.f2Desc') },
    { icon: Lightbulb, title: t('checkout.trust.f3Title'), description: t('checkout.trust.f3Desc') },
    { icon: Heart, title: t('checkout.trust.f4Title'), description: t('checkout.trust.f4Desc') },
    { icon: Sparkles, title: t('checkout.trust.f5Title'), description: t('checkout.trust.f5Desc') },
  ];

  const benefitsList = [
    t('checkout.benefits.b1'),
    t('checkout.benefits.b2'),
    t('checkout.benefits.b3'),
    t('checkout.benefits.b4'),
    t('checkout.benefits.b5'),
  ];

  const locale = useLocale();
  const testimonialImages = locale === 'ja' ? [yukiImg, harutoImg, aoiImg] : [sarahImg, marcusImg, priyaImg];
  const testimonialAges = [29, 47, 25];
  const testimonials = (t('checkout.testimonials', { returnObjects: true }) as Array<{ name: string; location: string; type: string; typeLabel: string; quote: string }>).map((x, i) => ({
    ...x,
    age: testimonialAges[i],
    img: testimonialImages[i],
  }));

  const faqItems = [
    { question: t('checkout.faq.q1'), answer: t('checkout.faq.a1') },
    { question: t('checkout.faq.q2'), answer: t('checkout.faq.a2') },
    { question: t('checkout.faq.q3'), answer: t('checkout.faq.a3') },
  ];

  useEffect(() => {
    if (!scores) navigate('/');
  }, [scores, navigate]);

  if (!scores) return null;

  const scrollToPayment = () => {
    document.getElementById('payment-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Social Proof Ticker */}
      <SocialProofTicker />

      {/* Banner */}
      <div className="bg-secondary text-secondary-foreground py-4 text-center">
        <p className="text-sm md:text-base" dangerouslySetInnerHTML={{ __html: t('checkout.banner').replace('<bold>', '<span class="font-bold">').replace('</bold>', '</span>') }} />
      </div>

      {/* Hero */}
      <div className="bg-card py-4 md:py-6 pb-8 md:pb-6 px-4 border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5" style={{ lineHeight: '1.35' }}
            dangerouslySetInnerHTML={{ __html: t('checkout.heroTitle') }}
          />
          <p className="text-muted-foreground text-base md:text-xl mb-8 max-w-xl">
            {t('checkout.heroBody')}
          </p>
          <Button size="xl" className="text-2xl px-16 py-8 font-extrabold rounded-full shadow-elevated mb-12" onClick={scrollToPayment}>
            {t('checkout.revealCta')}
          </Button>
          <PersonalityTypesGrid />
        </div>
      </div>

      {/* Trustpilot-style Badge */}
      <div className="bg-muted/50 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-foreground font-semibold text-base">{t('checkout.trustExcellent')}</span>
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-primary-foreground"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
            ))}
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary" style={{ clipPath: 'inset(0 30% 0 0)' }} />
              <div className="absolute inset-0 bg-muted" style={{ clipPath: 'inset(0 0 0 70%)' }} />
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current absolute top-1 left-1 text-primary-foreground"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
          </div>
          <span className="text-muted-foreground text-sm">
            {t('checkout.trustRated')} <span className="font-semibold">4.7</span> {t('checkout.trustOf')} {t('checkout.trustReviews')} <span className="font-semibold underline">{t('checkout.trustReviewsCount')}</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <section id="payment-section" className="pt-12 md:pt-16 pb-4 md:pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Features */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6 bg-muted rounded-full px-4 py-2 text-sm w-fit">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{t('checkout.social4M')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{t('checkout.whatYourTypeReveals')}</h2>
              <div className="space-y-4">
                {trustFeatures.map((feature, index) => (
                  <div key={index} className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1 text-base">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Payment */}
            <div id="payment-card" className="order-1 lg:order-2 bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border space-y-4 md:space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">{t('checkout.fullAccessTitle')}</h3>
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-foreground text-sm md:text-base">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 rounded-xl p-3 md:p-5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <div className="font-bold text-foreground text-base">{t('checkout.discountTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('checkout.discountBody')}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-base md:text-2xl font-bold text-foreground">{t('checkout.totalToday')}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground line-through text-sm md:text-lg">($38.38)</span>
                  <span className="text-xl md:text-4xl font-bold text-foreground">$4.99</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                <Button className="w-full py-6 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background" size="lg" onClick={() => navigate('/cross-sell', { state: { scores } })}>
                  <img src={gpayIcon} alt="Google Pay" className="h-7 w-[130px] max-w-full object-contain" />
                </Button>
                <Button className="w-full py-6 text-lg font-bold" size="lg" style={{ backgroundColor: 'hsl(213 100% 44%)', color: 'white' }} onClick={() => navigate('/cross-sell', { state: { scores } })}>
                  PayPal
                </Button>
                <Button className="w-full py-6 text-lg font-semibold" size="lg" style={{ backgroundColor: 'hsl(var(--success))', color: 'white' }} onClick={() => navigate('/cross-sell', { state: { scores } })}>
                  {t('checkout.creditCard')}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('checkout.secureNote')}</span>
              </div>

              <p
                className="text-xs text-muted-foreground text-center leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: t('checkout.disclaimer', {
                    terms: `<a href="#" class="underline hover:text-foreground">${t('checkout.termsLink')}</a>`,
                    privacy: `<a href="#" class="underline hover:text-foreground">${t('checkout.privacyLink')}</a>`,
                    subscription: `<a href="#" class="underline hover:text-foreground">${t('checkout.subscriptionLink')}</a>`,
                    interpolation: { escapeValue: false },
                  }),
                }}
              />

            </div>
          </div>
        </div>
      </section>

      {/* Report & Brain Training Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          {/* Top - Report Card */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">{t('checkout.completeReportTitle')}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t('checkout.completeReportBody')}
              </p>
            </div>
            <div className="flex-shrink-0 bg-muted/50 rounded-xl p-5 border border-border flex flex-col items-center gap-2 w-full md:w-52">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-xs text-muted-foreground text-center">{t('checkout.fullAccessRequired')}</p>
            </div>
          </div>

          {/* Bottom - Two columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left - Brain Training */}
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-5">{t('checkout.brainGrowTitle')}</h3>
              <div className="space-y-4">
                {[
                  t('checkout.brainGrow.i1'),
                  t('checkout.brainGrow.i2'),
                  t('checkout.brainGrow.i3'),
                  t('checkout.brainGrow.i4'),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - What You'll Improve */}
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-5">{t('checkout.improveTitle')}</h3>
              <div className="space-y-4">
                {[
                  t('checkout.improve.i1'),
                  t('checkout.improve.i2'),
                  t('checkout.improve.i3'),
                  t('checkout.improve.i4'),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">{t('checkout.usersSay')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" width={48} height={48} />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}, {testimonial.age}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{testimonial.type}</span>
                  <span className="text-xs text-muted-foreground">{testimonial.typeLabel}</span>
                </div>
                <div className="relative">
                  <span className="text-2xl text-muted-foreground/30 leading-none">"</span>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{testimonial.quote}</p>
                  <span className="text-2xl text-muted-foreground/30 leading-none float-right">"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-12">
        <div className="flex flex-col items-center gap-4 px-4">
          <Button size="lg" className="text-lg md:text-xl px-10 md:px-12 py-6" onClick={scrollToPayment}>
            {t('checkout.revealCta')}
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
