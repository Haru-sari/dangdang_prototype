import { POINTS_PER_LEVEL } from '../config/constants';

/** 레벨은 Lv.1부터 시작하고, POINTS_PER_LEVEL마다 1씩 오릅니다. */
export function levelFromPoints(points: number, perLevel = POINTS_PER_LEVEL): number {
  return Math.floor(Math.max(0, points) / perLevel) + 1;
}
