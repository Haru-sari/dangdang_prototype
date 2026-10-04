// 앱에 보이는 모든 문구. 데모 전 검수는 이 파일만 보면 됩니다.
import { PHONE } from './constants';

export const SAFETY_NOTICE =
  `이 앱은 의료진이 실시간으로 보지 않으며 응급 대응을 하지 않습니다. ` +
  `많이 힘드실 때는 자살예방상담전화 ${PHONE.counseling}, 위급할 때는 ${PHONE.emergency}, ` +
  `담당 병원으로 연락해 주세요.`;

export interface ConsentStep {
  title: string;
  lines: string[];
  safety?: boolean;
}

export const CONSENT_STEPS: ConsentStep[] = [
  {
    title: '이 앱은 무엇인가요?',
    lines: [
      '진료 때 보여드릴 마음기록카드를 모으는 앱이에요.',
      '병을 판단하거나 응급 상황에 대응하지 않아요.',
    ],
  },
  {
    title: '무엇을 모으나요?',
    lines: ['음성 녹음', '사진', '이름(별명)'],
  },
  {
    title: '어디에 쓰나요?',
    lines: [
      '기록을 날짜별 앨범으로 보여드려요.',
      '진료 때 직접 앨범을 열어 보여주실 수 있어요.',
    ],
  },
  {
    title: '어떻게 보관되나요?',
    lines: [
      '기록은 이 휴대폰의 브라우저 안에만 저장돼요. 서버로 보내지 않아요.',
      '설정에서 언제든 모두 지울 수 있어요.',
      '브라우저 데이터를 지우거나 다른 기기에서 열면 기록이 보이지 않아요.',
    ],
  },
  {
    title: '꼭 알아두세요',
    lines: [],
    safety: true,
  },
  {
    title: '동의해 주시겠어요?',
    lines: ['동의하지 않으셔도 불이익은 없어요.'],
  },
];

export const CONSENT = {
  next: '다음',
  agree: '동의합니다',
  decline: '동의하지 않아요',
  declinedTitle: '앱을 사용하지 않으셔도 괜찮아요',
  declinedBody: '아무 정보도 저장하지 않았어요. 이 화면을 닫으셔도 됩니다.',
  declinedRestart: '처음 안내 다시 보기',
};

export const PROFILE = {
  title: '어떻게 불러드릴까요?',
  hint: '이름이나 별명을 적어 주세요.',
  placeholder: '예: 김영희',
  submit: '시작하기',
};

export const HOME = {
  greeting: (name: string) => `${name}님, 안녕하세요`,
  welcomeBack: (name: string) => `${name}님, 다시 만나서 반가워요`,
  questionLabel: '오늘의 질문',
  answer: '답하기',
  doneTitle: '오늘의 기록을 마쳤어요',
  doneBody: '내일 새로운 질문으로 만나요.',
  feedPending: '오늘의 밥이 기다리고 있어요',
  goFeed: '밥 주러 가기',
  album: '기록 앨범',
  settings: '설정',
  level: (level: number) => `친밀도 Lv.${level}`,
};

export const ANSWER = {
  chooseTitle: '어떻게 남기시겠어요?',
  photo: '사진 남기기',
  voice: '음성으로 말하기',
  skip: '오늘은 건너뛰기',
  back: '뒤로',

  takePhoto: '사진 찍기',
  pickPhoto: '앨범에서 고르기',
  usePhoto: '이 사진으로 할게요',
  repickPhoto: '다시 고르기',
  preparingPhoto: '사진을 준비하고 있어요',

  voiceIntro: `버튼을 누르고 편하게 말씀해 주세요.`,
  voiceLimit: (seconds: number) => `최대 ${Math.round(seconds / 60)}분까지 녹음돼요.`,
  startRecording: '녹음 시작',
  stopRecording: '녹음 마치기',
  recording: '녹음 중',
  preparingMic: '마이크를 준비하고 있어요',
  listen: '들어보기',
  stopListening: '멈추기',
  useVoice: '이대로 할게요',
  rerecord: '다시 녹음',

  saving: '저장하고 있어요',

  micDenied:
    '마이크를 사용할 수 없어요. 사진으로 남기시거나, 설정에서 마이크를 허용해 주세요.',
  micHelp: [
    '아이폰: 설정 → Safari → 마이크 → 허용',
    '안드로이드: 주소창 옆 자물쇠 모양 → 권한 → 마이크 허용',
  ],
  saveFailed: '잘 저장되지 않았어요. 다시 한 번 해볼까요?',
  retry: '다시 해보기',
  usePhotoInstead: '사진으로 남기기',
};

export const FEED = {
  arrived: '오늘의 밥이 도착했어요',
  feed: '밥 주기',
  bubbles: [
    '오늘 와줘서 고마워요. 멍!',
    '이야기해줘서 고마워요. 멍!',
    '오늘도 만나서 반가워요. 멍!',
  ],
  saved: '기록 카드가 앨범에 저장됐어요',
  levelUp: (level: number) => `친밀도가 Lv.${level}이 되었어요`,
  album: '앨범 보기',
  home: '홈으로',
};

export const ALBUM = {
  title: '기록 앨범',
  empty: '아직 기록이 없어요. 오늘 첫 기록을 남겨볼까요?',
  voiceCard: '음성 기록',
  home: '홈으로',
  back: '앨범으로',
  play: '듣기',
  stop: '멈추기',
};

export const SETTINGS = {
  title: '설정',
  call: `${PHONE.counseling} 전화하기`,
  privacy: '개인정보 처리방침',
  wipe: '내 기록 모두 지우기',
  wipeConfirm: '모든 기록이 지워지고 되돌릴 수 없어요. 지울까요?',
  wipeYes: '모두 지우기',
  wipeNo: '그만두기',
  wipeFailed: '지우지 못했어요. 다시 한 번 해볼까요?',
  home: '홈으로',
};

export const PRIVACY = {
  title: '개인정보 처리방침',
  sections: [
    { heading: '모으는 것', body: '음성, 사진, 이름(별명)' },
    { heading: '쓰는 목적', body: '기록 앨범을 보여드리고, 진료 때 직접 확인하실 수 있게 해요.' },
    {
      heading: '보관',
      body: '이 휴대폰의 브라우저 안에만 저장돼요. 서버로 보내지 않으며, 개발자도 볼 수 없어요.',
    },
    {
      heading: '삭제',
      body: '설정의 "내 기록 모두 지우기"를 누르거나 브라우저 데이터를 지우면 모두 삭제돼요.',
    },
    { heading: '다른 곳에 제공', body: '다른 회사나 기관에 제공하지 않아요.' },
  ],
  back: '설정으로',
};
