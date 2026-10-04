# 배포 안내 (Vercel)

마음기록카드 프로토타입을 Vercel에 배포하는 방법입니다. 서버·DB가 없는 정적 웹앱이라 설정 파일 없이 기본값으로 배포됩니다.

## 배포 전 확인

- [ ] `npm run check`가 통과한다 (타입 검사 + 테스트 + 금지어 검사)
- [ ] `src/config/constants.ts`의 전화번호가 맞다 (자살예방상담전화 `109`, 응급 `119`)
- [ ] 모든 변경이 GitHub `claude/prd-implementation-plan-4vt3z3` 브랜치에 push되어 있다

## 처음 배포하기

1. https://vercel.com/new 에 GitHub 계정(`Haru-sari`)으로 로그인합니다.
2. **Import Git Repository**에서 `dangdang_prototype` 옆 **Import**를 누릅니다.
   - 목록에 없으면 **Adjust GitHub App Permissions**에서 이 저장소 접근을 허용합니다.
3. 설정은 아래와 같이 자동으로 채워집니다. 바꾸지 않아도 됩니다.

   | 항목 | 값 |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |
   | Environment Variables | 없음 |

4. **Deploy**를 누릅니다. 1분 정도 걸립니다.
5. 완료 후 프로젝트 화면의 **Domains**에 있는 주소(예: `https://dangdang-prototype.vercel.app`)가 체험자에게 보낼 주소입니다.

> 배포마다 생기는 긴 주소(`dangdang-prototype-abc123-....vercel.app`)는 Vercel 로그인을 요구할 수 있습니다. 체험자에게는 반드시 **Domains**의 짧은 주소를 보내세요.

## 다시 배포하기

이 브랜치에 push하면 자동으로 다시 배포됩니다. 진행 상황은 Vercel 프로젝트의 **Deployments** 탭에서 볼 수 있습니다.
문제가 생기면 Deployments에서 이전 배포를 골라 **Promote to Production**으로 되돌릴 수 있습니다.

## 배포 후 확인

`docs/QA_CHECKLIST.md`를 아이폰 Safari와 안드로이드 Chrome에서 각각 확인합니다. 최소한 아래는 꼭 확인하세요.

- [ ] 사진 찍기 → 밥 주기 → 앨범에서 카드 확인
- [ ] 음성 녹음 → 들어보기 → 저장 → 앨범 상세에서 재생
- [ ] 설정의 "109 전화하기"가 전화 앱을 연다

## 체험자에게 링크를 보낼 때

- 카카오톡으로 링크를 열면 카톡 안의 브라우저에서 열려 마이크·카메라가 막힐 수 있습니다.
  링크와 함께 "오른쪽 아래(또는 위) 메뉴 → **다른 브라우저로 열기**(Safari/Chrome)"를 안내해 주세요.
- 기록은 **그 휴대폰의 그 브라우저 안에만** 저장됩니다. 다른 브라우저로 열거나 브라우저 데이터를 지우면 기록이 보이지 않습니다. 체험 기간 동안 같은 브라우저로 열도록 안내해 주세요.
- 아이폰에서 홈 화면에 추가하면 Safari와 저장 공간이 분리되어 기록이 따로 보일 수 있습니다. 데모 기간에는 Safari에서 바로 여는 것을 권합니다.

## 문제가 생기면

| 증상 | 확인할 것 |
|---|---|
| 배포가 Build 단계에서 실패 | Deployments → 실패한 배포 → **Build Logs**의 오류 확인. 로컬에서 `npm run build`가 통과하는지 확인 |
| 접속 시 Vercel 로그인 화면이 나옴 | 배포별 긴 주소로 접속한 경우. **Domains**의 짧은 주소로 접속 |
| 녹음·사진 촬영 버튼을 눌러도 반응 없음 | `https://` 주소인지, 카톡 인앱 브라우저가 아닌지 확인. 휴대폰 설정에서 브라우저의 마이크·카메라 권한 확인 |
| 효과음이 안 남 | 아이폰 무음 스위치, 미디어 볼륨 확인 |
| 예전 화면이 보임 | 새로고침. 그래도 같으면 Deployments에서 최신 배포가 Production인지 확인 |
