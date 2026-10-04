import { beforeEach, describe, expect, it } from 'vitest';
import { addCard, deleteDatabase, getCard, getCardByDate, listCards, markFed, AlreadyRecordedError } from './db';
import { addPoint, getConsent, getPoints, getProfile, setConsent, setProfile } from './storage';
import { wipeAllData } from './wipe';

function photo(date: string) {
  return {
    date,
    questionId: 'q01',
    questionText: '오늘 무엇을 드셨나요?',
    answerType: 'photo' as const,
    answerBlob: new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' }),
    mimeType: 'image/jpeg',
  };
}

beforeEach(async () => {
  await deleteDatabase();
  localStorage.clear();
});

describe('cards', () => {
  it('stores a card and restores the blob with its mimeType', async () => {
    const saved = await addCard(photo('2026-10-04'));
    const loaded = await getCard(saved.id);
    expect(loaded?.answerBlob.type).toBe('image/jpeg');
    expect(new Uint8Array(await loaded!.answerBlob.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(loaded?.fed).toBe(false);
  });

  it('accepts only one card per day', async () => {
    await addCard(photo('2026-10-04'));
    await expect(addCard(photo('2026-10-04'))).rejects.toBeInstanceOf(AlreadyRecordedError);
    expect(await listCards()).toHaveLength(1);
  });

  it('lists newest first', async () => {
    await addCard(photo('2026-10-02'));
    await addCard(photo('2026-10-04'));
    await addCard(photo('2026-10-03'));
    expect((await listCards()).map((c) => c.date)).toEqual(['2026-10-04', '2026-10-03', '2026-10-02']);
  });

  it('marks fed only once', async () => {
    const card = await addCard(photo('2026-10-04'));
    expect(await markFed(card.id)).toBe(true);
    expect(await markFed(card.id)).toBe(false);
    expect((await getCardByDate('2026-10-04'))?.fed).toBe(true);
  });
});

describe('local values', () => {
  it('only adds points', () => {
    expect(getPoints()).toBe(0);
    expect(addPoint()).toBe(1);
    expect(addPoint()).toBe(2);
    expect(getPoints()).toBe(2);
  });

  it('keeps unrelated localStorage keys when wiping', async () => {
    localStorage.setItem('other-app', 'keep');
    setConsent(new Date('2026-10-04T00:00:00Z'));
    setProfile({ name: '영희' });
    addPoint();
    await addCard(photo('2026-10-04'));

    await wipeAllData();

    expect(getConsent()).toBeNull();
    expect(getProfile()).toBeNull();
    expect(getPoints()).toBe(0);
    expect(await listCards()).toEqual([]);
    expect(localStorage.getItem('other-app')).toBe('keep');
  });
});
