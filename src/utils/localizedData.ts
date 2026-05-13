// Locale-aware getters for report data. Selects EN or JA dataset based on
// the current route locale. Falls back to EN when a JA entry is missing.
import type { Locale } from '@/hooks/useLocale';
import { getPremiumTypeData as getPremiumEn } from '@/utils/premiumTypeData';
import type { PremiumTypeData } from '@/utils/premiumTypeData';
import { getCareerReport as getCareerEn } from '@/utils/careerReports';
import type { CareerReport } from '@/utils/careerReports';
import { typeData as typeDataEn } from '@/utils/types';
import { typeData as typeDataJa } from '@/utils/typesJa';
import type { TypeData } from '@/utils/types';

// Premium types: import all .ja.ts modules
import { INTJ as INTJ_ja } from '@/utils/premiumTypes/INTJ.ja';
import { INTP as INTP_ja } from '@/utils/premiumTypes/INTP.ja';
import { ENTJ as ENTJ_ja } from '@/utils/premiumTypes/ENTJ.ja';
import { ENTP as ENTP_ja } from '@/utils/premiumTypes/ENTP.ja';
import { INFJ as INFJ_ja } from '@/utils/premiumTypes/INFJ.ja';
import { INFP as INFP_ja } from '@/utils/premiumTypes/INFP.ja';
import { ENFJ as ENFJ_ja } from '@/utils/premiumTypes/ENFJ.ja';
import { ENFP as ENFP_ja } from '@/utils/premiumTypes/ENFP.ja';
import { ISTJ as ISTJ_ja } from '@/utils/premiumTypes/ISTJ.ja';
import { ISFJ as ISFJ_ja } from '@/utils/premiumTypes/ISFJ.ja';
import { ESTJ as ESTJ_ja } from '@/utils/premiumTypes/ESTJ.ja';
import { ESFJ as ESFJ_ja } from '@/utils/premiumTypes/ESFJ.ja';
import { ISTP as ISTP_ja } from '@/utils/premiumTypes/ISTP.ja';
import { ISFP as ISFP_ja } from '@/utils/premiumTypes/ISFP.ja';
import { ESTP as ESTP_ja } from '@/utils/premiumTypes/ESTP.ja';
import { ESFP as ESFP_ja } from '@/utils/premiumTypes/ESFP.ja';

import { careerReports as careerReportsJa } from '@/utils/careerReports.ja';

const premiumJa: Record<string, PremiumTypeData> = {
  INTJ: INTJ_ja, INTP: INTP_ja, ENTJ: ENTJ_ja, ENTP: ENTP_ja,
  INFJ: INFJ_ja, INFP: INFP_ja, ENFJ: ENFJ_ja, ENFP: ENFP_ja,
  ISTJ: ISTJ_ja, ISFJ: ISFJ_ja, ESTJ: ESTJ_ja, ESFJ: ESFJ_ja,
  ISTP: ISTP_ja, ISFP: ISFP_ja, ESTP: ESTP_ja, ESFP: ESFP_ja,
};

export function getPremiumTypeDataLocalized(code: string, locale: Locale): PremiumTypeData {
  if (locale === 'ja' && premiumJa[code]) return premiumJa[code];
  return getPremiumEn(code);
}

export function getCareerReportLocalized(type: string, locale: Locale): CareerReport | undefined {
  if (locale === 'ja' && careerReportsJa[type]) return careerReportsJa[type];
  return getCareerEn(type);
}

export function getTypeDataLocalized(code: string, locale: Locale): TypeData {
  const src = locale === 'ja' ? typeDataJa : typeDataEn;
  return src[code] ?? typeDataEn[code];
}
