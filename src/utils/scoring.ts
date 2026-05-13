export interface Scores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export const initialScores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

export interface AtScore { A: number; T: number; }
export const initialAtScore: AtScore = { A: 0, T: 0 };

const opposites: Record<string, string> = {
  E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J',
};

const atOpposite: Record<'A' | 'T', 'A' | 'T'> = { A: 'T', T: 'A' };

export function applyAnswer(scores: Scores, pole: string, weight: number): Scores {
  const next = { ...scores };
  if (weight > 0) {
    next[pole as keyof Scores] += weight;
  } else if (weight < 0) {
    next[opposites[pole] as keyof Scores] += Math.abs(weight);
  }
  return next;
}

export function applyAtAnswer(at: AtScore, pole: 'A' | 'T', weight: number): AtScore {
  const next = { ...at };
  if (weight > 0) {
    next[pole] += weight;
  } else if (weight < 0) {
    next[atOpposite[pole]] += Math.abs(weight);
  }
  return next;
}

// Signed-Likert-sum scoring: 12 items per axis × max weight 2 = 24 max |signed|.
// Percent in [50,100]: 50 = exact tie, 100 = maximum dominance. Ties default to first pole.
export const MAX_AXIS_ABS = 24;

interface AxisDef {
  dim: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  first: keyof Scores;
  second: keyof Scores;
  leftLabel: string;
  rightLabel: string;
}

const AXIS_DEFS: AxisDef[] = [
  { dim: 'E/I', first: 'E', second: 'I', leftLabel: 'Extraversion', rightLabel: 'Introversion' },
  { dim: 'S/N', first: 'S', second: 'N', leftLabel: 'Sensing',      rightLabel: 'Intuition'    },
  { dim: 'T/F', first: 'T', second: 'F', leftLabel: 'Thinking',     rightLabel: 'Feeling'      },
  { dim: 'J/P', first: 'J', second: 'P', leftLabel: 'Judging',      rightLabel: 'Perceiving'   },
];

function scoreAxis(scores: Scores, ax: AxisDef) {
  const signed = (scores[ax.first] || 0) - (scores[ax.second] || 0);
  const dominantIsFirst = signed >= 0; // tie → first pole
  const letter = dominantIsFirst ? ax.first : ax.second;
  const dominantLabel = dominantIsFirst ? ax.leftLabel : ax.rightLabel;
  const percent = Math.max(
    50,
    Math.min(100, Math.round((Math.abs(signed) / MAX_AXIS_ABS) * 50 + 50)),
  );
  return { letter, percent, dominantLabel };
}

export function calculateType(scores: Scores): string {
  return AXIS_DEFS.map(ax => scoreAxis(scores, ax).letter).join('');
}

export interface TraitPercentage {
  dim: string;
  leftLabel: string;
  rightLabel: string;
  dominantLabel: string;
  percentage: number;
}

export function calculatePercentages(scores: Scores): TraitPercentage[] {
  return AXIS_DEFS.map(ax => {
    const r = scoreAxis(scores, ax);
    return {
      dim: ax.dim,
      leftLabel: ax.leftLabel,
      rightLabel: ax.rightLabel,
      dominantLabel: r.dominantLabel,
      percentage: r.percent,
    };
  });
}

/** Signed-Likert A/T scoring. Returns letter ('A' tie default) and percent in [50,100]. */
export function calculateIdentity(at: AtScore): { letter: 'A' | 'T'; percent: number } {
  const signed = (at.A || 0) - (at.T || 0);
  const isAssertive = signed >= 0;
  const letter: 'A' | 'T' = isAssertive ? 'A' : 'T';
  const percent = Math.max(
    50,
    Math.min(100, Math.round((Math.abs(signed) / MAX_AXIS_ABS) * 50 + 50)),
  );
  return { letter, percent };
}
