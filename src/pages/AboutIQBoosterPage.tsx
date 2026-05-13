import { useTranslation } from 'react-i18next';
import { Target, Hash, Languages, Globe, Eye, BarChart3, Gamepad2 } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

import logicalImg from '@/assets/iq-booster/logical.png';
import numberSequenceImg from '@/assets/iq-booster/number-sequence.png';
import symbolicImg from '@/assets/iq-booster/symbolic.png';
import generalKnowledgeImg from '@/assets/iq-booster/general-knowledge.png';
import visualImg from '@/assets/iq-booster/visual.png';
import dashboardImg from '@/assets/iq-booster/dashboard.png';
import brainGamesImg from '@/assets/iq-booster/brain-games.png';

const AboutIQBoosterPage = () => {
  const { t } = useTranslation();

  const sections = [
    { icon: Target, title: t('aboutIQ.s1Title'), text: t('aboutIQ.s1Text'), image: logicalImg },
    { icon: Hash, title: t('aboutIQ.s2Title'), text: t('aboutIQ.s2Text'), image: numberSequenceImg },
    { icon: Languages, title: t('aboutIQ.s3Title'), text: t('aboutIQ.s3Text'), image: symbolicImg },
    { icon: Globe, title: t('aboutIQ.s4Title'), text: t('aboutIQ.s4Text'), image: generalKnowledgeImg },
    { icon: Eye, title: t('aboutIQ.s5Title'), text: t('aboutIQ.s5Text'), image: visualImg },
    { icon: BarChart3, title: t('aboutIQ.s6Title'), text: t('aboutIQ.s6Text'), image: dashboardImg },
    { icon: Gamepad2, title: t('aboutIQ.s7Title'), text: t('aboutIQ.s7Text'), image: brainGamesImg },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-6">{t('aboutIQ.title')}</h1>

        <div className="space-y-4 text-sm md:text-base text-foreground leading-relaxed mb-10">
          <p className="text-primary font-semibold">{t('aboutIQ.lead')}</p>
          <p>{t('aboutIQ.p1')}</p>
          <p className="text-muted-foreground">{t('aboutIQ.p2')}</p>
          <p className="text-muted-foreground">{t('aboutIQ.p3')}</p>
          <p>{t('aboutIQ.p4')}</p>
        </div>

        <div className="space-y-6 mb-10">
          {sections.map(({ icon: Icon, title, text, image }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{text}</p>
              <img src={image} alt={title} className="w-full rounded-lg border border-border" loading="lazy" />
            </div>
          ))}
        </div>

        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>{t('aboutIQ.closing1')}</p>
          <p className="text-primary font-semibold text-base md:text-lg">{t('aboutIQ.closing2')}</p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AboutIQBoosterPage;
