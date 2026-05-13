import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Star, TrendingUp, Heart, Briefcase, Lightbulb, UserCheck, Puzzle, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PersonalityMarquee from '@/components/PersonalityMarquee';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocalizedNavigate, useLocale } from '@/hooks/useLocale';
import { getFamousAvatar } from '@/utils/famousAvatars';
import { typeData } from '@/utils/types';
import yukiImg from '@/assets/testimonials/yuki.jpg';
import harutoImg from '@/assets/testimonials/haruto.jpg';
import aoiImg from '@/assets/testimonials/aoi.jpg';

// Type avatars - Male
import intjAvatar from '@/assets/personalities-home/intj-strategist.png';
import entjAvatar from '@/assets/personalities-home/entj-leader.png';
import infjAvatar from '@/assets/personalities-home/infj-visionary.png';
import enfjAvatar from '@/assets/personalities-home/enfj-guide.png';
import istjAvatar from '@/assets/personalities-home/istj-inspector.png';
import estjAvatar from '@/assets/personalities-home/estj-director.png';
import istpAvatar from '@/assets/personalities-home/istp-craftsman.png';
import estpAvatar from '@/assets/personalities-home/estp-daredevil.png';

// Type avatars - Female
import intpFAvatar from '@/assets/personalities-female-home/intp-thinker.png';
import entpFAvatar from '@/assets/personalities-female-home/entp-innovator.png';
import infpFAvatar from '@/assets/personalities-female-home/infp-idealist.png';
import enfpFAvatar from '@/assets/personalities-female-home/enfp-dreamer.png';
import isfjFAvatar from '@/assets/personalities-female-home/isfj-protector.png';
import esfjFAvatar from '@/assets/personalities-female-home/esfj-caretaker.png';
import isfpFAvatar from '@/assets/personalities-female-home/isfp-artist.png';
import esfpFAvatar from '@/assets/personalities-female-home/esfp-performer.png';

const IntroPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  const dimensions = [
    { icon: Star, title: t('intro.dimensions.strengthsTitle'), desc: t('intro.dimensions.strengthsDesc') },
    { icon: TrendingUp, title: t('intro.dimensions.growTitle'), desc: t('intro.dimensions.growDesc') },
    { icon: Briefcase, title: t('intro.dimensions.careerTitle'), desc: t('intro.dimensions.careerDesc') },
    { icon: Heart, title: t('intro.dimensions.relTitle'), desc: t('intro.dimensions.relDesc') },
    { icon: Lightbulb, title: t('intro.dimensions.decisionTitle'), desc: t('intro.dimensions.decisionDesc') },
    { icon: UserCheck, title: t('intro.dimensions.commTitle'), desc: t('intro.dimensions.commDesc') },
  ];

  const steps = [
    { step: '01', title: t('intro.step1Title'), desc: t('intro.step1Desc') },
    { step: '02', title: t('intro.step2Title'), desc: t('intro.step2Desc') },
    { step: '03', title: t('intro.step3Title'), desc: t('intro.step3Desc') },
    { step: '04', title: t('intro.step4Title'), desc: t('intro.step4Desc') },
  ];

  const locale = useLocale();
  const tImages = locale === 'ja'
    ? [yukiImg, harutoImg, aoiImg]
    : [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      ];
  const testimonials = [
    { quote: t('intro.t1Quote'), name: t('intro.t1Name'), type: t('intro.t1Type'), image: tImages[0] },
    { quote: t('intro.t2Quote'), name: t('intro.t2Name'), type: t('intro.t2Type'), image: tImages[1] },
    { quote: t('intro.t3Quote'), name: t('intro.t3Name'), type: t('intro.t3Type'), image: tImages[2] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 animate-fade-in">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-foreground bg-primary/10 px-3 md:px-4 py-1 md:py-1.5 rounded-full">{t('intro.badge')}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight md:leading-tight lg:leading-tight">
              {t('intro.headlinePart1')} <span className="text-primary">{t('intro.headlineHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('intro.subhead')}
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button size="xl" onClick={() => navigate('/instructions')} className="shadow-elevated">
                {t('common.startTest')} <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-background" />
      </section>

      <PersonalityMarquee />

      <section className="py-16 md:py-24 bg-accent/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              {t('intro.aboutTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('intro.aboutBody')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card rounded-2xl shadow-soft border border-border/50">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-accent">
                <Puzzle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t('intro.card1Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('intro.card1Body')}</p>
            </div>
            <div className="p-8 rounded-2xl shadow-soft bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white/20">
                <BarChart3 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('intro.card2Title')}</h3>
              <p className="opacity-90 leading-relaxed">{t('intro.card2Body')}</p>
            </div>
            <div className="p-8 bg-card rounded-2xl shadow-soft border border-border/50">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-accent">
                <Rocket className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{t('intro.card3Title')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('intro.card3Body')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{t('intro.whyEyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('intro.whyTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {t('intro.whyBody')}
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {dimensions.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 text-center hover:shadow-card transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mb-3 mx-auto">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{t('intro.typesEyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('intro.typesTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {t('intro.typesBody')}
            </p>
          </div>

          {/* 16 type badges grid — codes/labels stay Latin (per spec). */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { code: 'INTJ', label: 'Strategist', avatar: intjAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'INTP', label: 'Thinker', avatar: intpFAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'ENTJ', label: 'Leader', avatar: entjAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'ENTP', label: 'Innovator', avatar: entpFAvatar, color: 'border-purple-400/60 bg-purple-50/50 dark:bg-purple-950/20' },
              { code: 'INFJ', label: 'Visionary', avatar: infjAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'INFP', label: 'Idealist', avatar: infpFAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'ENFJ', label: 'Guide', avatar: enfjAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'ENFP', label: 'Dreamer', avatar: enfpFAvatar, color: 'border-emerald-400/60 bg-emerald-50/50 dark:bg-emerald-950/20' },
              { code: 'ISTJ', label: 'Inspector', avatar: istjAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ISFJ', label: 'Protector', avatar: isfjFAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ESTJ', label: 'Director', avatar: estjAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ESFJ', label: 'Caretaker', avatar: esfjFAvatar, color: 'border-sky-400/60 bg-sky-50/50 dark:bg-sky-950/20' },
              { code: 'ISTP', label: 'Craftsman', avatar: istpAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ISFP', label: 'Artist', avatar: isfpFAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ESTP', label: 'Daredevil', avatar: estpAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
              { code: 'ESFP', label: 'Performer', avatar: esfpFAvatar, color: 'border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20' },
            ].map(({ code, label, avatar, color }) => (
              <div key={code} className={`rounded-xl p-3 shadow-soft border text-center hover:scale-105 transition-all ${color}`}>
                <img src={avatar} alt={`${code} ${label}`} className="w-14 h-14 mx-auto rounded-full mb-2 object-cover" />
                <span className="text-sm font-extrabold text-primary">{code}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
              <Button variant="outline" size="xl" onClick={() => navigate('/16-types')} className="shadow-soft bg-background text-primary border-primary hover:bg-primary hover:text-primary-foreground px-12 py-6 transition-colors">
                {t('common.learnMore')} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/40 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('intro.howTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {t('intro.howBody')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <span className="text-3xl font-extrabold gradient-text">{step}</span>
                <h3 className="text-lg font-bold text-foreground mt-3 mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('intro.famousTitle', 'Famous People by Personality Type')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {t('intro.famousBody', 'Discover how well-known leaders, creators, and innovators are often associated with different 4-letter personality types.')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { code: 'INTJ', name: 'Elon Musk' },
              { code: 'INTP', name: 'Albert Einstein' },
              { code: 'ENTJ', name: 'Steve Jobs' },
              { code: 'ENTP', name: 'Leonardo da Vinci' },
              { code: 'INFJ', name: 'Mahatma Gandhi' },
              { code: 'INFP', name: 'William Shakespeare' },
              { code: 'ENFJ', name: 'Barack Obama' },
              { code: 'ENFP', name: 'Walt Disney' },
              { code: 'ISTJ', name: 'Emperor Meiji' },
              { code: 'ISFJ', name: 'Mother Teresa' },
              { code: 'ESTJ', name: 'George Washington' },
              { code: 'ESFJ', name: 'Taylor Swift' },
              { code: 'ISTP', name: 'Bruce Lee' },
              { code: 'ISFP', name: 'Frida Kahlo' },
              { code: 'ESTP', name: 'Madonna' },
              { code: 'ESFP', name: 'Elvis Presley' },
            ].map(({ code, name }) => {
              const localizedName = t(`intro.famousNames.${name}`, name);
              const localizedType = t(`sixteenTypes.labels.${code}`, typeData[code]?.name ?? '');
              return (
                <div key={code} className="bg-card rounded-2xl p-3 shadow-soft border border-border/50 text-center hover:shadow-card hover:scale-105 transition-all">
                  <span className="text-xs font-extrabold text-primary block mb-2">{code}</span>
                  <img src={getFamousAvatar(name)} alt={`${localizedName} - ${code}`} className="w-20 h-20 mx-auto rounded-full mb-2 object-cover" />
                  <p className="text-[11px] text-foreground font-semibold leading-tight">{localizedName}</p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">{localizedType}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/famous-people')}
              className="rounded-full px-8"
            >
              {t('intro.famousCta', 'Explore more')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              {t('intro.famousDisclaimer', 'These type assignments are estimates based on public personas and are for illustrative purposes only.')}
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{t('intro.testimonialsEyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('intro.testimonialsTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {t('intro.testimonialsBody')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, type, image }) => (
              <div key={name} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-foreground text-sm">{name}</p>
                    <p className="text-xs text-primary font-semibold">{type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <Button size="xl" onClick={() => navigate('/instructions')} className="shadow-elevated px-16 py-7 text-lg">
            {t('common.startTest')} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default IntroPage;
