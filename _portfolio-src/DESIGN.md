# 이준호 AX 포트폴리오

## Design Read

채용 담당자가 현업의 문제 발견, 판단, 구현, 실제 검증 범위를 빠르게 확인하는 한국어 포트폴리오. ‘업무가 도구로 바뀌는 작업실’의 감각을 비대칭 편집 레이아웃과 실제 화면으로 만든다. 이번 작업은 기존 공개 경력 정보 위의 시각적 전면 재구성이다.

DESIGN_VARIANCE: 9 / MOTION_INTENSITY: 7 / VISUAL_DENSITY: 4.

## 시각 규칙

- cool paper `#f0f1ef`, off-black `#222522`, burnt orange `#b3441e` 한 가지 accent. dark는 같은 의미의 토큰을 전역 교체한다.
- Korean Pretendard와 숫자·영문 Schibsted Grotesk. serif, generic neon, glass, decorative grid, 상태 점, section numbering을 사용하지 않는다.
- corner는 전체 square. 실제 앱 스크린샷 속 radius는 원본을 보존한다.
- hero는 두 줄 포스터 문장과 실제로 조작하는 종이 선별 장치다. 가상 공고7건의 키워드 선별·공고번호 중복 제거를 실행하면 두 알림이 정렬된다. 생성한 물리적 조형 사진은 장치의 배경이다. 작업은 운영 기록+실행 데모, 전체 폭 screenshot, 엇갈린 mobile screenshot pair 순서로 다르게 구성한다.
- 이미지 위 장식 태그는 없으며, 가상 데이터와 실제 캡처의 성격은 이미지 아래에 명시한다.
- layer: 일반 문서 0, hero type 1, header 10(현재 static), skip link 20, dialog는 native top layer.

## 동작

- hero 문장 진입은 작업의 목적을 먼저 읽도록 순서를 만든다.
- 아래 항목의 1회 reveal은 독서 순서를 만들고, 버튼의 화살표 이동은 행동을 예고한다.
- 실제 동작하는 로컬 예시는 입력한 키워드로 가상 공고를 선별하고 공고번호로 중복을 제거한다. API 및 실제 발송은 없다. loading, input error, empty, complete, reset 상태가 있다.
- 사례 상세는 native details. 실제 screenshot은 native dialog에서 viewport 전체로 열고 Escape/닫기 후 trigger focus를 돌려준다.
- 시스템 테마를 기본으로 하며 toggle은 명시적 light/dark, ‘시스템’ 버튼은 preference 복귀. storage 접근 실패 시에도 동작한다.
- reduced motion에서는 문장/reveal을 즉시 표시하고 CSS transition과 smooth scrolling을 없앤다.

## 공개 콘텐츠 경계

PRODUCT.md와 CONTENT.md만 사실 원본으로 사용한다. 입찰 초기 운영의 69/66/3/5/4와 2026.06.24-07.26은 실제 실행 결과로만 보인다. 인플루언서 화면은 실제 컴포넌트의 가상 데이터 렌더로, production 배포/동선 검증만 설명한다. Beanlog는 스토어 출시와 계측 경험을 보이며 사용자 수를 쓰지 않는다. 조직 전체의 AX 도입, 팀 매출, 수주 성과, 확인하지 않은 고객/사용자를 주장하지 않는다.

## 검증

2026-10-02 타입 검사·production build 통과. Aside 실제 화면과 Chrome 자동 검사에서 desktop/mobile/dark/reduced-motion의 자산 로드·overflow·anchor를 확인했다. WCAG A/AA 자동 검사는3화면 모두 위반0건. 실제 클릭·키보드로 종이 선별·동작 예시의 중복/다른 키워드/없는 키워드/빈 입력/초기화, native dialog Escape·focus 복귀, theme 저장·시스템 복귀, 경력 anchor를 검증했다.

로컬 production 빌드의 모바일 Lighthouse 결과: Performance91, Accessibility100, Best Practices100, SEO100. LCP3.3초·TBT70ms·CLS0. 모의 느린 모바일 환경의 실험 결과이며 실제 사용자 Core Web Vitals 수치가 아니다. 이미지 미리보기는 작은WebP, 확대는 원본PNG, 폰트는사용문자subset으로 제공한다.
