import { useTranslation } from 'react-i18next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useLocalizedNavigate } from '@/hooks/useLocale';

const AboutUsPage = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-6">{t('aboutUs.title')}</h1>

        <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>{t('aboutUs.p1')}</p>
          <p>{t('aboutUs.p2')}</p>
          <p>{t('aboutUs.p3')}</p>
          <p>{t('aboutUs.p4')}</p>
          <p>{t('aboutUs.p5')}</p>
          <p>{t('aboutUs.p6')}</p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/instructions')}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity"
          >
            {t('aboutUs.cta')}
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AboutUsPage;
