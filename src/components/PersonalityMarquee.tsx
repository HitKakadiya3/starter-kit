import { useTranslation } from 'react-i18next';
import intjImg from '@/assets/personalities-home/intj-strategist.png';
import intpImg from '@/assets/personalities-home/intp-thinker.png';
import entjImg from '@/assets/personalities-home/entj-leader.png';
import entpImg from '@/assets/personalities-home/entp-innovator.png';
import infjImg from '@/assets/personalities-home/infj-visionary.png';
import infpImg from '@/assets/personalities-home/infp-idealist.png';
import enfjImg from '@/assets/personalities-home/enfj-guide.png';
import enfpImg from '@/assets/personalities-home/enfp-dreamer.png';
import istjImg from '@/assets/personalities-home/istj-inspector.png';
import isfjImg from '@/assets/personalities-home/isfj-protector.png';
import estjImg from '@/assets/personalities-home/estj-director.png';
import esfjImg from '@/assets/personalities-home/esfj-caretaker.png';
import istpImg from '@/assets/personalities-home/istp-craftsman.png';
import isfpImg from '@/assets/personalities-home/isfp-artist.png';
import estpImg from '@/assets/personalities-home/estp-daredevil.png';
import esfpImg from '@/assets/personalities-home/esfp-performer.png';

import intjFImg from '@/assets/personalities-female-home/intj-strategist.png';
import intpFImg from '@/assets/personalities-female-home/intp-thinker.png';
import entjFImg from '@/assets/personalities-female-home/entj-leader.png';
import entpFImg from '@/assets/personalities-female-home/entp-innovator.png';
import infjFImg from '@/assets/personalities-female-home/infj-visionary.png';
import infpFImg from '@/assets/personalities-female-home/infp-idealist.png';
import enfjFImg from '@/assets/personalities-female-home/enfj-guide.png';
import enfpFImg from '@/assets/personalities-female-home/enfp-dreamer.png';
import istjFImg from '@/assets/personalities-female-home/istj-inspector.png';
import isfjFImg from '@/assets/personalities-female-home/isfj-protector.png';
import estjFImg from '@/assets/personalities-female-home/estj-director.png';
import esfjFImg from '@/assets/personalities-female-home/esfj-caretaker.png';
import istpFImg from '@/assets/personalities-female-home/istp-craftsman.png';
import isfpFImg from '@/assets/personalities-female-home/isfp-artist.png';
import estpFImg from '@/assets/personalities-female-home/estp-daredevil.png';
import esfpFImg from '@/assets/personalities-female-home/esfp-performer.png';

const personalities = [
  { code: 'INTJ', name: 'The Strategist', img: intjImg },
  { code: 'INTP', name: 'The Thinker', img: intpFImg },
  { code: 'ENTJ', name: 'The Leader', img: entjImg },
  { code: 'ENTP', name: 'The Innovator', img: entpFImg },
  { code: 'INFJ', name: 'The Visionary', img: infjFImg },
  { code: 'INFP', name: 'The Idealist', img: infpImg },
  { code: 'ENFJ', name: 'The Guide', img: enfjFImg },
  { code: 'ENFP', name: 'The Dreamer', img: enfpImg },
  { code: 'ISTJ', name: 'The Inspector', img: istjFImg },
  { code: 'ISFJ', name: 'The Protector', img: isfjImg },
  { code: 'ESTJ', name: 'The Director', img: estjFImg },
  { code: 'ESFJ', name: 'The Caretaker', img: esfjImg },
  { code: 'ISTP', name: 'The Craftsman', img: istpFImg },
  { code: 'ISFP', name: 'The Artist', img: isfpImg },
  { code: 'ESTP', name: 'The Daredevil', img: estpFImg },
  { code: 'ESFP', name: 'The Performer', img: esfpImg },
];


const PersonalityMarquee = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full overflow-hidden py-8 relative">
      <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: 'calc((100% - 72rem) / 2 + 2rem)', minWidth: '1rem', background: 'linear-gradient(to right, hsl(var(--background)), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: 'calc((100% - 72rem) / 2 + 2rem)', minWidth: '1rem', background: 'linear-gradient(to left, hsl(var(--background)), transparent)' }} />
      <div className="flex animate-marquee gap-5 md:gap-8" style={{ width: 'max-content' }}>
        {[...personalities, ...personalities].map((p, i) => (
          <div
            key={`${p.code}-${i}`}
            className="flex flex-col items-center gap-1.5 md:gap-2 flex-shrink-0 w-[100px] md:w-[140px]"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-border/50 shadow-soft bg-card">
              <img
                src={p.img}
                alt={`${p.code} - ${p.name}`}
                width={128}
                height={128}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm font-bold text-foreground">{p.code}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">{t(`sixteenTypes.labels.${p.code}`, p.name)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityMarquee;
