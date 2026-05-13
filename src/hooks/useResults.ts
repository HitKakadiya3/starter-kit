import { useMemo } from 'react';
import { Scores, calculateType, calculatePercentages } from '@/utils/scoring';
import { typeData } from '@/utils/types';

export function useResults(scores: Scores) {
  const type = useMemo(() => calculateType(scores), [scores]);
  const data = useMemo(() => typeData[type], [type]);
  const traitPercentages = useMemo(() => calculatePercentages(scores), [scores]);

  return { type, typeData: data, traitPercentages };
}
