// IndexedDB 래퍼. 기록 카드(사진·음성 포함)를 저장합니다.
// iOS Safari에서 Blob을 직접 저장하면 불안정한 경우가 있어 ArrayBuffer로 저장하고,
// 읽을 때 저장해 둔 mimeType으로 Blob을 다시 만듭니다.
import { DB_NAME } from '../config/constants';

const DB_VERSION = 1;
const STORE = 'cards';

export type AnswerType = 'photo' | 'voice';

interface CardRecord {
  id: string;
  date: string;
  questionId: string;
  questionText: string;
  answerType: AnswerType;
  answerData: ArrayBuffer;
  mimeType: string;
  createdAt: string;
  fed: boolean;
}

export interface Card extends Omit<CardRecord, 'answerData'> {
  answerBlob: Blob;
}

export interface NewCard {
  date: string;
  questionId: string;
  questionText: string;
  answerType: AnswerType;
  answerBlob: Blob;
  mimeType: string;
}

export class AlreadyRecordedError extends Error {
  constructor() {
    super('A card already exists for this date');
    this.name = 'AlreadyRecordedError';
  }
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
        // 하루 1건을 DB 수준에서도 보장
        store.createIndex('date', 'date', { unique: true });
      };
      req.onsuccess = () => {
        const db = req.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };
      req.onerror = () => {
        dbPromise = null;
        reject(req.error);
      };
    });
  }
  return dbPromise;
}

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    // error 이벤트 시점에는 tx.error가 아직 비어 있을 수 있어 요청의 오류를 씁니다.
    tx.onerror = (ev) => reject((ev.target as IDBRequest | null)?.error ?? tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function toCard(r: CardRecord): Card {
  const { answerData, ...rest } = r;
  return { ...rest, answerBlob: new Blob([answerData], { type: r.mimeType }) };
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function addCard(input: NewCard): Promise<Card> {
  const answerData = await input.answerBlob.arrayBuffer();
  const record: CardRecord = {
    id: newId(),
    date: input.date,
    questionId: input.questionId,
    questionText: input.questionText,
    answerType: input.answerType,
    answerData,
    mimeType: input.mimeType,
    createdAt: new Date().toISOString(),
    fed: false,
  };
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const existing = await promisify(store.index('date').getKey(input.date));
  if (existing !== undefined) {
    tx.abort();
    throw new AlreadyRecordedError();
  }
  store.add(record);
  try {
    await txDone(tx);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'ConstraintError') throw new AlreadyRecordedError();
    throw e;
  }
  return toCard(record);
}

export async function getCardByDate(date: string): Promise<Card | null> {
  const db = await openDb();
  const r = await promisify<CardRecord | undefined>(
    db.transaction(STORE).objectStore(STORE).index('date').get(date),
  );
  return r ? toCard(r) : null;
}

export async function getCard(id: string): Promise<Card | null> {
  const db = await openDb();
  const r = await promisify<CardRecord | undefined>(db.transaction(STORE).objectStore(STORE).get(id));
  return r ? toCard(r) : null;
}

/** 최신 날짜가 먼저 오도록 정렬 */
export async function listCards(): Promise<Card[]> {
  const db = await openDb();
  const all = await promisify<CardRecord[]>(db.transaction(STORE).objectStore(STORE).getAll());
  return all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).map(toCard);
}

/** 밥을 줬다고 표시. 처음 표시한 경우에만 true (포인트 중복 적립 방지) */
export async function markFed(id: string): Promise<boolean> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const r = await promisify<CardRecord | undefined>(store.get(id));
  let changed = false;
  if (r && !r.fed) {
    store.put({ ...r, fed: true });
    changed = true;
  }
  await txDone(tx);
  return changed;
}

export async function deleteDatabase(): Promise<void> {
  if (dbPromise) {
    try {
      (await dbPromise).close();
    } catch {
      // 열리지 않았던 경우는 무시
    }
    dbPromise = null;
  }
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    // 다른 탭이 열려 있어도 그 탭은 onversionchange에서 연결을 닫음
    req.onblocked = () => undefined;
  });
}
