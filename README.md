# SKALA-Web

SKALA Full-Stack Engineering — Vue.js 실습 저장소.
Day 1~3 실습(Vue 문법, Composition API, Component)에 Day 4 Vue Router, Day 5 Pinia, Day 6 Axios를 얹어,
나라 선택 홈(`/`) · 나라별 도시 목록(`/country/:countryCode`) · 상세(`/weather/:cityId`) · 소개(`/about`) · 실습 아카이브(`/lessons`)로 구성했습니다. 한국, 중국, 일본, 독일, 미국 5개국의 대표 도시 50곳을 실시간으로 보여줍니다.

## 실행 방법

```bash
npm install
npm run dev
```

### OpenWeatherMap 키 설정 (선택)

실시간 날씨 연동에는 OpenWeatherMap API 키가 필요합니다. 키가 없어도 목데이터로 동작합니다.

```bash
cp .env.example .env
# .env 파일을 열어 VITE_OPENWEATHER_API_KEY 값에 발급받은 키를 입력
```

- 키 발급: https://openweathermap.org/ 가입 후 My API Keys에서 확인 (신규 키는 활성화까지 시간이 걸릴 수 있습니다)
- .env는 커밋되지 않으므로 키가 저장소에 노출되지 않습니다

- Node 20.19+ / 22.12+ 필요
- 빌드: `npm run build` · 빌드 미리보기: `npm run preview`
- 라우터/Pinia 등 3일차 이후 스택은 사용하지 않았습니다 (강의 진도 기준)

## 폴더 구조

```
src/
├── main.js                  # 앱 엔트리 — 라우터 인스턴스 전역 주입 (.use(router))
├── App.vue                  # 내비게이션 바(RouterLink) + 메인 콘텐츠 영역(RouterView)
├── router/
│   └── index.js             # 라우트 규칙 정의 · Lazy Loading · Catch-all
├── stores/
│   └── configStore.js       # Pinia 전역 상태 — 온도 단위(unit/unitSymbol/toggleUnit)
├── api/
│   └── openWeather.js       # Axios 인스턴스와 OpenWeather 조회 함수, 글리프 매핑
├── views/                   # 페이지 단위 컴포넌트
│   ├── CountryHomeView.vue      # / — 나라 선택 대시보드 (수도 실황과 윤곽 드로잉)
│   ├── CityListView.vue         # /country/:countryCode — 나라별 대표 도시 10곳
│   ├── WeatherHomeView.vue      # /lessons/*/home — 과제 원형(4개 도시) 데모 보존
│   ├── WeatherDetailView.vue    # /weather/:cityId — 동적 매칭 상세 관측 페이지
│   ├── WeatherAboutView.vue     # /about — 서비스 소개
│   ├── NotFoundView.vue         # Catch-all — 404 안내
│   └── PracticeLabView.vue      # /lessons — Day 1–3 실습 아카이브
├── assets/
│   └── main.css             # 디자인 토큰 + 리셋 (화이트 · 헤어라인 · 8px 그리드)
├── layouts/
│   └── LessonLayout.vue     # 레슨 공통 틀 — 좌: 요구사항 / 우: 실습 화면
├── composables/
│   └── useWeatherSearch.js  # 검색어 + computed 필터 + watchEffect 추적 (과제2·3·홈 공용)
└── practices/
    ├── mockup/
    │   └── WeatherMockup.vue        # 과제1 — Vue 기본 문법
    ├── composition/
    │   └── WeatherComposition.vue   # 과제2 — Composition API
    └── component/
        ├── WeatherParent.vue        # 과제3 — 상태 소유 + 조립
        ├── BaseDashboardCard.vue    # 공통 카드 (slot / header·footer named slot)
        ├── SearchBar.vue            # props + update-query emit
        └── WeatherCard.vue          # props + select-card/click-detail emit + actions scoped slot
```

## 과제별 정리

### 01 날씨 Mockup — `practices/mockup/WeatherMockup.vue`

| 구분 | 내용 |
| ---- | ---- |
| 요구사항 | `v-for` + `:key` 카드 렌더링 · 25도 기준 `v-if` 라벨 · `:value`/`@input` 한글 검색 · 카드 클릭 상태바 · `@click.stop` 상세보기 alert |
| 튜닝 | 라벨 3단계(`v-else-if`) + 확인용 제주 데이터 추가 · `v-model.trim.lazy` 비교 입력 · `v-memo` 리렌더 횟수 콘솔 확인 |

- 한글 입력은 IME 조합 때문에 `v-model`이 조합 완료 후에 반영되므로, 즉시 동기화가 필요하면 `:value` + `@input`을 사용
- `.lazy`는 input 대신 change 이벤트(Enter/포커스 아웃)에 반영 — 두 입력을 나란히 두고 차이를 눈으로 비교

### 02 날씨 컴포지션 — `practices/composition/WeatherComposition.vue`

| 구분 | 내용 |
| ---- | ---- |
| 요구사항 | 반응형 상태(1일차 동일) · `computed` 검색 필터 · `watch`(selectedCityInfo) · `watchEffect`(searchQuery) · 결과 3분기(원본/일치/없음) |
| 튜닝 | 검색 로직 `useWeatherSearch()` 컴포저블 추출 · `watch immediate: true` · `nextTick`/`onUpdated` DOM 패치 추적 |

### 03 날씨 컴포넌트 — `practices/component/`

| 구분 | 내용 |
| ---- | ---- |
| 요구사항 | 기능 변경 없이 4개 컴포넌트 분리 · 부모가 상태 소유 · props 단방향 전달 · emits 상향 통신 · `style scoped` 분리 |
| 튜닝 | BaseDashboardCard `header`/`footer` Named Slot · WeatherCard `actions` Scoped Slot(부모가 상세보기 버튼 커스터마이징) |

- slot으로 전달한 자식(SearchBar, WeatherCard 커스텀 버튼)은 시각적으로 카드 안에 있지만 **부모 스코프에서 컴파일**되므로 부모의 상태·핸들러와 직접 바인딩된다

### 04 Router 활용 — `router/` + `views/`

| 구분 | 내용 |
| ---- | ---- |
| 요구사항 | 라우터 전역 주입 · Lazy Loading · Catch-all · 내비게이션 바(RouterLink)와 RouterView · WeatherHomeView가 WeatherParent 대체 · 상세보기 alert 제거 → `router.push('/weather/' + id)` · :cityId 동적 매칭으로 Mount 시점 Mock 선택 · About 페이지와 돌아가기 |
| 구성 | 홈(`/`)은 즉시 로딩, 나머지 페이지는 `() => import()` Lazy Loading · 404는 `/:pathMatch(.*)*` Catch-all |

- 상세보기 버튼은 WeatherCard의 **actions Scoped Slot**을 그대로 활용 — 과제3에서는 alert, 홈에서는 라우터 이동으로 부모가 용도를 갈아끼운다 (같은 부품, 다른 동작)
- 존재하지 않는 도시 코드(`/weather/city_99`)는 상세 페이지 안에서 안내 처리, 정의되지 않은 경로는 404 페이지로

## 콘솔로 렌더링 흐름 관찰하기

브라우저 개발자 도구 콘솔을 열고 화면을 조작하면 상태 변경 → 가상 DOM 비교 → 실제 DOM 패치의 순서가 로그로 보입니다.

| 로그 | 의미 |
| ---- | ---- |
| `[watchEffect] 현재 검색어 '...'` | 검색어 상태가 바뀌는 즉시 (타이핑마다) |
| `[watch] 상태 바 문구 변경: ...` | 카드 선택으로 상태가 바뀔 때 (`immediate: true`라 마운트 시 1회 선실행) |
| `[상태 변경] 필터 결과 N건 / 실제 DOM 카드 M개` | 상태는 새 값, DOM은 아직 이전 값인 시점 |
| `[nextTick 후] 실제 DOM 카드 N개` | DOM 패치가 끝난 뒤 — 상태와 DOM이 일치 |
| `[onUpdated] 컴포넌트 DOM 패치 완료` | 실제 DOM 변경이 있었을 때만 호출 |
| `[v-memo] ○○ 카드 렌더 N회` | 과제1 카드 — 검색어를 타이핑해도 횟수가 늘지 않으면 v-memo가 패치를 건너뛴 것 |

확인해볼 것:

1. 과제1 검색창에 타이핑 → `[v-memo]` 로그가 **늘지 않음** (diff를 의도적으로 건너뛰는 사례)
2. 과제2 검색창에 "수원" 입력 → `[상태 변경]`(이전 DOM 개수) → `[nextTick 후]`(새 DOM 개수) 순서 확인
3. 카드 클릭 → `[watch]` 로그와 `[onUpdated]` 로그의 선후 관계 확인

## 진행 흐름

이슈 → 브랜치 → 작업 단위 커밋 → PR → 머지 순서로 진행했습니다.

| 이슈 | 브랜치 | PR |
| ---- | ------ | -- |
| #1 프로젝트 초기 세팅 | `setting/project-init` | #2 |
| #3 과제1 날씨 Mockup | `feat/weather-mockup` | #4 |
| #5 과제2 날씨 컴포지션 | `feat/weather-composition` | #6 |
| #7 과제3 날씨 컴포넌트 | `feat/weather-component` | #8 |
| #9 README 설계서 | `docs/readme-guide` | #10 |
| #17 과제4 Router 활용 | `feat/weather-router` | — |
