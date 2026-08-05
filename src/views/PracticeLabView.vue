<script setup>
import LessonLayout from '@/layouts/LessonLayout.vue'
import WeatherMockup from '@/practices/mockup/WeatherMockup.vue'
import WeatherComposition from '@/practices/composition/WeatherComposition.vue'
import WeatherParent from '@/practices/component/WeatherParent.vue'
import UnitToggler from '@/components/weather/UnitToggler.vue'
import WeatherElement from '@/practices/element/WeatherElement.vue'
import { useConfigStore } from '@/stores/configStore'

// 05 스토어 데모 — 아래 토글과 내비의 토글이 같은 전역 상태를 바라본다
const configStore = useConfigStore()

// 인덱스 목차 — 클릭하면 해당 실습 섹션으로 부드럽게 이동한다
// Day가 늘어나면 이 배열에 항목만 추가하면 목차와 섹션 이동이 함께 늘어난다
const lessons = [
  { no: '01', anchor: '#lesson-01', title: '날씨 Mockup', desc: 'Vue 기본 문법' },
  { no: '02', anchor: '#lesson-02', title: '날씨 컴포지션', desc: 'Composition API' },
  { no: '03', anchor: '#lesson-03', title: '날씨 컴포넌트', desc: '컴포넌트 분리' },
  { no: '04', anchor: '#lesson-04', title: 'Router 활용', desc: '페이지 전환과 동적 매칭' },
  { no: '05', anchor: '#lesson-05', title: 'Store 적용', desc: 'Pinia 전역 상태' },
  { no: '06', anchor: '#lesson-06', title: '데이터 연동', desc: 'Axios와 OpenWeather' },
  { no: '07', anchor: '#lesson-07', title: 'Element Plus', desc: 'UI 라이브러리 적용' },
]
</script>

<template>
  <div class="page">
    <header id="archive-top" class="page-head">
      <p class="section-label">Practice Archive</p>
      <h1 class="page-title">실습 아카이브</h1>
      <p class="page-sub">Vue 문법, Composition API, Component, Router 실습 기록</p>

      <!-- 기하학 인덱스 목차 — 큰 번호와 가는 룰로 구성 -->
      <nav class="toc">
        <a v-for="lesson in lessons" :key="lesson.no" :href="lesson.anchor" class="toc-item">
          <span class="toc-no">{{ lesson.no }}</span>
          <span class="toc-body">
            <span class="toc-title">{{ lesson.title }}</span>
            <span class="toc-desc">{{ lesson.desc }}</span>
          </span>
          <span class="toc-arrow">↓</span>
        </a>
      </nav>
    </header>

    <div id="lesson-01" class="lesson-anchor"></div>
    <LessonLayout index="01" title="날씨 Mockup" toc-href="#archive-top" subtitle="v-for, v-if, 바인딩, 이벤트 수식어">
      <template #spec>
        <ul class="spec-list">
          <li>배열 렌더링: <code>v-for</code>와 <code>:key</code></li>
          <li>조건부 라벨: <code>v-if</code> 25도 분기</li>
          <li>한글 검색: <code>:value</code>와 <code>@input</code></li>
          <li>카드 선택 상태바와 <code>@click.stop</code> 상세보기</li>
        </ul>
      </template>
      <template #preview>
        <WeatherMockup />
      </template>
    </LessonLayout>

    <div id="lesson-02" class="lesson-anchor"></div>
    <LessonLayout index="02" title="날씨 컴포지션" toc-href="#archive-top" subtitle="computed, watch, watchEffect">
      <template #spec>
        <ul class="spec-list">
          <li>반응형 상태 정의 (1일차와 동일)</li>
          <li>검색 필터: <code>computed</code></li>
          <li><code>watch</code> 상태바 추적과 <code>immediate</code> 옵션</li>
          <li><code>watchEffect</code> 검색어 추적</li>
          <li>결과 3분기: 원본, 일치, 없음 안내</li>
          <li>튜닝: <code>useWeatherSearch()</code>, <code>nextTick</code>, <code>onUpdated</code></li>
        </ul>
        <p class="spec-note">동작 로그는 브라우저 콘솔에서 확인할 수 있습니다</p>
      </template>
      <template #preview>
        <WeatherComposition />
      </template>
    </LessonLayout>

    <div id="lesson-03" class="lesson-anchor"></div>
    <LessonLayout index="03" title="날씨 컴포넌트" toc-href="#archive-top" subtitle="props, emits, slot, scoped">
      <template #spec>
        <ul class="spec-list">
          <li>4개 컴포넌트 분리 (기능 변경 없음)</li>
          <li>WeatherParent: 반응형 데이터 소유</li>
          <li>BaseDashboardCard: 공통 디자인과 <code>slot</code></li>
          <li>SearchBar: <code>props</code>와 <code>update-query</code></li>
          <li>WeatherCard: <code>select-card</code>와 <code>click-detail</code></li>
          <li>튜닝: header/footer Named Slot과 actions Scoped Slot</li>
        </ul>
        <p class="spec-note">각 컴포넌트 스타일은 style scoped로 분리했습니다</p>
      </template>
      <template #preview>
        <WeatherParent />
      </template>
    </LessonLayout>

    <div id="lesson-04" class="lesson-anchor"></div>
    <LessonLayout index="04" title="Router 활용" toc-href="#archive-top" subtitle="RouterLink, RouterView, 동적 매칭, 지연 로딩">
      <template #spec>
        <ul class="spec-list">
          <li>라우터 전역 주입과 규칙 정의</li>
          <li>내비게이션 바: <code>RouterLink</code>와 <code>RouterView</code></li>
          <li>상세보기: <code>router.push('/weather/' + id)</code></li>
          <li><code>:cityId</code> 동적 매칭과 Mount 시점 조회</li>
          <li>지연 로딩과 Catch-all 404 처리</li>
          <li>튜닝: 검색어 <code>?search=</code> 상태 복원</li>
        </ul>
        <p class="spec-note">이 실습의 결과물은 사이트 전체입니다. 옆 데모로 직접 확인해 보세요</p>
      </template>
      <template #preview>
        <div class="router-demo">
          <p class="demo-title">라우터 데모</p>
          <p class="demo-desc">
            지금 보고 있는 이 사이트가 과제 결과물입니다. 홈 대시보드, 도시 상세, 존재하지 않는
            경로까지 각 라우트로 이동해 확인할 수 있습니다.
          </p>
          <div class="demo-links">
            <RouterLink to="/lessons/home" class="demo-link">홈 대시보드 /lessons/home</RouterLink>
            <RouterLink to="/lessons/weather/city_01" class="demo-link">서울 상세 /lessons/weather/city_01</RouterLink>
            <RouterLink to="/lessons/weather/city_99" class="demo-link">없는 도시 /lessons/weather/city_99</RouterLink>
            <RouterLink to="/lessons/no-such-page" class="demo-link">404 확인 /lessons/no-such-page</RouterLink>
          </div>
        </div>
      </template>
    </LessonLayout>

    <div id="lesson-05" class="lesson-anchor"></div>
    <LessonLayout index="05" title="Store 적용" subtitle="Pinia, state, getters, actions" toc-href="#archive-top">
      <template #spec>
        <ul class="spec-list">
          <li>Pinia 전역 등록: <code>createPinia()</code></li>
          <li>configStore — state: <code>unit</code></li>
          <li>getters: <code>unitSymbol</code> (℃와 ℉)</li>
          <li>actions: <code>toggleUnit</code></li>
          <li>UnitToggler를 내비게이션 바 옆에 배치</li>
          <li>메인과 상세 온도 표시에 단위 변환 적용</li>
          <li>주의: state 구조분해는 <code>storeToRefs</code>로</li>
        </ul>
        <p class="spec-note">원본 데이터는 섭씨로 유지하고 표시할 때만 변환합니다</p>
      </template>
      <template #preview>
        <div class="store-demo">
          <p class="demo-title">전역 상태 데모</p>
          <p class="demo-desc">
            아래 토글과 내비게이션 바의 토글은 같은 configStore를 바라봅니다. 어느 쪽을 눌러도
            둘이 함께 바뀌고, 홈 카드와 상세 페이지의 온도 표시도 같이 반응합니다.
          </p>
          <div class="store-demo-row">
            <UnitToggler />
            <span class="store-demo-state">
              현재 단위: <strong>{{ configStore.unit }}</strong> ({{ configStore.unitSymbol }})
            </span>
          </div>
          <div class="demo-links">
            <RouterLink to="/lessons/store/home" class="demo-link">홈에서 단위 적용 확인 /lessons/store/home</RouterLink>
            <RouterLink to="/lessons/store/weather/city_01" class="demo-link">상세에서 단위 적용 확인 /lessons/store/weather/city_01</RouterLink>
          </div>
        </div>
      </template>
    </LessonLayout>

    <div id="lesson-06" class="lesson-anchor"></div>
    <LessonLayout index="06" title="날씨 데이터 연동" subtitle="Axios, REST API, async와 await" toc-href="#archive-top">
      <template #spec>
        <ul class="spec-list">
          <li>axios 설치와 <code>axios.create</code> 인스턴스</li>
          <li>OpenWeatherMap 가입과 키 발급</li>
          <li>키는 <code>.env</code>로 관리 (공개 저장소 커밋 금지)</li>
          <li>메인: <code>Promise.all</code> 4개 도시 병렬 호출</li>
          <li>상세: 영문명 매핑 후 실시간 관측값 교체</li>
          <li><code>try / catch / finally</code>와 로딩 상태 처리</li>
          <li>키 미설정이나 통신 실패 시 목데이터 폴백</li>
        </ul>
        <p class="spec-note">홈 제목 아래 점 표시로 실시간(초록)과 목데이터(회색)를 구분합니다</p>
      </template>
      <template #preview>
        <div class="store-demo">
          <p class="demo-title">실시간 연동 데모</p>
          <p class="demo-desc">
            홈과 상세가 OpenWeather 실시간 관측값으로 채워집니다. 관측 시각과 구름량, 기압까지
            실제 데이터가 들어오고, 통신이 불가능하면 목데이터로 자연스럽게 내려앉습니다.
          </p>
          <div class="demo-links">
            <RouterLink to="/lessons/api/home" class="demo-link">실시간 대시보드 /lessons/api/home</RouterLink>
            <RouterLink to="/lessons/api/weather/city_01" class="demo-link">서울 실시간 관측 /lessons/api/weather/city_01</RouterLink>
          </div>
        </div>
      </template>
    </LessonLayout>

    <div id="lesson-07" class="lesson-anchor"></div>
    <LessonLayout index="07" title="Element Plus 활용" subtitle="UI 라이브러리로 3일차 과제 개선" toc-href="#archive-top">
      <template #spec>
        <ul class="spec-list">
          <li>검색 입력: <code>input</code> → <code>el-input</code> (clearable)</li>
          <li>공통 카드: BaseDashboardCard → <code>el-card</code></li>
          <li>온도 칩: 자작 칩 → <code>el-tag</code> (구간별 타입)</li>
          <li>버튼: 자작 버튼 → <code>el-button</code></li>
          <li>알림: <code>window.alert</code> → <code>ElMessageBox</code></li>
          <li>선택 피드백: <code>ElMessage</code> 토스트 추가</li>
          <li>상태바: 자작 스트립 → <code>el-alert</code></li>
          <li>빈 결과: 안내 문구 → <code>el-empty</code></li>
        </ul>
        <p class="spec-note">기능은 3일차와 동일하고 부품만 라이브러리로 교체했습니다</p>
      </template>
      <template #preview>
        <WeatherElement />
      </template>
    </LessonLayout>
  </div>
</template>

<style scoped>
.page {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.page-head {
  margin-bottom: var(--s6);
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.page-sub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

.page-head {
  scroll-margin-top: 96px;
}

/* 인덱스 목차 — 상단 2px 잉크 룰 아래 큰 번호가 정렬된다.
   항목이 늘어나도 자동으로 줄바꿈되며 배치된다 */
.toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: var(--s2);
  margin-top: var(--s4);
}

.toc-item {
  display: flex;
  align-items: baseline;
  gap: var(--s2);
  padding: var(--s2) var(--s1) var(--s2) 0;
  border-top: 2px solid var(--line-strong);
  text-decoration: none;
  color: var(--ink);
  transition: background 0.2s ease;
}

.toc-item:hover {
  background: var(--canvas);
}

.toc-no {
  font-size: 34px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.toc-body {
  display: grid;
  gap: 2px;
  flex: 1;
}

.toc-title {
  font-size: 14px;
  font-weight: 700;
}

.toc-desc {
  font-size: 11.5px;
  color: var(--muted);
}

.toc-arrow {
  font-size: 13px;
  color: var(--muted);
  transition: transform 0.2s ease;
}

.toc-item:hover .toc-arrow {
  transform: translateY(3px);
}

/* 글래스 내비 높이만큼 여유를 두고 앵커가 멈추게 한다 */
.lesson-anchor {
  scroll-margin-top: 96px;
}

/* 스토어 데모 (05) */
.store-demo {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s3);
}

.store-demo-row {
  display: flex;
  align-items: center;
  gap: var(--s2);
  margin-bottom: var(--s2);
}

.store-demo-state {
  font-size: 13px;
  color: var(--muted);
}

.store-demo-state strong {
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 12.5px;
}

/* 라우터 데모 (04) */
.router-demo {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s3);
}

.demo-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding-bottom: var(--s1);
  margin-bottom: var(--s2);
  border-bottom: 1px solid var(--line-strong);
}

.demo-desc {
  font-size: 13.5px;
  line-height: 1.7;
  margin-bottom: var(--s2);
}

.demo-links {
  display: grid;
  gap: var(--s1);
}

.demo-link {
  display: block;
  padding: 10px var(--s2);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 13px;
  font-family: var(--font-mono);
  text-decoration: none;
  transition: all 0.15s;
}

.demo-link:hover {
  border-color: var(--line-strong);
  background: var(--ink);
  color: var(--paper);
}


@media (max-width: 720px) {
  .toc {
    grid-template-columns: 1fr;
  }
}

.spec-list {
  list-style: none;
  display: grid;
  gap: var(--s1);
  font-size: 13px;
}

.spec-list li {
  padding-left: 14px;
  position: relative;
}

/* 기하학 마커 — 작은 사각형 */
.spec-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  background: var(--ink);
}

.spec-list code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  background: var(--canvas);
  border: 1px solid var(--line);
  padding: 0 4px;
}

.spec-note {
  font-size: 12px;
  color: var(--muted);
  border-top: 1px solid var(--line);
  padding-top: var(--s1);
}
</style>
