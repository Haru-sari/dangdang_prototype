import questions from '../data/questions.json';
import { daysBetween } from './date';

export interface Question {
  id: string;
  text: string;
}

export const QUESTIONS: Question[] = questions;

/** 시작일로부터 경과 일수에 따라 순환. 같은 날에는 항상 같은 질문. */
export function questionForDate(dateKey: string, startDateKey: string, list: Question[] = QUESTIONS): Question {
  const n = list.length;
  const index = ((daysBetween(startDateKey, dateKey) % n) + n) % n;
  return list[index];
}
