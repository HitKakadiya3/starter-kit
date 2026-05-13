import { useState, useCallback } from 'react';
import { questions, Question } from '@/utils/questions';
import { Scores, initialScores, applyAnswer, AtScore, initialAtScore, applyAtAnswer } from '@/utils/scoring';

export function useQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [atScore, setAtScore] = useState<AtScore>(initialAtScore);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion: Question = questions[questionIndex];
  const totalQuestions = questions.length;

  const answer = useCallback((weight: number) => {
    const q = questions[questionIndex];
    if (q.dim === 'A/T') {
      setAtScore(prev => applyAtAnswer(prev, q.pole as 'A' | 'T', weight));
    } else {
      setScores(prev => applyAnswer(prev, q.pole, weight));
    }

    if (questionIndex + 1 >= totalQuestions) {
      setIsComplete(true);
    } else {
      setQuestionIndex(prev => prev + 1);
    }
  }, [questionIndex, totalQuestions]);

  const reset = useCallback(() => {
    setQuestionIndex(0);
    setScores(initialScores);
    setAtScore(initialAtScore);
    setIsComplete(false);
  }, []);

  return { currentQuestion, questionIndex, totalQuestions, answer, isComplete, scores, atScore, reset };
}
