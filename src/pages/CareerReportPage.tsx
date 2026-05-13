import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { calculateType, type Scores } from '@/utils/scoring';
import { type PremiumCareerReport } from '@/utils/careerReports';
import { getCareerReportLocalized } from '@/utils/localizedData';
import { useLocale, useLocalizedNavigate } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';
import { getAvatarForType, type Gender } from '@/utils/avatarMap';
import {
  Sparkles, Briefcase, Building, Compass, TrendingUp,
  AlertTriangle, Target, ArrowRight, ArrowLeft, CheckCircle2,
  XCircle, DollarSign, Zap, Users, MessageSquare, Flag,
  Lightbulb, Network, Calendar, Eye,
} from 'lucide-react';

/* Single accent color used throughout — keeps the page recognizably "career". */
const ACCENT = 'hsl(24 95% 53%)';      // orange-500
const ACCENT_SOFT = 'hsl(34 100% 96%)'; // orange-50

const useSections = () => {
  const { t } = useTranslation();
  return [
    { id: 'summary', label: t('report.career.summary'), icon: Sparkles },
    { id: 'dna', label: t('report.career.dna'), icon: Compass },
    { id: 'strengths', label: t('report.career.strengths'), icon: Zap },
    { id: 'matches', label: t('report.career.matches'), icon: Briefcase },
    { id: 'industries', label: t('report.career.industries'), icon: Building },
    { id: 'environment', label: t('report.career.environment'), icon: Eye },
    { id: 'comp', label: t('report.career.comp'), icon: DollarSign },
    { id: 'leadership', label: t('report.career.leadership'), icon: Target },
    { id: 'stages', label: t('report.career.stages'), icon: TrendingUp },
    { id: 'skills', label: t('report.career.skills'), icon: Lightbulb },
    { id: 'negotiation', label: t('report.career.negotiation'), icon: MessageSquare },
    { id: 'pivots', label: t('report.career.pivots'), icon: Users },
    { id: 'traps', label: t('report.career.traps'), icon: AlertTriangle },
    { id: 'redflags', label: t('report.career.redflags'), icon: Flag },
    { id: 'networking', label: t('report.career.networking'), icon: Network },
    { id: 'plan', label: t('report.career.plan'), icon: Calendar },
    { id: 'vision', label: t('report.career.vision'), icon: ArrowRight },
  ];
};

const CareerReportPage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const state = location.state as { scores?: Scores; type?: string } | null;

  const queryType = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const t = new URLSearchParams(window.location.search).get('type');
    return t ? t.toUpperCase() : null;
  }, []);

  const type = useMemo(() => {
    if (queryType) return queryType;
    if (state?.type) return state.type;
    if (state?.scores) return calculateType(state.scores);
    return 'INTJ';
  }, [state, queryType]);

  const locale = useLocale();
  const report = useMemo(() => getCareerReportLocalized(type, locale), [type, locale]);
  const avatar = useMemo(() => {
    const g = (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender;
    return getAvatarForType(type, g);
  }, [type]);

  if (!report) return null;

  const goBack = () =>
    navigate('/results', { state: { ...(state?.scores ? { scores: state.scores } : {}), careerPurchased: true } });

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-accent/20"
      style={{ ['--report-accent' as string]: ACCENT, ['--report-accent-soft' as string]: ACCENT_SOFT }}
    >
      <ReportStyles />
      <div className="lg:flex max-w-[1280px] mx-auto">
        {report.premium && <Sidebar onBack={goBack} />}
        <main id="career-report-content" className="flex-1 min-w-0">
          <HeroSection type={type} title={report.title} subtitle={report.subtitle} avatar={avatar} onBack={goBack} />

          {report.premium ? (
            <PremiumLayout type={type} premium={report.premium} />
          ) : (
            <LegacyLayout report={report} type={type} />
          )}

          <div className="px-5 md:px-10 pb-16 pt-4 flex justify-center">
            <Button
              size="lg"
              onClick={goBack}
              className="rounded-full font-semibold text-white"
              style={{ backgroundColor: 'var(--report-accent)' }}
            >
              <BackToReportLabel />
            </Button>
          </div>
        </main>
      </div>
      {report.premium && <MobileTabBar />}
    </div>
  );
};

const BackToReportLabel = () => {
  const { t } = useTranslation();
  return <>{t('report.backToReport')}</>;
};

const PremiumBadgeLabel = () => {
  const { t } = useTranslation();
  return <>{t('report.careerPage.premiumBadge')}</>;
};



/* ===================== Styles + nav ===================== */

const ReportStyles = () => (
  <style>{`
    .career-section { scroll-margin-top: 80px; }
    @keyframes career-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .career-fade-in { animation: career-fade-up 0.6s ease-out both; }
  `}</style>
);

const Sidebar = ({ onBack }: { onBack: () => void }) => {
  const { t } = useTranslation();
  const SECTIONS = useSections();
  const [active, setActive] = useState('summary');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [SECTIONS]);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 p-6 space-y-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t('report.back')}
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
          {t('report.careerReport')}
        </p>
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', `#${s.id}`);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              style={{
                background: isActive ? 'color-mix(in srgb, var(--report-accent) 12%, transparent)' : 'transparent',
                color: isActive ? 'var(--report-accent)' : 'hsl(var(--muted-foreground))',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{s.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

const MobileTabBar = () => {
  const SECTIONS = useSections();
  return (
  <div className="lg:hidden sticky bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border">
    <div className="overflow-x-auto">
      <div className="flex gap-1 px-3 py-2 min-w-max">
        {SECTIONS.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              history.replaceState(null, '', `#${s.id}`);
            }}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-muted text-muted-foreground cursor-pointer"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  </div>
  );
};

/* ===================== Section primitives ===================== */

const Section = ({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      id={id}
      className={`career-section px-5 md:px-10 py-6 md:py-8 ${visible ? 'career-fade-in' : 'opacity-0'} ${className}`}
    >
      {children}
    </section>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="mb-8 md:mb-10">
    <p
      className="text-xs font-semibold uppercase tracking-[0.18em] mb-2"
      style={{ color: 'var(--report-accent)' }}
    >
      {eyebrow}
    </p>
    <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h2>
    {subtitle && <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border bg-card p-6 md:p-7 ${className}`}>
    {children}
  </div>
);

/* ===================== Hero ===================== */

const HeroSection = ({
  type, title, subtitle, avatar, onBack,
}: {
  type: string; title: string; subtitle: string; avatar: string | null; onBack: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Section id="hero" className="!pt-10">
      <button
        onClick={onBack}
        className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {t('report.backToReport')}
      </button>
      <div
        className="rounded-3xl overflow-hidden p-8 md:p-12 relative border border-border"
        style={{
          background: `linear-gradient(135deg, var(--report-accent-soft) 0%, hsl(var(--background)) 100%)`,
        }}
      >
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {avatar && (
            <img
              src={avatar}
              alt={`${type} avatar`}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-background shadow-lg shrink-0"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{
                background: 'color-mix(in srgb, var(--report-accent) 15%, transparent)',
                color: 'var(--report-accent)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" /> <PremiumBadgeLabel />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="mt-3 text-muted-foreground text-base md:text-lg">{subtitle}</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

/* ===================== Premium layout ===================== */

const PremiumLayout = ({ type, premium: p }: { type: string; premium: PremiumCareerReport }) => {
  const { t } = useTranslation();
  const cp = (k: string, opts?: Record<string, unknown>) => t(`report.careerPage.${k}`, opts);
  return (
  <>
    <Section id="summary">
      <SectionHeader eyebrow={cp('sec01Eyebrow')} title={cp('sec01Title')} />
      <Card>
        <p className="text-foreground/80 leading-relaxed text-base md:text-lg">{p.executiveSummary}</p>
      </Card>
    </Section>

    <Section id="dna">
      <SectionHeader eyebrow={cp('sec02Eyebrow')} title={cp('sec02Title')} />
      <div className="space-y-4">
        {p.careerDna.map((para, i) => (
          <Card key={i}>
            <p className="text-foreground/80 leading-relaxed">{para}</p>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="strengths">
      <SectionHeader eyebrow={cp('sec03Eyebrow')} title={cp('sec03Title')} />
      <div className="grid md:grid-cols-2 gap-4">
        {p.strengths.map((s, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3 mb-2">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{
                  background: 'color-mix(in srgb, var(--report-accent) 12%, transparent)',
                  color: 'var(--report-accent)',
                }}
              >
                {i + 1}
              </div>
              <p className="font-bold text-foreground pt-1">{s.title}</p>
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed">{s.text}</p>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="matches">
      <SectionHeader
        eyebrow={cp('sec04Eyebrow')}
        title={cp('sec04Title')}
        subtitle={cp('sec04Subtitle')}
      />
      <div className="space-y-4">
        {p.matches.map((m) => (
          <Card key={m.rank}>
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                style={{
                  background: 'color-mix(in srgb, var(--report-accent) 12%, transparent)',
                  color: 'var(--report-accent)',
                }}
              >
                {m.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-foreground leading-tight">{m.role}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--report-accent)' }}>
                  {cp('fitLabel')}: {m.fit}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line mb-4">{m.why}</p>
            <div
              className="rounded-xl p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-line"
              style={{ background: 'var(--report-accent-soft)' }}
            >
              {m.comp}
            </div>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="industries">
      <SectionHeader eyebrow={cp('sec05Eyebrow')} title={cp('sec05Title')} />
      <div className="grid md:grid-cols-2 gap-4">
        <FlagList icon={CheckCircle2} title={cp('bestIndustries')} items={p.bestIndustries} tone="good" />
        <FlagList icon={XCircle} title={cp('avoidIndustries')} items={p.avoidIndustries} tone="bad" />
      </div>
    </Section>

    <Section id="environment">
      <SectionHeader
        eyebrow={cp('sec06Eyebrow')}
        title={cp('sec06Title')}
        subtitle={cp('sec06Subtitle')}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <FlagList icon={CheckCircle2} title={cp('greenFlags')} items={p.greenFlags} tone="good" />
        <FlagList icon={Flag} title={cp('redFlags')} items={p.redFlags} tone="bad" />
      </div>
    </Section>

    <Section id="comp">
      <SectionHeader
        eyebrow={cp('sec07Eyebrow')}
        title={cp('sec07Title')}
        subtitle={cp('sec07Subtitle')}
      />
      <div className="space-y-3">
        {p.compTrajectory.map((c, i) => (
          <Card key={i} className="!p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <p className="font-bold text-foreground text-base">{c.stage}</p>
              <p
                className="text-base font-bold"
                style={{ color: 'var(--report-accent)' }}
              >
                {c.range}
              </p>
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed">{c.driver}</p>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="leadership">
      <SectionHeader eyebrow={cp('sec08Eyebrow')} title={cp('sec08Title')} />
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <FlagList icon={CheckCircle2} title={cp('naturalStrengths')} items={p.leadershipStrengths} tone="good" />
        <FlagList icon={AlertTriangle} title={cp('blindSpots')} items={p.leadershipBlindspots} tone="warn" />
      </div>
      <p className="font-semibold text-foreground mb-3 mt-6">{cp('typeScripts')}</p>
      <div className="space-y-3">
        {p.leadershipScripts.map((s, i) => (
          <ScriptCard key={i} label={s.label} text={s.text} />
        ))}
      </div>
    </Section>

    <Section id="stages">
      <SectionHeader
        eyebrow={cp('sec09Eyebrow')}
        title={cp('sec09Title')}
        subtitle={cp('sec09Subtitle')}
      />
      <div className="space-y-4">
        {p.stages.map((s, i) => (
          <Card key={i}>
            <p className="font-bold text-lg mb-2" style={{ color: 'var(--report-accent)' }}>{s.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">{s.intro}</p>
            <div className="space-y-2">
              <StageRow label={cp('milestones')} text={s.milestones} tone="good" />
              <StageRow label={cp('mistakes')} text={s.mistakes} tone="bad" />
              <StageRow label={cp('signals')} text={s.signals} tone="info" />
            </div>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="skills">
      <SectionHeader eyebrow={cp('sec10Eyebrow')} title={cp('sec10Title')} />
      <div className="grid md:grid-cols-2 gap-4">
        <FlagList icon={Sparkles} title={cp('investSkills')} items={p.investSkills} tone="good" />
        <FlagList icon={XCircle} title={cp('deprioritizeSkills')} items={p.deprioritizeSkills} tone="warn" />
      </div>
    </Section>

    <Section id="negotiation">
      <SectionHeader eyebrow={cp('sec11Eyebrow')} title={cp('sec11Title')} />
      <Card className="mb-4">
        <p className="text-foreground/80 leading-relaxed">{p.negotiationOverview}</p>
      </Card>
      <p className="font-semibold text-foreground mb-3">{cp('copyScripts')}</p>
      <div className="space-y-3">
        {p.negotiationScripts.map((s, i) => (
          <ScriptCard key={i} label={s.label} text={s.text} />
        ))}
      </div>
    </Section>

    <Section id="pivots">
      <SectionHeader eyebrow={cp('sec12Eyebrow')} title={cp('sec12Title')} />
      <div className="space-y-3">
        {p.pivots.map((pv, i) => (
          <Card key={i}>
            <p className="font-bold text-foreground mb-2">{pv.title}</p>
            <p className="text-sm text-foreground/75 leading-relaxed">{pv.text}</p>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="traps">
      <SectionHeader
        eyebrow={cp('sec13Eyebrow')}
        title={cp('sec13Title', { type })}
        subtitle={cp('sec13Subtitle')}
      />
      <div className="space-y-3">
        {p.traps.map((tp, i) => (
          <div
            key={i}
            className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground mb-1">{tp.title}</p>
                <p className="text-sm text-foreground/75 leading-relaxed">{tp.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section id="redflags">
      <SectionHeader
        eyebrow={cp('sec14Eyebrow')}
        title={cp('sec14Title')}
        subtitle={cp('sec14Subtitle')}
      />
      <Card>
        <ul className="space-y-3">
          {p.redFlagPhrases.map((phrase, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
              <span className="text-destructive font-bold shrink-0 mt-0.5">⚠</span>
              <span>{phrase}</span>
            </li>
          ))}
        </ul>
      </Card>
    </Section>

    <Section id="networking">
      <SectionHeader eyebrow={cp('sec15Eyebrow')} title={cp('sec15Title')} />
      <Card>
        <p className="text-foreground/80 leading-relaxed">{p.networking}</p>
      </Card>
    </Section>

    <Section id="plan">
      <SectionHeader
        eyebrow={cp('sec16Eyebrow')}
        title={cp('sec16Title')}
        subtitle={cp('sec16Subtitle')}
      />
      <div className="space-y-2">
        {p.weeks.map((w, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:border-[color:var(--report-accent)] transition-colors"
          >
            <div
              className="font-bold w-16 shrink-0 text-sm"
              style={{ color: 'var(--report-accent)' }}
            >
              {w.label}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{w.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="vision">
      <SectionHeader eyebrow={cp('sec17Eyebrow')} title={cp('sec17Title')} />
      <div
        className="rounded-3xl p-8 md:p-10 border border-border"
        style={{
          background: `linear-gradient(135deg, var(--report-accent-soft) 0%, hsl(var(--background)) 100%)`,
        }}
      >
        <p className="text-foreground/80 leading-relaxed text-base md:text-lg italic">{p.visionExercise}</p>
      </div>
    </Section>
  </>
  );
};

/* ===================== Legacy fallback ===================== */

const LegacyLayout = ({
  report, type,
}: { report: NonNullable<ReturnType<typeof getCareerReportLocalized>>; type: string }) => {
  const { t } = useTranslation();
  const cp = (k: string, opts?: Record<string, unknown>) => t(`report.careerPage.${k}`, opts);
  return (
  <>
    <Section id="dna">
      <SectionHeader eyebrow={cp('legacyFoundationEyebrow')} title={cp('legacyDnaTitle')} />
      <Card><p className="text-foreground/80 leading-relaxed">{report.careerDna}</p></Card>
    </Section>

    <Section id="matches">
      <SectionHeader eyebrow={cp('legacyTopMatchesEyebrow')} title={cp('legacyTopMatchesTitle')} subtitle={cp('legacyTopMatchesSubtitle')} />
      <div className="space-y-3">
        {report.matches.map((m) => (
          <Card key={m.rank} className="!p-4">
            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full font-bold flex items-center justify-center"
                style={{
                  background: 'color-mix(in srgb, var(--report-accent) 12%, transparent)',
                  color: 'var(--report-accent)',
                }}
              >
                {m.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{m.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.salary}</p>
              </div>
              <div
                className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  background: 'color-mix(in srgb, var(--report-accent) 12%, transparent)',
                  color: 'var(--report-accent)',
                }}
              >
                {m.fit}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="environment">
      <SectionHeader eyebrow={cp('legacyEnvironmentEyebrow')} title={cp('legacyEnvironmentTitle')} />
      <Card><p className="text-foreground/80 leading-relaxed">{report.environment}</p></Card>
    </Section>

    <Section id="leadership">
      <SectionHeader eyebrow={cp('legacyLeadershipEyebrow')} title={cp('legacyLeadershipTitle')} />
      <Card><p className="text-foreground/80 leading-relaxed">{report.leadership}</p></Card>
    </Section>

    <Section id="stages">
      <SectionHeader eyebrow={cp('legacyRoadmapEyebrow')} title={cp('legacyRoadmapTitle')} />
      <div className="space-y-3">
        {report.stages.map((s, i) => (
          <Card key={i}>
            <p className="font-bold mb-1.5" style={{ color: 'var(--report-accent)' }}>{s.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{s.text}</p>
          </Card>
        ))}
      </div>
    </Section>

    <Section id="traps">
      <SectionHeader eyebrow={cp('legacyTrapsEyebrow')} title={cp('legacyTrapsTitle', { type })} />
      <div className="space-y-3">
        {report.traps.map((tp, i) => (
          <div key={i} className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <p className="font-bold text-foreground mb-1">{tp.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{tp.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section id="plan">
      <SectionHeader eyebrow={cp('legacyPlanEyebrow')} title={cp('legacyPlanTitle')} />
      <div className="space-y-3">
        {report.plan.map((pi, i) => (
          <Card key={i}>
            <p className="font-bold mb-1.5" style={{ color: 'var(--report-accent)' }}>{pi.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{pi.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  </>
  );
};

/* ===================== Small UI helpers ===================== */

const FlagList = ({
  icon: Icon, title, items, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  tone: 'good' | 'bad' | 'warn';
}) => {
  const styles =
    tone === 'good'
      ? { border: 'border-emerald-200/60', bg: 'bg-emerald-50/50', icon: 'text-emerald-600', title: 'text-emerald-700' }
      : tone === 'warn'
      ? { border: 'border-amber-200/60', bg: 'bg-amber-50/50', icon: 'text-amber-600', title: 'text-amber-700' }
      : { border: 'border-destructive/20', bg: 'bg-destructive/5', icon: 'text-destructive', title: 'text-destructive' };
  return (
    <div className={`rounded-2xl border ${styles.border} ${styles.bg} p-6`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${styles.icon}`} />
        <p className={`font-bold text-sm ${styles.title}`}>{title}</p>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
            <span className={`mt-0.5 ${styles.icon}`}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ScriptCard = ({ label, text }: { label: string; text: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <p
      className="text-xs font-bold uppercase tracking-wider mb-2"
      style={{ color: 'var(--report-accent)' }}
    >
      {label}
    </p>
    <p className="text-sm text-foreground/80 leading-relaxed italic">"{text.replace(/^['"]|['"]$/g, '')}"</p>
  </div>
);

const StageRow = ({ label, text, tone }: { label: string; text: string; tone: 'good' | 'bad' | 'info' }) => {
  const color =
    tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-destructive' : 'text-foreground';
  const icon = tone === 'good' ? '✓' : tone === 'bad' ? '✕' : '◆';
  return (
    <div className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
      <span className={`font-bold shrink-0 ${color}`}>{icon}</span>
      <span><span className={`font-semibold ${color}`}>{label}:</span> {text}</span>
    </div>
  );
};

export default CareerReportPage;
