// Vector PDF document for the premium personality report.
// Built with @react-pdf/renderer — no DOM capture, no print dialog.
import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from '@react-pdf/renderer';
import i18n from '@/i18n';
import type { PremiumTypeData } from '@/utils/premiumTypeData';
import type { TraitPercentage } from '@/utils/scoring';

// react-pdf's default Latin hyphenation breaks CJK text (it tries to hyphen-
// break inside multi-byte runs, which produces visible artefacts). Replacing
// the callback with a no-op keeps every word atomic — safe for Latin too.
Font.registerHyphenationCallback((word) => [word]);

// Lazily register Noto Sans JP — a free font with full Japanese (CJK) glyph
// coverage. We only register it when a Japanese report is actually generated
// so English PDFs don't pay the ~3-5 MB font download. The TTFs are sourced
// from the @expo-google-fonts/noto-sans-jp npm package via jsDelivr — TTF is
// required (react-pdf does not support WOFF/WOFF2).
const JP_FONT_FAMILY = 'NotoSansJP';
const JP_REGULAR_URL = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-jp/NotoSansJP_400Regular.ttf';
const JP_BOLD_URL    = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-jp/NotoSansJP_700Bold.ttf';
let jpFontRegistered = false;
function ensureJapaneseFont() {
  if (jpFontRegistered) return;
  // Noto Sans JP — and CJK fonts generally — ship no italic cut. The PDF
  // styles use `fontStyle: 'italic'` in several places (hero quote, mantra,
  // type-comparison "you might be" line); without an italic slot react-pdf's
  // resolver throws "Could not resolve font for NotoSansJP, fontStyle italic".
  // Map italic to the upright TTF so text renders (visually upright, which
  // matches Japanese typographic convention — italics are not used in CJK).
  Font.register({
    family: JP_FONT_FAMILY,
    fonts: [
      { src: JP_REGULAR_URL, fontWeight: 400 },
      { src: JP_REGULAR_URL, fontWeight: 400, fontStyle: 'italic' },
      { src: JP_BOLD_URL,    fontWeight: 700 },
      { src: JP_BOLD_URL,    fontWeight: 700, fontStyle: 'italic' },
    ],
  });
  jpFontRegistered = true;
}

// Convert an HSL string like "hsl(40 75% 45%)" or "hsl(40, 75%, 45%)" to "#rrggbb"
function hslToHex(hsl: string): string {
  const m = hsl.match(/hsla?\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i);
  if (!m) return hsl;
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const to = (v: number) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

// Mix accent (hex) with white by `pct` (0-100)
function tint(hex: string, pct: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * (1 - pct / 100));
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

// Darken hex by mixing toward black for the snapshot background.
function shade(hex: string, pct: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c * (1 - pct / 100));
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

const makeStyles = (accent: string, fontFamily?: string) => StyleSheet.create({
  page:    { paddingTop: 36, paddingBottom: 48, paddingHorizontal: 40, fontSize: 10, color: '#1f2937', lineHeight: 1.5, ...(fontFamily ? { fontFamily } : {}) },
  eyebrow: { fontSize: 8, color: accent, letterSpacing: 1.4, marginBottom: 6, textTransform: 'uppercase' },
  // Hero title — extra lineHeight + bottom margin to prevent collision with subtitle.
  h1:      { fontSize: 26, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 10 },
  // Loosen the gap below section titles so the description doesn't kiss the heading.
  h2:      { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 10 },
  h3:      { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 },
  small:   { fontSize: 9, color: '#6b7280' },
  p:       { fontSize: 10, color: '#374151', marginBottom: 6, lineHeight: 1.55 },
  // Block wrapper for a section header (eyebrow + h2 + optional intro p). Used
  // with wrap={false} so the heading never orphans at the bottom of a page.
  section:    { marginTop: 16 },
  sectionFirst: { marginTop: 4 },
  hero:    { backgroundColor: accent, borderRadius: 14, padding: 24, color: 'white', marginBottom: 18 },
  heroEyebrow: { fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.4, marginBottom: 6, textTransform: 'uppercase' },
  // The pill is a View wrapper, not a Text, because `alignSelf: 'flex-start'`
  // on a Text element does not consistently shrink-to-fit under Noto Sans JP
  // (the badge ends up filling the column). A View sizes to its child
  // reliably across both fonts.
  heroBadgeBox:{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.22)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999, marginBottom: 8 },
  // The MBTI code ("ENTP") is always Latin, so we pin the badge to Helvetica
  // even when the page font is Noto Sans JP — Noto's Latin glyphs are much
  // wider, which made the pill look loose and stretched the letters apart in
  // Japanese reports. Helvetica is built into react-pdf so no registration is
  // needed.
  heroBadgeText:{ fontFamily: 'Helvetica', fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: 3 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2, marginBottom: 6, lineHeight: 1.4 },
  heroQuote:{ color: 'white', fontStyle: 'italic', fontSize: 12, marginTop: 8, lineHeight: 1.5 },
  // Axis row: shows both poles flanking the bar.
  axisRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  axisLabelL: { width: 88, fontSize: 8, color: 'rgba(255,255,255,0.55)', textAlign: 'right', paddingRight: 6 },
  axisLabelR: { width: 88, fontSize: 8, color: 'rgba(255,255,255,0.55)', paddingLeft: 6 },
  axisLabelActive: { color: 'white', fontWeight: 700 },
  axisTrack:{ flexGrow: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3 },
  axisFill: { height: '100%', backgroundColor: 'white', borderRadius: 3 },
  axisPct:  { width: 38, textAlign: 'right', fontSize: 8, color: 'white', fontWeight: 700 },
  // Cards — NO fixed/min/max height, NO overflow:hidden. Let flex grow.
  card:    { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 8, backgroundColor: 'white' },
  tintCard:{ borderRadius: 10, padding: 12, marginBottom: 8 },
  twoCol:  { flexDirection: 'row', gap: 10 },
  col:     { flex: 1 },
  bullet:  { flexDirection: 'row', marginBottom: 3 },
  bulletDot:{ width: 8, fontSize: 10, color: accent, lineHeight: 1.5 },
  bulletTxt:{ flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.55 },
  cardBody: { fontSize: 10, color: '#374151', lineHeight: 1.55, marginTop: 2 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  pill:    { fontSize: 8, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, backgroundColor: tint(accent, 18), color: accent },
  quote:   { borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 12, paddingVertical: 6, marginVertical: 8 },
  quoteTxt:{ fontStyle: 'italic', fontSize: 11, color: '#1f2937', marginBottom: 4, lineHeight: 1.5 },
  pageNum: { position: 'absolute', bottom: 20, right: 40, fontSize: 8, color: '#9ca3af' },
  footer:  { position: 'absolute', bottom: 20, left: 40, fontSize: 8, color: '#9ca3af' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },
  fnHeader:{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  // Circular cognitive function badge.
  fnAbbr:  { width: 36, height: 36, borderRadius: 18, color: 'white', fontSize: 12, fontWeight: 700, textAlign: 'center', paddingTop: 10, marginRight: 10 },
  // Plain coloured gauge used for Social Battery & Stress Tolerance.
  gauge:   { height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, marginVertical: 6, position: 'relative' },
  gaugeFill:{ height: '100%', borderRadius: 4 },
  // Gradient-style stress track built from three coloured segments.
  // No overflow:hidden — otherwise the round marker gets clipped to a thin
  // sliver and reads as "( )" on the page.
  stressTrack: { flexDirection: 'row', height: 10, borderRadius: 5, marginVertical: 8, position: 'relative' },
  stressSeg:   { flex: 1, height: '100%' },
  stressMarker:{ position: 'absolute', top: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: 'white', borderWidth: 2, borderColor: '#111827' },
});

const Bullets = ({ items, s }: { items: string[]; s: ReturnType<typeof makeStyles> }) => (
  <View>
    {items.map((b, i) => (
      <View key={i} style={s.bullet}>
        <Text style={s.bulletDot}>•</Text>
        <Text style={s.bulletTxt}>{b}</Text>
      </View>
    ))}
  </View>
);

const PageFooter = ({ s, brand }: { s: ReturnType<typeof makeStyles>; brand: string }) => (
  <>
    <Text style={s.footer} fixed>{brand}</Text>
    <Text style={s.pageNum} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </>
);

// Pole labels per dimension for the hero axis bars.
// Keys cover both compact ("EI") and slashed ("E/I") dim formats so the
// labels render regardless of which scoring shape the caller passes in.
const AXIS_POLES: Record<string, [string, string]> = {
  EI: ['Extraversion', 'Introversion'],
  SN: ['Sensing',      'Intuition'],
  TF: ['Thinking',     'Feeling'],
  JP: ['Judging',      'Perceiving'],
  'E/I': ['Extraversion', 'Introversion'],
  'S/N': ['Sensing',      'Intuition'],
  'T/F': ['Thinking',     'Feeling'],
  'J/P': ['Judging',      'Perceiving'],
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Section 10 ring/initials palette — kept in lockstep with the on-screen
// `colors` array in PremiumReportPage so the PDF and web pick the same hue
// for each famous-person card index.
const FAMOUS_RING_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

export interface ReportPdfProps {
  data: PremiumTypeData;
  type: string;
  traitPercentages: TraitPercentage[];
  avatarDataUrl?: string | null;
  /** Map of famous-person name -> data URL for their avatar PNG. Pre-fetched
   *  by the caller so react-pdf can embed images without a network round-trip
   *  during render. Names with no entry fall back to coloured initials. */
  famousAvatars?: Record<string, string>;
  /** A/T axis result, 0–100, 100 = most Turbulent. Optional. */
  turbulentPercent?: number;
  /** Per-type stress baseline used to blend the marker. Optional. */
  stressBaseline?: number;
  /** Active UI locale — drives CJK font registration for Japanese reports. */
  locale?: 'en' | 'ja';
}

export const ReportPdf = ({
  data, type, traitPercentages, avatarDataUrl, famousAvatars,
  turbulentPercent, stressBaseline = 50, locale = 'en',
}: ReportPdfProps) => {
  // Helvetica (the react-pdf default) has no CJK glyphs, so Japanese text
  // renders as mojibake. Register Noto Sans JP on demand and apply it as the
  // page-level font for the Japanese locale; other locales keep the default.
  if (locale === 'ja') ensureJapaneseFont();
  const pageFontFamily = locale === 'ja' ? JP_FONT_FAMILY : undefined;
  const accent = hslToHex(data.accentColor);
  const s = makeStyles(accent, pageFontFamily);

  // Resolve translations against the i18n singleton with an explicit `lng`
  // override — safer than relying on `useTranslation()` here because the PDF
  // is rendered via `pdf(<ReportPdf/>)`, which lives outside the page's React
  // context tree.
  const tr = (key: string, opts?: Record<string, unknown>): string =>
    i18n.t(key, { lng: locale, ...(opts ?? {}) }) as string;
  const sectionLabel = tr('report.body.section');
  const brandLine = `${tr('brand.name')} — ${tr('report.sections.summary')}`;

  // Stress marker position — same blend the on-screen Stress Tolerance card uses.
  const stressMarker = clamp(
    Math.round(
      turbulentPercent !== undefined
        ? 0.4 * stressBaseline + 0.6 * turbulentPercent
        : stressBaseline
    ),
    2,
    98,
  );
  const identity = turbulentPercent !== undefined && turbulentPercent >= 50 ? 'Turbulent' : 'Assertive';

  const mantra = data.affirmations[0] ?? '';
  // No dedicated "closingNote" field exists — synthesize from the last
  // introduction paragraph (the most reflective one) for the snapshot page.
  const closingNote =
    data.introduction[data.introduction.length - 1] ?? data.tagline;

  return (
    <Document title={`${type} Personality Report`} author="16 Types Test">
      {/* ===== Single flowing content page =====
          All sections live on one <Page>; react-pdf paginates automatically as
          content overflows. This avoids the "every section starts on a fresh
          page" whitespace problem. Each card and each section-header block
          uses wrap={false} so boxes don't split mid-content and headings don't
          orphan at the foot of a page. */}
      <Page size="A4" style={s.page}>
        {/* Hero — keep as one unbreakable block. */}
        <View style={s.hero} wrap={false}>
          <Text style={s.heroEyebrow}>{`${sectionLabel} 01 · ${tr('report.sections.overview')}`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={s.heroBadgeBox}>
                <Text style={s.heroBadgeText}>{type}</Text>
              </View>
              <Text style={s.h1}>{data.name}</Text>
              <Text style={s.heroSub}>{data.traits.join('  ·  ')}</Text>
              <Text style={s.heroQuote}>"{data.tagline}"</Text>
            </View>
            {avatarDataUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={avatarDataUrl} style={{ width: 90, height: 90, borderRadius: 12, marginLeft: 12 }} />
            )}
          </View>

          <View style={{ marginTop: 14 }}>
            {traitPercentages.map(tp => {
              const poles = AXIS_POLES[tp.dim] ?? ['', ''];
              // tp.dominantLabel is one of the two pole names; figure out which side.
              const dominantIsRight = tp.dominantLabel === poles[1];
              // Bar fills from the left toward the dominant pole.
              const fillPct = dominantIsRight ? tp.percentage : 100 - tp.percentage;
              return (
                <View key={tp.dim} style={s.axisRow}>
                  <Text style={[s.axisLabelL, !dominantIsRight && s.axisLabelActive]}>
                    {poles[0]}
                  </Text>
                  <View style={s.axisTrack}>
                    <View style={[s.axisFill, { width: `${fillPct}%` }]} />
                  </View>
                  <Text style={[s.axisLabelR, dominantIsRight && s.axisLabelActive]}>
                    {poles[1]}
                  </Text>
                  <Text style={s.axisPct}>{tp.percentage}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ===== Section 02 — Type Portrait ===== */}
        <View style={s.sectionFirst} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 02`}</Text>
          <Text style={s.h2}>{tr('report.sections.portrait')}</Text>
          {data.introduction.slice(0, 1).map((p, i) => <Text key={i} style={s.p}>{p}</Text>)}
        </View>
        {data.introduction.slice(1).map((p, i) => <Text key={i} style={s.p}>{p}</Text>)}

        <View style={s.quote} wrap={false}>
          <Text style={s.quoteTxt}>"{data.famousQuote.text}"</Text>
          <Text style={s.small}>— {data.famousQuote.person}</Text>
        </View>

        {/* ===== Section 03 — Cognitive Functions ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 03`}</Text>
          <Text style={s.h2}>{tr('report.sections.cognitive')}</Text>
          <Text style={s.p}>{tr('report.body.cognitiveSubtitle')}</Text>
        </View>

        {([
          [tr('report.body.fnDominantRank'),  data.cognitiveFunctions.dominant,  100],
          [tr('report.body.fnAuxiliaryRank'), data.cognitiveFunctions.auxiliary,  80],
          [tr('report.body.fnTertiaryRank'),  data.cognitiveFunctions.tertiary,   55],
          [tr('report.body.fnInferiorRank'),  data.cognitiveFunctions.inferior,   35],
        ] as const).map(([rank, fn, pct]) => (
          <View key={rank} style={s.card} wrap={false}>
            <View style={s.fnHeader}>
              <Text style={[s.fnAbbr, { backgroundColor: tint(accent, pct) }]}>{fn.abbr}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.eyebrow, { marginBottom: 1 }]}>{rank}</Text>
                <Text style={s.h3}>{fn.name}</Text>
              </View>
            </View>
            <Text style={s.cardBody}>{fn.description}</Text>
          </View>
        ))}

        {/* ===== Section 04 — Strengths & Weaknesses ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 04`}</Text>
          <Text style={s.h2}>{tr('report.body.strengthsTitle')}</Text>
          <Text style={[s.h3, { marginTop: 6 }]}>{tr('report.body.yourStrengths')}</Text>
        </View>
        {data.strengths.map(st => (
          <View key={st.title} style={s.card} wrap={false}>
            <Text style={s.h3}>{st.title}</Text>
            <Text style={s.cardBody}>{st.description}</Text>
          </View>
        ))}

        <Text style={[s.h3, { marginTop: 10 }]}>{tr('report.body.yourBlindSpots')}</Text>
        {data.weaknesses.map(w => (
          <View key={w.title} style={s.card} wrap={false}>
            <Text style={s.h3}>{w.title}</Text>
            <Text style={s.cardBody}>{w.description}</Text>
          </View>
        ))}

        {/* ===== Section 05 — Under Pressure ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 05`}</Text>
          <Text style={s.h2}>{tr('report.body.stressTitle')}</Text>
          <Text style={s.p}>{tr('report.body.stressSubtitle')}</Text>
        </View>

        {/* Social Battery */}
        <View style={[s.tintCard, { backgroundColor: tint(accent, 12) }]} wrap={false}>
          <Text style={s.h3}>{tr('report.body.socialBattery')}</Text>
          <View style={s.gauge}>
            <View style={[s.gaugeFill, { width: `${data.socialBattery}%`, backgroundColor: accent }]} />
          </View>
          <Text style={s.small}>{data.socialBattery}%</Text>
        </View>

        {/* Stress Tolerance — uses A/T blend (turbulentPercent + per-type baseline). */}
        <View style={[s.tintCard, { backgroundColor: tint(accent, 12) }]} wrap={false}>
          <Text style={s.h3}>{tr('report.body.stressTolerance')}</Text>
          <View style={s.stressTrack}>
            <View style={[s.stressSeg, { backgroundColor: '#4ade80' }]} />
            <View style={[s.stressSeg, { backgroundColor: '#fbbf24' }]} />
            <View style={[s.stressSeg, { backgroundColor: '#ef4444' }]} />
            <View style={[s.stressMarker, { left: `${stressMarker}%`, marginLeft: -10 }]} />
          </View>
          <Text style={s.small}>
            {turbulentPercent !== undefined
              ? `${identity}  ·  ${turbulentPercent}%`
              : tr('report.body.calmOverwhelmed')}
          </Text>
        </View>

        <View style={s.twoCol} wrap={false}>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.triggers')}</Text>
            <Bullets items={data.stressTriggers} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.signsOfStress')}</Text>
            <Bullets items={data.stressSigns} s={s} />
          </View>
        </View>

        <View wrap={false} style={{ marginTop: 10 }}>
          <Text style={s.h3}>{tr('report.body.recovery')}</Text>
          <Bullets items={data.recoveryStrategies} s={s} />
        </View>

        {/* ===== Section 06 — Relationships ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 06`}</Text>
          <Text style={s.h2}>{tr('report.body.relationshipsTitle')}</Text>
          <Text style={s.p}>{data.relationships.narrative}</Text>
        </View>

        <View style={s.twoCol} wrap={false}>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.whatYouOffer')}</Text>
            <Bullets items={data.relationships.offers} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.whatYouNeed')}</Text>
            <Bullets items={data.relationships.needs} s={s} />
          </View>
        </View>

        <View wrap={false} style={{ marginTop: 8 }}>
          <Text style={s.h3}>{tr('report.body.commonChallenges')}</Text>
          <Bullets items={data.relationships.challenges} s={s} />
        </View>

        <Text style={[s.h3, { marginTop: 8 }]}>{tr('report.body.compatibleTypes')}</Text>
        {data.relationships.compatibleWith.map(c => (
          <View key={c.type} style={s.card} wrap={false}>
            <Text style={s.h3}>{c.type}</Text>
            <Text style={s.cardBody}>{c.reason}</Text>
          </View>
        ))}

        {/* ===== Section 07 — Friendships ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 07`}</Text>
          <Text style={s.h2}>{tr('report.sections.friendships')}</Text>
          <Text style={s.p}>{data.friendships.narrative}</Text>
        </View>

        <View wrap={false}>
          <Text style={s.h3}>{tr('report.body.friendWho')}</Text>
          <Bullets items={data.friendships.positives} s={s} />
        </View>
        <View wrap={false} style={{ marginTop: 6 }}>
          <Text style={s.h3}>{tr('report.body.watchOutFor')}</Text>
          <Bullets items={data.friendships.watchOuts} s={s} />
        </View>

        {/* ===== Section 08 — Career ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 08`}</Text>
          <Text style={s.h2}>{tr('report.body.careerTitle')}</Text>
          <Text style={s.p}>{data.career.narrative}</Text>
        </View>

        <View wrap={false}>
          <Text style={[s.h3, { marginTop: 6 }]}>{tr('report.body.bestFitCareers')}</Text>
          <View style={s.pillRow}>
            {data.career.bestCareers.map(c => (
              <Text key={c.label} style={s.pill}>{c.label}</Text>
            ))}
          </View>
        </View>

        <View style={s.twoCol} wrap={false}>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.leadershipStyle')}</Text>
            <Bullets items={data.career.leadershipStyle} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>{tr('report.body.asTeammate')}</Text>
            <Bullets items={data.career.asTeammate} s={s} />
          </View>
        </View>

        <View wrap={false} style={{ marginTop: 8 }}>
          <Text style={s.h3}>{tr('report.body.approachWithCaution')}</Text>
          <Bullets items={data.career.cautionCareers} s={s} />
        </View>

        {/* ===== Section 09 — Growth Roadmap ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 09`}</Text>
          <Text style={s.h2}>{tr('report.body.growthTitle')}</Text>
          <Text style={s.p}>{tr('report.body.growthSubtitle')}</Text>
        </View>

        {data.growthRoadmap.map(g => (
          <View key={g.phase} style={s.card} wrap={false}>
            <Text style={s.h3}>{g.phase}</Text>
            <Text style={s.cardBody}>{g.description}</Text>
          </View>
        ))}

        <View style={[s.tintCard, { backgroundColor: tint(accent, 14), marginTop: 8 }]} wrap={false}>
          <Text style={s.h3}>{tr('report.body.topGrowthChallenges')}</Text>
          <Bullets items={data.topGrowthChallenges} s={s} />
        </View>

        {/* ===== Section 10 — Famous People ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 10`}</Text>
          <Text style={s.h2}>{tr('report.body.famousTitle')}</Text>
          <Text style={s.p}>{tr('report.body.famousSubtitle', { type: data.code })}</Text>
        </View>

        {/* 3-column grid of avatar cards mirroring the web UI. Numeric widths +
            gap so the layout fits exactly inside the 515pt content area
            (3*165 + 2*7.5 = 510). */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7.5 }}>
          {data.famousPeople.map((p, i) => {
            const ringColor = FAMOUS_RING_COLORS[i % FAMOUS_RING_COLORS.length];
            const avatarSrc = famousAvatars?.[p.name];
            const initials = p.name.split(' ').map(n => n[0]).slice(0, 2).join('');
            return (
              <View
                key={p.name}
                style={[s.card, { width: 165, marginBottom: 7.5 }]}
                wrap={false}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  {avatarSrc ? (
                    // Outer View provides the 2pt coloured ring; Image fills
                    // the inner area with matching radius so its edge sits
                    // flush against the ring (inner radius = outer - border).
                    <View
                      style={{
                        width: 36, height: 36, borderRadius: 18,
                        borderWidth: 2, borderColor: ringColor,
                        marginRight: 8,
                      }}
                    >
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image src={avatarSrc} style={{ width: 32, height: 32, borderRadius: 16 }} />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 36, height: 36, borderRadius: 18,
                        backgroundColor: ringColor,
                        alignItems: 'center', justifyContent: 'center',
                        marginRight: 8,
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{initials}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: 700, color: '#111827', lineHeight: 1.25 }}>
                      {p.name}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 1 }}>{p.role}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.5 }}>{p.reason}</Text>
              </View>
            );
          })}
        </View>

        {/* ===== Section 11 — Type Comparisons ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 11`}</Text>
          <Text style={s.h2}>{tr('report.body.section11Title')}</Text>
          <Text style={s.p}>{tr('report.body.section11Subtitle')}</Text>
        </View>

        {data.typeComparisons.map(c => (
          <View key={c.vsType} style={s.card} wrap={false}>
            <Text style={s.h3}>{type} {tr('report.body.vs')} {c.vsType}</Text>
            <Text style={[s.eyebrow, { marginTop: 4 }]}>{tr('report.body.sharedTraits')}</Text>
            <Bullets items={c.sharedTraits} s={s} />
            <Text style={s.eyebrow}>{tr('report.body.keyDifferences')}</Text>
            <Bullets items={c.keyDifferences} s={s} />
            <Text style={[s.cardBody, { fontStyle: 'italic', marginTop: 4 }]}>
              {tr('report.body.youMightBe', { type: c.vsType })} {c.youMightBeThis}
            </Text>
          </View>
        ))}

        {/* ===== Section 12 — Affirmations ===== */}
        <View style={s.section} wrap={false}>
          <Text style={s.eyebrow}>{`${sectionLabel} 12`}</Text>
          <Text style={s.h2}>{tr('report.sections.summary')}</Text>
        </View>
        {data.affirmations.map((a, i) => (
          <View key={i} style={[s.tintCard, { backgroundColor: tint(accent, 12) }]} wrap={false}>
            <Text style={[s.quoteTxt, { color: accent }]}>"{a}"</Text>
          </View>
        ))}

        <PageFooter s={s} brand={brandLine} />
      </Page>

      {/* ===== Page 10 — Final Snapshot (closing card) ===== */}
      <Page size="A4" style={[s.page, { backgroundColor: shade(accent, 25), color: 'white' }]}>
        <Text style={[s.heroEyebrow, { marginBottom: 18 }]}>{tr('report.body.finalSnapshot')}</Text>

        <View style={{ flexDirection: 'row', gap: 18, marginBottom: 24, alignItems: 'center' }}>
          {avatarDataUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src={avatarDataUrl}
              style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)' }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, letterSpacing: 2, marginBottom: 6 }}>
              {tr('report.body.typePortrait')}
            </Text>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 700, lineHeight: 1.15, marginBottom: 4 }}>
              {type} — {data.name}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{data.tagline}"
            </Text>
          </View>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 2, marginTop: 12, marginBottom: 8 }}>
          {tr('report.body.closingNote')}
        </Text>
        <Text style={{ color: 'white', fontSize: 11, lineHeight: 1.65 }}>
          {closingNote}
        </Text>

        {mantra && (
          <View style={{
            marginTop: 28,
            padding: 22,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, letterSpacing: 2, marginBottom: 8 }}>
              {tr('report.body.yourMantra')}
            </Text>
            <Text style={{ color: 'white', fontSize: 18, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{mantra}"
            </Text>
          </View>
        )}

        <Text
          style={{ position: 'absolute', bottom: 20, left: 40, fontSize: 8, color: 'rgba(255,255,255,0.6)' }}
          fixed
        >
          {brandLine}
        </Text>
        <Text
          style={{ position: 'absolute', bottom: 20, right: 40, fontSize: 8, color: 'rgba(255,255,255,0.6)' }}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
};
