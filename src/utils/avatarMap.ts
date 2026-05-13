// Centralized avatar mapping for the 16 personality types.
// Uses the white-background variant for clean report layouts.

import intjImg from '@/assets/personalities/intj-strategist.png';
import intpImg from '@/assets/personalities/intp-thinker.png';
import entjImg from '@/assets/personalities/entj-leader.png';
import entpImg from '@/assets/personalities/entp-innovator.png';
import infjImg from '@/assets/personalities/infj-visionary.png';
import infpImg from '@/assets/personalities/infp-idealist.png';
import enfjImg from '@/assets/personalities/enfj-guide.png';
import enfpImg from '@/assets/personalities/enfp-dreamer.png';
import istjImg from '@/assets/personalities/istj-inspector.png';
import isfjImg from '@/assets/personalities/isfj-protector.png';
import estjImg from '@/assets/personalities/estj-director.png';
import esfjImg from '@/assets/personalities/esfj-caretaker.png';
import istpImg from '@/assets/personalities/istp-craftsman.png';
import isfpImg from '@/assets/personalities/isfp-artist.png';
import estpImg from '@/assets/personalities/estp-daredevil.png';
import esfpImg from '@/assets/personalities/esfp-performer.png';

import fIntjImg from '@/assets/personalities-female/intj-strategist.png';
import fIntpImg from '@/assets/personalities-female/intp-thinker.png';
import fEntjImg from '@/assets/personalities-female/entj-leader.png';
import fEntpImg from '@/assets/personalities-female/entp-innovator.png';
import fInfjImg from '@/assets/personalities-female/infj-visionary.png';
import fInfpImg from '@/assets/personalities-female/infp-idealist.png';
import fEnfjImg from '@/assets/personalities-female/enfj-guide.png';
import fEnfpImg from '@/assets/personalities-female/enfp-dreamer.png';
import fIstjImg from '@/assets/personalities-female/istj-inspector.png';
import fIsfjImg from '@/assets/personalities-female/isfj-protector.png';
import fEstjImg from '@/assets/personalities-female/estj-director.png';
import fEsfjImg from '@/assets/personalities-female/esfj-caretaker.png';
import fIstpImg from '@/assets/personalities-female/istp-craftsman.png';
import fIsfpImg from '@/assets/personalities-female/isfp-artist.png';
import fEstpImg from '@/assets/personalities-female/estp-daredevil.png';
import fEsfpImg from '@/assets/personalities-female/esfp-performer.png';

export const avatarByType: Record<string, string> = {
  INTJ: intjImg, INTP: intpImg, ENTJ: entjImg, ENTP: entpImg,
  INFJ: infjImg, INFP: infpImg, ENFJ: enfjImg, ENFP: enfpImg,
  ISTJ: istjImg, ISFJ: isfjImg, ESTJ: estjImg, ESFJ: esfjImg,
  ISTP: istpImg, ISFP: isfpImg, ESTP: estpImg, ESFP: esfpImg,
};

export const avatarByTypeFemale: Record<string, string> = {
  INTJ: fIntjImg, INTP: fIntpImg, ENTJ: fEntjImg, ENTP: fEntpImg,
  INFJ: fInfjImg, INFP: fInfpImg, ENFJ: fEnfjImg, ENFP: fEnfpImg,
  ISTJ: fIstjImg, ISFJ: fIsfjImg, ESTJ: fEstjImg, ESFJ: fEsfjImg,
  ISTP: fIstpImg, ISFP: fIsfpImg, ESTP: fEstpImg, ESFP: fEsfpImg,
};

export type Gender = 'male' | 'female' | null | undefined;

export function getAvatarForType(type: string, gender?: Gender): string {
  if (gender === 'female') return avatarByTypeFemale[type] ?? avatarByType[type];
  return avatarByType[type];
}

// Each type gets a distinct hero accent color (HSL semantic-friendly).
export const heroColorByType: Record<string, string> = {
  INTJ: 'hsl(265 55% 58%)', INTP: 'hsl(220 60% 60%)',
  ENTJ: 'hsl(280 55% 55%)', ENTP: 'hsl(295 60% 62%)',
  INFJ: 'hsl(170 50% 45%)', INFP: 'hsl(195 60% 55%)',
  ENFJ: 'hsl(155 50% 50%)', ENFP: 'hsl(35 85% 60%)',
  ISTJ: 'hsl(195 45% 45%)', ISFJ: 'hsl(180 40% 50%)',
  ESTJ: 'hsl(15 65% 55%)',  ESFJ: 'hsl(345 65% 60%)',
  ISTP: 'hsl(210 25% 45%)', ISFP: 'hsl(85 45% 50%)',
  ESTP: 'hsl(25 80% 55%)',  ESFP: 'hsl(330 70% 62%)',
};
