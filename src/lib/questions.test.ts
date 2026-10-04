import { describe, expect, it } from 'vitest';
import { QUESTIONS, questionForDate } from './questions';

describe('questions', () => {
  it('has 12 questions with unique ids', () => {
    expect(QUESTIONS).toHaveLength(12);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(12);
  });

  it('starts with the first question on the start date', () => {
    expect(questionForDate('2026-10-04', '2026-10-04')).toBe(QUESTIONS[0]);
  });

  it('returns the same question for the same day', () => {
    expect(questionForDate('2026-10-09', '2026-10-04')).toBe(questionForDate('2026-10-09', '2026-10-04'));
  });

  it('moves to the next question each day and wraps around', () => {
    expect(questionForDate('2026-10-05', '2026-10-04')).toBe(QUESTIONS[1]);
    expect(questionForDate('2026-10-15', '2026-10-04')).toBe(QUESTIONS[11]);
    expect(questionForDate('2026-10-16', '2026-10-04')).toBe(QUESTIONS[0]);
  });

  it('never fails for dates before the start date', () => {
    expect(questionForDate('2026-10-03', '2026-10-04')).toBe(QUESTIONS[11]);
  });
});
