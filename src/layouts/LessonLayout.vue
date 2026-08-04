<script setup>
// 레슨 공통 레이아웃
// 좌측: 과제 요구사항(spec 슬롯) / 우측: 실습 화면(preview 슬롯)
defineProps({
  index: {
    type: String,
    required: true, // 예: '01'
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  // 값이 있으면 헤더 우측에 목차로 돌아가는 링크를 표시한다
  tocHref: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="lesson">
    <!-- 헤더: 큰 인덱스 숫자 + 제목 + 가는 룰 -->
    <header class="lesson-head">
      <span class="lesson-index">{{ index }}</span>
      <div class="lesson-title-group">
        <h2 class="lesson-title">{{ title }}</h2>
        <p v-if="subtitle" class="lesson-subtitle">{{ subtitle }}</p>
      </div>

      <a v-if="tocHref" :href="tocHref" class="head-toc">↑ 목차</a>
    </header>

    <div class="lesson-body">
      <!-- 좌: 요구사항 -->
      <aside class="lesson-spec">
        <p class="section-label">과제 요구사항</p>
        <slot name="spec"></slot>
      </aside>

      <!-- 우: 실습 프리뷰 -->
      <div class="lesson-preview">
        <!-- 좌측 요구사항 텍스트와 달리, 이 영역은 실제로 동작하는 화면임을 표시 -->
        <p class="section-label">실습 화면</p>
        <div class="preview-canvas">
          <slot name="preview"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lesson {
  border-top: 2px solid var(--line-strong);
  padding: var(--s4) 0 var(--s8) 0;
}

.lesson-head {
  display: flex;
  align-items: baseline;
  gap: var(--s3);
  margin-bottom: var(--s4);
}

/* 큰 인덱스 숫자 — 기하학적 앵커 */
.lesson-index {
  font-size: 56px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.lesson-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.lesson-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

/* 섹션에서 곧바로 목차로 올라가는 링크 */
.head-toc {
  margin-left: auto;
  align-self: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  padding: 5px 12px;
  border: 1px solid var(--line);
  transition: all 0.15s;
}

.head-toc:hover {
  color: var(--paper);
  background: var(--ink);
  border-color: var(--line-strong);
}

.lesson-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--s4);
  align-items: start;
}

/* 좌측 요구사항 패널 — 가는 좌측 룰 */
.lesson-spec {
  border-left: 1px solid var(--line);
  padding-left: var(--s2);
  display: grid;
  gap: var(--s2);
}

/* 우측 프리뷰 — 모눈 캔버스 프레임 */
.lesson-preview {
  display: grid;
  gap: var(--s2);
}

/* 모눈 대신 담백한 단색 캔버스 — 카드가 배경과 싸우지 않게 */
.preview-canvas {
  border: 1px solid var(--line);
  border-top: 2px solid var(--line-strong);
  background: var(--canvas);
  padding: var(--s4);
}

@media (max-width: 880px) {
  .lesson-body {
    grid-template-columns: 1fr;
  }
}
</style>
