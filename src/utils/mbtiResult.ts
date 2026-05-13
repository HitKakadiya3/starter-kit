// Persisted MBTI result payload — the single source of truth read by the
// premium report for dynamic gauges (social battery, stress meter, etc).
import { Scores, calculateType, calculatePercentages, calculateIdentity, AtScore, initialAtScore } from './scoring';

export const MBTI_RESULT_KEY = 'mbti.result';

export interface MbtiTrait {
  letter: string;
  /** 0-100 strength of the dominant letter for that axis. */
  percent: number;
}

export interface MbtiResult {
  code: string;
  traits: {
    EI: MbtiTrait;
    SN: MbtiTrait;
    TF: MbtiTrait;
    JP: MbtiTrait;
  };
  /** "A" = Assertive, "T" = Turbulent. */
  identity: 'A' | 'T';
  /** 0-100 score on the A/T axis; 100 = most Turbulent. */
  turbulentPercent: number;
  completedAt: string;
}

/** EI percent expressed as "% Extraverted" (higher = more extraverted). */
export function extraversionPercent(scores: Scores): number {
  const total = scores.E + scores.I;
  if (!total) return 50;
  return Math.round((scores.E / total) * 100);
}

/** Build a persistable result payload from raw quiz scores. */
export function buildResult(scores: Scores, atScore: AtScore = initialAtScore): MbtiResult {
  const code = calculateType(scores);
  const pcts = calculatePercentages(scores);

  // Always derive the letter from the 4-letter code (so SN→"N" not "Intuition"[0]="I").
  const traitFor = (dim: string, letter: string): MbtiTrait => {
    const tp = pcts.find(p => p.dim === dim)!;
    return { letter, percent: tp.percentage };
  };

  // A/T axis — signed-Likert. turbulentPercent in [0,100], 100 = most Turbulent, 50 = tie.
  const at = calculateIdentity(atScore);
  const identity: 'A' | 'T' = at.letter;
  const turbulentPercent = at.letter === 'T' ? at.percent : 100 - at.percent;

  return {
    code,
    traits: {
      EI: traitFor('E/I', code[0]),
      SN: traitFor('S/N', code[1]),
      TF: traitFor('T/F', code[2]),
      JP: traitFor('J/P', code[3]),
    },
    identity,
    turbulentPercent,
    completedAt: new Date().toISOString(),
  };
}

export function persistResult(scores: Scores, atScore: AtScore = initialAtScore): MbtiResult {
  const result = buildResult(scores, atScore);
  try {
    localStorage.setItem(MBTI_RESULT_KEY, JSON.stringify(result));
  } catch {
    // ignore (private mode / quota)
  }
  return result;
}

export function readResult(): MbtiResult | null {
  try {
    const raw = localStorage.getItem(MBTI_RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MbtiResult>;
    if (!parsed?.code || !parsed.traits) return null;
    // Backfill turbulentPercent from identity flag if missing.
    if (parsed.turbulentPercent === undefined) {
      if (parsed.identity === 'T') parsed.turbulentPercent = 70;
      else if (parsed.identity === 'A') parsed.turbulentPercent = 30;
    }
    return parsed as MbtiResult;
  } catch {
    return null;
  }
}
