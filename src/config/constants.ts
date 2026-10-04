// 배포 전에 이 파일의 값을 한 번 더 확인해 주세요.

/** 안내 전화번호 */
export const PHONE = {
  /** 자살예방상담전화 */
  counseling: '109',
  /** 응급 */
  emergency: '119',
} as const;

/** 친밀도: 이 포인트마다 레벨 +1 */
export const POINTS_PER_LEVEL = 3;

/** 음성 녹음 최대 길이(초). 도달하면 자동 정지 */
export const MAX_RECORDING_SECONDS = 60;

/** 사진 저장 시 긴 변 최대 픽셀 */
export const PHOTO_MAX_EDGE = 1280;
/** 사진 JPEG 품질 (0~1) */
export const PHOTO_QUALITY = 0.85;

/** localStorage 키 접두사 */
export const STORAGE_PREFIX = 'dangdang:';
/** IndexedDB 이름 */
export const DB_NAME = 'dangdang-db';
