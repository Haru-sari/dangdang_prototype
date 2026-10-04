// 날짜는 모두 기기 로컬 시간 기준 "YYYY-MM-DD" 문자열(dateKey)로 다룹니다.

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseKey(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

/** 개발 빌드에서만 `?debugDate=YYYY-MM-DD`로 오늘 날짜를 바꿔 테스트할 수 있습니다. */
function debugDateKey(): string | null {
  if (!import.meta.env.DEV || typeof location === 'undefined') return null;
  const v = new URLSearchParams(location.search).get('debugDate');
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

export function todayKey(): string {
  return debugDateKey() ?? toDateKey(new Date());
}

/** a에서 b까지 경과한 일수 (b가 이후면 양수) */
export function daysBetween(a: string, b: string): number {
  const pa = parseKey(a);
  const pb = parseKey(b);
  const ua = Date.UTC(pa.y, pa.m - 1, pa.d);
  const ub = Date.UTC(pb.y, pb.m - 1, pb.d);
  return Math.round((ub - ua) / 86_400_000);
}

/** "10월 4일 일요일" / withYear면 "2026년 10월 4일 일요일" */
export function formatDateKey(key: string, withYear = false): string {
  const { y, m, d } = parseKey(key);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const md = `${m}월 ${d}일 ${weekday}`;
  return withYear ? `${y}년 ${md}` : md;
}
