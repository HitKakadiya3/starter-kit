import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useResults } from '@/hooks/useResults';
import { useRedirectGuard } from '@/hooks/useRedirectGuard';
import { getPremiumTypeData, type PremiumTypeData, type CognitiveFunction } from '@/utils/premiumTypeData';
import { getAvatarForType, type Gender } from '@/utils/avatarMap';
import type { Scores, TraitPercentage } from '@/utils/scoring';
import { readResult, type MbtiResult } from '@/utils/mbtiResult';
import { stressBaselineByType, socialBatteryByType } from '@/utils/types';
import { Button } from '@/components/ui/button';

import {
  Sparkles, CheckCircle2, AlertTriangle, Brain, Heart, Users, Briefcase,
  TrendingUp, Star, Quote, Printer, Flame, Battery, Compass, Shield,
  Scale, ClipboardList, BarChart, Building, GraduationCap, Truck,
  Lightbulb, Target, ArrowRight, Sunrise,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Premium Personality Deep-Dive Report — 12 sections                */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: 'hero', label: 'Overview', icon: Sparkles },
  { id: 'portrait', label: 'Type Portrait', icon: Quote },
  { id: 'cognitive', label: 'How Your Mind Works', icon: Brain },
  { id: 'strengths', label: 'Strengths & Weaknesses', icon: Shield },
  { id: 'stress', label: 'Under Pressure', icon: Flame },
  { id: 'relationships', label: 'Relationships & Love', icon: Heart },
  { id: 'friendships', label: 'Friendships', icon: Users },
  { id: 'career', label: 'Career Paths', icon: Briefcase },
  { id: 'growth', label: 'Growth Roadmap', icon: TrendingUp },
  { id: 'famous', label: 'Famous People', icon: Star },
  { id: 'comparisons', label: 'Type Comparisons', icon: Compass },
  { id: 'summary', label: 'Summary & Affirmations', icon: Sunrise },
];

const PremiumReportPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qid = searchParams.get('qid');
  const scores = (location.state as { scores: Scores } | null)?.scores;

  // Dev-test path: scores explicitly passed via state — skip the resume guard
  // so local MBTI previews work without a live backend qid.
  if (scores) return <ReportContent scores={scores} />;

  return <ReportGuardedPlaceholder qid={qid} />;
};

const ReportGuardedPlaceholder = ({ qid }: { qid: string | null }) => {
  const ready = useRedirectGuard('/results');
  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }
  // Module 5 is TBD — once it wires POST /customer/thankyou, it will derive
  // real scores (or a server-declared personality_type) and render the full
  // report. Until then, a qid-only landing shows this placeholder.
  return <ReportComingSoon qid={qid!} />;
};

const ReportComingSoon = ({ qid }: { qid: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl border border-border bg-card shadow-sm">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Your report is on the way</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Thanks for completing the test. Full report rendering goes live
        in the next release — your responses are already saved against
        quiz id <code className="text-xs px-1 py-0.5 rounded bg-muted">{qid}</code>.
      </p>
    </div>
  </div>
);

const ReportContent = ({ scores }: { scores: Scores }) => {
  const { type, traitPercentages } = useResults(scores);
  const data = getPremiumTypeData(type);
  const accent = data.accentColor;

  // Read the persisted, axis-rich result so gauges can reflect the user's
  // actual test outcome. Falls back to per-type baselines when missing.
  const result = useMemo<MbtiResult | null>(() => readResult(), []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-accent/20"
      style={{ ['--report-accent' as string]: accent }}
    >
      <PrintStyles />
      <div className="lg:flex max-w-[1280px] mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <HeroSection data={data} type={type} traitPercentages={traitPercentages} />
          <PortraitSection data={data} type={type} />
          <CognitiveSection data={data} />
          <StrengthsSection data={data} />
          <StressSection data={data} type={type} result={result} />
          <RelationshipsSection data={data} />
          <FriendshipsSection data={data} type={type} result={result} />
          <CareerSection data={data} />
          <GrowthSection data={data} />
          <FamousSection data={data} />
          <ComparisonsSection data={data} />
          <SummarySection data={data} type={type} />
          
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
};

/* ===================== Print + global styles ===================== */

const PrintStyles = () => (
  <style>{`
    @media print {
      .no-print { display: none !important; }
      .report-section { break-inside: avoid; page-break-inside: avoid; }
      body { background: white !important; }
    }
    .report-section { scroll-margin-top: 80px; }
    @keyframes report-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .report-fade-in { animation: report-fade-up 0.7s ease-out both; }
  `}</style>
);

/* ===================== Sidebar (desktop) ===================== */

const Sidebar = () => {
  const [active, setActive] = useState('hero');
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
  }, []);

  return (
    <aside className="hidden lg:block w-64 shrink-0 no-print">
      <div className="sticky top-6 p-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Your Report
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
        <div className="pt-4 mt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>
    </aside>
  );
};

/* ===================== Mobile tab bar ===================== */

const MobileTabBar = () => (
  <div className="lg:hidden sticky bottom-0 left-0 right-0 z-40 no-print bg-background/95 backdrop-blur border-t border-border">
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

/* ===================== Section wrapper ===================== */

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
      className={`report-section px-5 md:px-10 py-12 md:py-16 ${visible ? 'report-fade-in' : 'opacity-0'} ${className}`}
    >
      {children}
    </section>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) => (
  <div className="mb-8 md:mb-10">
    {eyebrow && (
      <p
        className="text-xs font-semibold uppercase tracking-[0.18em] mb-2"
        style={{ color: 'var(--report-accent)' }}
      >
        {eyebrow}
      </p>
    )}
    <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h2>
    {subtitle && <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">{subtitle}</p>}
  </div>
);

/* ===================== Section 1 — Hero ===================== */

const HeroSection = ({ data, type, traitPercentages }: {
  data: PremiumTypeData; type: string; traitPercentages: TraitPercentage[];
}) => {
  const avatar = getAvatarForType(type, (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender);
  return (
    <Section id="hero" className="!pt-10">
      <div
        className="rounded-3xl overflow-hidden text-white p-8 md:p-12 relative"
        style={{
          background: `linear-gradient(135deg, var(--report-accent), color-mix(in srgb, var(--report-accent) 60%, hsl(var(--foreground))))`,
        }}
      >
        <div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur text-3xl md:text-5xl font-extrabold tracking-widest">
                {type}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{data.name}</h1>
            <p className="text-white/85 text-sm md:text-base mb-4">
              {data.traits.join(' · ')}
            </p>
            <p className="text-lg md:text-xl font-medium text-white/95 italic">
              "{data.tagline}"
            </p>
          </div>
          {avatar && (
            <img
              src={avatar}
              alt={data.name}
              className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-white/15 p-2 object-contain"
              loading="lazy"
            />
          )}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3 md:gap-4">
          {traitPercentages.map(tp => (
            <div key={tp.dim} className="bg-white/10 backdrop-blur rounded-xl p-3.5">
              <div className="flex justify-between items-baseline mb-1.5 text-xs font-medium text-white/80">
                <span>{tp.leftLabel}</span>
                <span>{tp.rightLabel}</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-white rounded-full transition-all duration-700"
                  style={{
                    width: `${tp.percentage}%`,
                    left: tp.dominantLabel === tp.leftLabel ? 0 : 'auto',
                    right: tp.dominantLabel === tp.rightLabel ? 0 : 'auto',
                  }}
                />
              </div>
              <p className="text-xs mt-1.5 text-white/90 font-semibold">
                {tp.percentage}% {tp.dominantLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ===================== Section 2 — Portrait ===================== */

const PortraitSection = ({ data, type }: { data: PremiumTypeData; type: string }) => {
  const avatar = getAvatarForType(type, (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender);
  return (
    <Section id="portrait">
      <SectionHeader eyebrow="Section 02" title="Type Portrait" subtitle="A deeper look at who you are at your core." />
      <div className="grid md:grid-cols-[1fr,200px] gap-8 items-start">
        <div className="space-y-4 text-foreground/85 leading-relaxed text-[15px] md:text-base">
          {data.introduction.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {avatar && (
          <img src={avatar} alt={data.name} className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-card border border-border p-2 object-contain mx-auto" loading="lazy" />
        )}
      </div>
      <div
        className="mt-8 p-6 md:p-8 rounded-2xl border-l-4 bg-card"
        style={{ borderLeftColor: 'var(--report-accent)' }}
      >
        <Quote className="h-6 w-6 mb-3" style={{ color: 'var(--report-accent)' }} />
        <p className="text-lg md:text-xl text-foreground italic font-medium leading-snug">
          "{data.famousQuote.text}"
        </p>
        <p className="mt-3 text-sm text-muted-foreground">— {data.famousQuote.person}</p>
      </div>
    </Section>
  );
};

/* ===================== Section 3 — Cognitive Functions ===================== */

const FUNCTION_LABELS = [
  { key: 'dominant', label: 'Your Core Strength', rank: '#1 Dominant' },
  { key: 'auxiliary', label: 'Your Support System', rank: '#2 Auxiliary' },
  { key: 'tertiary', label: 'Developing with Age', rank: '#3 Tertiary' },
  { key: 'inferior', label: 'Hidden Edge / Stress Trigger', rank: '#4 Inferior' },
] as const;

const CognitiveSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="cognitive">
    <SectionHeader eyebrow="Section 03" title="How Your Mind Works" subtitle="Your four cognitive functions, ranked from dominant to inferior." />
    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
      {FUNCTION_LABELS.map((f, i) => {
        const fn = data.cognitiveFunctions[f.key] as CognitiveFunction;
        return (
          <div key={f.key} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0"
                style={{ background: `color-mix(in srgb, var(--report-accent) ${100 - i * 18}%, hsl(var(--muted)))` }}
              >
                {fn.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--report-accent)' }}>{f.rank}</p>
                <h3 className="font-bold text-foreground text-lg leading-tight">{fn.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{f.label}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{fn.description}</p>
          </div>
        );
      })}
    </div>

    {/* Diamond diagram */}
    <div className="mt-10 flex justify-center">
      <div className="relative w-64 h-64">
        {[
          { fn: data.cognitiveFunctions.dominant, pos: 'top-0 left-1/2 -translate-x-1/2', size: 'w-20 h-20', opacity: 1 },
          { fn: data.cognitiveFunctions.auxiliary, pos: 'right-0 top-1/2 -translate-y-1/2', size: 'w-16 h-16', opacity: 0.8 },
          { fn: data.cognitiveFunctions.tertiary, pos: 'left-0 top-1/2 -translate-y-1/2', size: 'w-14 h-14', opacity: 0.6 },
          { fn: data.cognitiveFunctions.inferior, pos: 'bottom-0 left-1/2 -translate-x-1/2', size: 'w-12 h-12', opacity: 0.4 },
        ].map((d, i) => (
          <div
            key={i}
            className={`absolute ${d.pos} ${d.size} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
            style={{ background: 'var(--report-accent)', opacity: d.opacity }}
          >
            {d.fn.abbr}
          </div>
        ))}
      </div>
    </div>
  </Section>
);

/* ===================== Section 4 — Strengths & Weaknesses ===================== */

const StrengthsSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="strengths">
    <SectionHeader eyebrow="Section 04" title="Strengths & Weaknesses" subtitle="The dual edges of your personality." />
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Your Strengths
        </h3>
        <div className="space-y-3">
          {data.strengths.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{s.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Your Blind Spots
        </h3>
        <div className="space-y-3">
          {data.weaknesses.map((w, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{w.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{w.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div
      className="mt-8 p-5 rounded-xl text-center text-sm font-medium"
      style={{ background: 'color-mix(in srgb, var(--report-accent) 10%, transparent)', color: 'var(--report-accent)' }}
    >
      Awareness of your blind spots is the first step to growth.
    </div>
  </Section>
);

/* ===================== Section 5 — Stress Profile ===================== */

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const StressSection = ({ data, type, result }: {
  data: PremiumTypeData; type: string; result: MbtiResult | null;
}) => {
  const stressBaseline = stressBaselineByType[type] ?? 50;
  // Dynamic — blend of typeData[code].stressBaseline and result.turbulentPercent.
  // Falls back to the per-type baseline alone when turbulentPercent is unknown.
  const markerPosition = clamp(
    Math.round(
      result?.turbulentPercent !== undefined
        ? 0.4 * stressBaseline + 0.6 * result.turbulentPercent
        : stressBaseline
    ),
    2,
    98,
  );

  return (
    <Section id="stress">
      <SectionHeader eyebrow="Section 05" title="Under Pressure" subtitle="How stress shows up — and how you recover." />
      <div className="grid md:grid-cols-3 gap-5">
        <StressCard title="Triggers" icon={Flame} items={data.stressTriggers} accent="var(--report-accent)" />
        <StressCard title="Signs of Stress" icon={AlertTriangle} items={data.stressSigns} accent="hsl(30 90% 50%)" />
        <StressCard title="Recovery" icon={Sunrise} items={data.recoveryStrategies} accent="hsl(160 60% 40%)" />
      </div>

      {/* Stress meter — marker position reflects user's A/T blend. */}
      <div className="mt-10 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Stress Tolerance</h3>
          <span className="text-xs text-muted-foreground">Calm → Overwhelmed</span>
        </div>
        <div className="h-3 rounded-full bg-gradient-to-r from-green-400 via-amber-400 to-red-500 relative">
          <div
            className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-lg transition-all duration-700"
            style={{
              left: `${markerPosition}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: 'var(--report-accent)',
            }}
            aria-label={`Stress tolerance marker at ${markerPosition}%`}
          />
        </div>
      </div>
    </Section>
  );
};

const StressCard = ({ title, icon: Icon, items, accent }: {
  title: string; icon: React.ElementType; items: string[]; accent: string;
}) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-5 w-5" style={{ color: accent }} />
      <h3 className="font-bold text-foreground">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground/80 leading-relaxed flex gap-2">
          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* ===================== Section 6 — Relationships ===================== */

const RelationshipsSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="relationships">
    <SectionHeader eyebrow="Section 06" title="Relationships & Love" subtitle="How you love, what you offer, and what you need." />
    <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.relationships.narrative}</p>

    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <IconCard icon={Heart} title="What You Offer" items={data.relationships.offers} />
      <IconCard icon={Target} title="What You Need" items={data.relationships.needs} />
      <IconCard icon={AlertTriangle} title="Common Challenges" items={data.relationships.challenges} />
    </div>

    <h3 className="font-bold text-foreground mb-4">Compatible Types</h3>
    <div className="flex flex-wrap gap-3">
      {data.relationships.compatibleWith.map((c) => (
        <div
          key={c.type}
          className="flex-1 min-w-[240px] bg-card border border-border rounded-xl p-4"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-2"
            style={{ background: 'var(--report-accent)' }}
          >
            {c.type}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">{c.reason}</p>
        </div>
      ))}
    </div>
  </Section>
);

const IconCard = ({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: string[] }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <Icon className="h-5 w-5 mb-3" style={{ color: 'var(--report-accent)' }} />
    <h4 className="font-semibold text-foreground mb-3 text-sm">{title}</h4>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
          <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* ===================== Section 7 — Friendships ===================== */

const FriendshipsSection = ({ data, type, result }: {
  data: PremiumTypeData; type: string; result: MbtiResult | null;
}) => {
  // Dynamic — blend of per-type social battery baseline and result.traits.EI.percent.
  // Per spec, EI.percent is 0-100 where higher = more extraverted (regardless of letter).
  // Falls back to the per-type baseline alone when EI percent is unknown.
  const batteryBaseline = socialBatteryByType[type] ?? data.socialBattery;
  const extraversionPct = result?.traits?.EI?.percent;

  const socialBattery = clamp(
    Math.round(
      extraversionPct === undefined
        ? batteryBaseline
        : 0.5 * batteryBaseline + 0.5 * extraversionPct
    ),
    0,
    100,
  );

  return (
    <Section id="friendships">
      <SectionHeader eyebrow="Section 07" title="Friendships & Social Life" subtitle="The friend you are — and your social blind spots." />
      <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.friendships.narrative}</p>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5" style={{ color: 'var(--report-accent)' }} />
            <h3 className="font-semibold text-foreground">Social Battery</h3>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--report-accent)' }}>{socialBattery}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${socialBattery}%`, background: 'var(--report-accent)' }}
          />
        </div>
      </div>

    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          You're the friend who...
        </h4>
        <ul className="space-y-3">
          {data.friendships.positives.map((p, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2">
              <span className="text-green-600 shrink-0">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Watch out for...
        </h4>
        <ul className="space-y-3">
          {data.friendships.watchOuts.map((p, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2">
              <span className="text-amber-600 shrink-0">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </Section>
  );
};

/* ===================== Section 8 — Career ===================== */

const ICON_MAP: Record<string, React.ElementType> = {
  briefcase: Briefcase, shield: Shield, scale: Scale, 'clipboard-list': ClipboardList,
  'bar-chart': BarChart, building: Building, 'graduation-cap': GraduationCap, truck: Truck,
};

const CareerSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="career">
    <SectionHeader eyebrow="Section 08" title="Career Paths" subtitle="Where your strengths shine — and where to be careful." />
    <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.career.narrative}</p>

    <h3 className="font-bold text-foreground mb-4">Best-Fit Careers</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
      {data.career.bestCareers.map((c) => {
        const Icon = ICON_MAP[c.icon] ?? Briefcase;
        return (
          <div key={c.label} className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
            <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--report-accent)' }} />
            <p className="text-sm font-medium text-foreground">{c.label}</p>
          </div>
        );
      })}
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <IconCard icon={Compass} title="Leadership Style" items={data.career.leadershipStyle} />
      <IconCard icon={Users} title="As a Teammate" items={data.career.asTeammate} />
    </div>

    <div className="mt-6 p-5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30">
      <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        Approach with Caution
      </h4>
      <ul className="space-y-1">
        {data.career.cautionCareers.map((c, i) => (
          <li key={i} className="text-sm text-foreground/80">• {c}</li>
        ))}
      </ul>
    </div>
  </Section>
);

/* ===================== Section 9 — Growth Roadmap ===================== */

const GrowthSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="growth">
    <SectionHeader eyebrow="Section 09" title="Personal Growth Roadmap" subtitle="How your type evolves across a lifetime." />
    <div className="grid md:grid-cols-2 gap-5 mb-8">
      {data.growthRoadmap.map((g, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--report-accent)' }}
            >
              {i + 1}
            </div>
            <h3 className="font-bold text-foreground">{g.phase}</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{g.description}</p>
        </div>
      ))}
    </div>

    <div
      className="rounded-2xl p-6 md:p-8 text-white"
      style={{ background: `linear-gradient(135deg, var(--report-accent), color-mix(in srgb, var(--report-accent) 60%, hsl(var(--foreground))))` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5" />
        <h3 className="font-bold">Top 3 Growth Challenges</h3>
      </div>
      <ul className="space-y-3">
        {data.topGrowthChallenges.map((c, i) => (
          <li key={i} className="flex gap-3 text-sm md:text-base text-white/95 leading-relaxed">
            <span className="font-bold shrink-0">{i + 1}.</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  </Section>
);

/* ===================== Section 10 — Famous People ===================== */

const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

const FamousSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="famous">
    <SectionHeader eyebrow="Section 10" title="Famous People & Characters" subtitle={`Notable ${data.code}s in history and fiction.`} />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.famousPeople.map((p, i) => {
        const initials = p.name.split(' ').map(n => n[0]).slice(0, 2).join('');
        return (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{ background: colors[i % colors.length] }}
              >
                {initials}
              </div>
              <div>
                <h4 className="font-semibold text-foreground leading-tight">{p.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{p.role}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed">{p.reason}</p>
          </div>
        );
      })}
    </div>
  </Section>
);

/* ===================== Section 11 — Comparisons ===================== */

const ComparisonsSection = ({ data }: { data: PremiumTypeData }) => (
  <Section id="comparisons">
    <SectionHeader eyebrow="Section 11" title="Type Comparisons" subtitle="The two types most often confused with yours." />
    <div className="grid md:grid-cols-2 gap-5">
      {data.typeComparisons.map((c) => (
        <div key={c.vsType} className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{data.code} vs</p>
          <h3 className="text-2xl font-bold mb-5" style={{ color: 'var(--report-accent)' }}>{c.vsType}</h3>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Shared Traits</p>
            <ul className="space-y-1.5">
              {c.sharedTraits.map((s, i) => (
                <li key={i} className="text-sm text-foreground/80 flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Key Differences</p>
            <ul className="space-y-1.5">
              {c.keyDifferences.map((d, i) => (
                <li key={i} className="text-sm text-foreground/80 flex gap-2">
                  <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--report-accent)' }} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-muted text-sm text-foreground/85">
            <span className="font-semibold">You might be {c.vsType} if: </span>{c.youMightBeThis}
          </div>
        </div>
      ))}
    </div>
    <p className="mt-6 text-center text-sm text-muted-foreground italic">
      Not sure your type fits? Consider retaking the test.
    </p>
  </Section>
);

/* ===================== Section 12 — Summary (Editorial Poster) ===================== */

const SummarySection = ({ data, type }: { data: PremiumTypeData; type: string }) => {
  const avatar = getAvatarForType(type, (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender);
  const signature = data.strengths[0]?.title ?? '—';
  const growthEdge = data.weaknesses[0]?.title ?? '—';
  const bestWith = data.relationships.compatibleWith.slice(0, 2).map(c => c.type).join(' · ') || '—';
  const powerMove = data.career.bestCareers[0]?.label ?? 'Build the future';
  const mantra = data.affirmations[0] ?? '';

  return (
    <Section id="summary">
      <div
        className="relative overflow-hidden rounded-3xl shadow-elevated"
        style={{
          background: `linear-gradient(145deg,
            color-mix(in srgb, var(--report-accent) 84%, hsl(var(--foreground))) 0%,
            color-mix(in srgb, var(--report-accent) 68%, hsl(var(--background))) 58%,
            color-mix(in srgb, var(--report-accent) 76%, hsl(var(--foreground))) 100%)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--background) / 0.02), hsl(var(--foreground) / 0.16))',
          }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr,0.85fr] p-6 md:p-10 lg:p-12">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6 text-[10px] md:text-[11px] font-semibold tracking-[0.28em] uppercase text-primary-foreground/75">
              <span>Section 12</span>
              <span>Final Snapshot</span>
            </div>

            <div className="inline-flex items-center rounded-full border px-4 py-2 mb-5 text-sm md:text-base font-extrabold tracking-[0.35em] text-primary-foreground"
              style={{
                borderColor: 'hsl(var(--primary-foreground) / 0.22)',
                background: 'hsl(var(--primary-foreground) / 0.08)',
              }}
            >
              {type}
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-none text-primary-foreground text-balance">
              {data.name}
            </h2>
            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-primary-foreground/85">
              {data.tagline}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Signature Trait', value: signature },
                { label: 'Growth Edge', value: growthEdge },
                { label: 'Best With', value: bestWith },
                { label: 'Power Move', value: powerMove },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border p-4 md:p-5"
                  style={{
                    borderColor: 'hsl(var(--primary-foreground) / 0.14)',
                    background: 'hsl(var(--primary-foreground) / 0.08)',
                  }}
                >
                  <div className="text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase text-primary-foreground/65">
                    {item.label}
                  </div>
                  <div className="mt-2 text-base md:text-lg font-bold leading-tight text-primary-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {mantra && (
              <div
                className="mt-6 rounded-2xl border p-5 md:p-6"
                style={{
                  borderColor: 'hsl(var(--primary-foreground) / 0.14)',
                  background: 'hsl(var(--foreground) / 0.18)',
                }}
              >
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase text-primary-foreground/70">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your Mantra
                </div>
                <p className="mt-3 text-lg md:text-2xl italic leading-relaxed text-primary-foreground text-balance">
                  “{mantra}”
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center no-print">
              <Button
                size="lg"
                onClick={() => window.print()}
                className="w-full sm:w-auto font-bold"
                style={{
                  background: 'hsl(var(--primary-foreground))',
                  color: 'hsl(var(--foreground))',
                }}
              >
                <Printer className="h-4 w-4 mr-2" />
                Download Poster + Report
              </Button>
              <p className="text-xs md:text-sm text-primary-foreground/70">Save as PDF for future reference</p>
            </div>
          </div>

          <div className="flex items-stretch">
            <div
              className="w-full rounded-[28px] border p-4 md:p-5"
              style={{
                borderColor: 'hsl(var(--primary-foreground) / 0.16)',
                background: 'linear-gradient(180deg, hsl(var(--primary-foreground) / 0.12), hsl(var(--foreground) / 0.18))',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase text-primary-foreground/65">
                <span>Type Portrait</span>
                <span>{type}</span>
              </div>

              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ background: 'linear-gradient(180deg, hsl(var(--background) / 0.88), hsl(var(--muted) / 0.94))' }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={data.name}
                    className="w-full aspect-[4/5] object-contain p-4 md:p-6"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">
                    Portrait unavailable
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl p-4"
                style={{ background: 'hsl(var(--primary-foreground) / 0.08)' }}
              >
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary-foreground/65">Closing Note</p>
                <p className="mt-2 text-sm md:text-base leading-relaxed text-primary-foreground/84">
                  Your personality is a compass, not a cage. Keep what resonates, question what does not, and use this report to move with more self-awareness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PremiumReportPage;
