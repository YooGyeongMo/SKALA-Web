<script setup>
import LessonLayout from '@/layouts/LessonLayout.vue'
import WeatherMockup from '@/practices/mockup/WeatherMockup.vue'
import WeatherComposition from '@/practices/composition/WeatherComposition.vue'
import WeatherParent from '@/practices/component/WeatherParent.vue'
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1 class="page-title">Day 1–3 실습 아카이브</h1>
      <p class="page-sub">Vue 문법, Composition API, Component 실습 기록</p>
    </header>

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
