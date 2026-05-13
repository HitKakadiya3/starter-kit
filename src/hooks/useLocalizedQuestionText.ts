import { useTranslation } from 'react-i18next';
import { questions } from '@/utils/questions';
import { questionsJa } from '@/utils/questionsJa';

/**
 * Returns the current question text in the active locale.
 * Scoring still runs off the canonical English bank — only the displayed
 * text is swapped, so dim/pole and order are guaranteed identical.
 */
export function useLocalizedQuestionText(index: number): string {
  const { i18n } = useTranslation();
  if (i18n.language === 'ja' && questionsJa[index]) return questionsJa[index];
  return questions[index]?.text ?? '';
}
