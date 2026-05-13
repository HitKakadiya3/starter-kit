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

const opposites: Record<string, string> = {
  E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J',
};

export function applyAnswer(scores: Scores, pole: string, weight: number): Scores {
  const next = { ...scores };
  if (weight > 0) {
    next[pole as keyof Scores] += weight;
  } else if (weight < 0) {
    next[opposites[pole] as keyof Scores] += Math.abs(weight);
  }
  return next;
}

export function calculateType(scores: Scores): string {
  const e_i = scores.E >= scores.I ? 'E' : 'I';
  const s_n = scores.S >= scores.N ? 'S' : 'N';
  const t_f = scores.T >= scores.F ? 'T' : 'F';
  const j_p = scores.J >= scores.P ? 'J' : 'P';
  return `${e_i}${s_n}${t_f}${j_p}`;
}

export interface TraitPercentage {
  dim: string;
  leftLabel: string;
  rightLabel: string;
  dominantLabel: string;
  percentage: number;
}

export function calculatePercentages(scores: Scores): TraitPercentage[] {
  const dims: [string, string, string, string][] = [
    ['E/I', 'E', 'Extraversion', 'Introversion'],
    ['S/N', 'S', 'Sensing', 'Intuition'],
    ['T/F', 'T', 'Thinking', 'Feeling'],
    ['J/P', 'J', 'Judging', 'Perceiving'],
  ];

  return dims.map(([dim, left, leftLabel, rightLabel]) => {
    const right = opposites[left];
    const leftScore = scores[left as keyof Scores];
    const rightScore = scores[right as keyof Scores];
    const total = leftScore + rightScore || 1;
    const leftPct = Math.round((leftScore / total) * 100);
    const rightPct = 100 - leftPct;
    const dominant = leftPct >= rightPct;
    return {
      dim,
      leftLabel,
      rightLabel,
      dominantLabel: dominant ? leftLabel : rightLabel,
      percentage: dominant ? leftPct : rightPct,
    };
  });
}
