// Vector PDF document for the premium personality report.
// Built with @react-pdf/renderer — no DOM capture, no print dialog.
import {
  Document, Page, Text, View, StyleSheet, Image,
} from '@react-pdf/renderer';
import type { PremiumTypeData } from '@/utils/premiumTypeData';
import type { TraitPercentage } from '@/utils/scoring';

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

const makeStyles = (accent: string) => StyleSheet.create({
  page:    { paddingTop: 36, paddingBottom: 48, paddingHorizontal: 40, fontSize: 10, color: '#1f2937', lineHeight: 1.5 },
  eyebrow: { fontSize: 8, color: accent, letterSpacing: 1.4, marginBottom: 4, textTransform: 'uppercase' },
  // Hero title — extra lineHeight + bottom margin to prevent collision with subtitle.
  h1:      { fontSize: 26, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 10 },
  h2:      { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 },
  h3:      { fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 },
  small:   { fontSize: 9, color: '#6b7280' },
  p:       { fontSize: 10, color: '#374151', marginBottom: 6, lineHeight: 1.55 },
  hero:    { backgroundColor: accent, borderRadius: 14, padding: 24, color: 'white', marginBottom: 18 },
  heroEyebrow: { fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: 1.4, marginBottom: 6, textTransform: 'uppercase' },
  heroBadge:{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.22)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999, fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: 3, marginBottom: 8 },
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

const PageFooter = ({ s }: { s: ReturnType<typeof makeStyles> }) => (
  <>
    <Text style={s.footer} fixed>16 Types Test — Personality Report</Text>
    <Text style={s.pageNum} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
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

export interface ReportPdfProps {
  data: PremiumTypeData;
  type: string;
  traitPercentages: TraitPercentage[];
  avatarDataUrl?: string | null;
  /** A/T axis result, 0–100, 100 = most Turbulent. Optional. */
  turbulentPercent?: number;
  /** Per-type stress baseline used to blend the marker. Optional. */
  stressBaseline?: number;
}

export const ReportPdf = ({
  data, type, traitPercentages, avatarDataUrl,
  turbulentPercent, stressBaseline = 50,
}: ReportPdfProps) => {
  const accent = hslToHex(data.accentColor);
  const s = makeStyles(accent);

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
      {/* ===== Page 1 — Hero + Type Portrait ===== */}
      <Page size="A4" style={s.page}>
        <View style={s.hero}>
          <Text style={s.heroEyebrow}>Section 01 · Overview</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroBadge}>{type}</Text>
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

        <Text style={s.eyebrow}>Section 02</Text>
        <Text style={s.h2}>Type Portrait</Text>
        {data.introduction.slice(0, 3).map((p, i) => <Text key={i} style={s.p}>{p}</Text>)}

        <View style={s.quote}>
          <Text style={s.quoteTxt}>"{data.famousQuote.text}"</Text>
          <Text style={s.small}>— {data.famousQuote.person}</Text>
        </View>

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 2 — Portrait continued + Cognitive Functions ===== */}
      <Page size="A4" style={s.page}>
        {data.introduction.length > 3 && (
          <>
            <Text style={s.eyebrow}>Section 02 (continued)</Text>
            {data.introduction.slice(3).map((p, i) => <Text key={i} style={s.p}>{p}</Text>)}
            <View style={s.divider} />
          </>
        )}

        <Text style={s.eyebrow}>Section 03</Text>
        <Text style={s.h2}>How Your Mind Works</Text>
        <Text style={s.p}>Your four cognitive functions, ranked from dominant to inferior.</Text>

        {([
          ['Dominant', data.cognitiveFunctions.dominant, 100],
          ['Auxiliary', data.cognitiveFunctions.auxiliary, 80],
          ['Tertiary', data.cognitiveFunctions.tertiary, 55],
          ['Inferior', data.cognitiveFunctions.inferior, 35],
        ] as const).map(([rank, fn, pct]) => (
          // No wrap={false} — let cards reflow if needed instead of clipping.
          <View key={rank} style={s.card}>
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

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 3 — Strengths & Weaknesses ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 04</Text>
        <Text style={s.h2}>Strengths & Weaknesses</Text>

        <Text style={[s.h3, { marginTop: 6 }]}>Your Strengths</Text>
        {data.strengths.map(st => (
          <View key={st.title} style={s.card}>
            <Text style={s.h3}>{st.title}</Text>
            <Text style={s.cardBody}>{st.description}</Text>
          </View>
        ))}

        <Text style={[s.h3, { marginTop: 10 }]}>Your Weaknesses</Text>
        {data.weaknesses.map(w => (
          <View key={w.title} style={s.card}>
            <Text style={s.h3}>{w.title}</Text>
            <Text style={s.cardBody}>{w.description}</Text>
          </View>
        ))}

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 4 — Under Pressure ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 05</Text>
        <Text style={s.h2}>Under Pressure</Text>
        <Text style={s.p}>How stress shows up for you and how to recover.</Text>

        {/* Social Battery */}
        <View style={[s.tintCard, { backgroundColor: tint(accent, 12) }]}>
          <Text style={s.h3}>Social Battery</Text>
          <View style={s.gauge}>
            <View style={[s.gaugeFill, { width: `${data.socialBattery}%`, backgroundColor: accent }]} />
          </View>
          <Text style={s.small}>{data.socialBattery}% — your typical capacity for social engagement</Text>
        </View>

        {/* Stress Tolerance — uses A/T blend (turbulentPercent + per-type baseline). */}
        <View style={[s.tintCard, { backgroundColor: tint(accent, 12) }]}>
          <Text style={s.h3}>Stress Tolerance</Text>
          <View style={s.stressTrack}>
            <View style={[s.stressSeg, { backgroundColor: '#4ade80' }]} />
            <View style={[s.stressSeg, { backgroundColor: '#fbbf24' }]} />
            <View style={[s.stressSeg, { backgroundColor: '#ef4444' }]} />
            <View style={[s.stressMarker, { left: `${stressMarker}%`, marginLeft: -10 }]} />
          </View>
          <Text style={s.small}>
            {turbulentPercent !== undefined
              ? `${identity}  ·  you: ${turbulentPercent}% turbulent  ·  type baseline: ${stressBaseline}%`
              : `Calm  ·  Overwhelmed  ·  baseline ${stressBaseline}%`}
          </Text>
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.h3}>Stress Triggers</Text>
            <Bullets items={data.stressTriggers} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>Warning Signs</Text>
            <Bullets items={data.stressSigns} s={s} />
          </View>
        </View>

        <Text style={[s.h3, { marginTop: 10 }]}>Recovery Strategies</Text>
        <Bullets items={data.recoveryStrategies} s={s} />

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 5 — Relationships & Friendships ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 06</Text>
        <Text style={s.h2}>Relationships & Love</Text>
        <Text style={s.p}>{data.relationships.narrative}</Text>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.h3}>What You Offer</Text>
            <Bullets items={data.relationships.offers} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>What You Need</Text>
            <Bullets items={data.relationships.needs} s={s} />
          </View>
        </View>

        <Text style={[s.h3, { marginTop: 8 }]}>Common Challenges</Text>
        <Bullets items={data.relationships.challenges} s={s} />

        <Text style={[s.h3, { marginTop: 8 }]}>Compatible Types</Text>
        {data.relationships.compatibleWith.map(c => (
          <View key={c.type} style={s.card}>
            <Text style={s.h3}>{c.type}</Text>
            <Text style={s.cardBody}>{c.reason}</Text>
          </View>
        ))}

        <View style={s.divider} />

        <View>
          <Text style={s.eyebrow}>Section 07</Text>
          <Text style={s.h2}>Friendships</Text>
          <Text style={s.p}>{data.friendships.narrative}</Text>

          <Text style={s.h3}>What Friends Love About You</Text>
          <Bullets items={data.friendships.positives} s={s} />
          <Text style={[s.h3, { marginTop: 6 }]}>Watch-Outs</Text>
          <Bullets items={data.friendships.watchOuts} s={s} />
        </View>

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 6 — Career ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 08</Text>
        <Text style={s.h2}>Career Paths</Text>
        <Text style={s.p}>{data.career.narrative}</Text>

        <Text style={[s.h3, { marginTop: 6 }]}>Best-Fit Careers</Text>
        <View style={s.pillRow}>
          {data.career.bestCareers.map(c => (
            <Text key={c.label} style={s.pill}>{c.label}</Text>
          ))}
        </View>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.h3}>Leadership Style</Text>
            <Bullets items={data.career.leadershipStyle} s={s} />
          </View>
          <View style={s.col}>
            <Text style={s.h3}>As a Teammate</Text>
            <Bullets items={data.career.asTeammate} s={s} />
          </View>
        </View>

        <Text style={[s.h3, { marginTop: 8 }]}>Careers to Approach with Caution</Text>
        <Bullets items={data.career.cautionCareers} s={s} />

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 7 — Growth Roadmap + Famous People ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 09</Text>
        <Text style={s.h2}>Growth Roadmap</Text>
        <Text style={s.p}>How your type matures and grows across life stages.</Text>

        {data.growthRoadmap.map(g => (
          <View key={g.phase} style={s.card}>
            <Text style={s.h3}>{g.phase}</Text>
            <Text style={s.cardBody}>{g.description}</Text>
          </View>
        ))}

        <View style={[s.tintCard, { backgroundColor: tint(accent, 14), marginTop: 8 }]}>
          <Text style={s.h3}>Top 3 Growth Challenges</Text>
          <Bullets items={data.topGrowthChallenges} s={s} />
        </View>

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 8 — Famous People ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 10</Text>
        <Text style={s.h2}>Famous People Like You</Text>
        <Text style={s.p}>Real and fictional figures who share your type.</Text>

        {data.famousPeople.map(p => (
          <View key={p.name} style={s.card}>
            <Text style={s.h3}>{p.name} <Text style={s.small}>— {p.role}</Text></Text>
            <Text style={s.cardBody}>{p.reason}</Text>
          </View>
        ))}

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 9 — Type Comparisons + Affirmations ===== */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Section 11</Text>
        <Text style={s.h2}>Type Comparisons</Text>
        <Text style={s.p}>How you differ from your closest neighbours.</Text>

        {data.typeComparisons.map(c => (
          <View key={c.vsType} style={s.card}>
            <Text style={s.h3}>{type} vs {c.vsType}</Text>
            <Text style={[s.eyebrow, { marginTop: 4 }]}>Shared Traits</Text>
            <Bullets items={c.sharedTraits} s={s} />
            <Text style={s.eyebrow}>Key Differences</Text>
            <Bullets items={c.keyDifferences} s={s} />
            <Text style={[s.cardBody, { fontStyle: 'italic', marginTop: 4 }]}>
              You might be {c.vsType}: {c.youMightBeThis}
            </Text>
          </View>
        ))}

        <View style={s.divider} />

        <Text style={s.eyebrow}>Section 12</Text>
        <Text style={s.h2}>Your Affirmations</Text>
        {data.affirmations.map((a, i) => (
          <View key={i} style={[s.tintCard, { backgroundColor: tint(accent, 12) }]}>
            <Text style={[s.quoteTxt, { color: accent }]}>"{a}"</Text>
          </View>
        ))}

        <PageFooter s={s} />
      </Page>

      {/* ===== Page 10 — Final Snapshot (closing card) ===== */}
      <Page size="A4" style={[s.page, { backgroundColor: shade(accent, 25), color: 'white' }]}>
        <Text style={[s.heroEyebrow, { marginBottom: 18 }]}>Final Snapshot</Text>

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
              TYPE PORTRAIT
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
          CLOSING NOTE
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
              YOUR MANTRA
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
          16 Types Test — Personality Report
        </Text>
        <Text
          style={{ position: 'absolute', bottom: 20, right: 40, fontSize: 8, color: 'rgba(255,255,255,0.6)' }}
          fixed
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  );
};
