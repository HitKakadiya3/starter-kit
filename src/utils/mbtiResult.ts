// Persisted MBTI result payload — the single source of truth read by the
// premium report for dynamic gauges (social battery, stress meter, etc).
import { Scores, calculateType, calculatePercentages } from './scoring';

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
export function buildResult(scores: Scores): MbtiResult {
  const code = calculateType(scores);
  const pcts = calculatePercentages(scores);

  const trait = (dim: string): MbtiTrait => {
    const tp = pcts.find(p => p.dim === dim)!;
    return { letter: tp.dominantLabel[0], percent: tp.percentage };
  };

  // The quiz does not yet measure A/T — default to a neutral Assertive.
  // Anything reading this can override with a real score later.
  const identity: 'A' | 'T' = 'A';
  const turbulentPercent = 50;

  return {
    code,
    traits: {
      EI: { letter: code[0], percent: extraversionPercent(scores) },
      SN: trait('S/N'),
      TF: trait('T/F'),
      JP: trait('J/P'),
    },
    identity,
    turbulentPercent,
    completedAt: new Date().toISOString(),
  };
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
