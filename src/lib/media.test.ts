import { describe, expect, it } from 'vitest';
import { fitWithin } from './image';
import { formatSeconds, pickAudioMimeType } from './recorder';

describe('pickAudioMimeType', () => {
  it('prefers audio/mp4 (Safari)', () => {
    expect(pickAudioMimeType((t) => t === 'audio/mp4' || t.startsWith('audio/webm'))).toBe('audio/mp4');
  });

  it('falls back to webm opus (Chrome)', () => {
    expect(pickAudioMimeType((t) => t.startsWith('audio/webm'))).toBe('audio/webm;codecs=opus');
  });

  it('returns undefined when nothing is supported', () => {
    expect(pickAudioMimeType(() => false)).toBeUndefined();
  });

  it('treats a throwing check as unsupported', () => {
    expect(
      pickAudioMimeType((t) => {
        if (t === 'audio/mp4') throw new Error('boom');
        return t === 'audio/webm';
      }),
    ).toBe('audio/webm');
  });
});

describe('formatSeconds', () => {
  it('formats m:ss', () => {
    expect(formatSeconds(0)).toBe('0:00');
    expect(formatSeconds(12.7)).toBe('0:12');
    expect(formatSeconds(60)).toBe('1:00');
  });
});

describe('fitWithin', () => {
  it('keeps small images as they are', () => {
    expect(fitWithin(800, 600, 1280)).toEqual({ width: 800, height: 600 });
  });

  it('scales the longest edge down', () => {
    expect(fitWithin(4032, 3024, 1280)).toEqual({ width: 1280, height: 960 });
    expect(fitWithin(3024, 4032, 1280)).toEqual({ width: 960, height: 1280 });
  });
});
