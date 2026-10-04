import { deleteDatabase } from './db';
import { clearAllStorage } from './storage';

/** 카드, 포인트, 프로필, 동의 상태를 포함한 모든 앱 데이터 삭제 */
export async function wipeAllData(): Promise<void> {
  await deleteDatabase();
  clearAllStorage();
}
