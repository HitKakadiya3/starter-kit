import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResults } from '@/hooks/useResults';
import TypeBadge from '@/components/TypeBadge';
import TraitBar from '@/components/TraitBar';
import InfoCard from '@/components/InfoCard';
import StrengthTag from '@/components/StrengthTag';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { Scores } from '@/utils/scoring';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = (location.state as { scores: Scores } | null)?.scores;

  if (!scores) {
    navigate('/');
    return null;
  }

  return <ResultsContent scores={scores} onRetake={() => navigate('/')} />;
};

const ResultsContent = ({ scores, onRetake }: { scores: Scores; onRetake: () => void }) => {
  const { type, typeData: data, traitPercentages } = useResults(scores);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30 py-8 px-4">
      <div className="max-w-[680px] mx-auto space-y-6">
        {/* Type header */}
        <div className="text-center space-y-3 bg-card rounded-2xl p-6 md:p-10 shadow-card border border-border/50 animate-fade-in">
          <TypeBadge type={type} />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{data.name}</h2>
        </div>

        {/* Trait bars */}
        <div className="bg-card rounded-2xl p-5 md:p-8 shadow-card border border-border/50 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">{t('results.cognitiveProfile')}</h3>
          {traitPercentages.map(tp => (
            <TraitBar key={tp.dim} {...tp} />
          ))}
        </div>

        {/* Description */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-8 shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{data.description}</p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <InfoCard title={t('results.strengths')}>
            <div className="flex flex-wrap gap-1.5">
              {data.strengths.map(s => <StrengthTag key={s} label={s} />)}
            </div>
          </InfoCard>
          <InfoCard title={t('results.careerPaths')}>
            <p>{data.careers}</p>
          </InfoCard>
          <InfoCard title={t('results.famousExamples')}>
            <p>{data.famous}</p>
          </InfoCard>
          <InfoCard title={t('results.atTheirBest')}>
            <p>{data.atTheirBest}</p>
          </InfoCard>
        </div>

        {/* Retake */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" size="lg" onClick={onRetake}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('results.retake')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
