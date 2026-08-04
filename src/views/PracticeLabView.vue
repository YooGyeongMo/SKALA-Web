<script setup>
import LessonLayout from '@/layouts/LessonLayout.vue'
import WeatherMockup from '@/practices/mockup/WeatherMockup.vue'
import WeatherComposition from '@/practices/composition/WeatherComposition.vue'
import WeatherParent from '@/practices/component/WeatherParent.vue'

// 인덱스 목차 — 클릭하면 해당 실습 섹션으로 부드럽게 이동한다
// Day가 늘어나면 이 배열에 항목만 추가하면 목차와 섹션 이동이 함께 늘어난다
const lessons = [
  { no: '01', anchor: '#lesson-01', title: '날씨 Mockup', desc: 'Vue 기본 문법' },
  { no: '02', anchor: '#lesson-02', title: '날씨 컴포지션', desc: 'Composition API' },
  { no: '03', anchor: '#lesson-03', title: '날씨 컴포넌트', desc: '컴포넌트 분리' },
  { no: '04', anchor: '#lesson-04', title: 'Router 활용', desc: '페이지 전환과 동적 매칭' },
]
</script>

<template>
  <div class="page">
    <header id="archive-top" class="page-head">
      <p class="section-label">Practice Archive</p>
      <h1 class="page-title">Day 1–3 실습 아카이브</h1>
      <p class="page-sub">Vue 문법, Composition API, Component 실습 기록</p>

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
    <LessonLayout index="01" title="날씨 Mockup" subtitle="v-for, v-if, 바인딩, 이벤트 수식어">
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
    <LessonLayout index="02" title="날씨 컴포지션" subtitle="computed, watch, watchEffect">
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
    <LessonLayout index="03" title="날씨 컴포넌트" subtitle="props, emits, slot, scoped">
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
    <LessonLayout index="04" title="Router 활용" subtitle="RouterLink, RouterView, 동적 매칭, 지연 로딩">
      <template #spec>
        <ul class="spec-list">
          <li>라우터 전역 주입과 규칙 정의</li>
          <li>내비게이션 바: <code>RouterLink</code>와 <code>RouterView</code></li>
          <li>상세보기: <code>router.push('/weather/' + id)</code></li>
          <li><code>:cityId</code> 동적 매칭과 Mount 시점 조회</li>
          <li>지연 로딩과 Catch-all 404 처리</li>
          <li>튜닝: 검색어 <code>?search=</code> 상태 복원</li>
        </ul>
        <p class="spec-note">이 실습의 결과물은 사이트 전체입니다. 아래 데모로 직접 확인해 보세요</p>
      </template>
      <template #preview>
        <div class="router-demo">
          <p class="demo-title">라우터 데모</p>
          <p class="demo-desc">
            지금 보고 있는 이 사이트가 과제 결과물입니다. 홈 대시보드, 도시 상세, 존재하지 않는
            경로까지 각 라우트로 이동해 확인할 수 있습니다.
          </p>
          <div class="demo-links">
            <RouterLink to="/" class="demo-link">홈 대시보드 /</RouterLink>
            <RouterLink to="/weather/city_01" class="demo-link">서울 상세 /weather/city_01</RouterLink>
            <RouterLink to="/weather/city_99" class="demo-link">없는 도시 /weather/city_99</RouterLink>
            <RouterLink to="/no-such-page" class="demo-link">404 확인 /no-such-page</RouterLink>
          </div>
        </div>
      </template>
    </LessonLayout>

    <!-- 어느 섹션에서든 목차로 바로 돌아가는 플로팅 버튼 -->
    <a href="#archive-top" class="btn-top" aria-label="목차로 돌아가기">↑ 목차</a>
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

/* 목차로 돌아가는 플로팅 글래스 버튼 */
.btn-top {
  position: fixed;
  right: var(--s3);
  bottom: var(--s3);
  z-index: 90;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border: 1px solid rgba(17, 17, 17, 0.1);
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(17, 17, 17, 0.08);
  transition: all 0.2s ease;
}

.btn-top:hover {
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
