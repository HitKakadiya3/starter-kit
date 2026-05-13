import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocale';
import type { QuizAnswer } from '@/lib/apiTypes';
import { withPromoParams } from '@/lib/promoUrl';

const allLetters: Record<number, string[]> = {
  0: ['E', 'I'],
  1: ['S', 'N'],
  2: ['T', 'F'],
  3: ['J', 'P'],
};

interface CalculatingRouteState {
  answers: QuizAnswer[];
  startTime: number;
  endTime: number;
}

const CalculatingPage = () => {
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();
  const state = location.state as CalculatingRouteState | null;

  const [progress, setProgress] = useState(0);
  const [, setCycleIndex] = useState(0);
  const [displayLetters, setDisplayLetters] = useState(['E', 'S', 'T', 'J']);

  useEffect(() => {
    if (!state?.answers) {
      navigate('/', { replace: true });
      return;
    }

    // Cycle letters rapidly
    const letterInterval = setInterval(() => {
      setCycleIndex((prev) => prev + 1);
      setDisplayLetters((prev) =>
        prev.map((_, i) => {
          const options = allLetters[i];
          return options[Math.floor(Math.random() * options.length)];
        }),
      );
    }, 150);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.0;
      });
    }, 80);

    // Navigate after ~8 seconds
    const timeout = setTimeout(() => {
      clearInterval(letterInterval);
      clearInterval(progressInterval);
      navigate(withPromoParams('/email'), { state, replace: false });
    }, 8000);

    return () => {
      clearInterval(letterInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [state, navigate]);

  if (!state?.answers) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-10 animate-fade-in">
        {/* Animated brain network icon */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160" className="animate-spin" style={{ animationDuration: '8s' }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const r = 65;
              const cx = 80 + r * Math.cos(rad - Math.PI / 2);
              const cy = 80 + r * Math.sin(rad - Math.PI / 2);
              return (
                <g key={angle}>
                  <line x1={80} y1={80} x2={cx} y2={cy} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
                  <circle cx={cx} cy={cy} r={i % 2 === 0 ? 8 : 6} fill={i % 2 === 0 ? 'hsl(270 50% 45%)' : 'hsl(270 40% 65%)'} opacity="0.7" />
                </g>
              );
            })}
            <circle cx="80" cy="80" r="8" fill="hsl(270 50% 45%)" />
          </svg>

          {/* Cycling type letters in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg px-5 py-3 border border-border/50">
              <div className="flex gap-1.5">
                {displayLetters.map((letter, i) => (
                  <span
                    key={i}
                    className="text-2xl md:text-3xl font-extrabold tracking-wider text-primary transition-all duration-100"
                    style={{ minWidth: '1.5rem', textAlign: 'center' }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Text */}
        <p className="text-sm md:text-base text-muted-foreground text-center max-w-md leading-relaxed">
          {t('calculating.body')}
        </p>
      </div>
    </div>
  );
};

export default CalculatingPage;
