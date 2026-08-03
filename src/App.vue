<script setup>
import LessonLayout from '@/layouts/LessonLayout.vue'
import WeatherMockup from '@/practices/mockup/WeatherMockup.vue'
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1 class="page-title">SKALA Vue 실습</h1>
      <p class="page-sub">Day 1–3 · 날씨 대시보드</p>
    </header>

    <LessonLayout index="01" title="날씨 Mockup" subtitle="v-for · v-if · 바인딩 · 이벤트 수식어">
      <template #spec>
        <ul class="spec-list">
          <li>배열 렌더링 — <code>v-for</code> + <code>:key</code></li>
          <li>조건부 라벨 — <code>v-if</code> 25도 분기</li>
          <li>한글 검색 — <code>:value</code> / <code>@input</code></li>
          <li>카드 선택 상태바 + <code>@click.stop</code> 상세보기</li>
        </ul>
      </template>
      <template #preview>
        <WeatherMockup />
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
</style>
