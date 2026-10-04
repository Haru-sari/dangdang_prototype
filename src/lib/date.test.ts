import { describe, expect, it } from 'vitest';
import { daysBetween, formatDateKey, toDateKey } from './date';

describe('toDateKey', () => {
  it('uses local date parts', () => {
    expect(toDateKey(new Date(2026, 9, 4, 0, 0, 0))).toBe('2026-10-04');
  });

  it('switches to the next day right after local midnight', () => {
    expect(toDateKey(new Date(2026, 9, 4, 23, 59, 59))).toBe('2026-10-04');
    expect(toDateKey(new Date(2026, 9, 5, 0, 0, 0))).toBe('2026-10-05');
  });
});

describe('daysBetween', () => {
  it('counts calendar days', () => {
    expect(daysBetween('2026-10-04', '2026-10-04')).toBe(0);
    expect(daysBetween('2026-10-04', '2026-10-05')).toBe(1);
    expect(daysBetween('2026-10-05', '2026-10-04')).toBe(-1);
  });

  it('crosses month and year boundaries', () => {
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
  });
});

describe('formatDateKey', () => {
  it('formats month, day and weekday', () => {
    expect(formatDateKey('2026-10-04')).toBe('10월 4일 일요일');
  });

  it('adds the year when asked', () => {
    expect(formatDateKey('2026-10-04', true)).toBe('2026년 10월 4일 일요일');
  });
});
