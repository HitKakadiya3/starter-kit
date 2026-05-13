import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocalizedNavigate } from '@/hooks/useLocale';
import { withPromoParams } from '@/lib/promoUrl';

const SiteHeader = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0 w-7 h-7 md:w-10 md:h-10">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const r = 16;
              const cx = 20 + r * Math.cos(rad - Math.PI / 2);
              const cy = 20 + r * Math.sin(rad - Math.PI / 2);
              return (
                <g key={angle}>
                  <line x1={20} y1={20} x2={cx} y2={cy} stroke="hsl(270 30% 80%)" strokeWidth="1" />
                  <circle cx={cx} cy={cy} r={i % 2 === 0 ? 3 : 2.2} fill={i % 2 === 0 ? 'hsl(270 50% 45%)' : 'hsl(270 40% 65%)'} />
                </g>
              );
            })}
            {[30, 120, 210, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const r = 8;
              const cx = 20 + r * Math.cos(rad - Math.PI / 2);
              const cy = 20 + r * Math.sin(rad - Math.PI / 2);
              return <circle key={angle} cx={cx} cy={cy} r="1.8" fill="hsl(270 50% 55%)" />;
            })}
            <circle cx="20" cy="20" r="3" fill="hsl(270 50% 45%)" />
          </svg>
          <div className="flex flex-col" style={{ lineHeight: '1.1' }}>
            <span className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.06em]">
              <span style={{ color: 'hsl(270 50% 45%)' }}>16</span>
              <span className="text-foreground"> {t('brand.name')}</span>
            </span>
            <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-muted-foreground">{t('brand.tagline')}</span>
          </div>
        </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/16-types" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/16-types'); }}>{t('nav.sixteenTypes')}</a>
          <a href="/faq" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>{t('nav.faq')}</a>
          <a href="/contact" className="hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>{t('nav.contact')}</a>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Button size="sm" onClick={() => navigate(withPromoParams('/instructions'))}>
            {t('common.startTest')}
          </Button>
          <a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
              {t('common.iqBoosterLogin')}
            </Button>
          </a>
          <LanguageSwitcher />
        </div>
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-3">
          <a href="/16-types" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/16-types'); }}>{t('nav.sixteenTypes')}</a>
          <a href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/faq'); }}>{t('nav.faq')}</a>
          <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/contact'); }}>{t('nav.contact')}</a>
          <Button size="sm" onClick={() => { setMobileMenuOpen(false); navigate(withPromoParams('/instructions')); }} className="w-full mt-1">
            {t('common.startTest')}
          </Button>
          <a href="https://iqbooster.org/sign-in/" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button size="sm" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 hover:text-primary">
              {t('common.iqBoosterLogin')}
            </Button>
          </a>
          <LanguageSwitcher className="self-start" />
        </div>
      )}
    </nav>
  );
};

export default SiteHeader;
