// 강아지 이미지·효과음 경로를 한 곳에 모아둡니다.
// 값이 null이면 코드에 내장된 플레이스홀더(SVG 강아지, 합성 효과음)를 사용합니다.
// 실제 에셋으로 교체할 때는 public/ 폴더에 파일을 넣고 경로를 적어 주세요. 예: '/pet/idle.gif'

export const PET_IMAGES: Record<'idle' | 'eating' | 'welcome' | 'card', string | null> = {
  idle: null,
  eating: null,
  welcome: null,
  card: null,
};

/** 밥 주기 효과음. 예: '/sounds/bark.mp3' (라이선스 확인 필수) */
export const BARK_SOUND: string | null = null;
