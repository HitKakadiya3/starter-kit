import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Scores } from '@/utils/scoring';
import { useLocalizedNavigate } from '@/hooks/useLocale';

const EmailCapturePage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const scores = (location.state as { scores: Scores } | null)?.scores;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!scores) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/checkout', { state: { scores, email } });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30 flex flex-col items-center justify-start pt-4 md:pt-32 px-4">
      <div className="flex flex-col items-center space-y-5 md:space-y-8 animate-fade-in max-w-md w-full text-center bg-card border border-border rounded-2xl shadow-lg p-5 md:p-8">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
            {t('email.title')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {t('email.subhead')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2 text-center">
            <label htmlFor="email" className="text-base font-medium text-foreground">
              {t('email.label')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base bg-background border-2 border-foreground/40"
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('common.processing')}
              </span>
            ) : (
              t('common.continue')
            )}
          </Button>
          <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
            {t('email.consent')}{' '}
            <a href="#" className="underline hover:text-muted-foreground">{t('email.privacyPolicy')}</a> {t('email.and')}{' '}
            <a href="#" className="underline hover:text-muted-foreground">{t('email.termsOfUse')}</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmailCapturePage;
