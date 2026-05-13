import { useState, useEffect, useMemo } from 'react';
import SiteFooter from '@/components/SiteFooter';
import { Check, Users, Target, Lightbulb, Heart, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useRedirectGuard } from '@/hooks/useRedirectGuard';
import { usePricing } from '@/hooks/usePricing';
import { DEFAULT_SUBSCRIPTION_DAYS } from '@/lib/pricingConstants';
import { getSession } from '@/lib/session';
import gpayIcon from '@/assets/gpay-icon.png';
import sarahImg from '@/assets/testimonials/sarah.jpg';
import marcusImg from '@/assets/testimonials/marcus.jpg';
import priyaImg from '@/assets/testimonials/priya.jpg';

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
          Personality type: <span className="text-primary font-bold">{item.type}</span>
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
            <span className="hidden md:block text-[8px] text-muted-foreground">{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const trustFeatures = [
  { icon: Users, title: 'Who are you, really?', description: 'Discover the deeper patterns behind your 4-letter personality type and what makes you uniquely you.' },
  { icon: Target, title: 'Your strengths & growth areas', description: 'Understand where you naturally excel, where you may struggle, and how to grow with confidence.' },
  { icon: Lightbulb, title: 'The career path that fits you best', description: 'Find the roles, work environments, and leadership styles that match your personality type.' },
  { icon: Heart, title: 'Your relationship style', description: 'Learn how you connect, communicate, and build stronger personal and romantic relationships.' },
  { icon: Sparkles, title: 'Unlock your potential', description: 'Get personalized brain training exercises based on your personality type to sharpen focus, memory, and decision-making.' },
];

const benefitsList = [
  'Unique 4-letter personality type',
  'Deep insights into strengths and growth areas',
  'Relationship style and communication patterns',
  'Ideal career path and work style',
  'Enjoy a 7-day free trial of IQ Booster, with brain training tailored to your progress',
];

const testimonials = [
  { name: 'Sarah K.', age: 29, location: 'New York, US', type: 'ENFJ', typeLabel: 'The Protagonist', img: sarahImg, quote: 'This test captured exactly how I lead and connect with others. The relationship insights helped me understand why I always put people first — and how to set better boundaries without losing my warmth.' },
  { name: 'Marcus L.', age: 47, location: 'London, UK', type: 'INTJ', typeLabel: 'The Architect', img: marcusImg, quote: "The strategic breakdown of my personality was remarkably precise. It confirmed my natural approach to problem-solving and gave me new frameworks for improving how I communicate my ideas to others." },
  { name: 'Priya R.', age: 25, location: 'Mumbai, India', type: 'INFP', typeLabel: 'The Mediator', img: priyaImg, quote: 'Reading my results felt like someone finally understood me. The career path suggestions aligned perfectly with my creative passions, and the growth areas gave me real confidence to pursue what I love.' },
];

const faqItems = [
  { question: 'What do I get with my purchase?', answer: "You'll unlock your complete 4-letter personality type report, including detailed trait insights, strengths and growth areas, relationship style, ideal career matches, and personalized brain training recommendations. Your purchase also includes a 7-day free trial of IQ Booster, with daily exercises that adapt to your progress. After 7 days, your subscription will begin automatically unless canceled before the trial ends." },
  { question: 'How can I cancel my subscription?', answer: 'You can cancel your subscription at any time through your account settings or by contacting our customer support team. There are no cancellation fees.' },
  { question: 'How can I get support if needed?', answer: 'Our customer support team is available 24/7 via email and live chat. You can also visit our help center for instant answers to common questions.' },
];

const GuardLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="text-muted-foreground text-sm">Loading…</p>
  </div>
);

const CheckoutPage = () => {
  const ready = useRedirectGuard('/checkout');
  const { current, strikethrough, hasPromo, isLoading, isError, refetch } = usePricing();
  const session = getSession();

  const savings = useMemo(() => {
    if (!hasPromo || !strikethrough || !current) return null;
    const baseNum = parseFloat(strikethrough.first_sale_price);
    const promoNum = parseFloat(current.first_sale_price);
    if (!Number.isFinite(baseNum) || !Number.isFinite(promoNum) || baseNum <= 0) {
      return null;
    }
    return Math.round((1 - promoNum / baseNum) * 100);
  }, [hasPromo, strikethrough, current]);

  if (!ready) return <GuardLoading />;

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
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
      </div>
    );
  }

  const pricePlaceholder = (
    <span
      className="inline-block h-5 w-16 bg-muted rounded animate-pulse align-baseline"
      aria-hidden="true"
    />
  );

  const scrollToPayment = () => {
    document.getElementById('payment-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Social Proof Ticker */}
      <SocialProofTicker />

      {/* Banner */}
      <div className="bg-secondary text-secondary-foreground py-4 text-center">
        <p className="text-sm md:text-base">
          Your answers reveal a <span className="font-bold">rare</span> personality type
        </p>
      </div>

      {/* Hero */}
      <div className="bg-card py-4 md:py-6 pb-8 md:pb-6 px-4 border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-5" style={{ lineHeight: '1.35' }}>
            Your Personality Type<br className="hidden md:block" /> Profile Is Ready!
          </h2>
          <p className="text-muted-foreground text-base md:text-xl mb-8 max-w-xl">
            Get your personality type report with deep insights into your strengths, weaknesses, relationships, and ideal career path.
          </p>
          <Button size="xl" className="text-2xl px-16 py-8 font-extrabold rounded-full shadow-elevated mb-12" onClick={scrollToPayment}>
            Reveal My Type
          </Button>
          <PersonalityTypesGrid />
        </div>
      </div>

      {/* Trustpilot-style Badge */}
      <div className="bg-muted/50 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-foreground font-semibold text-base">Excellent</span>
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
            Rated <span className="font-semibold">4.7</span> / 5 based on <span className="font-semibold underline">1,468 reviews</span>
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
                <span className="font-medium text-foreground">4M+ people have taken this personality test</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">What your type reveals</h2>
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
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Your full access includes</h3>
                {benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-foreground text-sm md:text-base">{benefit}</p>
                  </div>
                ))}
              </div>

              {hasPromo && strikethrough && savings !== null && (
                <div className="bg-primary/10 rounded-xl p-3 md:p-5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎁</div>
                    <div>
                      <div className="font-bold text-foreground text-base">Discount Applied!</div>
                      <div className="text-sm text-muted-foreground">You're saving {savings}%</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <span className="text-lg md:text-2xl font-bold text-foreground">Total Today:</span>
                <div className="flex items-baseline gap-2">
                  {strikethrough && (
                    <span className="text-muted-foreground line-through text-base md:text-lg">({strikethrough.first_sale_price_label})</span>
                  )}
                  <span className="text-2xl md:text-4xl font-bold text-foreground">
                    {isLoading || !current ? pricePlaceholder : current.first_sale_price_label}
                  </span>
                </div>
              </div>

              {/* Payment Buttons — delegated to CheckoutForm, which owns the
                  consent checkbox, the three preserved-visual buttons, the
                  inline CardForm, and the error slot (Module 3 §6.3). */}
              <CheckoutForm
                priceLabel={current?.first_sale_price_label ?? '---'}
                pricing={current}
                email={session.email}
                gpayIcon={gpayIcon}
              />

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Your payment is secure and encrypted</span>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                By completing your purchase, you agree to pay {current?.first_sale_price_label ?? pricePlaceholder} for your results. Also you accept our{' '}
                <a href="#" className="underline hover:text-foreground">Terms of Use</a>,{' '}
                <a href="#" className="underline hover:text-foreground">Privacy Policy</a> and{' '}
                <a href="#" className="underline hover:text-foreground">subscription policy</a>.
                {' '}After 7 days, your subscription will begin automatically and renew at {current?.subscription_price_label ?? pricePlaceholder} every {current?.subscription_day_label ?? DEFAULT_SUBSCRIPTION_DAYS} days until canceled.
              </p>

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
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Your complete type report</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Unlock a detailed personality profile covering your 4-letter type, core strengths, relationship style, communication patterns, and ideal career path.
              </p>
            </div>
            <div className="flex-shrink-0 bg-muted/50 rounded-xl p-5 border border-border flex flex-col items-center gap-2 w-full md:w-52">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-xs text-muted-foreground text-center">Full access is required to unlock your complete report</p>
            </div>
          </div>

          {/* Bottom - Two columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left - Brain Training */}
            <div className="bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-5">How brain training helps you grow</h3>
              <div className="space-y-4">
                {[
                  'Improve focus, consistency, and daily productivity',
                  'Strengthen decision-making based on your natural type',
                  'Build better habits through personalized daily exercises',
                  'Stay mentally sharp with adaptive brain training',
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
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-5">What You'll Improve</h3>
              <div className="space-y-4">
                {[
                  'Improve communication and relationship awareness',
                  'Learn how to work better with your natural strengths',
                  'Build confidence in career and leadership situations',
                  'Develop sharper thinking and emotional balance',
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
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10">What our users say</h2>
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
            Reveal My Type
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default CheckoutPage;
