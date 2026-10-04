// localStorage 래퍼. 동의, 프로필, 포인트 등 작은 값만 저장합니다.
import { STORAGE_PREFIX } from '../config/constants';

export interface Consent {
  agreed: boolean;
  agreedAt: string;
}

export interface Profile {
  name: string;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

export function getConsent(): Consent | null {
  return read<Consent>('consent');
}

export function setConsent(agreedAt: Date = new Date()): void {
  write('consent', { agreed: true, agreedAt: agreedAt.toISOString() } satisfies Consent);
}

export function getProfile(): Profile | null {
  return read<Profile>('profile');
}

export function setProfile(profile: Profile): void {
  write('profile', profile);
}

export function getPoints(): number {
  const pet = read<{ points: number }>('pet');
  return pet && Number.isFinite(pet.points) ? pet.points : 0;
}

/** 포인트는 쌓기만 합니다. 줄이는 함수는 일부러 두지 않습니다. */
export function addPoint(): number {
  const next = getPoints() + 1;
  write('pet', { points: next });
  return next;
}

/** 질문 순환의 기준일 (동의한 날) */
export function getStartDate(): string | null {
  return read<string>('startDate');
}

export function setStartDate(dateKey: string): void {
  write('startDate', dateKey);
}

/** 마지막으로 홈을 연 날. 반가운 인사 연출에만 쓰고 화면에 일수로 표시하지 않습니다. */
export function getLastVisit(): string | null {
  return read<string>('lastVisit');
}

export function setLastVisit(dateKey: string): void {
  write('lastVisit', dateKey);
}

export function clearAllStorage(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
