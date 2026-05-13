import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useResults } from '@/hooks/useResults';
import { type PremiumTypeData, type CognitiveFunction } from '@/utils/premiumTypeData';
import { getPremiumTypeDataLocalized } from '@/utils/localizedData';
import { useLocale, useLocalizedNavigate } from '@/hooks/useLocale';
import { getAvatarForType, type Gender } from '@/utils/avatarMap';
import type { Scores, TraitPercentage } from '@/utils/scoring';
import { readResult, type MbtiResult } from '@/utils/mbtiResult';
import { stressBaselineByType, socialBatteryByType } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { pdf } from '@react-pdf/renderer';
import { ReportPdf } from '@/pdf/ReportPdf';
import careerPreview from '@/assets/career-icon-orange.png';

// Fetch an image URL and turn it into a data: URL so react-pdf can embed it
// without a network round-trip during render.
async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function downloadReportPdf(args: {
  data: import('@/utils/premiumTypeData').PremiumTypeData;
  type: string;
  traitPercentages: import('@/utils/scoring').TraitPercentage[];
  avatarUrl?: string | null;
  turbulentPercent?: number;
  stressBaseline?: number;
}) {
  const avatarDataUrl = args.avatarUrl ? await fetchAsDataUrl(args.avatarUrl) : null;
  const blob = await pdf(
    <ReportPdf
      data={args.data}
      type={args.type}
      traitPercentages={args.traitPercentages}
      avatarDataUrl={avatarDataUrl}
      turbulentPercent={args.turbulentPercent}
      stressBaseline={args.stressBaseline}
    />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `16types-${args.type}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


import {
  Sparkles, CheckCircle2, AlertTriangle, Brain, Heart, Users, Briefcase,
  TrendingUp, Star, Quote, Download, Flame, Battery, Compass, Shield,
  Scale, ClipboardList, BarChart, Building, GraduationCap, Truck,
  Lightbulb, Target, ArrowRight, Sunrise,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Premium Personality Deep-Dive Report — 12 sections                */
/* ------------------------------------------------------------------ */

const useSections = () => {
  const { t } = useTranslation();
  return [
    { id: 'hero', label: t('report.sections.overview'), icon: Sparkles },
    { id: 'portrait', label: t('report.sections.portrait'), icon: Quote },
    { id: 'cognitive', label: t('report.sections.cognitive'), icon: Brain },
    { id: 'strengths', label: t('report.sections.strengths'), icon: Shield },
    { id: 'stress', label: t('report.sections.stress'), icon: Flame },
    { id: 'relationships', label: t('report.sections.relationships'), icon: Heart },
    { id: 'friendships', label: t('report.sections.friendships'), icon: Users },
    { id: 'career', label: t('report.sections.career'), icon: Briefcase },
    { id: 'growth', label: t('report.sections.growth'), icon: TrendingUp },
    { id: 'famous', label: t('report.sections.famous'), icon: Star },
    { id: 'comparisons', label: t('report.sections.comparisons'), icon: Compass },
    { id: 'summary', label: t('report.sections.summary'), icon: Sunrise },
  ];
};

const PremiumReportPage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const locState = location.state as { scores: Scores; careerPurchased?: boolean } | null;
  const scores = locState?.scores;
  const careerPurchased = locState?.careerPurchased ?? false;
  if (!scores) { navigate('/'); return null; }
  return <ReportContent scores={scores} careerPurchased={careerPurchased} />;
};

const DOWNLOAD_EVENT = 'report:download-pdf';
const handleSavePdf = () => window.dispatchEvent(new CustomEvent(DOWNLOAD_EVENT));

const ReportContent = ({ scores, careerPurchased = false }: { scores: Scores; careerPurchased?: boolean }) => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const { type, traitPercentages } = useResults(scores);
  const locale = useLocale();
  const data = getPremiumTypeDataLocalized(type, locale);
  const accent = data.accentColor;

  // Read the persisted, axis-rich result so gauges can reflect the user's
  // actual test outcome. Falls back to per-type baselines when missing.
  const result = useMemo<MbtiResult | null>(() => readResult(), []);

  // Listen for download requests dispatched by the Sidebar / Summary buttons.
  useEffect(() => {
    const onDownload = () => {
      const gender = (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender;
      const avatarUrl = getAvatarForType(type, gender);
      void downloadReportPdf({
        data,
        type,
        traitPercentages,
        avatarUrl,
        turbulentPercent: result?.turbulentPercent,
        stressBaseline: stressBaselineByType[type] ?? 50,
      });
    };
    window.addEventListener(DOWNLOAD_EVENT, onDownload);
    return () => window.removeEventListener(DOWNLOAD_EVENT, onDownload);
  }, [data, type, traitPercentages, result]);


  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-accent/20"
      style={{ ['--report-accent' as string]: accent }}
    >
      <PrintStyles />
      <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm no-print">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center h-20">
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
      </header>
      <div className="lg:flex max-w-[1280px] mx-auto">
        <Sidebar careerPurchased={careerPurchased} onViewCareer={() => navigate('/career-report', { state: { scores } })} />
        <main id="report-content" className="flex-1 min-w-0">
          <HeroSection data={data} type={type} traitPercentages={traitPercentages} />
          <PortraitSection data={data} type={type} />
          <CognitiveSection data={data} />
          <StrengthsSection data={data} />
          <StressSection data={data} type={type} result={result} />
          <RelationshipsSection data={data} />
          <FriendshipsSection data={data} type={type} result={result} />
          <CareerSection data={data} />
          {careerPurchased && (
            <div className="px-4 md:px-8 pb-2 no-print">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 p-5 max-w-2xl mx-auto">
                <div className="relative space-y-2">
                  <div className="flex justify-center -my-3">
                    <img
                      src={careerPreview}
                      alt={t('report.careerPotentialTitle')}
                      loading="lazy"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-foreground leading-tight">
                      {t('report.careerPotentialTitle')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {t('report.careerPotentialBody')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full rounded-full font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => navigate('/career-report', { state: { scores } })}
                  >
                    {t('report.viewReport')}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <GrowthSection data={data} />
          <FamousSection data={data} />
          <ComparisonsSection data={data} />
          <SummarySection data={data} type={type} />
          {careerPurchased && (
            <div className="lg:hidden px-4 md:px-8 pb-12 pt-2 no-print">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 p-5">
                <div className="relative space-y-3">
                  <div className="flex justify-center -my-3">
                    <img
                      src={careerPreview}
                      alt={t('report.careerPotentialTitle')}
                      loading="lazy"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-foreground leading-tight">
                      {t('report.careerPotentialTitle')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {t('report.careerPotentialBody')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full rounded-full font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => navigate('/career-report', { state: { scores } })}
                  >
                    {t('report.viewReport')}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
};

/* ===================== Print + global styles ===================== */

const PrintStyles = () => (
  <style>{`
    .report-section { scroll-margin-top: 80px; }
    @keyframes report-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .report-fade-in { animation: report-fade-up 0.7s ease-out both; }

    @page {
      size: A4 portrait;
      margin: 14mm 14mm 16mm 14mm;
    }

    @media print {
      html, body, *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        animation: none !important;
        transition: none !important;
      }

      body { background: white !important; }
      .no-print, nav, aside, footer { display: none !important; }

      html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
      #report-content, main, .report-main {
        width: 100% !important;
        max-width: 170mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
      }
      #report-content * { max-width: 100% !important; box-sizing: border-box !important; }

      .grid-cols-2,
      .md\\:grid-cols-2,
      .lg\\:grid-cols-2 { grid-template-columns: 1fr !important; }
      .grid-cols-3, .md\\:grid-cols-3, .lg\\:grid-cols-3 {
        grid-template-columns: 1fr 1fr !important;
      }
      .grid-cols-4, .md\\:grid-cols-4, .lg\\:grid-cols-4 {
        grid-template-columns: 1fr 1fr !important;
      }

      .report-section {
        break-before: page;
        page-break-before: always;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }
      .report-section:first-of-type {
        break-before: auto;
        page-break-before: auto;
      }
      .rounded-2xl, .rounded-3xl, .card, .report-card,
      [class*="shadow-"] {
        break-inside: avoid-page;
        page-break-inside: avoid;
      }
      h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }

      .py-16 { padding-top: 8mm !important; padding-bottom: 8mm !important; }
      .py-12 { padding-top: 6mm !important; padding-bottom: 6mm !important; }
      .p-12  { padding: 8mm !important; }
      .p-8   { padding: 6mm !important; }
      .gap-8 { gap: 4mm !important; }

      h1, h2, h3, p, li { word-break: break-word; overflow-wrap: anywhere; }

      img { max-width: 100% !important; height: auto !important; }

      a { text-decoration: none !important; color: inherit !important; }
    }
  `}</style>
);

/* ===================== Sidebar (desktop) ===================== */

const Sidebar = ({ careerPurchased = false, onViewCareer }: { careerPurchased?: boolean; onViewCareer?: () => void } = {}) => {
  const { t } = useTranslation();
  const SECTIONS = useSections();
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
  }, [SECTIONS]);

  return (
    <aside className="hidden lg:block w-64 shrink-0 no-print">
      <div className="sticky top-6 p-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          {t('report.yourReport')}
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
        {careerPurchased ? (
          <div className="pt-3 mt-3 border-t border-border">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 p-4">
              <div className="relative space-y-3">
                <div className="flex justify-center -my-3">
                  <img
                    src={careerPreview}
                    alt={t('report.careerPotentialTitle')}
                    loading="lazy"
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {t('report.careerPotentialTitle')}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {t('report.careerPotentialBody')}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full rounded-full font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={onViewCareer}
                >
                  {t('report.viewReport')}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-3 mt-3 pb-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSavePdf}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('report.saveAsPdf')}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

/* ===================== Mobile tab bar ===================== */

const MobileTabBar = () => {
  const SECTIONS = useSections();
  return (
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
};

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
      className={`report-section px-5 md:px-10 py-10 md:py-14 ${visible ? 'report-fade-in' : 'opacity-0'} ${className}`}
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
  const { t } = useTranslation();
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
            <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
              {t('report.you')}
            </p>
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
  const { t } = useTranslation();
  const avatar = getAvatarForType(type, (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender);
  return (
    <Section id="portrait">
      <SectionHeader eyebrow={`${t('report.body.section')} 02`} title={t('report.sections.portrait')} subtitle={t('report.body.portraitSubtitle')} />
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

const useFunctionLabels = () => {
  const { t } = useTranslation();
  return [
    { key: 'dominant', label: t('report.body.fnDominantLabel'), rank: t('report.body.fnDominantRank') },
    { key: 'auxiliary', label: t('report.body.fnAuxiliaryLabel'), rank: t('report.body.fnAuxiliaryRank') },
    { key: 'tertiary', label: t('report.body.fnTertiaryLabel'), rank: t('report.body.fnTertiaryRank') },
    { key: 'inferior', label: t('report.body.fnInferiorLabel'), rank: t('report.body.fnInferiorRank') },
  ] as const;
};

const CognitiveSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  const FUNCTION_LABELS = useFunctionLabels();
  return (
  <Section id="cognitive">
    <SectionHeader eyebrow={`${t('report.body.section')} 03`} title={t('report.sections.cognitive')} subtitle={t('report.body.cognitiveSubtitle')} />
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
};

/* ===================== Section 4 — Strengths & Weaknesses ===================== */

const StrengthsSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="strengths">
    <SectionHeader eyebrow={`${t('report.body.section')} 04`} title={t('report.body.strengthsTitle')} subtitle={t('report.body.strengthsSubtitle')} />
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          {t('report.body.yourStrengths')}
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
          {t('report.body.yourBlindSpots')}
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
      {t('report.body.blindSpotNote')}
    </div>
  </Section>
  );
};

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

  const { t } = useTranslation();
  return (
    <Section id="stress">
      <SectionHeader eyebrow={`${t('report.body.section')} 05`} title={t('report.body.stressTitle')} subtitle={t('report.body.stressSubtitle')} />
      <div className="grid md:grid-cols-3 gap-5">
        <StressCard title={t('report.body.triggers')} icon={Flame} items={data.stressTriggers} accent="var(--report-accent)" />
        <StressCard title={t('report.body.signsOfStress')} icon={AlertTriangle} items={data.stressSigns} accent="hsl(30 90% 50%)" />
        <StressCard title={t('report.body.recovery')} icon={Sunrise} items={data.recoveryStrategies} accent="hsl(160 60% 40%)" />
      </div>

      {/* Stress meter — marker position reflects user's A/T blend. */}
      <div className="mt-10 bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">{t('report.body.stressTolerance')}</h3>
          <span className="text-xs text-muted-foreground">{t('report.body.calmOverwhelmed')}</span>
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

const RelationshipsSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="relationships">
    <SectionHeader eyebrow={`${t('report.body.section')} 06`} title={t('report.body.relationshipsTitle')} subtitle={t('report.body.relationshipsSubtitle')} />
    <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.relationships.narrative}</p>

    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <IconCard icon={Heart} title={t('report.body.whatYouOffer')} items={data.relationships.offers} />
      <IconCard icon={Target} title={t('report.body.whatYouNeed')} items={data.relationships.needs} />
      <IconCard icon={AlertTriangle} title={t('report.body.commonChallenges')} items={data.relationships.challenges} />
    </div>

    <h3 className="font-bold text-foreground mb-4">{t('report.body.compatibleTypes')}</h3>
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
};

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
  const eiPercent = result?.traits?.EI?.percent;
  const eiLetter = result?.traits?.EI?.letter;
  // Convert dominance (50-100 of winning pole) → directional E-ness (0-100, higher = more extraverted)
  const eDirectional =
    eiPercent === undefined
      ? undefined
      : eiLetter === 'E'
        ? eiPercent
        : 100 - eiPercent;

  const socialBattery = clamp(
    Math.round(
      eDirectional === undefined
        ? batteryBaseline
        : 0.5 * batteryBaseline + 0.5 * eDirectional
    ),
    0,
    100,
  );

  const { t } = useTranslation();
  return (
    <Section id="friendships">
      <SectionHeader eyebrow={`${t('report.body.section')} 07`} title={t('report.body.friendshipsTitle')} subtitle={t('report.body.friendshipsSubtitle')} />
      <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.friendships.narrative}</p>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5" style={{ color: 'var(--report-accent)' }} />
            <h3 className="font-semibold text-foreground">{t('report.body.socialBattery')}</h3>
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
          {t('report.body.friendWho')}
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
          {t('report.body.watchOutFor')}
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

const CareerSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="career">
    <SectionHeader eyebrow={`${t('report.body.section')} 08`} title={t('report.body.careerTitle')} subtitle={t('report.body.careerSubtitle')} />
    <p className="text-foreground/85 leading-relaxed mb-8 text-[15px]">{data.career.narrative}</p>

    <h3 className="font-bold text-foreground mb-4">{t('report.body.bestFitCareers')}</h3>
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
      <IconCard icon={Compass} title={t('report.body.leadershipStyle')} items={data.career.leadershipStyle} />
      <IconCard icon={Users} title={t('report.body.asTeammate')} items={data.career.asTeammate} />
    </div>

    <div className="mt-6 p-5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30">
      <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        {t('report.body.approachWithCaution')}
      </h4>
      <ul className="space-y-1">
        {data.career.cautionCareers.map((c, i) => (
          <li key={i} className="text-sm text-foreground/80">• {c}</li>
        ))}
      </ul>
    </div>
  </Section>
  );
};

/* ===================== Section 9 — Growth Roadmap ===================== */

const GrowthSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="growth">
    <SectionHeader eyebrow={`${t('report.body.section')} 09`} title={t('report.body.growthTitle')} subtitle={t('report.body.growthSubtitle')} />
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
        <h3 className="font-bold">{t('report.body.topGrowthChallenges')}</h3>
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
};

/* ===================== Section 10 — Famous People ===================== */

const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

import { getFamousAvatar } from '@/utils/famousAvatars';

const FamousSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="famous">
    <SectionHeader eyebrow={`${t('report.body.section')} 10`} title={t('report.body.famousTitle')} subtitle={t('report.body.famousSubtitle', { type: data.code })} />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.famousPeople.map((p, i) => {
        const initials = p.name.split(' ').map(n => n[0]).slice(0, 2).join('');
        const avatar = getFamousAvatar(p.name);
        return (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={p.name}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover bg-muted shrink-0 ring-2"
                  style={{ boxShadow: `0 0 0 2px ${colors[i % colors.length]}` }}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ background: colors[i % colors.length] }}
                >
                  {initials}
                </div>
              )}
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
};


/* ===================== Section 11 — Comparisons ===================== */

const ComparisonsSection = ({ data }: { data: PremiumTypeData }) => {
  const { t } = useTranslation();
  return (
  <Section id="comparisons">
    <SectionHeader eyebrow={`${t('report.body.section')} 11`} title={t('report.body.section11Title')} subtitle={t('report.body.section11Subtitle')} />
    <div className="grid md:grid-cols-2 gap-5">
      {data.typeComparisons.map((c) => (
        <div key={c.vsType} className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{data.code} {t('report.body.vs')}</p>
          <h3 className="text-2xl font-bold mb-5" style={{ color: 'var(--report-accent)' }}>{c.vsType}</h3>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{t('report.body.sharedTraits')}</p>
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
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{t('report.body.keyDifferences')}</p>
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
            <span className="font-semibold">{t('report.body.youMightBe', { type: c.vsType })} </span>{c.youMightBeThis}
          </div>
        </div>
      ))}
    </div>
  </Section>
  );
};

/* ===================== Section 12 — Summary (Editorial Poster) ===================== */

const SummarySection = ({ data, type }: { data: PremiumTypeData; type: string }) => {
  const { t } = useTranslation();
  const avatar = getAvatarForType(type, (typeof window !== 'undefined' ? localStorage.getItem('user_gender') : null) as Gender);
  const signature = data.strengths[0]?.title ?? '—';
  const growthEdge = data.weaknesses[0]?.title ?? '—';
  const bestWith = data.relationships.compatibleWith.slice(0, 2).map(c => c.type).join(' · ') || '—';
  const powerMove = data.career.bestCareers[0]?.label ?? 'Build the future';
  const mantra = data.affirmations[0] ?? '';

  return (
    <Section id="summary">
      <div
        className="relative overflow-hidden rounded-3xl shadow-elevated p-8 md:p-12 lg:p-14"
        style={{
          background: `linear-gradient(160deg,
            color-mix(in srgb, var(--report-accent) 90%, hsl(var(--foreground))) 0%,
            color-mix(in srgb, var(--report-accent) 78%, hsl(var(--background))) 100%)`,
        }}
      >
        {/* Eyebrow */}
        <p className="text-[11px] md:text-xs font-semibold tracking-[0.32em] uppercase text-primary-foreground/70 mb-8">
          {t('report.body.finalSnapshot')}
        </p>

        {/* Avatar + Type Portrait header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-10">
          {avatar ? (
            <img
              src={avatar}
              alt={data.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover flex-shrink-0 border-4"
              style={{ borderColor: 'hsl(var(--primary-foreground) / 0.25)' }}
              loading="lazy"
            />
          ) : (
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-primary-foreground/60"
              style={{ background: 'hsl(var(--primary-foreground) / 0.12)' }}
            >
              {t('report.body.noPortrait')}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-primary-foreground/65 mb-2">
              {t('report.body.typePortrait')}
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-primary-foreground">
              {type} — {data.name}
            </h2>
            {data.tagline && (
              <p className="mt-3 text-sm md:text-base italic text-primary-foreground/80">
                "{data.tagline}"
              </p>
            )}
          </div>
        </div>

        {/* Closing Note */}
        <div className="mb-8">
          <p className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-primary-foreground/65 mb-3">
            {t('report.body.closingNote')}
          </p>
          <p className="text-sm md:text-base leading-relaxed text-primary-foreground/90 max-w-3xl">
            {t('report.body.closingBody', { type })}
          </p>
        </div>

        {/* Mantra card */}
        {mantra && (
          <div
            className="rounded-2xl border-2 p-6 md:p-8"
            style={{ borderColor: 'hsl(var(--primary-foreground) / 0.35)' }}
          >
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-primary-foreground/70 mb-4">
              {t('report.body.yourMantra')}
            </p>
            <p className="text-xl md:text-2xl italic font-semibold leading-relaxed text-primary-foreground text-balance">
              "{mantra}"
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-2 no-print">
          <Button
            size="lg"
            onClick={handleSavePdf}
            className="w-full sm:w-auto font-bold"
            style={{
              background: 'hsl(var(--primary-foreground))',
              color: 'hsl(var(--foreground))',
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('report.body.savePdf')}
          </Button>
          <p className="text-xs md:text-sm text-primary-foreground/70 text-center">{t('report.body.savePdfNote')}</p>
        </div>

        {/* Hidden helper data to keep variables used */}
        <span className="sr-only">{signature} {growthEdge} {bestWith} {powerMove}</span>
      </div>
    </Section>
  );
};

export default PremiumReportPage;
