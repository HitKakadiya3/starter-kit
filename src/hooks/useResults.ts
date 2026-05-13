import { useMemo } from 'react';
import { Scores, calculateType, calculatePercentages } from '@/utils/scoring';
import { useLocale } from '@/hooks/useLocale';
import { getTypeDataLocalized } from '@/utils/localizedData';

export function useResults(scores: Scores) {
  const locale = useLocale();
  const type = useMemo(() => calculateType(scores), [scores]);
  const data = useMemo(() => getTypeDataLocalized(type, locale), [type, locale]);
  const traitPercentages = useMemo(() => calculatePercentages(scores), [scores]);

  return { type, typeData: data, traitPercentages };
}
