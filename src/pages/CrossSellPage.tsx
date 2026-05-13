import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Scores } from '@/utils/scoring';
import careerPreview from '@/assets/career-preview.png';
import { useLocalizedNavigate } from '@/hooks/useLocale';

const CrossSellPage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const state = location.state as { scores: Scores; email: string } | null;

  useEffect(() => {
    if (!state?.scores) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.scores) {
    return null;
  }

  const handleAddIQTest = () => {
    navigate('/details', { state: { scores: state.scores, careerPurchased: true } });
  };

  const handleSkip = () => {
    navigate('/details', { state: { scores: state.scores, careerPurchased: false } });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-4 md:pt-12">
        <div className="max-w-xl w-full bg-card shadow-card rounded-2xl overflow-hidden">
          <div className="bg-secondary text-secondary-foreground py-3 md:py-5 text-center space-y-0.5 md:space-y-1">
            <p className="text-base md:text-xl font-bold">{t('crossSell.paymentCompleted')}</p>
            <p className="text-sm md:text-lg font-semibold">{t('crossSell.reportReady')}</p>
          </div>

          <div className="px-5 md:px-10 py-5 md:py-8 space-y-4 md:space-y-6">
            <p className="text-[12px] md:text-[14.5px] text-muted-foreground leading-relaxed">
              {t('crossSell.description')}
            </p>

            <div className="bg-muted/50 rounded-2xl p-3 md:p-4 border border-border flex items-center gap-4 md:gap-5">
              <div className="flex-1 space-y-1.5 md:space-y-2">
                <h3 className="text-base md:text-xl font-bold text-foreground leading-tight">{t('crossSell.productTitle')}</h3>
                <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
                  {t('crossSell.productBody')}
                </p>
              </div>
              <div className="flex-shrink-0 w-16 md:w-24 rounded-xl overflow-hidden">
                <img src={careerPreview} alt={t('crossSell.productTitle')} loading="lazy" width={512} height={512} className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 md:space-y-3">
              <Button
                variant="hero"
                size="xl"
                className="max-w-sm mx-auto w-full text-[15px] md:text-xl font-bold rounded-full px-4 whitespace-normal text-center leading-tight h-auto min-h-[52px] py-3"
                onClick={handleAddIQTest}
              >
                {t('crossSell.confirm')}
              </Button>
              <button
                onClick={handleSkip}
                className="text-sm md:text-lg font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors mt-2 md:mt-3 py-1 md:py-2"
              >
                {t('crossSell.skip')}
              </button>
            </div>

            <p className="text-[10px] md:text-xs text-muted-foreground/60 text-center leading-relaxed">
              {t('crossSell.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossSellPage;
