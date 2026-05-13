// Canonical order of Likert labels as rendered by ScaleSelector, top-to-bottom.
// Shared with useQuiz so that a user's click position maps to the backend
// option whose `text` matches the label — the backend's `options[]` array
// order is not guaranteed per question.
export const LIKERT_LABELS_BY_POSITION: readonly string[] = [
  'Strongly Agree',
  'Agree',
  'Neutral',
  'Disagree',
  'Strongly Disagree',
] as const;
