import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getPremiumTypeDataLocalized } from '@/utils/localizedData';
import { getPremiumTypeData } from '@/utils/premiumTypeData';
import { getFamousAvatar } from '@/utils/famousAvatars';
import { useLocale, useLocalizedNavigate } from '@/hooks/useLocale';

const TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const FamousPeoplePage = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t('common.backToHome')}
        </button>

        <header className="mb-10 md:mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            {t('famousPeople.eyebrow')}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {t('famousPeople.title')}
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t('famousPeople.subtitle')}
          </p>
        </header>

        <div className="space-y-12 md:space-y-16">
          {TYPES.map(type => {
            const data = getPremiumTypeDataLocalized(type, locale);
            const enData = getPremiumTypeData(type);
            const accent = data.accentColor;
            const localizedName = locale === 'ja' ? t(`sixteenTypes.labels.${type}`) : data.name;
            return (
              <section key={type} aria-labelledby={`heading-${type}`}>
                <div
                  className="flex flex-wrap items-end justify-between gap-3 pb-4 mb-6 border-b"
                  style={{ borderColor: accent }}
                >
                  <div>
                    <span
                      className="inline-block text-xs font-bold tracking-widest px-2.5 py-1 rounded-md text-white mb-2"
                      style={{ background: accent }}
                    >
                      {type}
                    </span>
                    <h2
                      id={`heading-${type}`}
                      className="text-xl md:text-2xl font-bold text-foreground"
                    >
                      {localizedName}
                    </h2>
                  </div>
                  {locale !== 'ja' && (
                    <p className="text-sm text-muted-foreground italic max-w-md">
                      "{data.tagline}"
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                  {data.famousPeople.map((p, i) => {
                    const enName = enData?.famousPeople[i]?.name;
                    const avatar = getFamousAvatar(p.name) ?? (enName ? getFamousAvatar(enName) : undefined);
                    const initials = p.name
                      .split(' ')
                      .map(n => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('');
                    return (
                      <div
                        key={p.name}
                        className="group bg-card border border-border rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
                      >
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={p.name}
                            loading="lazy"
                            width={160}
                            height={160}
                            className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full object-cover bg-card ring-2 ring-offset-2 ring-offset-card"
                            style={{ ['--tw-ring-color' as string]: accent }}
                          />
                        ) : (
                          <div
                            className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold"
                            style={{ background: accent }}
                          >
                            {initials}
                          </div>
                        )}
                        <h3 className="mt-3 text-sm font-semibold text-foreground leading-tight">
                          {p.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {p.role}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 md:mt-16 max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
            {t('famousPeople.noteTitle')}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('famousPeople.noteBody')}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default FamousPeoplePage;
