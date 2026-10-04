# 구현 계획: 마음기록카드 펫 앱 (MVP 웹앱 프로토타입)

> 기준 문서: [`docs/PRD.md`](./PRD.md). PRD의 "범위 밖"(7장) 항목은 구현하지 않는다.

## 1. 기술 스택 결정

| 영역 | 선택 | 이유 |
|---|---|---|
| 빌드 | Vite + React + TypeScript | PRD 기본 제안. 가볍고 Vercel 배포가 간단함 |
| 라우팅 | 직접 만든 작은 해시 라우터 (`#/home`, `#/album` …) | 라이브러리 없이 휴대폰 "뒤로가기" 버튼이 자연스럽게 동작 |
| 상태 | React state + Context 1개 (`AppContext`) | 화면 수가 적어 상태 라이브러리 불필요 |
| 저장 | IndexedDB(카드·Blob) + localStorage(동의·프로필·포인트) | PRD 3장. IndexedDB는 의존성 없이 얇은 래퍼 직접 작성 |
| 스타일 | 일반 CSS + CSS 변수(디자인 토큰) | 큰 글씨·높은 대비 규칙을 토큰으로 강제 |
| 애니메이션 | CSS keyframes + SVG 강아지 플레이스홀더 | 복잡한 라이브러리 불필요, 나중에 GIF로 교체 가능 |
| 효과음 | Web Audio API로 합성한 "멍" 플레이스홀더 → 이후 파일로 교체 | 라이선스 문제 없음. 에셋 경로는 `assets.ts` 한 곳에서 관리 |
| 테스트 | Vitest (순수 로직 단위 테스트) | 날짜·질문 순환·레벨·mimeType 선택 로직 검증 |
| 배포 | Vercel (HTTPS) | 카메라·마이크는 HTTPS 필수 |

외부 분석 도구, 광고, 쿠키, 서버 API 호출은 일절 넣지 않는다.

## 2. 디렉터리 구조 (예정)

```
src/
  main.tsx, App.tsx              # 라우터 + 첫 실행 분기(동의 여부)
  config/
    constants.ts                 # 전화번호(109/119), 레벨당 포인트(3), 최대 녹음 60초, 리사이즈 1280px
    copy.ts                      # 모든 화면 문구(안전 문구, 말풍선 3개, 오류 문구, 개인정보 처리방침)
    assets.ts                    # 강아지 이미지/애니메이션, 효과음 경로를 한 곳에
  data/
    questions.json               # 질문 12개
  lib/
    date.ts                      # 로컬 날짜 "YYYY-MM-DD", "10월 4일 일요일" 포맷
    questions.ts                 # 날짜 기반 질문 순환
    level.ts                     # points → level 계산
    db.ts                        # IndexedDB 래퍼 (cards 스토어)
    storage.ts                   # localStorage 래퍼 (consent, profile, pet, startDate, lastVisit)
    wipe.ts                      # 모든 앱 데이터 삭제
    image.ts                     # 사진 리사이즈 (긴 변 1280px, JPEG)
    recorder.ts                  # MediaRecorder 래퍼 + 지원 mimeType 선택
    sound.ts                     # 효과음 재생 (사용자 터치 시점)
  components/
    Pet.tsx                      # 강아지: idle / eating / welcome 상태별 애니메이션
    BigButton.tsx, Screen.tsx, ConfirmDialog.tsx, SafetyNotice.tsx, SpeechBubble.tsx
  screens/
    Consent.tsx, ConsentDeclined.tsx, Profile.tsx, Home.tsx,
    Answer.tsx (+ PhotoAnswer.tsx, VoiceAnswer.tsx),
    Feed.tsx, Album.tsx, CardDetail.tsx, Settings.tsx, Privacy.tsx
  styles/
    tokens.css, global.css
scripts/
  check-banned-words.mjs         # "치료/진단/점수/분석" 등 금지어 검사
```

## 3. 데이터 설계

- **localStorage** (키 접두사 `dangdang:`)
  - `consent` `{ agreed, agreedAt }`
  - `profile` `{ name, ageGroup? }`
  - `pet` `{ points }` — 감소시키는 코드 경로 자체를 만들지 않음 (`addPoint()`만 제공)
  - `startDate` — 질문 순환 기준일 (동의한 날)
  - `lastVisitDate` — "다시 만나서 반가워요" 인사 여부 판단에만 사용. 화면에 일수·빠진 날을 절대 표시하지 않음
- **IndexedDB** `dangdang-db` / 스토어 `cards` (keyPath `id`, 인덱스 `date` unique)
  - PRD 5-1의 card 구조 그대로. `date`에 unique 인덱스를 걸어 **하루 1건을 DB 수준에서 보장**
  - iOS Safari의 Blob 저장 이슈 대비: Blob 저장 실패 시 `ArrayBuffer + mimeType`으로 저장하고 읽을 때 Blob 재구성 (래퍼 내부에서 처리)
- **질문 선택**: `(오늘 - startDate 경과일) % 12`. 같은 날은 항상 같은 질문
- **레벨**: `Math.floor(points / POINTS_PER_LEVEL) + 1` (Lv.1부터 시작)

### 포인트 적립 시점 (결정 사항)
PRD는 "밥 주기 버튼 터치 시 +1"이지만, 사용자가 밥 주기 전에 앱을 닫으면 카드는 있는데 포인트가 없는 상태가 된다.
→ **카드에 `fed: boolean` 필드를 추가**하고, 오늘 카드가 있지만 `fed=false`면 홈에서 밥 주기 화면으로 다시 안내한다. 밥 주기 터치 시 `fed=true` + 포인트 +1을 함께 처리한다. (PRD 흐름을 그대로 지키면서 누락만 방지)

## 4. 단계별 구현 계획

### Phase 0. 프로젝트 기반 (반나절)
- Vite + React + TS 초기화, ESLint/Prettier, Vitest 설정
- 디자인 토큰: 본문 20px+, 버튼 글씨 22px+, 버튼 높이 56px+(권장 64px), 고대비 색, 최대 폭 480px 중앙 정렬
- `Screen` 레이아웃(한 화면에 행동 1개), `BigButton` 공통 컴포넌트
- 해시 라우터 + 첫 실행 분기(동의 없으면 동의 화면으로)

### Phase 1. 도메인·저장 계층 (반나절)
- `constants.ts`, `copy.ts`, `assets.ts`, `questions.json`
- `date.ts`, `questions.ts`, `level.ts` + **단위 테스트** (자정 경계, 질문 순환, 레벨 경계 2→3점)
- `db.ts`, `storage.ts`, `wipe.ts`

### Phase 2. 동의 → 프로필 (반나절)
- 동의 6단계: 단계별 1화면, "다음" 버튼 1개. 5단계에 `SafetyNotice`
- 마지막 화면 "동의합니다" / "동의하지 않아요"
- 거부 시 "앱을 사용하지 않으셔도 괜찮아요" 종료 화면 (아무 것도 저장하지 않음)
- 프로필: 이름(별명) 1개 입력, 연령대 선택은 선택 사항

### Phase 3. 홈 + 강아지 (반나절)
- `Pet` 컴포넌트: SVG 강아지 + CSS 애니메이션 3종 (숨쉬기/꼬리 살랑, 밥 먹기/꼬리 흔들기, 달려오기)
- 홈 상태: 오늘 미기록 → 큰 "답하기" / 기록 완료 → "오늘의 기록을 마쳤어요" + 앨범 버튼 강조 / 미급식 → "밥 주기"로 안내
- `lastVisitDate`가 어제보다 이전이면 달려오기 애니메이션 + "다시 만나서 반가워요" (부정적 연출 없음)
- 친밀도 "Lv.N" 간단 표시, 앨범·설정 이동 버튼
- `visibilitychange` 시 날짜 재확인 → 자정이 지나면 새 질문 열림

### Phase 4. 답변 화면 (1~1.5일, 가장 위험한 단계)
- 선택지 3개: 사진 남기기 / 음성으로 말하기 / 오늘은 건너뛰기
- **사진**: `<input type="file" accept="image/*" capture="environment">` + 별도 "앨범에서 고르기" 입력 → 미리보기 → "이 사진으로 할게요" / "다시 고르기". 저장 전 canvas로 1280px 리사이즈(JPEG 0.85)
- **음성**: `getUserMedia` → `MediaRecorder`. mimeType 후보 `audio/mp4` → `audio/webm;codecs=opus` → `audio/webm` 순으로 `isTypeSupported()` 확인. 경과 시간 + 큰 정지 버튼, 60초 자동 정지, 들어보기 → "이대로 할게요" / "다시 녹음". 정지 시 마이크 트랙 해제
- **건너뛰기**: 아무 것도 저장하지 않고 홈으로. 문구 없음
- **오류 처리**: 권한 거부(`NotAllowedError`) → PRD 문구 + 아이폰/안드로이드 권한 허용 방법 짧은 안내. 녹음·저장 실패 → "잘 저장되지 않았어요. 다시 한 번 해볼까요?" + 다시 시도
- 저장 직전 오늘 카드 존재 여부 재확인 (두 탭 동시 사용 등 대비)

### Phase 5. 밥 주기·반응 화면 (반나절)
- "오늘의 밥이 도착했어요" + 큰 "밥 주기"
- 터치 시: 효과음(터치 핸들러 안에서 재생), 밥 먹기 애니메이션, `fed=true` + 포인트 +1, 레벨업 시 표시 갱신
- 말풍선: `copy.ts`의 고정 3개 중 랜덤
- "기록 카드가 앨범에 저장됐어요" + "앨범 보기" / "홈으로"

### Phase 6. 앨범·카드 상세 (반나절)
- 날짜 내림차순 카드 목록 (날짜 큰 글씨, 질문, 사진 썸네일/음성 아이콘, 동일 강아지 이미지)
- 카드 없을 때만 중립 문구
- 상세: 연도 포함 날짜, 사진 크게 보기 / 음성 재생·정지 (저장된 mimeType으로 Blob 생성)
- `URL.createObjectURL` 은 화면 이탈 시 `revoke` 하여 메모리 누수 방지
- 편집·삭제·공유 기능 없음

### Phase 7. 설정·개인정보 처리방침 (반나절)
- 안전 문구 + "109 전화하기"(`tel:` 링크, 번호는 `constants.ts`)
- "내 기록 모두 지우기" → 확인 대화상자 → IndexedDB 삭제 + `dangdang:*` localStorage 삭제 → 첫 화면
- 개인정보 처리방침 앱 내 페이지 (PRD 5-4, 법률 검토 문장은 앱에 넣지 않음)
- 이름 수정(선택 사항, 여유 있으면)

### Phase 8. 검수·배포 (1일)
- `scripts/check-banned-words.mjs`: `src/` 전체에서 금지어 검사, `npm run check`에 포함
- PRD 8장 인수 기준 체크리스트를 `docs/QA_CHECKLIST.md`로 만들어 실제 기기(아이폰 Safari, 안드로이드 Chrome)에서 확인
- 개발용 날짜 조작 기능(`?debugDate=2026-10-10`, 개발 빌드에서만)으로 자정 경계·결석 후 재방문 시나리오 테스트
- Vercel 배포, HTTPS에서 카메라·마이크 동작 확인

**예상 총 기간: 약 5~6일 (1인 기준)**

## 5. 주요 리스크와 대응

| 리스크 | 대응 |
|---|---|
| iOS Safari MediaRecorder 형식 차이 | `isTypeSupported` 기반 선택 + mimeType 저장, 실기기 테스트를 Phase 4 직후 바로 진행 |
| iOS Safari IndexedDB Blob 저장 불안정 | ArrayBuffer 폴백 저장 |
| 아이폰 HEIC 사진 | canvas 리사이즈 과정에서 JPEG로 변환됨 |
| 사진 회전(EXIF) | 최신 브라우저는 `image-orientation: from-image` 기본 적용. 실기기에서 확인 |
| 효과음 자동재생 차단 | 밥 주기 터치 핸들러 안에서만 재생 |
| Safari가 7일 미사용 시 저장소 삭제 가능 (ITP) | `navigator.storage.persist()` 요청. 동의 화면 4단계 안내 문구로 이미 고지됨 |
| 인앱 브라우저(카카오톡)에서 링크 열림 | 카메라·마이크 제한 가능 → 데모 시 "Safari/Chrome으로 열기" 안내. 필요하면 감지 후 안내 문구 표시 |

## 6. 확인이 필요한 사항 (PRD 내 충돌·모호한 부분)

1. **금지어 충돌**: 동의 화면 1단계("진단·치료·응급 대응을 하지 않음")와 인수 기준("앱 어디에도 '치료', '진단' 표현이 없다")이 충돌합니다.
   → 제안: 1단계를 "이 앱은 진료 때 보여드릴 기록을 모으는 도구예요. 병을 판단하거나 응급 상황에 대응하지 않아요."처럼 금지어 없이 표현. 또는 "하지 않는다"는 부정 문맥에 한해 예외 허용.
2. **포인트 적립 시점**: 위 3장의 `fed` 플래그 방식으로 진행해도 될지.
3. **질문 순환 기준일**: 동의한 날을 시작일로 삼을지, 고정 날짜(예: 2026-01-01)를 기준으로 할지. (고정 날짜면 데모 체험자 모두 같은 날 같은 질문을 봄)
4. **연령대 입력**: 넣을지 여부 (선택 사항). 기본은 넣지 않음으로 진행 예정.
5. **강아지 에셋**: 우선 SVG 플레이스홀더로 진행. 최종 이미지/GIF 일정이 있는지.
