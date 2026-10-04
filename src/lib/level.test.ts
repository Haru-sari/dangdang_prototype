import { describe, expect, it } from 'vitest';
import { levelFromPoints } from './level';

describe('levelFromPoints', () => {
  it('starts at Lv.1', () => {
    expect(levelFromPoints(0)).toBe(1);
  });

  it('goes up every 3 points', () => {
    expect(levelFromPoints(2)).toBe(1);
    expect(levelFromPoints(3)).toBe(2);
    expect(levelFromPoints(5)).toBe(2);
    expect(levelFromPoints(6)).toBe(3);
  });

  it('respects a custom step', () => {
    expect(levelFromPoints(4, 2)).toBe(3);
  });

  it('never goes below Lv.1', () => {
    expect(levelFromPoints(-5)).toBe(1);
  });
});
