import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocalizedNavigate } from '@/hooks/useLocale';

// Male avatars
import intjAvatar from '@/assets/personalities-home/intj-strategist.png';
import entjAvatar from '@/assets/personalities-home/entj-leader.png';
import infjAvatar from '@/assets/personalities-home/infj-visionary.png';
import enfjAvatar from '@/assets/personalities-home/enfj-guide.png';
import istjAvatar from '@/assets/personalities-home/istj-inspector.png';
import estjAvatar from '@/assets/personalities-home/estj-director.png';
import istpAvatar from '@/assets/personalities-home/istp-craftsman.png';
import estpAvatar from '@/assets/personalities-home/estp-daredevil.png';

// Female avatars
import intpFAvatar from '@/assets/personalities-female-home/intp-thinker.png';
import entpFAvatar from '@/assets/personalities-female-home/entp-innovator.png';
import infpFAvatar from '@/assets/personalities-female-home/infp-idealist.png';
import enfpFAvatar from '@/assets/personalities-female-home/enfp-dreamer.png';
import isfjFAvatar from '@/assets/personalities-female-home/isfj-protector.png';
import esfjFAvatar from '@/assets/personalities-female-home/esfj-caretaker.png';
import isfpFAvatar from '@/assets/personalities-female-home/isfp-artist.png';
import esfpFAvatar from '@/assets/personalities-female-home/esfp-performer.png';

interface TypeInfo { code: string; avatar: string }

const groups: Array<{ key: 'g1'|'g2'|'g3'|'g4'; color: string; cardBorder: string; types: TypeInfo[]; number: number }> = [
  {
    key: 'g1', number: 1,
    color: 'text-purple-500',
    cardBorder: 'border-purple-300/60 bg-purple-50/30 dark:bg-purple-950/20',
    types: [
      { code: 'INTJ', avatar: intjAvatar },
      { code: 'INTP', avatar: intpFAvatar },
      { code: 'ENTJ', avatar: entjAvatar },
      { code: 'ENTP', avatar: entpFAvatar },
    ],
  },
  {
    key: 'g2', number: 2,
    color: 'text-emerald-500',
    cardBorder: 'border-emerald-300/60 bg-emerald-50/30 dark:bg-emerald-950/20',
    types: [
      { code: 'INFJ', avatar: infjAvatar },
      { code: 'INFP', avatar: infpFAvatar },
      { code: 'ENFJ', avatar: enfjAvatar },
      { code: 'ENFP', avatar: enfpFAvatar },
    ],
  },
  {
    key: 'g3', number: 3,
    color: 'text-sky-500',
    cardBorder: 'border-sky-300/60 bg-sky-50/30 dark:bg-sky-950/20',
    types: [
      { code: 'ISTJ', avatar: istjAvatar },
      { code: 'ISFJ', avatar: isfjFAvatar },
      { code: 'ESTJ', avatar: estjAvatar },
      { code: 'ESFJ', avatar: esfjFAvatar },
    ],
  },
  {
    key: 'g4', number: 4,
    color: 'text-amber-500',
    cardBorder: 'border-amber-300/60 bg-amber-50/30 dark:bg-amber-950/20',
    types: [
      { code: 'ISTP', avatar: istpAvatar },
      { code: 'ISFP', avatar: isfpFAvatar },
      { code: 'ESTP', avatar: estpAvatar },
      { code: 'ESFP', avatar: esfpFAvatar },
    ],
  },
];

const SixteenTypesPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  const dimensions = [
    { pair: 'E / I', label: t('sixteenTypes.energy'), desc: t('sixteenTypes.energyDesc') },
    { pair: 'S / N', label: t('sixteenTypes.information'), desc: t('sixteenTypes.informationDesc') },
    { pair: 'T / F', label: t('sixteenTypes.decisions'), desc: t('sixteenTypes.decisionsDesc') },
    { pair: 'J / P', label: t('sixteenTypes.lifestyle'), desc: t('sixteenTypes.lifestyleDesc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            {t('sixteenTypes.title1')} <span className="text-primary">{t('sixteenTypes.title2')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('sixteenTypes.subtitle')}</p>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dimensions.map(({ pair, label, desc }) => (
              <div key={pair} className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 text-center">
                <span className="text-2xl font-extrabold gradient-text">{pair}</span>
                <h4 className="font-bold text-foreground mt-2 text-sm">{label}</h4>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {groups.map(({ key, number, color, cardBorder, types }) => (
        <section key={key} className="py-12 md:py-16 even:bg-muted/40">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {number}
                </span>
                <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{t(`sixteenTypes.${key}Name`)}</h2>
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                {t(`sixteenTypes.${key}Sub`)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {types.map(({ code, avatar }) => (
                <div key={code} className={`rounded-2xl border p-5 text-center shadow-soft hover:scale-[1.03] transition-all ${cardBorder}`}>
                  <img src={avatar} alt={code} className="w-24 h-24 mx-auto rounded-2xl mb-4 object-cover" />
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">{code}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{t(`sixteenTypes.labels.${code}`)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(`sixteenTypes.desc.${code}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Button size="xl" onClick={() => navigate('/instructions')} className="shadow-elevated px-12 py-6 text-lg md:text-xl">
            {t('sixteenTypes.startTest')}
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SixteenTypesPage;
