import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiQuestion } from "@/lib/apiTypes";
import { useQuiz } from "./useQuiz";

// Q1: options in the "canonical" render order (Strongly Agree → Strongly Disagree).
const Q1: ApiQuestion = {
  id: "q1",
  question_type_id: 6,
  text: "Q1",
  options: [
    { id: "o1-sa", text: "Strongly Agree", weight: 5 },
    { id: "o1-a", text: "Agree", weight: 4 },
    { id: "o1-n", text: "Neutral", weight: 3 },
    { id: "o1-d", text: "Disagree", weight: 2 },
    { id: "o1-sd", text: "Strongly Disagree", weight: 1 },
  ],
};

// Q2: options in a DIFFERENT order (covers the "varies per question" case from
// the real backend). Position 0 in the UI is still "Strongly Agree", so the
// hook must resolve o2-sa by matching the text, not by array index.
const Q2: ApiQuestion = {
  id: "q2",
  question_type_id: "6",
  text: "Q2",
  options: [
    { id: "o2-d", text: "Disagree", weight: 5 },
    { id: "o2-n", text: "Neutral", weight: 4 },
    { id: "o2-a", text: "Agree", weight: 3 },
    { id: "o2-sa", text: "Strongly Agree", weight: 2 },
    { id: "o2-sd", text: "Strongly Disagree", weight: 1 },
  ],
};

describe("useQuiz", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("has an initial state reflecting the supplied question list", () => {
    const { result } = renderHook(() => useQuiz([Q1, Q2]));

    expect(result.current.questionIndex).toBe(0);
    expect(result.current.answers).toEqual([]);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.startTime).toBeUndefined();
    expect(result.current.endTime).toBeUndefined();
    expect(result.current.currentQuestion).toBe(Q1);
    expect(result.current.totalQuestions).toBe(2);
  });

  it("stamps startTime on the first answer call and advances the question", () => {
    vi.setSystemTime(1000);
    const { result } = renderHook(() => useQuiz([Q1, Q2]));

    act(() => {
      result.current.answer(0);
    });

    // Position 0 = "Strongly Agree" → Q1's o1-sa.
    expect(result.current.answers).toEqual([{ id: "q1", answer: "o1-sa" }]);
    expect(result.current.startTime).toBe(1000);
    expect(result.current.endTime).toBeUndefined();
    expect(result.current.isComplete).toBe(false);
    expect(result.current.questionIndex).toBe(1);
    expect(result.current.currentQuestion).toBe(Q2);
  });

  it("stamps endTime and flips isComplete on the final answer", () => {
    vi.setSystemTime(1000);
    const { result } = renderHook(() => useQuiz([Q1, Q2]));

    act(() => {
      result.current.answer(0);
    });

    vi.setSystemTime(5000);
    act(() => {
      result.current.answer(2);
    });

    expect(result.current.answers.length).toBe(2);
    // Position 2 = "Neutral". Q2's options are in a different array order but
    // the text match still finds o2-n — proves the hook ignores options[] order.
    expect(result.current.answers[1]).toEqual({ id: "q2", answer: "o2-n" });
    expect(result.current.endTime).toBe(5000);
    expect(result.current.isComplete).toBe(true);
  });

  it("treats an out-of-range positionIndex as a no-op", () => {
    const { result } = renderHook(() => useQuiz([Q1, Q2]));

    act(() => {
      result.current.answer(99);
    });

    expect(result.current.answers).toEqual([]);
    expect(result.current.startTime).toBeUndefined();
    expect(result.current.questionIndex).toBe(0);
  });

  it("reset() returns the hook to its initial state", () => {
    vi.setSystemTime(1000);
    const { result } = renderHook(() => useQuiz([Q1, Q2]));

    act(() => {
      result.current.answer(0);
    });
    expect(result.current.answers.length).toBe(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.answers).toEqual([]);
    expect(result.current.startTime).toBeUndefined();
    expect(result.current.endTime).toBeUndefined();
    expect(result.current.isComplete).toBe(false);
    expect(result.current.questionIndex).toBe(0);
  });

  it("handles an empty question list without advancing or completing", () => {
    const { result } = renderHook(() => useQuiz([]));

    expect(result.current.currentQuestion).toBeUndefined();
    expect(result.current.totalQuestions).toBe(0);
    expect(result.current.isComplete).toBe(false);

    act(() => {
      result.current.answer(0);
    });

    expect(result.current.answers).toEqual([]);
    expect(result.current.startTime).toBeUndefined();
    expect(result.current.isComplete).toBe(false);
  });
});
