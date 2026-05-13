import { useQuiz } from '@/hooks/useQuiz';
import ProgressBar from '@/components/ProgressBar';
import ScaleSelector from '@/components/ScaleSelector';
import { useEffect, useRef } from 'react';
import { persistResult } from '@/utils/mbtiResult';
import { useLocalizedNavigate } from '@/hooks/useLocale';
import { useLocalizedQuestionText } from '@/hooks/useLocalizedQuestionText';

const QuizPage = () => {
  const navigate = useLocalizedNavigate();
  const { currentQuestion, questionIndex, totalQuestions, answer, isComplete, scores, atScore } = useQuiz();
  const questionText = useLocalizedQuestionText(questionIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isComplete) {
      persistResult(scores, atScore);
      navigate('/calculating', { state: { scores } });
    }
  }, [isComplete, scores, atScore, navigate]);

  useEffect(() => {
    // Scroll to top of container on question change
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col" ref={containerRef}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10">
        {/* Navbar with logo */}
        <div className="bg-background/90 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center h-20">
            <div className="flex items-center gap-3 flex-shrink-0">
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
                  <span className="text-foreground"> Types Test</span>
                </span>
                <span className="text-[9px] md:text-[11px] font-medium tracking-[0.25em] text-muted-foreground">Inspired by MBTI Theory</span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress bar outside the white header */}
        <div className="px-4 md:px-8 py-4">
          <div className="max-w-2xl mx-auto">
            <ProgressBar current={questionIndex + 1} total={totalQuestions} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8 md:pt-12 pb-12">
        <div className="max-w-[600px] w-full space-y-10 animate-fade-in" key={questionIndex}>
          <p className="text-xl md:text-2xl font-bold text-foreground text-center leading-relaxed">
            {questionText}
          </p>

          <ScaleSelector onSelect={answer} questionIndex={questionIndex} />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
