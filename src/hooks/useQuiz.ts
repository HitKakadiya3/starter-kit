import { useCallback, useState } from "react";
import type { ApiQuestion, QuizAnswer } from "@/lib/apiTypes";
import { LIKERT_LABELS_BY_POSITION } from "@/lib/likertScale";

export interface UseQuizState {
  currentQuestion: ApiQuestion | undefined;
  questionIndex: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  startTime: number | undefined;
  endTime: number | undefined;
  answer: (positionIndex: number) => void;
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
    (positionIndex: number) => {
      setAnswers((prev) => {
        const q = questions[prev.length];
        if (!q) return prev;
        const label = LIKERT_LABELS_BY_POSITION[positionIndex];
        if (!label) return prev;
        // The backend's options[] order varies per question; match by text
        // label rather than by array index.
        const opt = q.options?.find((o) => o.text === label);
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
