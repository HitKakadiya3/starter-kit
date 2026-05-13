import { useTranslation } from 'react-i18next';
import { useLocale, useLocalizedNavigate } from '@/hooks/useLocale';

const SiteFooter = () => {
  const navigate = useLocalizedNavigate();
  const locale = useLocale();
  const { t } = useTranslation();

  return (
    <footer className="relative mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(270_40%_12%)]" />
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15V45L30 60L0 45V15Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-12">
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0 w-10 h-10">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 16;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return (
                  <g key={angle}>
                    <line x1={20} y1={20} x2={cx} y2={cy} stroke="hsl(270 60% 70% / 0.5)" strokeWidth="1" />
                    <circle cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} fill={i % 2 === 0 ? 'hsl(270 70% 70%)' : 'hsl(270 60% 65%)'} />
                  </g>
                );
              })}
              {[30, 120, 210, 300].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const r = 8;
                const cx = 20 + r * Math.cos(rad - Math.PI / 2);
                const cy = 20 + r * Math.sin(rad - Math.PI / 2);
                return <circle key={angle} cx={cx} cy={cy} r="1.8" fill="hsl(270 65% 68%)" />;
              })}
              <circle cx="20" cy="20" r="3" fill="hsl(270 70% 75%)" />
            </svg>
            <div className="flex flex-col" style={{ lineHeight: '1.1' }}>
              <span className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.06em] whitespace-nowrap">
                <span className="text-[hsl(270_70%_70%)]">16</span>
                <span className="text-white"> {t('brand.name')}</span>
              </span>
              <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-white/40">{t('brand.tagline')}</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-sm text-white mb-3 leading-tight">{t('footer.support')}</h4>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="text-sm text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.contactSupport')}</a>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.privacyPolicy')}</a></li>
                <li><a href="/terms-conditions" onClick={(e) => { e.preventDefault(); navigate('/terms-conditions'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href="/subscription-policy" onClick={(e) => { e.preventDefault(); navigate('/subscription-policy'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.subscriptionPolicy')}</a></li>
                {locale === 'ja' && (
                  <li><a href="/legal-notice" onClick={(e) => { e.preventDefault(); navigate('/legal-notice'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">特定商取引法に基づく表記</a></li>
                )}
                <li><a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">{t('footer.explore')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about-us" onClick={(e) => { e.preventDefault(); navigate('/about-us'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.faq')}</a></li>
                <li><a href="/famous-people" onClick={(e) => { e.preventDefault(); navigate('/famous-people'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.famousAvatars')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-3">{t('footer.iqBooster')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer" className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.logIn')}</a></li>
                <li><a href="/about-iq-booster" onClick={(e) => { e.preventDefault(); navigate('/about-iq-booster'); }} className="text-[hsl(270_80%_80%)] hover:text-white transition-colors">{t('footer.aboutIQ')}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-sm text-[hsl(0_0%_70%)] mt-10 mb-6 leading-relaxed text-center">
          {t('footer.disclaimer')}
        </p>

        <div className="border-t border-white/10 pt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-[hsl(0_0%_70%)]">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
