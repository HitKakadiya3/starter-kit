import { useCallback, useState } from "react";
import type { ApiQuestion, QuizAnswer } from "@/lib/apiTypes";

export interface UseQuizState {
  currentQuestion: ApiQuestion | undefined;
  questionIndex: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  startTime: number | undefined;
  endTime: number | undefined;
  answer: (optionId: string) => void;
  reset: () => void;
}

export function useQuiz(questions: ApiQuestion[]): UseQuizState {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [endTime, setEndTime] = useState<number | undefined>();

  const questionIndex = answers.length;
  const currentQuestion = questions[questionIndex];
  const isComplete = questions.length > 0 && answers.length === questions.length;

  const answer = useCallback(
    (optionId: string) => {
      setAnswers((prev) => {
        const q = questions[prev.length];
        if (!q) return prev;
        const opt = q.options?.find((o) => o.id === optionId);
        if (!opt) return prev;
        const next = [...prev, { id: q.id, answer: opt.id }];
        if (prev.length === 0) setStartTime(Date.now());
        if (next.length === questions.length) setEndTime(Date.now());
        return next;
      });
    },
    [questions],
  );

  const reset = useCallback(() => {
    setAnswers([]);
    setStartTime(undefined);
    setEndTime(undefined);
  }, []);

  return {
    currentQuestion,
    questionIndex,
    totalQuestions: questions.length,
    answers,
    isComplete,
    startTime,
    endTime,
    answer,
    reset,
  };
}
