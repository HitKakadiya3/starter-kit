import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQuiz } from '@/hooks/useQuiz';
import ProgressBar from '@/components/ProgressBar';
import ScaleSelector from '@/components/ScaleSelector';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import type { ApiQuestion } from '@/lib/apiTypes';
import { withPromoParams } from '@/lib/promoUrl';

const QuizPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['questions'],
    queryFn: () =>
      apiGet<{ questions: ApiQuestion[] }>('questions?variant_type=&tag='),
    staleTime: Infinity,
    retry: 0,
  });

  const preparedQuestions = useMemo(() => {
    const list = data?.questions;
    if (!Array.isArray(list)) return [];
    const valid = list.filter(
      (q) =>
        // Backend returns question_type_id as a string in live responses.
        Number(q.question_type_id) === 6 &&
        Array.isArray(q.options) &&
        q.options.length === 5 &&
        q.options.every((o) => typeof o.text === 'string'),
    );
    if (valid.length !== list.length) {
      console.warn(
        `QuizPage: dropped ${list.length - valid.length} non-Likert items`,
      );
    }
    const shuffled = [...valid];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const sliced = shuffled.slice(0, 60);
    if (sliced.length < 60) {
      console.warn(
        `QuizPage: only ${sliced.length} valid questions available (<60)`,
      );
    }
    return sliced;
  }, [data]);

  const quiz = useQuiz(preparedQuestions);
  const { currentQuestion, questionIndex, totalQuestions, isComplete, answers, startTime, endTime } = quiz;

  useEffect(() => {
    if (isComplete) {
      navigate(withPromoParams('/calculating'), {
        state: { answers, startTime, endTime },
        replace: false,
      });
    }
  }, [isComplete, answers, startTime, endTime, navigate]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-muted-foreground text-sm">Loading your questions…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8 text-center space-y-5">
          <h2 className="text-xl font-extrabold text-foreground">
            We couldn't load the quiz.
          </h2>
          <p className="text-sm text-muted-foreground">Please try again.</p>
          <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (preparedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8 text-center space-y-5">
          <h2 className="text-xl font-extrabold text-foreground">
            This test isn't available right now
          </h2>
          <Button variant="hero" size="lg" className="w-full" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col" ref={containerRef}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10">
        {/* Navbar with logo */}
        <div className="bg-background/90 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
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
            {currentQuestion.text}
          </p>

          <ScaleSelector
            onSelect={(positionIndex) => quiz.answer(positionIndex)}
            questionIndex={questionIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
