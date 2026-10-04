import { BARK_SOUND } from '../config/assets';

/**
 * 멍멍 효과음. 브라우저 자동재생 정책 때문에 반드시 사용자 터치 핸들러 안에서 호출하세요.
 * BARK_SOUND가 비어 있으면 Web Audio로 짧은 소리를 합성합니다(플레이스홀더, 라이선스 문제 없음).
 */
export function playBark(): void {
  try {
    if (BARK_SOUND) {
      void new Audio(BARK_SOUND).play().catch(() => undefined);
      return;
    }
    synthBark();
  } catch {
    // 소리가 안 나도 흐름은 계속됩니다.
  }
}

type AudioContextCtor = typeof AudioContext;

function synthBark(): void {
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!Ctor) return;
  const ctx = new Ctor();
  void ctx.resume();
  const woof = (start: number) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, start);
    osc.frequency.exponentialRampToValueAtTime(170, start + 0.16);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  };
  const t = ctx.currentTime + 0.02;
  woof(t);
  woof(t + 0.26);
  setTimeout(() => void ctx.close().catch(() => undefined), 1000);
}
